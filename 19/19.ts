import { getData } from '../common';

const data = getData('input.txt');
const [rawStripes, rawTowels] = data.split('\n\n');
const stripes = rawStripes.split(', ');
const towels = rawTowels.split('\n');

const cache = new Map<string, number>();

const check = (towel: string, path: string, ways = 0): number => {
    if (cache.has(towel)) {
        return cache.get(towel) as number;
    }

    let next = stripes.reduce((acc, stripe) => {
        if (towel.startsWith(stripe)) {
            const nextTowel = towel.slice(stripe.length);
            if (nextTowel === '') {
                return acc + 1;
            }
            return acc + check(nextTowel, path + stripe, ways + 1);
        }

        return acc;
    }, 0);

    cache.set(towel, next);

    return next;
};

console.time('check');
const result = towels.reduce(
    (acc, towel) => {
        const checked = check(towel, '');
        return {
            result1: acc.result1 + +(checked > 0),
            result2: acc.result2 + checked,
        };
    },
    {
        result1: 0,
        result2: 0,
    }
);
console.log(result, 'result');
console.timeEnd('check');
