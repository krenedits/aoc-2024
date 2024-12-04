import * as fs from 'fs';

const getData = (path: string): string => {
    return fs.readFileSync(path, 'utf8');
};

const getLines = <T extends string = string>(path: string): T[] => {
    return getData(path)
        .split('\n')
        .filter((line) => line !== '') as T[];
};

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
}

export { getData, getLines, Matrix };
