import { getLines } from '../common';

const SPLIT_STRING = '   ';
type SplitString = typeof SPLIT_STRING;
type InputLine = `${number}${SplitString}${number}`;

const data = getLines<InputLine>('input.txt');

interface Pairs {
    left: number[];
    right: number[];
}

const parsePairs = (lines: InputLine[]): Pairs => {
    const pairs: Pairs = { left: [], right: [] };

    lines.forEach((line) => {
        const [left, right] = line.split(SPLIT_STRING).map(Number);
        pairs.left.push(left);
        pairs.right.push(right);
    });

    return pairs;
};

const pairs = parsePairs(data);

pairs.left.sort();
pairs.right.sort();

const result1 = pairs.left.reduce(
    (acc, l, i) => acc + Math.abs(l - pairs.right[i]),
    0
);

console.log(result1);

let leftIndex = 0,
    rightIndex = 0;
let result2 = 0;

while (leftIndex < pairs.left.length && rightIndex < pairs.right.length) {
    const l = pairs.left[leftIndex];
    let occurrences = 0;

    while (pairs.right[rightIndex] < l) {
        rightIndex++;
    }

    while (pairs.right[rightIndex] === l) {
        occurrences++;
        rightIndex++;
    }

    let sameOccurrences = occurrences;
    while (pairs.left[++leftIndex] === l) {
        sameOccurrences += occurrences;
    }

    result2 += sameOccurrences * l;
}

console.log(result2);
