import { getData, Matrix, Point } from "../common";

type Move = '^' | 'v' | '<' | '>';

const data = getData('example.txt');
const MOVE: Record<Move, Point> = {
    '^': [-1, 0],
    'v': [1, 0],
    '<': [0, -1],
    '>': [0, 1],
}

const [rawMap, rawMoves] = data.split('\n\n');
const moves = rawMoves.split('').filter((char) => Object.keys(MOVE).includes(char)) as Move[];
const ROBOT = '@';
const WALL = '#';
const EMPTY = '.';

declare class Result {
    readonly BOX: string;
    move: (map: Matrix<string>, point: Point, movement: Move) => boolean;
    getResult: () => void;
} 

class Result1 implements Result {
    readonly BOX = 'O';
    move(map: Matrix<string>, point: Point, movement: Move): boolean {
        const [i, j] = point;
        const [iMove, jMove] = MOVE[movement];
        const nextPoint = [i + iMove, j + jMove] as Point;
        const current = map.get(i, j);
    
        if (map.get(nextPoint[0], nextPoint[1]) === WALL || !current) {
            return false;
        }
    
        if (map.get(nextPoint[0], nextPoint[1]) === EMPTY) {
            map.replace(nextPoint[0], nextPoint[1], current);
            map.replace(i, j, EMPTY);
    
            return true;
        }
    
        if (map.get(nextPoint[0], nextPoint[1]) === this.BOX) {
            const result = this.move(map, nextPoint, movement);
    
            if (result) {
                map.replace(nextPoint[0], nextPoint[1], current);
                map.replace(i, j, EMPTY);
            }
    
            return result;
        }
    
        return false;
    }

    getResult() {
        const map = new Matrix(rawMap.split('\n').map((line) => line.split('')));
        for (const movement of moves) {
            this.move(map, map.find(ROBOT) as Point, movement);
        }
    
        const result = map.findAll(this.BOX).reduce((acc, [i, j]) => acc + i * 100 + j, 0);

        console.log(result);
    }
}

class Result2 implements Result {
    readonly BOX = '[]';
    readonly ORIGINAL_BOX = 'O';
    move(map: Matrix<string>, point: Point, movement: Move, check = false): boolean {
        const [i, j] = point;
        const [iMove, jMove] = MOVE[movement];
        const nextPoint = [i + iMove, j + jMove] as Point;
        const nextField = map.get(nextPoint[0], nextPoint[1]);
        const current = map.get(i, j);
    
        if (!nextField || nextField === WALL || !current) {
            return false;
        }

        
        if (nextField === EMPTY) {
            if (!check) {
                map.replace(nextPoint[0], nextPoint[1], current);
                map.replace(i, j, EMPTY);
            }
            return true;
        }
        
        if (this.BOX.includes(nextField)) {
            let result = false;
            
            if (movement === '^' || movement === 'v') {
                const isOpener = nextField === '[';
                const result1 = this.move(map, isOpener ? nextPoint : [nextPoint[0], nextPoint[1] - 1], movement, true);
                const result2 = this.move(map, isOpener ? [nextPoint[0], nextPoint[1] + 1] : nextPoint, movement, true);
                result = result1 && result2;
                if (result) {
                    this.move(map, isOpener ? nextPoint : [nextPoint[0], nextPoint[1] - 1], movement, check);
                    this.move(map, isOpener ? [nextPoint[0], nextPoint[1] + 1] : nextPoint, movement, check);
                }
            } else {
                result = this.move(map, nextPoint, movement, check);
            }

            if (result && !check) {
                map.replace(nextPoint[0], nextPoint[1], current);
                map.replace(i, j, EMPTY);
            }
            
            return result;
        }
    
        return false;
    }

    replaceElements(rawMap: string): string {
        return rawMap.replaceAll(EMPTY, EMPTY + EMPTY)
        .replaceAll(WALL, WALL + WALL)
        .replaceAll(ROBOT, ROBOT + EMPTY)
        .replaceAll(this.ORIGINAL_BOX, this.BOX);
    }

    getResult() {
        const map = new Matrix(this.replaceElements(rawMap).split('\n').map((line) => line.split('')));
        let i = 1;
        for (const movement of moves) {
            this.move(map, map.find(ROBOT) as Point, movement);

            i++;
        }
        
        const result = map.findAll(this.BOX[0]).reduce((acc, [i, j]) => acc + i * 100 + j, 0);
        
        console.log(result);
    }
}

new Result1().getResult();
new Result2().getResult();