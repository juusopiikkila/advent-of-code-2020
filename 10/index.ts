import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

class Solver {
    constructor(
        // eslint-disable-next-line no-unused-vars
        private readonly data: number[],
    ) {
        this.data.sort((a, b) => a - b);
    }

    getDifferences(): number {
        const skips = {
            one: 0,
            three: 0,
        };

        this.data.forEach((num, index) => {
            if (!index) {
                skips.one += 1;
                return;
            }

            const diff = num - this.data[index - 1];

            if (diff === 1) {
                skips.one += 1;
            } else if (diff === 3) {
                skips.three += 1;
            } else {
                throw new Error('Invalid skip');
            }
        });

        skips.three += 1;

        return skips.one * skips.three;
    }

    getChunks(): number[][] {
        const chunks: number[][] = [];
        const data = [0, ...this.data, this.data[this.data.length - 1] + 3];
        let chunk: number[] = [];

        data.forEach((num, index) => {
            chunk.push(num);

            if (data[index + 1] >= num + 3) {
                chunks.push(chunk);
                chunk = [];
            }
        });

        if (chunk.length) {
            chunks.push(chunk);
        }

        return chunks;
    }

    getPossibilitiesFromChunk(chunk: number[], index = 0): number {
        const from = chunk[index];
        const next = chunk.filter((num) => num > from && num <= from + 3);
        if (!next.length) {
            return 1;
        }

        return next.reduce((acc, num) => acc + this.getPossibilitiesFromChunk(chunk, chunk.indexOf(num)), 0);
    }

    getPossibilities(): number {
        return this.getChunks().reduce((acc, chunk) => acc * this.getPossibilitiesFromChunk(chunk), 1);
    }
}

function part1(data: string[]): number {
    return new Solver(data.map(Number)).getDifferences();
}

function part2(data: string[]): number {
    return new Solver(data.map(Number)).getPossibilities();
}

try {
    readFileToArray('./10/input.txt').then((data) => {
        const testData = [
            16,
            10,
            15,
            5,
            1,
            11,
            7,
            19,
            6,
            12,
            4,
        ];

        strictEqual(new Solver(testData).getDifferences(), 35);

        const testData2 = [
            28,
            33,
            18,
            42,
            31,
            14,
            46,
            20,
            48,
            47,
            24,
            23,
            49,
            45,
            19,
            38,
            39,
            11,
            1,
            32,
            25,
            35,
            8,
            17,
            7,
            9,
            4,
            2,
            34,
            10,
            3,
        ];

        strictEqual(new Solver(testData2).getDifferences(), 220);

        console.log('Part 1', part1(data));

        strictEqual(new Solver(testData).getPossibilities(), 8);

        strictEqual(new Solver(testData2).getPossibilities(), 19208);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
