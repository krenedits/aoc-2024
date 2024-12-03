import { getData } from '../common';

const data = getData('input.txt');
const getResult = (firstTask: boolean) =>
    [...data.matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g)].reduce(
        (acc, match) => {
            if (match[0] === 'do()') {
                return {
                    ...acc,
                    enabled: true,
                };
            }

            if (match[0] === "don't()") {
                return {
                    ...acc,
                    enabled: false,
                };
            }

            return {
                ...acc,
                sum: acc.enabled || firstTask ? acc.sum + +match[1] * +match[2] : acc.sum,
            };
        },
        {
            sum: 0,
            enabled: true,
        },
    ).sum;

console.log(getResult(true), getResult(false));
