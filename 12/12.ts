import { getLines, Matrix, Point } from '../common';

const data = getLines('input.txt');
const matrix = new Matrix<string>(data.map((line) => line.split('')));

type RegionCounter = { visitedPoints: Set<string>; borderCount: number; vertexCount: number };

const calculateVertexCount = (i: number, j: number): number => {
    const value = matrix.get(i, j);
    const { direct: [U, D, L, R], diagonal: [UL, UR, DL, DR] } = matrix.getAllNeighbours(i, j, true);

    // Calculate concave vertices
    const concave = [
        UL !== value && U === value && L === value,
        UR !== value && U === value && R === value,
        DR !== value && D === value && R === value,
        DL !== value && D === value && L === value,
    ].filter(Boolean).length;

    // Calculate convex vertices
    const borderCount = [U, D, L, R].filter((v) => v !== value).length;

    if (borderCount === 4) {
        return 4 + concave;
    }

    if (borderCount === 3) {
        return 2 + concave;
    }

    const convex = borderCount === 2 && !((U === D && U === value) || (L === R && L === value)) ? 1 : 0;

    return concave + convex;
};

const traverseRegion = (
    [i, j]: Point,
    visited: Set<string>,
    counter: RegionCounter = { visitedPoints: new Set<string>(), borderCount: 0, vertexCount: 0 },
): RegionCounter => {
    const key = `${i},${j}`;
    if (visited.has(key)) return counter;

    visited.add(key);
    counter.visitedPoints.add(key);

    const value = matrix.get(i, j);
    const neighbours = matrix.getNeighbourPoints(i, j);
    const reachable = neighbours.filter(([x, y]) => matrix.get(x, y) === value);
    const borders = neighbours.length - reachable.length;

    const vertices = calculateVertexCount(i, j);
    counter.vertexCount += vertices;
    counter.borderCount += borders;

    for (const neighbour of reachable) {
        traverseRegion(neighbour, visited, counter);
    }

    return counter;
};

const computeResult = () => {
    const visited = new Set<string>();
    let totalBorders = 0;
    let totalVertices = 0;

    for (let i = 0; i < matrix.rows.length; i++) {
        for (let j = 0; j < matrix.rows[i].length; j++) {
            if (!visited.has(`${i},${j}`)) {
                const { visitedPoints, borderCount, vertexCount } = traverseRegion([i, j], visited);
                totalBorders += visitedPoints.size * borderCount;
                totalVertices += visitedPoints.size * vertexCount;
            }
        }
    }

    return { totalBorders, totalVertices };
};

console.time('time');
const { totalBorders, totalVertices } = computeResult();
console.timeEnd('time');

console.log(totalBorders, totalVertices);