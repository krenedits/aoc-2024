import { getLines, Matrix, NodeDistance, Point } from '../common';

const data = getLines('input.txt');
const map = new Matrix(data.map((line) => line.split('')));
const START = 'S';
const END = 'E';
const WALL = '#';
const FIELD = '.';
const PASSABLE = [FIELD, END];

const start = map.find(START) as Point;
let distances: NodeDistance = {};
const SAVE_COUNT = 100;

const traverse = (start: Point) => {
    const queue: [Point, number][] = [[start, 0]];

    while (queue.length > 0) {
        const [point, distance] = queue.shift()!;
        const distanceKey = `${point[0]},${point[1]}`;

        if (distances[distanceKey] && distances[distanceKey] <= distance) {
            continue;
        }

        distances[distanceKey] = distance;

        const nextNeighbour = map
            .getNeighbourPoints(point[0], point[1])
            .find(
                (neighbour) =>
                    PASSABLE.includes(map.get(neighbour[0], neighbour[1]) as string) &&
                    (!distances[`${neighbour[0]},${neighbour[1]}`] ||
                        distances[`${neighbour[0]},${neighbour[1]}`] > distance + 1),
            );

        if (nextNeighbour) {
            queue.push([nextNeighbour as Point, distance + 1]);
        }
    }
};

const traverseFromPoint = (start: Point, end: Point, allowedCheats: number = 20): number => {
    const queue: [Point, number, number][] = [[start, 0, 0]];
    const localDistances = distances;

    while (queue.length > 0) {
        const [point, distance, cheats] = queue.shift()!;
        console.log(point, cheats);
        const localPassable = cheats >= allowedCheats ? PASSABLE : [...PASSABLE, WALL];
        const distanceKey = `${point[0]},${point[1]}`;

        if (localDistances[distanceKey] && localDistances[distanceKey] <= distance) {
            continue;
        }

        localDistances[distanceKey] = distance;

        if (point[0] === end[0] && point[1] === end[1]) {
            return distance;
        }

        const neighbours = map
            .getNeighbourPoints(point[0], point[1])
            .filter((neighbour) =>
                localPassable.includes(map.get(neighbour[0], neighbour[1]) as string),
            );

        for (const neighbour of neighbours) {
            const key = `${neighbour[0]},${neighbour[1]}`;

            if (!localDistances[key] || localDistances[key] > distance + 1) {
                const nextValue = map.get(neighbour[0], neighbour[1]) as string;
                queue.push([
                    neighbour as Point,
                    distance + 1,
                    cheats + (nextValue === WALL ? 1 : 0),
                ]);
            }
        }
    }

    return Infinity;
};

const getShortcuts = () => {
    traverse(start);
    const cheats = new Set<string>();

    Object.entries(distances).forEach(([key, value], i) => {
        console.log(i + 1, '/', Object.entries(distances).length);
        const [x, y] = key.split(',').map(Number);
        const point = [x, y] as Point;

        let j = i + SAVE_COUNT;

        while (j < Object.keys(distances).length) {
            const [key2, value2] = Object.entries(distances)[j];
            const [x2, y2] = key2.split(',').map(Number);
            const point2 = [x2, y2] as Point;
            const originalDistance = Math.abs(value - value2);
            const distance = traverseFromPoint(point, point2);

            if (originalDistance - distance >= SAVE_COUNT) {
                cheats.add([point, point2].join(','));
            }

            j++;
        }
    });

    return cheats.size;
};

console.time('time');
console.log(getShortcuts());
console.timeEnd('time');
