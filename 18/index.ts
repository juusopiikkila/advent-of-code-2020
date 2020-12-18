import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

class Calculator {
    constructor(
        // eslint-disable-next-line no-unused-vars
        private readonly expression: string,
        // eslint-disable-next-line no-unused-vars
        private readonly isAdvanced = false,
    ) {
        //
    }

    private calculateGroup(
        expr: string,
    ): number {
        const operators = ['+', '*'];
        let result = -1;
        let operator = '';
        let str = expr.trim();

        const regex = /\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g;
        const matches = str.match(regex);

        if (matches) {
            matches.forEach((match) => {
                str = str.replace(match, this.calculateGroup(match.slice(1, -1)).toString());
            });
        }

        if (this.isAdvanced && str.includes('*')) {
            return str.split('*').reduce((acc, part) => acc * this.calculateGroup(part), 1);
        }

        const expression = str.split(' ');

        for (let i = 0; i < expression.length; i += 1) {
            const char = expression[i];

            if (operators.includes(char)) {
                operator = char;
                // eslint-disable-next-line no-continue
                continue;
            }

            const value = parseInt(char, 10);

            if (result === -1) {
                result = value;
            } else if (operator === '+') {
                result += value;
            } else if (operator === '*') {
                result *= value;
            }
        }

        return result;
    }

    getResult(): number {
        return this.calculateGroup(this.expression);
    }
}

function part1(data: string[]): number {
    return data.reduce((acc, maths) => acc + new Calculator(maths).getResult(), 0);
}

function part2(data: string[]): number {
    return data.reduce((acc, maths) => acc + new Calculator(maths, true).getResult(), 0);
}

try {
    readFileToArray('./18/input.txt').then((data) => {
        strictEqual(new Calculator('1 + 2 * 3 + 4 * 5 + 6').getResult(), 71);

        strictEqual(new Calculator('2 * 3 + (4 * 5)').getResult(), 26);

        strictEqual(new Calculator('5 + (8 * 3 + 9 + 3 * 4 * 3)').getResult(), 437);

        strictEqual(new Calculator('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))').getResult(), 12240);

        strictEqual(new Calculator('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2').getResult(), 13632);

        strictEqual(new Calculator('1 + (2 * 3) + (4 * (5 + 6))').getResult(), 51);

        console.log('Part 1', part1(data));

        strictEqual(new Calculator('1 + 2 * 3 + 4 * 5 + 6', true).getResult(), 231);

        strictEqual(new Calculator('1 + (2 * 3) + (4 * (5 + 6))', true).getResult(), 51);

        strictEqual(new Calculator('2 * 3 + (4 * 5)', true).getResult(), 46);

        strictEqual(new Calculator('5 + (8 * 3 + 9 + 3 * 4 * 3)', true).getResult(), 1445);

        strictEqual(new Calculator('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', true).getResult(), 669060);

        strictEqual(new Calculator('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', true).getResult(), 23340);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
