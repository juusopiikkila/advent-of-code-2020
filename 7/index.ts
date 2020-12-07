import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

class Rule {
    private children: Record<string, {
        rule: Rule
        amount: number
    }> = {}

    private parents: Rule[] = []

    constructor(
        // eslint-disable-next-line no-unused-vars
        readonly color: string,
    ) {
        //
    }

    addContains(rule: Rule, amount: number): void {
        this.children[rule.color] = {
            rule,
            amount,
        };
    }

    getParents() {
        return this.parents;
    }

    getChildren() {
        return Object.values(this.children);
    }

    addParent(rule: Rule): void {
        this.parents.push(rule);
    }

    canContain(color: string): boolean {
        return this.children[color] !== undefined;
    }
}

class RuleBag {
    private rules: Record<string, Rule> = {};

    constructor(data: string[]) {
        this.readRules(data);
    }

    private readRules(data: string[]): void {
        const mainRegex = /^(.*?) bags contain (.*?)\.$/;
        const subRegex = /^([0-9]+) (.*?) bags?$/;

        data.forEach((line) => {
            const matches = line.match(mainRegex);

            if (!matches) {
                return;
            }

            const mainColor = matches[1];

            if (this.rules[mainColor] === undefined) {
                this.rules[mainColor] = new Rule(mainColor);
            }

            if (matches[2] === 'no other bags') {
                return;
            }

            matches[2].split(', ').forEach((bag) => {
                const bagMatches = bag.match(subRegex);

                if (!bagMatches) {
                    return;
                }

                this.addContainsRule(mainColor, bagMatches[2], parseInt(bagMatches[1], 10));
            });
        });
    }

    private getParentRules(rules: Rule[]): Record<string, Rule> {
        return rules.reduce((acc, rule) => ({
            ...acc,
            [rule.color]: rule,
            ...this.getParentRules(rule.getParents()),
        }), {});
    }

    private getChildrenCount(rule: Rule): number {
        return rule.getChildren()
            .reduce((acc, child) => acc + this.getChildrenCount(child.rule) * child.amount, 1);
    }

    addContainsRule(color: string, containsColor: string, amount: number) {
        if (this.rules[containsColor] === undefined) {
            this.rules[containsColor] = new Rule(containsColor);
        }

        this.rules[color].addContains(this.rules[containsColor], amount);
        this.rules[containsColor].addParent(this.rules[color]);
    }

    getContainableBagCountForColor(color: string): number {
        const bags = Object.values(this.rules).filter((rule) => rule.canContain(color));

        return Object.keys(this.getParentRules(bags)).length;
    }

    getBagCountForColor(color: string): number {
        return this.getChildrenCount(this.rules[color]) - 1;
    }
}

function part1(data: string[]): number {
    return new RuleBag(data).getContainableBagCountForColor('shiny gold');
}

function part2(data: string[]): number {
    return new RuleBag(data).getBagCountForColor('shiny gold');
}

try {
    readFileToArray('./7/input.txt').then((data) => {
        const testData = [
            'light red bags contain 1 bright white bag, 2 muted yellow bags.',
            'dark orange bags contain 3 bright white bags, 4 muted yellow bags.',
            'bright white bags contain 1 shiny gold bag.',
            'muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.',
            'shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.',
            'dark olive bags contain 3 faded blue bags, 4 dotted black bags.',
            'vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.',
            'faded blue bags contain no other bags.',
            'dotted black bags contain no other bags.',
        ];

        strictEqual(new RuleBag(testData).getContainableBagCountForColor('shiny gold'), 4);

        console.log('Part 1', part1(data));

        strictEqual(new RuleBag(testData).getBagCountForColor('shiny gold'), 32);

        const testData2 = [
            'shiny gold bags contain 2 dark red bags.',
            'dark red bags contain 2 dark orange bags.',
            'dark orange bags contain 2 dark yellow bags.',
            'dark yellow bags contain 2 dark green bags.',
            'dark green bags contain 2 dark blue bags.',
            'dark blue bags contain 2 dark violet bags.',
            'dark violet bags contain no other bags.',
        ];

        strictEqual(new RuleBag(testData2).getBagCountForColor('shiny gold'), 126);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
