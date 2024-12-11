import { getLines, Matrix } from '../common';

console.time('time');
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
const START = '^';

const rotateDirectionRight = (direction: Direction): Direction => {
    const [i, j] = direction;
    return [j, -i];
};

const getStringDirection = (direction: Direction): DirectionKey => {
    const [i, j] = direction;
    return i === 0 ? (j === 1 ? 'RIGHT' : 'LEFT') : i === 1 ? 'DOWN' : 'UP';
};

let infiniteSet = new Set<string>();

const traverse = (plusObstacle?: [number, number]) => {
    const matrix = new Matrix<string>(data.map((line) => line.split('')));
    const visited = new Set<string>();
    const visitedWithDirection = new Set<string>();
    let direction = DIRECTIONS.UP;
    let guard = matrix.find(START) as [number, number];
    let end = false;
    let infinite = false;

    if (plusObstacle) {
        matrix.replace(plusObstacle[0], plusObstacle[1], OBSTACLE);
    }

    while (!end) {
        const [i, j] = direction;
        const [guardI, guardJ] = guard;

        const visitedWithDirectionKey = `${guardI}-${guardJ}-${getStringDirection(
            direction
        )}`;
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

        if (!plusObstacle) {
            traverse([guardI + i, guardJ + j]);
        }

        guard = [guardI + i, guardJ + j];
    }

    if (plusObstacle) {
        return infinite;
    }

    return {
        result1: visited.size,
        result2: infiniteSet.size,
    };
};

const { result1, result2 } = traverse() as {
    result1: number;
    result2: number;
};

console.timeEnd('time');
console.log(result1, result2);
