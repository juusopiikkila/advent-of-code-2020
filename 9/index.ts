import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

class Processor {
    private pointer: number

    private weaknessPointer = 1

    constructor(
        // eslint-disable-next-line no-unused-vars
        private readonly data: number[],
        private readonly preambleLength: number,
        // eslint-disable-next-line no-unused-vars
        private readonly lookbackLength: number,
    ) {
        this.pointer = preambleLength;
    }

    getCombinations(numbers: number[]): number[] {
        const arr: number[] = [];

        numbers.forEach((num1, index1) => {
            numbers.forEach((num2, index2) => {
                if (index1 !== index2 && !arr.includes(num1 + num2)) {
                    arr.push(num1 + num2);
                }
            });
        });

        return arr.sort();
    }

    run(): number {
        const numbers = this.data.slice(this.pointer - this.lookbackLength, this.pointer);
        const result = this.data[this.pointer];
        const combinations = this.getCombinations(numbers);

        if (combinations.includes(result)) {
            this.pointer += 1;
            return this.run();
        }

        return result;
    }

    findWeakness(result: number): number {
        let startPointer = this.weaknessPointer - 1;

        while (startPointer >= 0) {
            const slice = this.data.slice(startPointer, this.weaknessPointer);
            const sum = slice.reduce((acc, num) => acc + num, 0);

            if (sum > result) {
                break;
            }

            if (sum === result) {
                const sortedSlice = slice.sort((a, b) => a - b);
                return sortedSlice[0] + sortedSlice[slice.length - 1];
            }

            startPointer -= 1;
        }

        this.weaknessPointer += 1;

        return this.findWeakness(result);
    }
}

function part1(data: string[]): number {
    return new Processor(data.map(Number), 25, 25).run();
}

function part2(data: string[]): number {
    const proc = new Processor(data.map(Number), 25, 25);
    return proc.findWeakness(proc.run());
}

try {
    readFileToArray('./9/input.txt').then((data) => {
        const testData = [
            35,
            20,
            15,
            25,
            47,
            40,
            62,
            55,
            65,
            95,
            102,
            117,
            150,
            182,
            127,
            219,
            299,
            277,
            309,
            576,
        ];

        strictEqual(new Processor(testData, 5, 5).run(), 127);

        console.log('Part 1', part1(data));

        const proc = new Processor(testData, 5, 5);
        strictEqual(proc.findWeakness(proc.run()), 62);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
