import { getLines, Matrix, Point } from '../common';

const data = getLines('input.txt');

const matrix = new Matrix<string>(data.map((line) => line.split('')));

type RegionCounter = { currentlyVisited: Set<string>; border: number; vertices: number };

const getConcaveCountFromPoint = (i: number, j: number): number => {
    let result = 0;
    const value = matrix.get(i, j);
    const [U, D, L, R] = matrix.getNeighbourPoints(i, j).map(([i, j]) => matrix.get(i, j));
    const [UL, UR, DL, DR] = matrix
        .getDiagonalNeighbourPoints(i, j)
        .map(([i, j]) => matrix.get(i, j));

    if (UL !== value && U === value && L === value) result++;
    if (UR !== value && U === value && R === value) result++;
    if (DR !== value && D === value && R === value) result++;
    if (DL !== value && D === value && L === value) result++;

    return result;
};

const getConvexCountFromPoint = (i: number, j: number): number => {
    const value = matrix.get(i, j);
    const neighbours = matrix.getNeighbourPoints(i, j);
    const borders = neighbours.filter(([nI, nJ]) => matrix.get(nI, nJ) !== value);

    if (borders.length === 4) {
        return 4;
    }

    if (borders.length === 3) {
        return 2;
    }

    if (borders.length === 2) {
        let result = 0;
        const value = matrix.get(i, j);
        const [U, D, L, R] = matrix.getNeighbourPoints(i, j).map(([i, j]) => matrix.get(i, j));
    
        if (U === value && L === value) result++;
        if (U === value && R === value) result++;
        if (D === value && R === value) result++;
        if (D === value && L === value) result++;
    
        return result > 0 ? 1 : 0;
    }

    return 0;
};

const traverseFromPoint = (
    [i, j]: Point,
    visited: Set<string>,
    counter: RegionCounter = { currentlyVisited: new Set<string>(), border: 0, vertices: 0 },
): RegionCounter => {
    visited.add(`${i},${j}`);

    if (counter.currentlyVisited.has(`${i},${j}`)) {
        return counter;
    }
    counter.currentlyVisited.add(`${i},${j}`);

    const neighbours = matrix.getNeighbourPoints(i, j);
    const reachable = neighbours.filter(([nI, nJ]) => matrix.get(nI, nJ) === matrix.get(i, j));
    const borders = neighbours.length - reachable.length;

    counter.vertices += getConcaveCountFromPoint(i, j) + getConvexCountFromPoint(i, j);
    counter.border += borders;

    return neighbours
        .filter(
            (neighbour) =>
                matrix.get(neighbour[0], neighbour[1]) === matrix.get(i, j) &&
                !visited.has(`${neighbour[0]},${neighbour[1]}`),
        )
        .reduce((acc, neighbour) => traverseFromPoint(neighbour, visited, acc), counter);
};

const getResult = () => {
    const visited = new Set<string>();
    let borderCounter = 0;
    let edgeCounter = 0;

    for (let i = 0; i < matrix.rows.length; i++) {
        for (let j = 0; j < matrix.rows[i].length; j++) {
            if (!visited.has(`${i},${j}`)) {
                const { currentlyVisited, border, vertices } = traverseFromPoint([i, j], visited);
                borderCounter += currentlyVisited.size * border;
                edgeCounter += currentlyVisited.size * vertices;
            }
        }
    }

    return {
        borderCounter,
        edgeCounter,
    };
};

const { borderCounter, edgeCounter } = getResult();
console.log(borderCounter, edgeCounter);
