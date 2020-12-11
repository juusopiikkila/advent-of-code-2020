import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

interface Coord {
    y: number
    x: number
}

class Simulation {
    height: number

    width: number

    state: string[][]

    previousState?: string

    constructor(
        data: string[],
        // eslint-disable-next-line no-unused-vars
        private readonly useCarelessRules = false,
    ) {
        this.state = this.parseMap(data);
        this.height = this.state.length;
        this.width = this.state[0].length;
    }

    private parseMap(data: string[]): string[][] {
        return data.map((line) => line.split(''));
    }

    private getOccupiedSeatCount(state: string[][]): number {
        return state.reduce((acc, line) => acc + line.filter((char) => char === '#').length, 0);
    }

    private getAdjacentCoords(y: number, x: number): Coord[] {
        let coords: Coord[] = [];

        if (this.useCarelessRules) {
            const directions: Coord[] = [
                { y: -1, x: 0 }, // up
                { y: -1, x: 1 }, // top right
                { y: 0, x: 1 }, // right
                { y: 1, x: 1 }, // bottom right
                { y: 1, x: 0 }, // bottom
                { y: 1, x: -1 }, // bottom left
                { y: 0, x: -1 }, // left
                { y: -1, x: -1 }, // top left
            ].filter((dir) => (
                y + dir.y >= 0 && y + dir.y < this.height
                && x + dir.x >= 0 && x + dir.x < this.width
            ));

            directions.forEach((dir) => {
                let curY = y + dir.y;
                let curX = x + dir.x;

                while (
                    curY >= 0 && curY < this.height
                    && curX >= 0 && curX < this.width
                ) {
                    if (this.state[curY][curX] !== '.') {
                        coords.push({
                            y: curY,
                            x: curX,
                        });
                        break;
                    }

                    curY += dir.y;
                    curX += dir.x;
                }
            });
        } else {
            coords = [
                { y: y - 1, x }, // up
                { y: y - 1, x: x + 1 }, // top right
                { y, x: x + 1 }, // right
                { y: y + 1, x: x + 1 }, // bottom right
                { y: y + 1, x }, // bottom
                { y: y + 1, x: x - 1 }, // bottom left
                { y, x: x - 1 }, // left
                { y: y - 1, x: x - 1 }, // top left
            ].filter((coord) => (
                coord.y >= 0 && coord.y < this.height
                && coord.x >= 0 && coord.x < this.width
            ));
        }

        return coords;
    }

    private getSeatsFromCoords(coords: Coord[]): string[] {
        return coords.reduce((acc, coord) => {
            acc.push(this.state[coord.y][coord.x]);

            return acc;
        }, [] as string[]);
    }

    private getAdjacentSeats(y: number, x: number) {
        return this.getSeatsFromCoords(this.getAdjacentCoords(y, x));
    }

    private canOccupySeat(y: number, x: number): boolean {
        const seats = this.getAdjacentSeats(y, x);

        return !seats.includes('#');
    }

    private canFreeUpSeat(y: number, x: number): boolean {
        return this.getAdjacentSeats(y, x).filter((char) => char === '#').length >= (this.useCarelessRules ? 5 : 4);
    }

    private getStateString(state: string[][]): string {
        return state.map((line) => line.join('')).join('');
    }

    run(): number {
        const newState: string[][] = JSON.parse(JSON.stringify(this.state));

        for (let y = 0; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                const char = this.state[y][x];

                if (char === 'L' && this.canOccupySeat(y, x)) {
                    newState[y][x] = '#';
                } else if (char === '#' && this.canFreeUpSeat(y, x)) {
                    newState[y][x] = 'L';
                }
            }
        }

        const newStateString = this.getStateString(newState);

        if (!this.previousState || newStateString !== this.previousState) {
            this.previousState = newStateString;
            this.state = newState;

            return this.run();
        }

        return this.getOccupiedSeatCount(newState);
    }
}

function part1(data: string[]): number {
    return new Simulation(data).run();
}

function part2(data: string[]): number {
    return new Simulation(data, true).run();
}

try {
    readFileToArray('./11/input.txt').then((data) => {
        const testData = [
            'L.LL.LL.LL',
            'LLLLLLL.LL',
            'L.L.L..L..',
            'LLLL.LL.LL',
            'L.LL.LL.LL',
            'L.LLLLL.LL',
            '..L.L.....',
            'LLLLLLLLLL',
            'L.LLLLLL.L',
            'L.LLLLL.LL',
        ];

        strictEqual(new Simulation(testData).run(), 37);

        console.log('Part 1', part1(data));

        strictEqual(new Simulation(testData, true).run(), 26);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
