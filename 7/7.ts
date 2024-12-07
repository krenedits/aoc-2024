import { getLines } from '../common';

const data = getLines('input.txt');
console.time('time');

const createNumber = (value: number, rest: number[], target: number, concat: boolean): boolean => {
    if (target < value) {
        return false;
    }

    if (rest.length > 0) {
        const [first, ...remaining] = rest;
        const addition = createNumber(value + first, remaining, target, concat);
        const multiplication = createNumber(value * first, remaining, target, concat);
        let concatenation = false;
        if (concat) {
            concatenation = createNumber(+(value + '' + first), remaining, target, concat);
        }

        return addition || multiplication || concatenation;
    }
    
    return value === target;
};

const {result1, result2} = data.reduce((acc, line) => {
    const [left, right] = line.split(': ');
    const [first, ...rest] = right.split(' ').map(Number);
    const target = +left;

    if (createNumber(first, rest, target, false)) {
        return {
            ...acc,
            result1: acc.result1 + +left,
            result2: acc.result2 + +left,
        };
    }

    if (createNumber(first, rest, target, true)) {
        return {
            ...acc,
            result2: acc.result2 + +left,
        }
    }

    return acc;
}, {
    result1: 0,
    result2: 0,
});

console.log(result1, result2);
console.timeEnd('time');
