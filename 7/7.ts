import { getLines } from '../common';

const data = getLines('input.txt');
console.time('time');

const createNumber = (value: number, rest: number[], cache: number[], concat: boolean): void => {
    if (rest.length > 0) {
        const [first, ...remaining] = rest;
        createNumber(value + first, remaining, cache, concat);
        createNumber(value * first, remaining, cache, concat);
        if (concat) {
            createNumber(+(value + '' + first), remaining, cache, concat);
        }
    } else {
        cache.push(value);
    }
};

const {result1, result2} = data.reduce((acc, line) => {
    const [left, right] = line.split(': ');
    const [first, ...rest] = right.split(' ').map(Number);
    const cacheOne: number[] = []
    createNumber(first, rest, cacheOne, false);
    const containsOne = cacheOne.includes(+left);

    if (containsOne) {
        return {
            ...acc,
            result1: acc.result1 + +left,
            result2: acc.result2 + +left,
        };
    }

    const cacheTwo: number[] = []
    createNumber(first, rest, cacheTwo, true);
    const containsTwo = cacheTwo.includes(+left);

    if (containsTwo) {
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
