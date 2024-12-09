import { getLines, Matrix, Point } from '../common';

type State = Record<string, [number, number][]>;
const EMPTY = '.';
const data = getLines('input.txt');

const parseData = (): State => {
    const state: State = {};

    data.forEach((line, i) => {
        line.split('').forEach((char, j) => {
            if (char !== EMPTY) {
                state[char] = state[char] || [];
                state[char].push([i, j]);
            }
        })
    });

    return state;
}

const isInMatrix = (i: number, j: number) => i < data.length && i >= 0 && j < data[0].length && j >= 0;

const getLinearAntinodes = (point1: Point, point2: Point): Point[] => {
    const difference = Matrix.getDifference(point1, point2);
    const previous = Matrix.add(point1, difference);
    const next = Matrix.substract(point2, difference);

    return [previous, next].filter(([i, j]) => isInMatrix(i, j));
}

const getAllPreviousAntinodes = (point1: Point, difference: Point) => {
    const result: Point[] = [];
    let currentPoint: Point | null = Matrix.add(point1, difference);

    while (isInMatrix(currentPoint[0], currentPoint[1])) {
        result.push(currentPoint);
        currentPoint = Matrix.add(currentPoint, difference);
    }

    return result;
}

const getAllNextAntinodes = (point1: Point, difference: Point) => {
    const result: Point[] = [];
    let currentPoint: Point | null = Matrix.substract(point1, difference);

    while (isInMatrix(currentPoint[0], currentPoint[1])) {
        result.push(currentPoint);
        currentPoint = Matrix.substract(currentPoint, difference);
    }

    return result;
}

const getAllLinearAntinodes = (point1: Point, point2: Point) => {
    const difference = Matrix.getDifference(point1, point2);

    return [...getAllPreviousAntinodes(point1, difference), ...getAllNextAntinodes(point2, difference)];
}

const getAntinodes = () => {
    const state = parseData();
    const antinodes = new Set<string>();
    const allAntinodes = new Set<string>();

    Object.values(state).forEach((value) => {
       let i = 0;

       while (i < value.length) {
            const point1 = value[i];
            allAntinodes.add(point1.join('-'));

            for (let j = i + 1; j < value.length; j++) {
                const point2 = value[j];

                getLinearAntinodes(point1, point2).forEach((antinode) => {
                    antinodes.add(antinode.join('-'));
                });

                getAllLinearAntinodes(point1, point2).forEach((antinode) => {
                    allAntinodes.add(antinode.join('-'));
                });
            }

            i++;
       }
    });

    return {
        result1: antinodes.size,
        result2: allAntinodes.size,
    };
}

const {result1, result2} = getAntinodes();

console.log(result1, result2);