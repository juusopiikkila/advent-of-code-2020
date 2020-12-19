import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

type Rule = string | Rule[]

class Validator {
    rules: Rule[] = []

    ruleLines: Map<number, string> = new Map()

    messages: string[] = []

    constructor(data: string[]) {
        this.parseData(data);
    }

    private parseData(data: string[]): void {
        const ruleLines: string[] = [];
        let type = 'rule';

        data.forEach((line) => {
            if (!line.length) {
                type = 'message';
            } else if (type === 'rule') {
                ruleLines.push(line);
            } else {
                this.messages.push(line);
            }
        });

        this.parseRuleLines(ruleLines);
    }

    private parseRuleLines(lines: string[]): void {
        lines.map((line) => line.split(': ')).forEach((rule) => {
            this.ruleLines.set(parseInt(rule[0], 10), rule[1]);
        });

        const baseRule = this.ruleLines.get(0);

        if (!baseRule) {
            throw new Error('Rule not found');
        }

        const rule = this.generateRules(baseRule);

        console.log(rule);

        console.log(this.getCombinations(rule));
    }

    private generateRules(rule: string): Rule[] {
        const arr: Rule[][] = [];

        rule.split('|').map((str) => str.trim()).forEach((rulePart) => {
            arr.push([]);

            rulePart.split(' ').map(Number).forEach((ruleNum) => {
                const child = this.ruleLines.get(ruleNum);

                if (!child) {
                    throw new Error(`Rule "${ruleNum}" not found`);
                }

                if (child === '"a"' || child === '"b"') {
                    arr[arr.length - 1].push(child.slice(1, -1));
                } else {
                    arr[arr.length - 1].push(this.generateRules(child));
                }
            });
        });

        return arr;
    }

    private getCombinations(rule: Rule[], base = ''): string[][] {
        let arr: string[][] = [];

        console.log('rule', rule, 'base', base);

        rule.forEach((r) => {
            if (Array.isArray(r)) {
                console.log('deeper', r);
                arr = [
                    ...arr,
                    ...this.getCombinations(r, base),
                ];
            } else {
                arr[0].push(`${base}${r}`);
            }
        });

        console.log('return', arr);

        return arr;
    }

    validate(): number {
        return 0;
    }
}

function part1(data: string[]): number {
    return 0;
}

function part2(data: string[]): number {
    return 0;
}

try {
    readFileToArray('./1/input.txt').then((data) => {
        // const testData = [
        //     '0: 4 1 5',
        //     '1: 2 3 | 3 2',
        //     '2: 4 4 | 5 5',
        //     '3: 4 5 | 5 4',
        //     '4: "a"',
        //     '5: "b"',
        //     '',
        //     'ababbb',
        //     'bababa',
        //     'abbbab',
        //     'aaabbb',
        //     'aaaabbb',
        // ];

        const testData = [
            '0: 4 5',
            '1: 4 | 5',
            '4: "a"',
            '5: "b"',
            '',
            'ababbb',
            'bababa',
            'abbbab',
            'aaabbb',
            'aaaabbb',
        ];

        strictEqual(new Validator(testData).validate(), 2);

        console.log('Part 1', part1(data));

        // strictEqual(test(14), 2);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
