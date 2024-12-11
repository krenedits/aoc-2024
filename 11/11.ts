import { getData } from '../common';

const data = getData('input.txt');
const numbers = data.split(' ').map(Number);
const cache: Record<string, number> = {};

const transform = (number: number): number[] => {
    if (number === 0) {
        return [1];
    }

    const string = '' + number;
    if (string.length % 2 === 0) {
        return [+string.slice(0, string.length / 2), +string.slice(string.length / 2)];
    }

    return [number * 2024];
};

const simulation = (number: number, round: number) => {
    const key = round + '-' + number;
    if (cache[key]) {
        const result = cache[key];
        return result;
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

console.time('start');
const result1 = numbers.reduce((acc, number) => acc + simulation(number, 25), 0);
const result2 = numbers.reduce((acc, number) => acc + simulation(number, 75), 0);
console.timeEnd('start');
console.log(result1, result2);
