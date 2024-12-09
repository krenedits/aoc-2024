import * as fs from 'fs';

const getData = (path: string): string => {
    return fs.readFileSync(path, 'utf8');
};

const getLines = <T extends string = string>(path: string): T[] => {
    return getData(path)
        .split('\n')
        .filter((line) => line !== '') as T[];
};

type Point = [number, number];

class Matrix<T extends string | number> {
    constructor(public rows: T[][]) {
        this.rows = rows;
    }

    get columns(): T[][] {
        return this.rows[0].map((_, index) => this.rows.map((row) => row[index]));
    }

    get diagonals(): T[][] {
        let j = 0;
        const result: T[][] = [];

        while (j < this.rows.length) {
            result.push(this.rows.slice(j).map((row, index) => row[index]));
            result.push(this.rows.map((_row, index) => {
                const row = _row.slice(0, _row.length - j);                
                return row[row.length - index - 1]
            }).filter(row => row !== undefined));
            if (j > 0) {
                result.push(this.columns.slice(j).map((row, index) => row[index]));
                result.push(this.columns.slice(j).map((row, index) => {
                    return row[row.length - index - 1]
                }).filter(row => row !== undefined));
            }
            j++;
        }

        return result;
    }

    getNeighbourPoints(row: number, column: number): Point[] {
        return [
            [row - 1, column],
            [row + 1, column],
            [row, column - 1],
            [row, column + 1],
        ];
    }

    getNeighbours(row: number, column: number): T[] {
        return [
            this.rows[row - 1]?.[column],
            this.rows[row + 1]?.[column],
            this.columns[column - 1]?.[row],
            this.columns[column + 1]?.[row],
        ].filter((value) => value !== undefined);
    }

    getDiagonalNeighbours(row: number, column: number): T[] {
        return [
            this.rows[row - 1]?.[column - 1],
            this.rows[row - 1]?.[column + 1],
            this.rows[row + 1]?.[column - 1],
            this.rows[row + 1]?.[column + 1],
        ].filter((value) => value !== undefined);
    }

    find(value: T): Point | undefined {
        return this.rows.reduce((acc, row, rowIndex) => {
            const column = row.indexOf(value);

            if (column !== -1) {
                return [rowIndex, column];
            }

            return acc;
        }, undefined as Point | undefined);
    }

    findAll(value: T): Point[] {
        return this.rows.reduce((acc, row, rowIndex) => {
            const columns = row
                .map((char, columnIndex) => {
                    if (char === value) {
                        return [rowIndex, columnIndex];
                    }

                    return undefined;
                })
                .filter((column) => column !== undefined) as Point[];

            return [...acc, ...columns];
        }, [] as Point[]);
    }

    findAllByCondition(condition: (value: T) => boolean): Point[] {
        return this.rows.reduce((acc, row, rowIndex) => {
            const columns = row
                .map((char, columnIndex) => {
                    if (condition(char)) {
                        return [rowIndex, columnIndex];
                    }

                    return undefined;
                })
                .filter((column) => column !== undefined) as Point[];

            return [...acc, ...columns];
        }, [] as Point[]);
    }

    get(row: number, column: number): T | undefined {
        return this.rows[row]?.[column];
    }

    replace(row: number, column: number, value: T): void {
        if (this.rows[row]?.[column]) {
            this.rows[row][column] = value;
        }
    }

    toString(): string {
        return this.rows.map((row) => row.join('')).join('\n');
    }

    static getDifference(point1: Point, point2: Point): Point {
        return [point1[0] - point2[0], point1[1] - point2[1]];
    }

    static add(point1: Point, point2: Point): Point {
        return [point1[0] + point2[0], point1[1] + point2[1]];
    }

    static substract(point1: Point, point2: Point): Point {
        return [point1[0] - point2[0], point1[1] - point2[1]];
    }
}

export type { Point };
export { getData, getLines, Matrix };
