import { getData } from '../common';

const data = getData('input.txt');
const numbers = data.split(' ').map(Number);
const cache: Record<string, number> = {};

const transform = (number: number): number[] => {
    if (number === 0) {
        return [1];
    }

    const string = '' + number;
    const length = string.length;
    if (length % 2 === 0) {
        const center = length / 2;
        return [+string.slice(0, center), +string.slice(center)];
    }

    return [number * 2024];
};

const simulation = (number: number, round: number) => {
    const key = round + '-' + number;
    if (cache[key]) {
        return cache[key];
    }

    if (round === 0) {
        return 1;
    }

    const transformed = transform(number);

    const result = transformed.reduce((acc, number) => {
        return acc + simulation(number, round - 1);
    }, 0);

    cache[key] = result;

    return result;
};

const getResult = (rounds: number) => {
    return numbers.reduce((acc, number) => acc + simulation(number, rounds), 0);
};

console.time('start');

console.time('part1');
const result1 = getResult(25);
console.timeEnd('part1');

console.time('part2');
const result2 = getResult(75);
console.timeEnd('part2');

console.timeEnd('start');

console.log(result1, result2);
