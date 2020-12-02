import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

interface Args {
    min: number
    max: number
    char: string
    password: string
}

function getArgs(input: string): Args {
    const regex = /^([0-9]+)-([0-9]+) ([a-z]): ([a-z]+)$/g;
    const matches = regex.exec(input);

    if (!matches) {
        throw new Error(`Unable to parse input: ${input}`);
    }

    return {
        min: parseInt(matches[1], 10),
        max: parseInt(matches[2], 10),
        char: matches[3],
        password: matches[4],
    };
}

function passwordHasOccurrences(min: number, max: number, char: string, password: string): boolean {
    const matches = password.match(new RegExp(char, 'g'))?.length || 0;

    return matches >= min && matches <= max;
}

function passwordHasChars(index1: number, index2: number, char: string, password: string): boolean {
    return (password[index1 - 1] === char && password[index2 - 1] !== char)
        || (password[index1 - 1] !== char && password[index2 - 1] === char);
}

function getValidPasswordCount(arr: string[], strict = false): number {
    return arr.reduce((acc, string) => {
        const args = getArgs(string);

        return (
            (!strict && passwordHasOccurrences(args.min, args.max, args.char, args.password))
            || (strict && passwordHasChars(args.min, args.max, args.char, args.password))
        ) ? acc + 1 : acc;
    }, 0);
}

function part1(data: string[]): number {
    return getValidPasswordCount(data);
}

function part2(data: string[]): number {
    return getValidPasswordCount(data, true);
}

try {
    readFileToArray('./2/input.txt').then((data) => {
        const testData = [
            '1-3 a: abcde',
            '1-3 b: cdefg',
            '2-9 c: ccccccccc',
        ];

        strictEqual(getValidPasswordCount(testData), 2);

        console.log('Part 1', part1(data));

        strictEqual(getValidPasswordCount(testData, true), 1);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
