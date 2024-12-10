import { getLines, Matrix, Point } from "../common";

const data = getLines('input.txt');

class TraverseMatrix extends Matrix<number> {
    private readonly START = 0;
    private readonly END = 9;

    constructor(rows: number[][]) {
        super(rows);
    }

    isReachable(value1?: number, value2?: number) {
        if (value1 === undefined || value2 === undefined) {
            return false;
        }

        return value2 - value1 === 1;
    }

    canPass(point1: Point, point2: Point): boolean {
        const value1 = this.get(point1[0], point1[1]);
        const value2 = this.get(point2[0], point2[1]);

        return this.isReachable(value1, value2);
    }

    traverseFromPoint(point: Point): string[] {
        if (this.get(point[0], point[1]) === this.END) {
            return [point.join('-')];
        }

        const neighbours = this.getNeighbourPoints(point[0], point[1]);

        return neighbours
            .filter((neighbour) => this.canPass(point, neighbour))
            .reduce((acc, neighbour) => acc.concat(this.traverseFromPoint(neighbour)), [] as string[]);
    }

    trailheads() {
        const trailheads = this.findAllByCondition((value) => value === this.START).reduce((acc, point) => {
            const trailheads = this.traverseFromPoint(point);
            
            return {
                result1: acc.result1 + new Set(trailheads).size,
                result2: acc.result2 + trailheads.length,
            };
        }, {result1: 0, result2: 0});

        return trailheads;
    }
}

const matrix = new TraverseMatrix(data.map((line) => line.split('').map(Number)));
console.log(matrix.trailheads());