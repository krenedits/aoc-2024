import { getLines, Matrix } from "../common";

const SIZE = 70;
const FIRST_X_BYTE = 1024;
const OBSTACLE = '#';
const EMPTY = '.';
const END_POINT = [SIZE, SIZE];

const data = getLines('input.txt');

const setObstacles = (count: number = FIRST_X_BYTE) => {
    const map = new Matrix<string>(Array.from({ length: SIZE + 1 }).map(() => Array.from({ length: SIZE + 1 }).fill(EMPTY)) as string[][]);

    data.slice(0, count).forEach((line) => {
        const [y, x] = line.split(',').map(Number);
        map.replace(x, y, OBSTACLE);
    });

    return map;
}

const traverse = (map: Matrix<string>) => {
    const queue: [number, number, number][] = [[0, 0, 0]];
    const visited = new Set<string>();

    while (queue.length > 0) {
        const [y, x, steps] = queue.shift() as [number, number, number];
        if (visited.has(`${y}-${x}`)) {
            continue;
        }
        visited.add(`${y}-${x}`);
        
        if (y === END_POINT[0] && x === END_POINT[1]) {
            return steps;
        }
        
        for (const [dy, dx] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            const [ny, nx] = [y + dy, x + dx];
            if (map.get(ny, nx) === EMPTY) {
                queue.push([ny, nx, steps + 1]);
            }
        }
    }

    return -1;
}


const result1 = traverse(setObstacles());

const getResult2 = () => {
    let min = FIRST_X_BYTE;
    let max = data.length

    while (min < max) {
        const count = Math.floor((min + max) / 2);
        const result = traverse(setObstacles(count));
        if (result === -1) {
            max = count - 1;
        } else {
            min = count + 1;
        }
    }

    return data[min - 1];
}

console.time('time');
console.log(result1);
console.log(getResult2());
console.timeEnd('time');