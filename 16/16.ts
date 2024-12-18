import { DIRECTIONS, getLines, Matrix, Point } from '../common';

const data = getLines('input.txt');
const map = new Matrix(data.map((line) => line.split('')));

const START = 'S';
const END = 'E';
const WALL = '#';
const FIELD = '.';
const PASSABLE = [FIELD, END];
const SCORES_ON_TURN = 1000;
const START_DIRECTION = DIRECTIONS.RIGHT;

type NodeDistance = Record<`${number},${number}`, number>

let absoluteMin: number | null = null;
let localMin: number = Infinity;
const shortestPaths = new Set<string>();

const traverse = (point: Point, direction: Point, turns: number, distances: NodeDistance, path: Point[] = []) => {
    const current = map.get(point[0], point[1]);
    const score = path.length + turns * SCORES_ON_TURN;
    const end = current === END;
    const directions = [direction, [direction[1], direction[0]], [-direction[1], -direction[0]]];
    const distanceKey = `${point.join(',')}`;
    
    if (distances[distanceKey] && distances[distanceKey] < score || localMin < score) {
        return distances[distanceKey];
    }

    distances[distanceKey] = score;

    if (end) {
        distances[`${point[0]},${point[1]}`] = score;
        path.push(point);
        localMin = Math.min(localMin, score);
        if (absoluteMin && score === absoluteMin) {
            path.forEach((point) => shortestPaths.add(point.join(',')));
        }
        return score;
    }


    for (let i = 0; i < directions.length; i++) {
        const direction = directions[i];
        const next = [point[0] + direction[0], point[1] + direction[1]];
        const nextValue = map.get(next[0], next[1]);
        if (!PASSABLE.includes(nextValue as string)) {
            continue;
        }

        traverse(next as Point, direction as Point, turns + (i > 0 ? 1 : 0), distances, [...path, point]);
    }

    return score;
}

const getPathFromStartToEnd = () => {
    const start = map.find(START) as Point;
    const end = map.find(END) as Point;
    const distances: NodeDistance = {};
    
    traverse(start, START_DIRECTION, 0, distances);
    // absoluteMin = distances[`${end[0]},${end[1]}`];
    // traverse(start, START_DIRECTION, 0, {});

    return {
        result1: distances[`${end[0]},${end[1]}`],
        result2: shortestPaths.size
    };
}
const {result1, result2} = getPathFromStartToEnd();
console.log(result1, result2);
// 450 low