import { getData } from '../common';

const data = getData('input.txt');
const [rawOrders, rawUpdates] = data.split('\n\n');

const orders = rawOrders.split('\n');
const updates = rawUpdates.split('\n').map((update) => update.split(',').map(Number));

type OrderHelper = Record<number, { left: number[]; right: number[] }>

const helper: OrderHelper = {};
orders.forEach((order) => {
    const [left, right] = order.split('|').map(Number);

    if (!helper[left] && !helper[right]) {
        helper[left] = { left: [], right: [right] };
        helper[right] = { left: [left], right: [] };
    } else if (!helper[left] && helper[right]) {
        helper[left] = { left: [], right: [right] };
        helper[right].left.push(left);
    } else if (helper[left] && !helper[right]) {
        helper[right] = { left: [left], right: [] };
        helper[left].right.push(right);
    } else {
        helper[left].right.push(right);
        helper[right].left.push(left);
    }
});

const isCorrectOrder = (row: number[]): boolean => {
    let i = 0;
    while (i < row.length) {
        if (helper[row[i]]) {
            const leftSide = row.slice(0, i);
            const rightSide = row.slice(i + 1);
            const hasRightOnLeft = leftSide.some((value) => helper[row[i]].right.includes(value));
            const hasLeftOnRight = rightSide.some((value) => helper[row[i]].left.includes(value));

            if (hasRightOnLeft || hasLeftOnRight) {
                return false;
            }
        }
        i++;
    }

    return true;
}

const orderSort = (a: number, b: number): number => {
    if (helper[a] && helper[b]) {
        return isCorrectOrder([a, b]) ? -1 : 1;
    }

    return 0;
}

const incorrects: number[][] = [];

const result1 = updates.reduce((acc, update) => {
    const median = Math.floor(update.length / 2);
    const incorrect = isCorrectOrder(update);
    
    if (!incorrect) {
        incorrects.push(update);
    }
    
    return acc + (incorrect ? update[median] : 0);
}, 0);

const result2 = incorrects.map(incorrect => incorrect.sort(orderSort)).reduce((acc, update) => acc + update[Math.floor(update.length / 2)], 0);

console.log(result1, result2);