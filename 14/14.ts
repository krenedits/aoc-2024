import { getLines, Point } from "../common";
import * as fs from 'fs';
import * as canvasPackage from 'canvas';

const WIDTH = 101;
const HEIGHT = 103;
const SECONDS = 100;

interface Robot {
    position: Point;
    velocity: Point;
}

const createRobots = (): Robot[] => {
    const data = getLines('input.txt');
    const robots: Robot[] = [];
    
    data.forEach((line) => {
        const [p1, p2, v1, v2] = [...line.matchAll(/-?\d+/g)].map(m => +m[0]);
        
        robots.push({
            position: [p1, p2],
            velocity: [v1, v2],
        });
    });

    return robots;
}

const simulateRobotMovement = (robot: Robot, seconds = SECONDS): Point => {
    let newWidth = robot.position[0] + robot.velocity[0] * seconds;

    if (newWidth < 0) {
        newWidth = WIDTH + ((newWidth % WIDTH) || -WIDTH);
    } else {
        newWidth = newWidth % WIDTH;
    }

    let newHeight = robot.position[1] + robot.velocity[1] * seconds;

    if (newHeight < 0) {
        newHeight = HEIGHT + ((newHeight % HEIGHT) || -HEIGHT);
    } else {
        newHeight = newHeight % HEIGHT;
    }
    
    return [
        newWidth,
        newHeight
    ];
}

const simulateRobotMovements = (seconds = SECONDS): Point[] => {
    const robots = createRobots();
    
    const positions = robots.map(robot => simulateRobotMovement(robot, seconds));
    
    return positions;
}

const getNumberOfQuarter = (point: Point): number => {
    const [x, y] = point;

    if (x === Math.floor(WIDTH / 2) || y === Math.floor(HEIGHT / 2)) return 0;

    if (x < WIDTH / 2 && y < HEIGHT / 2) return 1;
    if (x > WIDTH / 2 && y < HEIGHT / 2) return 2;
    if (x > WIDTH / 2 && y > HEIGHT / 2) return 3;
    if (x < WIDTH / 2 && y > HEIGHT / 2) return 4;
    return 0;
}

const countQuarters = (points: Point[]) => points.reduce((acc, point) => {
    const quarter = getNumberOfQuarter(point);
    if (quarter) {
        acc[quarter -1] += 1;
    }
    return acc;
}, [0, 0, 0, 0])

const getResult1 = () => countQuarters(simulateRobotMovements())

const result1 = getResult1().reduce((acc, count) => acc * count, 1);

console.log(result1);

const clearAllMaps = () => {
    const directory = '.'
    const files = fs.readdirSync(directory);
    for (const file of files) {
        if (file.startsWith('map')) {
            fs.unlinkSync(`${directory}/${file}`);
        }
    }
}

const drawMap = (positions: Point[], i: number) => {
    const ZOOM = 10;
    const canvas = canvasPackage.createCanvas(WIDTH * ZOOM, HEIGHT * ZOOM);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    positions.forEach(position => {
        const [x, y] = position;
        ctx.fillRect(x * ZOOM, y * ZOOM, ZOOM, ZOOM);
    });

    fs.writeFileSync(`map${i}.png`, canvas.toBuffer());
}

const getResult2 = () => {
    let i = 77;
    clearAllMaps();

    while (i < 10000) {
        const positions = simulateRobotMovements(i);
        drawMap(positions, i);
        i += WIDTH;
    }
}

getResult2();
