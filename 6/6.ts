import { getLines, Matrix } from '../common';
import * as fs from 'fs';

const data = getLines('input.txt');
const OBSTACLE = '#';
type DirectionKey = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Direction = [number, number];
const DIRECTIONS: Record<DirectionKey, [number, number]> = {
    UP: [-1, 0],
    DOWN: [1, 0],
    LEFT: [0, -1],
    RIGHT: [0, 1],
};
const VISITED = 'X';
const START = '^';

const rotateDirectionRight = (direction: Direction): Direction => {
    const [i, j] = direction;
    return [j, -i];
};

const getStringDirection = (direction: Direction): DirectionKey => {
    const [i, j] = direction;
    return i === 0 ? (j === 1 ? 'RIGHT' : 'LEFT') : (i === 1 ? 'DOWN' : 'UP');
}

const getDirectionBetweenPoints = (start: [number, number], end: [number, number]): Direction => {
    const [startI, startJ] = start;
    const [endI, endJ] = end;
    const i = endI - startI > 0 ? 1 : (endI - startI < 0 ? -1 : 0);
    const j = endJ - startJ > 0 ? 1 : (endJ - startJ < 0 ? -1 : 0);
    return [i, j];
}

const isConnected = ([i1, j1]: Direction, [i2, j2]: Direction, direction: Direction): boolean => {
    return (i1 === i2 || j1 === j2) && compareDirections(getDirectionBetweenPoints([i1, j1], [i2, j2]), direction);
}

const compareDirections = (direction1: Direction, direction2: Direction): boolean => {
    const [i1, j1] = direction1;
    const [i2, j2] = direction2;
    return i1 === i2 && j1 === j2;
}


const canCreateRectangleFromTriplet = (triplet: string, matrix: Matrix<string>): boolean => {
    const [f, s, t] = triplet.split('|');
    const [fI, fJ] = f.split('-').map(Number);
    const [sI, sJ] = s.split('-').map(Number);
    const [tI, tJ] = t.split('-').map(Number);

    const fourthPoint = [fI === sI ? tI : fI, fJ === sJ ? tJ : fJ];

    return matrix.getNeighbours(fourthPoint[0], fourthPoint[1]).some((value) => value === OBSTACLE);
}

let infiniteSet = new Set<string>();

const traverse = (start?: [number, number], defaultDirection?: Direction, plusObstacle?: [number, number]) => {
    const matrix = new Matrix<string>(data.map((line) => line.split('')));
    const visited = new Set<string>();
    const visitedWithDirection = new Set<string>();
    let direction = defaultDirection ?? DIRECTIONS.UP;
    let guard = start ?? matrix.find(START) as [number, number];
    let end = false;
    let infinite = false;

    if (plusObstacle) {
        matrix.replace(plusObstacle[0], plusObstacle[1], OBSTACLE);
    }

    while (!end) {
        const [i, j] = direction;
        const [guardI, guardJ] = guard;

        const visitedWithDirectionKey = `${guardI}-${guardJ}-${getStringDirection(direction)}`;
        if (plusObstacle && visitedWithDirection.has(visitedWithDirectionKey)) {
            infinite = true;
            infiniteSet.add(plusObstacle.join('-'));
            break;
        }

        const visitedKey = `${guardI}-${guardJ}`;
        visited.add(visitedKey);
        const next = matrix.get(guardI + i, guardJ + j);

        if (!next) {
            end = true;
            break;
        }


        if (next === OBSTACLE) {
            direction = rotateDirectionRight(direction);
            continue;
        }
        visitedWithDirection.add(visitedWithDirectionKey);

        if (!start) {
            traverse(guard, direction, [guardI + i, guardJ + j]);
        }

        guard = [guardI + i, guardJ + j];
    }

    if (start) {
        return infinite;
    }

    // visited.forEach((point) => {
    //     const [i, j] = point.split('-').map(Number);
    //     matrix.replace(i, j, VISITED);
    // })
    
    // infiniteSet.forEach((point) => {
    //     const [i, j] = point.split('-').map(Number);
    //     matrix.replace(i, j, 'K');
    // })
    // fs.writeFileSync('output.txt', matrix.toString());


    console.log(Math.min(...[...infiniteSet.keys()].map((key) => Number(key.split('-')[0]))));

    return {
        result1: visited.size,
        result2: infiniteSet.size,
    };
};


const { result1, result2 } = traverse() as {
    result1: number;
    result2: number;
};

// 1763 is too low
// 1990 is too high

console.log(result1, result2);
