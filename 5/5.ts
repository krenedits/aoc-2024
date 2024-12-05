import { getData } from '../common';

const data = getData('input.txt');
const [rawOrders, rawUpdates] = data.split('\n\n');

const orders = rawOrders.split('\n');

const compare = (a: number, b: number): number => {
    if (orders.includes(a + '|' + b)) {
        return -1;
    }

    if (orders.includes(b + '|' + a)) {
        return 1;
    }

    return 0;
};

const updates = rawUpdates
    .split('\n')
    .map((update) => update.split(',').map(Number));

const isCorrectOrder = (row: number[]): boolean => {
    return [...row].sort(compare).join(',') === row.join(',');
};

let result1 = 0;
let result2 = 0;

updates.forEach((update) => {
    const medianIndex = Math.floor(update.length / 2);

    if (isCorrectOrder(update)) {
        result1 += update[medianIndex];
    } else {
        result2 += update.sort(compare)[medianIndex];
    }
});

console.log(result1, result2);
