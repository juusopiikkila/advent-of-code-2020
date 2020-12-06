import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function getGroups(data: string[]): string[][] {
    const arr: string[][] = [];
    let buffer: string[] = [];

    data.forEach((line) => {
        if (!line.length) {
            arr.push(buffer);
            buffer = [];
        } else {
            buffer.push(line);
        }
    });

    if (buffer.length) {
        arr.push(buffer);
    }

    return arr;
}

function getUnique(data: string): string {
    return data.split('')
        .filter((val, index, arr) => arr.indexOf(val) === index)
        .join('');
}

function getAllAnswersSum(data: string[]): number {
    return getGroups(data)
        .map((line) => line.join(''))
        .reduce((acc, group) => acc + getUnique(group).length, 0);
}

function getCollectiveAnswersSum(data: string[]): number {
    return getGroups(data).reduce((acc, group) => {
        let total = 0;

        getUnique(group.join(''))
            .split('')
            .forEach((answer) => {
                total += group.join('')
                    .match(new RegExp(`${answer}`, 'g'))?.length === group.length ? 1 : 0;
            });

        return acc + total;
    }, 0);
}

function part1(data: string[]): number {
    return getAllAnswersSum(data);
}

function part2(data: string[]): number {
    return getCollectiveAnswersSum(data);
}

try {
    readFileToArray('./6/input.txt').then((data) => {
        const testData = [
            'abc',
            '',
            'a',
            'b',
            'c',
            '',
            'ab',
            'ac',
            '',
            'a',
            'a',
            'a',
            'a',
            '',
            'b',
            '',
        ];

        strictEqual(getAllAnswersSum(testData), 11);

        console.log('Part 1', part1(data));

        strictEqual(getCollectiveAnswersSum(testData), 6);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
