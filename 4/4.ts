import { getLines, Matrix } from '../common';

const data = getLines('input.txt');

const matrix = new Matrix<string>(data.map((line) => line.split('')));

const WORD_TO_FIND = 'XMAS';
const WORDS_TO_FIND = [WORD_TO_FIND, [...WORD_TO_FIND].reverse().join('')];

const WORD_TO_FIND_SECOND = 'MAS';
const WORDS_TO_FIND_SECOND = [WORD_TO_FIND_SECOND, [...WORD_TO_FIND_SECOND].reverse().join('')];
const X_MAS_CENTER = 'A';

const hay = [
    matrix.rows,
    matrix.columns,
    matrix.diagonals,
].flat().map(row => row.join(''));

const countWordInRow = (row: string, word: string) => [...row.matchAll(new RegExp(word, 'g'))].length;

const result1 = WORDS_TO_FIND.reduce((acc, word) => acc + (hay.reduce((acc, row) => acc + countWordInRow(row, word), 0)), 0);
const result2 = matrix.rows.reduce((acc, row, i) => {
    return acc + row.reduce((acc, char, j) => {
        if (char === X_MAS_CENTER) {
            const [F1, S2, S1, F2] = matrix.getDiagonalNeighbours(i, j);
            
            const match = WORDS_TO_FIND_SECOND.includes(`${F1}${char}${F2}`) && WORDS_TO_FIND_SECOND.includes(`${S1}${char}${S2}`);

            if (match) {
                return acc + 1;
            }
        }

        return acc;
    }, 0);
}, 0);

console.log(result1, result2);