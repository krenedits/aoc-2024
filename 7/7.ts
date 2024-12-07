import { getLines } from '../common';

const data = getLines('input.txt');

class Binary {
    constructor(
        public value: number,
        public left: null | Binary = null,
        public right: null | Binary = null,
        public center: null | Binary = null,
    ) {
        this.value = value;
        this.left = left;
        this.center = center;
        this.right = right;
    }

    leafsOne(): Binary[] {
        if (this.left && this.right) {
            return [...this.left.leafsOne(), ...this.right.leafsOne()];
        }

        return [this];
    }

    leafsTwo(): Binary[] {
        if (this.left && this.center && this.right) {
            return [...this.left.leafsTwo(), ...this.center.leafsTwo(), ...this.right.leafsTwo()];
        }

        return [this];
    }
}

const createBinary = (value: number, rest: number[]): Binary => {
    let binary;
    if (rest.length > 0) {
        const [first, ...remaining] = rest;
        binary = new Binary(
            value,
            createBinary(value + first, remaining),
            createBinary(value * first, remaining),
            createBinary(+(value + '' + first), remaining),
        );
    } else {
        binary = new Binary(value);
    }

    return binary;
};

const {result1, result2} = data.reduce((acc, line) => {
    const [left, right] = line.split(': ');
    const [first, ...rest] = right.split(' ').map(Number);

    const binary = createBinary(first, rest);
    const containsOne = binary
        .leafsOne()
        .map((leaf) => leaf.value)
        .includes(+left);

    const containsTwo = binary
        .leafsTwo()
        .map((leaf) => leaf.value)
        .includes(+left);

    if (containsOne) {
        return {
            ...acc,
            result1: acc.result1 + +left,
            result2: acc.result2 + +left,
        };
    }

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
