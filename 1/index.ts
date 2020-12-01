import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function get2020SumsforTwo(arr: number[]): number {
    let sum = 0;
    const usedIndexes: number[] = [];

    arr.forEach((num1, index1) => {
        arr.forEach((num2, index2) => {
            if (
                index1 !== index2
                && num1 + num2 === 2020
                && usedIndexes.indexOf(index1) === -1
                && usedIndexes.indexOf(index2) === -1
            ) {
                sum += num1 * num2;

                usedIndexes.push(index1);
                usedIndexes.push(index2);
            }
        });
    });

    return sum;
}

function get2020SumsforThree(arr: number[]): number {
    let sum = 0;
    const usedIndexes: number[] = [];

    arr.forEach((num1, index1) => {
        arr.forEach((num2, index2) => {
            arr.forEach((num3, index3) => {
                if (
                    index1 !== index2
                    && index1 !== index3
                    && index2 !== index3
                    && num1 + num2 + num3 === 2020
                    && usedIndexes.indexOf(index1) === -1
                    && usedIndexes.indexOf(index2) === -1
                    && usedIndexes.indexOf(index3) === -1
                ) {
                    sum += num1 * num2 * num3;

                    usedIndexes.push(index1);
                    usedIndexes.push(index2);
                    usedIndexes.push(index3);
                }
            });
        });
    });

    return sum;
}

function part1(data: string[]): number {
    return get2020SumsforTwo(data.map((line) => parseInt(line, 10)));
}

function part2(data: string[]): number {
    return get2020SumsforThree(data.map((line) => parseInt(line, 10)));
}

try {
    readFileToArray('./1/input.txt').then((data) => {
        strictEqual(get2020SumsforTwo([
            1721,
            979,
            366,
            299,
            675,
            1456,
        ]), 514579);

        console.log('Part 1', part1(data));

        strictEqual(get2020SumsforThree([
            1721,
            979,
            366,
            299,
            675,
            1456,
        ]), 241861950);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
