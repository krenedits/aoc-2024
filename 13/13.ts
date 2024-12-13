import { getData, Matrix } from '../common';

const data = getData('input.txt');
const groups = data.split('\n\n');

const A_TOKEN = 3;
const B_TOKEN = 1;

const PART_2_NUMBER = 10 ** 13;

interface Point {
    x: number;
    y: number;
}

interface Group {
    A: Point;
    B: Point;
    prize: Point;
}

const parseData = (group: string): Group => {
    const regex =
        /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/g;

    const [_, AX, AY, BX, BY, PX, PY] = [...group.matchAll(regex)][0];

    return {
        A: {
            x: +AX,
            y: +AY,
        },
        B: {
            x: +BX,
            y: +BY,
        },
        prize: {
            x: +PX,
            y: +PY,
        },
    };
};

interface Equation {
    a: number;
    b: number;
    c: number;
}

const isWholeNumber = (value: number) => Math.floor(value) === value;

const solveEquations = (equations: [Equation, Equation]): number => {
    const { a: a1, b: b1, c: c1 } = equations[0];
    const { a: a2, b: b2, c: c2 } = equations[1];

    // for 2x2 (or NxN idk)
    // D = determinant
    // Dx = determinant for 'a' column replaced with 'c' column
    // Dy = determinant for 'b' row swapped with 'c' column
    // x = Dx / D
    // y = Dy / D
    const d = Matrix.determinantForArray([
        [a1, b1],
        [a2, b2],
    ]);
    const dx = Matrix.determinantForArray([
        [c1, b1],
        [c2, b2],
    ]);
    const dy = Matrix.determinantForArray([
        [a1, c1],
        [a2, c2],
    ]);
    const x = dx / d;
    const y = dy / d;

    if (!(isWholeNumber(x) && isWholeNumber(y))) {
        return 0;
    }

    return x * A_TOKEN + y * B_TOKEN;
};

const result = groups.reduce(
    (acc, group) => {
        const { A, B, prize } = parseData(group);
        const equations1: [Equation, Equation] = [
            { a: A.x, b: B.x, c: prize.x },
            { a: A.y, b: B.y, c: prize.y },
        ];

        const equations2: [Equation, Equation] = [
            { a: A.x, b: B.x, c: prize.x + PART_2_NUMBER },
            { a: A.y, b: B.y, c: prize.y + PART_2_NUMBER },
        ];

        return {
            result1: acc.result1 + solveEquations(equations1),
            result2: acc.result2 + solveEquations(equations2),
        };
    },
    { result1: 0, result2: 0 },
);

console.log(result.result1, result.result2);
