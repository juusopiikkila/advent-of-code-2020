import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

interface Instruction {
    operation: string
    argument: number
}

class Processor {
    originalProgram: Instruction[]

    program: Instruction[]

    acc = 0

    pointer = 0

    pointerHistory: number[] = []

    changePointer = 0

    constructor(data: string[]) {
        this.program = this.parseProgram(data);
        this.originalProgram = [...this.program];
    }

    private parseProgram(data: string[]): Instruction[] {
        return data.map((line) => {
            const matches = line.match(/([a-z]+) ([0-9+-]+)/);

            if (!matches) {
                throw new Error('Error in code');
            }

            return {
                operation: matches[1],
                argument: parseInt(matches[2], 10),
            };
        });
    }

    reset() {
        this.acc = 0;
        this.pointer = 0;
        this.pointerHistory = [];
    }

    run() {
        this.reset();

        while (this.program[this.pointer]) {
            if (this.pointerHistory.includes(this.pointer)) {
                throw new Error('Infinite loop');
            }

            this.pointerHistory.push(this.pointer);

            const instruction = this.program[this.pointer];

            if (instruction.operation === 'acc') {
                this.acc += instruction.argument;
                this.pointer += 1;
            } else if (instruction.operation === 'jmp') {
                this.pointer += instruction.argument;
            } else if (instruction.operation === 'nop') {
                this.pointer += 1;
            }
        }
    }

    runUntilLoop() {
        try {
            this.run();
        } catch (err) {
            return this.acc;
        }

        return -1;
    }

    runUntilTermination(): number {
        try {
            this.run();
        } catch (err) {
            if (this.program[this.pointer] && this.program[this.changePointer]) {
                this.program = JSON.parse(JSON.stringify(this.originalProgram));

                if (this.program[this.changePointer].operation === 'nop') {
                    this.program[this.changePointer].operation = 'jmp';
                } else if (this.program[this.changePointer].operation === 'jmp') {
                    this.program[this.changePointer].operation = 'nop';
                }

                this.changePointer += 1;

                return this.runUntilTermination();
            }
        }

        return this.acc;
    }
}

function part1(data: string[]): number {
    return new Processor(data).runUntilLoop();
}

function part2(data: string[]): number {
    return new Processor(data).runUntilTermination();
}

try {
    readFileToArray('./8/input.txt').then((data) => {
        const testData = [
            'nop +0',
            'acc +1',
            'jmp +4',
            'acc +3',
            'jmp -3',
            'acc -99',
            'acc +1',
            'jmp -4',
            'acc +6',
        ];

        strictEqual(new Processor(testData).runUntilLoop(), 5);

        console.log('Part 1', part1(data));

        strictEqual(new Processor(testData).runUntilTermination(), 8);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
