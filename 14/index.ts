import { strictEqual } from 'assert';
import { padStart } from 'lodash';
import { readFileToArray } from '../utils';

class Memory {
    state: Record<number, number> = {}

    constructor(
        // eslint-disable-next-line no-unused-vars
        private readonly program: string[],
        // eslint-disable-next-line no-unused-vars
        private readonly version = 1,
    ) {
        //
    }

    private applyMask(mask: string, value: number): string {
        const bitValue = padStart(value.toString(2), 36, '0');

        return bitValue.split('').map((char, index) => {
            if (this.version === 1) {
                return mask[index] !== 'X' ? mask[index] : char;
            }

            return mask[index] !== '0' ? mask[index] : char;
        }).join('');
    }

    getCombinations(...args: number[][]): number[][] {
        return args.reduce((val, b) => (
            val.flatMap((d) => b.map((e) => [d, e].flat()))
        ), [[]] as number[][]);
    }

    private getAddresses(address: number, mask: string): number[] {
        if (this.version === 1) {
            return [address];
        }

        const bitAddress = this.applyMask(mask, address);
        const floatingCount = bitAddress.split('X').length - 1;
        const combinations: number[][] = [];
        const indexes: number[] = [];

        for (let i = 0; i < floatingCount; i += 1) {
            combinations.push([0, 1]);
            indexes.push(bitAddress.indexOf('X', indexes.length ? indexes[indexes.length - 1] + 1 : 0));
        }

        return this.getCombinations(...combinations).map((nums) => {
            const val = bitAddress.toString().split('');
            nums.forEach((num, idx) => {
                val[indexes[idx]] = num.toString();
            });

            return parseInt(val.join(''), 2);
        });
    }

    private writeMemory(address: number, value: number, mask: string) {
        this.getAddresses(address, mask).forEach((addr) => {
            const result = this.version === 1 ? parseInt(this.applyMask(mask, value), 2) : value;

            this.state[addr] = result;
        });
    }

    private getMemorySum() {
        return Object.values(this.state).reduce((acc, value) => acc + value, 0);
    }

    run(): number {
        const maskRegex = /mask = (.*)/;
        const lineRegex = /mem\[([0-9]+)\] = ([0-9]+)/;
        let mask = '';

        this.program.forEach((line) => {
            if (line.indexOf('mask') !== -1) {
                const matches = line.match(maskRegex);
                if (!matches) {
                    throw new Error('Mask regex error');
                }

                [, mask] = matches;
            } else {
                const matches = line.match(lineRegex);
                if (!matches) {
                    throw new Error('Line regex error');
                }

                const address = parseInt(matches[1], 10);
                const value = parseInt(matches[2], 10);

                this.writeMemory(address, value, mask);
            }
        });

        return this.getMemorySum();
    }
}

function part1(data: string[]): number {
    return new Memory(data).run();
}

function part2(data: string[]): number {
    return new Memory(data, 2).run();
}

try {
    readFileToArray('./14/input.txt').then((data) => {
        const testData = [
            'mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X',
            'mem[8] = 11',
            'mem[7] = 101',
            'mem[8] = 0',
        ];

        strictEqual(new Memory(testData).run(), 165);

        console.log('Part 1', part1(data));

        const testData2 = [
            'mask = 000000000000000000000000000000X1001X',
            'mem[42] = 100',
            'mask = 00000000000000000000000000000000X0XX',
            'mem[26] = 1',
        ];

        strictEqual(new Memory(testData2, 2).run(), 208);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
