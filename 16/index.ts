import { strictEqual, deepStrictEqual } from 'assert';
import { readFileToArray } from '../utils';

interface Rule {
    from: number
    to: number
}

class TicketValidator {
    rules: Record<string, Rule[]> = {}

    myTicket: number[] = []

    tickets: number[][] = []

    constructor(data: string[]) {
        this.parseData(data);
    }

    private parseData(data: string[]): void {
        const groups: string[][] = [];
        let group: string[] = [];

        data.forEach((line) => {
            if (!line.length) {
                groups.push(group);
                group = [];
            } else {
                group.push(line);
            }
        });

        if (group.length) {
            groups.push(group);
        }

        groups[0].forEach((line) => {
            const matches = line.match(/([a-z ]+): ([0-9]+)-([0-9]+) or ([0-9]+)-([0-9]+)/);
            if (matches) {
                const [, name] = matches;

                this.rules[name] = [
                    { from: parseInt(matches[2], 10), to: parseInt(matches[3], 10) },
                    { from: parseInt(matches[4], 10), to: parseInt(matches[5], 10) },
                ];
            }
        });

        this.myTicket = groups[1][1].split(',').map(Number);
        this.tickets = groups[2].slice(1).map((ticket) => ticket.split(',').map(Number));
    }

    private isValueValid(value: number, rules: Rule[]): boolean {
        for (let i = 0; i < rules.length; i += 1) {
            if (value >= rules[i].from && value <= rules[i].to) {
                return true;
            }
        }

        return false;
    }

    isTicketValid(ticket: number[]): boolean {
        for (let i = 0; i < ticket.length; i += 1) {
            const value = ticket[i];
            let validForAny = false;

            Object.values(this.rules).forEach((rules) => {
                if (this.isValueValid(value, rules)) {
                    validForAny = true;
                }
            });

            if (!validForAny) {
                return false;
            }
        }

        return true;
    }

    getTicketScanningErrorRate(): number {
        let invalidTotal = 0;

        this.tickets.forEach((ticket) => {
            ticket.forEach((value) => {
                let validForAny = false;

                Object.values(this.rules).forEach((rules) => {
                    if (this.isValueValid(value, rules)) {
                        validForAny = true;
                    }
                });

                if (!validForAny) {
                    invalidTotal += value;
                }
            });
        });

        return invalidTotal;
    }

    getTicketFieldNames(): string[] {
        const tickets = this.tickets.filter((ticket) => this.isTicketValid(ticket));
        let possibleFields = tickets[0]
            .map(() => Object.keys(this.rules))
            .map((ruleNames, index) => ruleNames.filter((ruleName) => {
                const rules = this.rules[ruleName];

                for (let i = 0; i < tickets.length; i += 1) {
                    const value = tickets[i][index];

                    if (!this.isValueValid(value, rules)) {
                        return false;
                    }
                }

                return true;
            }));

        while (possibleFields.reduce((acc, fields) => acc + fields.length, 0) !== possibleFields.length) {
            const blacklistedFields = possibleFields.reduce((acc, fields) => [
                ...acc,
                ...fields.length > 1 ? [] : [fields[0]],
            ], []);

            possibleFields = possibleFields.map((fields) => {
                if (fields.length > 1) {
                    return fields.filter((field) => !blacklistedFields.includes(field));
                }

                return fields;
            });
        }

        return possibleFields.map((fields) => fields[0]);
    }

    getDurationFieldsSum(): number {
        const names = this.getTicketFieldNames();
        const numbers: number[] = [];

        names.forEach((name, index) => {
            if (name.indexOf('departure') === 0) {
                numbers.push(this.myTicket[index]);
            }
        });

        return numbers.reduce((acc, number) => acc * number);
    }
}

function part1(data: string[]): number {
    return new TicketValidator(data).getTicketScanningErrorRate();
}

function part2(data: string[]): number {
    return new TicketValidator(data).getDurationFieldsSum();
}

try {
    readFileToArray('./16/input.txt').then((data) => {
        const testData = [
            'class: 1-3 or 5-7',
            'row: 6-11 or 33-44',
            'seat: 13-40 or 45-50',
            '',
            'your ticket:',
            '7,1,14',
            '',
            'nearby tickets:',
            '7,3,47',
            '40,4,50',
            '55,2,20',
            '38,6,12',
        ];

        strictEqual(new TicketValidator(testData).getTicketScanningErrorRate(), 71);

        console.log('Part 1', part1(data));

        deepStrictEqual(new TicketValidator(testData).getTicketFieldNames(), ['row', 'class', 'seat']);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
