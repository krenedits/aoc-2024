import { getData } from '../common';

const data = getData('input.txt');
const [rawOrders, rawUpdates] = data.split('\n\n');

const orders = rawOrders.split('\n');
const updates = rawUpdates.split('\n').map((update) =>
    update.split(',').map(Number)
);

type OrderHelper = Record<number, { left: number[]; right: number[] }>;

const helper: OrderHelper = {};

orders.forEach((order) => {
    const [left, right] = order.split('|').map(Number);

    helper[left] = helper[left] || { left: [], right: [] };
    helper[right] = helper[right] || { left: [], right: [] };

    helper[left].right.push(right);
    helper[right].left.push(left);
});

const isCorrectOrder = (row: number[]): boolean => {
    return row.every((value, i) => {
        if (!helper[value]) return true;

        const leftSide = row.slice(0, i);
        const rightSide = row.slice(i + 1);

        const hasConflict =
            leftSide.some((v) => helper[value].right.includes(v)) ||
            rightSide.some((v) => helper[value].left.includes(v));

        return !hasConflict;
    });
};

const orderSort = (a: number, b: number): number => {
    if (helper[a] && helper[b]) {
        return isCorrectOrder([a, b]) ? -1 : 1;
    }
    return 0;
};

const incorrectUpdates: number[][] = [];

const result1 = updates.reduce((sum, update) => {
    const medianIndex = Math.floor(update.length / 2);
    const isOrderCorrect = isCorrectOrder(update);

    if (!isOrderCorrect) {
        incorrectUpdates.push(update);
    }

    return sum + (isOrderCorrect ? update[medianIndex] : 0);
}, 0);

const result2 = incorrectUpdates
    .map((update) => update.sort(orderSort))
    .reduce((sum, update) => sum + update[Math.floor(update.length / 2)], 0);

console.log(result1, result2);