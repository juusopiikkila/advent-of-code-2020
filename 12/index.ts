import { strictEqual } from 'assert';
import { distManhattan } from '@thi.ng/vectors';
import { readFileToArray } from '../utils';

interface Instruction {
    action: string
    amount: number
}

class Waypoint {
    x = 10

    y = -1

    runInstruction({ action, amount }: Instruction): void {
        if (action === 'N') {
            this.y -= amount;
        } else if (action === 'E') {
            this.x += amount;
        } else if (action === 'S') {
            this.y += amount;
        } else if (action === 'W') {
            this.x -= amount;
        } else if (action === 'R' || action === 'L') {
            const radians = (action === 'R' ? amount : amount * -1) * (Math.PI / 180);
            const cos = Math.cos(radians);
            const sin = Math.sin(radians);
            const { x, y } = this;

            this.x = Math.round((cos * x) - (sin * y));
            this.y = Math.round((cos * y) + (sin * x));
        }
    }
}

class Ship {
    x = 0

    y = 0

    bearing = 1

    instructions: Instruction[]

    waypoint?: Waypoint

    constructor(
        data: string[],
        waypointMode = false,
    ) {
        this.instructions = this.parseInstructions(data);
        this.waypoint = waypointMode ? new Waypoint() : undefined;
    }

    private parseInstructions(data: string[]): Instruction[] {
        return data.map((line) => {
            const action = line[0];
            const amount = parseInt(line.slice(1), 10);

            return {
                action,
                amount,
            };
        });
    }

    private runInstruction({ action, amount }: Instruction): void {
        if (this.waypoint) {
            if (action === 'F') {
                this.x += this.waypoint.x * amount;
                this.y += this.waypoint.y * amount;
            } else {
                this.waypoint.runInstruction({ action, amount });
            }
        } else if (action === 'N') {
            this.y -= amount;
        } else if (action === 'E') {
            this.x += amount;
        } else if (action === 'S') {
            this.y += amount;
        } else if (action === 'W') {
            this.x -= amount;
        } else if (action === 'R') {
            this.bearing += amount / 90;

            if (this.bearing > 3) {
                this.bearing -= 4;
            }
        } else if (action === 'L') {
            this.bearing -= amount / 90;

            if (this.bearing < 0) {
                this.bearing += 4;
            }
        } else if (action === 'F') {
            if (this.bearing === 0) { // north
                this.y -= amount;
            } else if (this.bearing === 1) { // east
                this.x += amount;
            } else if (this.bearing === 2) { // south
                this.y += amount;
            } else if (this.bearing === 3) { // west
                this.x -= amount;
            }
        }
    }

    run(): number {
        this.instructions.forEach((instruction) => this.runInstruction(instruction));

        return distManhattan([0, 0], [this.y, this.x]);
    }
}

function part1(data: string[]): number {
    return new Ship(data).run();
}

function part2(data: string[]): number {
    return new Ship(data, true).run();
}

try {
    readFileToArray('./12/input.txt').then((data) => {
        const testData = [
            'F10',
            'N3',
            'F7',
            'R90',
            'F11',
        ];

        strictEqual(new Ship(testData).run(), 25);

        console.log('Part 1', part1(data));

        strictEqual(new Ship(testData, true).run(), 286);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
