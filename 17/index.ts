import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

interface Coord4D {
    y: number
    x: number
    z: number
    w: number
}

class Dimension {
    state = new Map()

    cycle = 0

    minCoord: Coord4D

    maxCoord: Coord4D

    constructor(
        data: string[],
        // eslint-disable-next-line no-unused-vars
        private readonly is4D = false,
    ) {
        const initialState = this.parseState(data);
        const size = Math.floor(initialState[0].length / 2);

        initialState.forEach((row, y) => {
            row.forEach((cube, x) => {
                if (cube === '#') {
                    const coordStr = this.getCoordString(y - size, x - size, 0, 0);
                    this.state.set(coordStr, cube);
                }
            });
        });

        this.minCoord = {
            y: -size,
            x: -size,
            z: 0,
            w: 0,
        };

        this.maxCoord = {
            y: size,
            x: size,
            z: 0,
            w: 0,
        };
    }

    private parseState(data: string[]): string[][] {
        return data.map((line) => line.split(''));
    }

    private getAdjacentCoords(y: number, x: number, z: number, w = 0): Coord4D[] {
        const coords: Coord4D[] = [];

        for (let i = z - 1; i <= z + 1; i += 1) {
            for (let j = y - 1; j <= y + 1; j += 1) {
                for (let n = x - 1; n <= x + 1; n += 1) {
                    if (this.is4D) {
                        for (let m = w - 1; m <= w + 1; m += 1) {
                            coords.push({
                                y: j,
                                x: n,
                                z: i,
                                w: m,
                            });
                        }
                    } else {
                        coords.push({
                            y: j,
                            x: n,
                            z: i,
                            w: 0,
                        });
                    }
                }
            }
        }

        return coords.filter((coord) => !(coord.x === x && coord.y === y && coord.z === z && coord.w === w));
    }

    private getActiveNeighbourCount(y: number, x: number, z: number, w = 0): number {
        return this.getAdjacentCoords(y, x, z, w).reduce((acc, coord) => {
            const coordStr = this.getCoordString(coord.y, coord.x, coord.z, coord.w);

            return acc + (this.state.has(coordStr) ? 1 : 0);
        }, 0);
    }

    private getCoordString(y: number, x: number, z: number, w = 0) {
        return `${y}/${x}/${z}/${w}`;
    }

    private getCubeState(y: number, x: number, z: number, w = 0) {
        const coordStr = this.getCoordString(y, x, z, w);
        const activeNeigbours = this.getActiveNeighbourCount(y, x, z, w);

        let cube = this.state.get(coordStr) || '.';

        if (cube === '#' && !(activeNeigbours === 2 || activeNeigbours === 3)) {
            cube = '.';
        } else if (cube === '.' && activeNeigbours === 3) {
            cube = '#';
        }

        return cube;
    }

    run(): number {
        for (let cycle = 0; cycle < 6; cycle += 1) {
            const min: Coord4D = {
                y: 0,
                x: 0,
                z: 0,
                w: 0,
            };
            const max: Coord4D = {
                y: 0,
                x: 0,
                z: 0,
                w: 0,
            };

            const curMin = this.minCoord;
            const curMax = this.maxCoord;
            const newState = new Map();

            for (let z = curMin.z - 1; z <= curMax.z + 1; z += 1) {
                for (let y = curMin.y - 1; y <= curMax.y + 1; y += 1) {
                    for (let x = curMin.x - 1; x <= curMax.x + 1; x += 1) {
                        if (this.is4D) {
                            for (let w = curMin.w - 1; w <= curMax.w + 1; w += 1) {
                                const coordStr = this.getCoordString(y, x, z, w);
                                const cubeState = this.getCubeState(y, x, z, w);

                                if (cubeState === '#') {
                                    newState.set(coordStr, '#');

                                    if (y < min.y) { min.y = y; }
                                    if (x < min.x) { min.x = x; }
                                    if (z < min.z) { min.z = z; }
                                    if (w < min.w) { min.w = w; }

                                    if (y > max.y) { max.y = y; }
                                    if (x > max.x) { max.x = x; }
                                    if (z > max.z) { max.z = z; }
                                    if (w > max.w) { max.w = w; }
                                }
                            }
                        } else {
                            const coordStr = this.getCoordString(y, x, z);
                            const cubeState = this.getCubeState(y, x, z);

                            if (cubeState === '#') {
                                newState.set(coordStr, '#');

                                if (y < min.y) { min.y = y; }
                                if (x < min.x) { min.x = x; }
                                if (z < min.z) { min.z = z; }

                                if (y > max.y) { max.y = y; }
                                if (x > max.x) { max.x = x; }
                                if (z > max.z) { max.z = z; }
                            }
                        }
                    }
                }
            }

            this.state = newState;
            this.minCoord = min;
            this.maxCoord = max;
        }

        let count = 0;
        this.state.forEach((cube) => {
            if (cube === '#') {
                count += 1;
            }
        });
        return count;
    }
}

function part1(data: string[]): number {
    return new Dimension(data).run();
}

function part2(data: string[]): number {
    return new Dimension(data, true).run();
}

try {
    readFileToArray('./17/input.txt').then((data) => {
        const testData = [
            '.#.',
            '..#',
            '###',
        ];

        strictEqual(new Dimension(testData).run(), 112);

        console.log('Part 1', part1(data));

        strictEqual(new Dimension(testData, true).run(), 848);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
