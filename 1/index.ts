import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function getCombinations(...args: number[][]): number[][] {
    return args.reduce((val, b) => (
        val.flatMap((d) => b.map((e) => [d, e].flat()))
    ), [[]] as number[][]);
}

function get2020Sums(...args: number[][]): number {
    const combinations = getCombinations(...args);

    for (let i = 0; i < combinations.length; i += 1) {
        const arrSum = combinations[i].reduce((acc, a) => acc + a, 0);

        if (arrSum === 2020) {
            return combinations[i].reduce((acc, a) => acc * a);
        }
    }

    return 0;
}

function part1(data: number[]): number {
    return get2020Sums(data, data);
}

function part2(data: number[]): number {
    return get2020Sums(data, data, data);
}

try {
    readFileToArray('./1/input.txt').then((data) => {
        const numberData = data.map((line) => parseInt(line, 10));
        const testData = [
            1721,
            979,
            366,
            299,
            675,
            1456,
        ];

        strictEqual(get2020Sums(testData, testData), 514579);

        console.log('Part 1', part1(numberData));

        strictEqual(get2020Sums(testData, testData, testData), 241861950);

        console.log('Part 2', part2(numberData));
    });
} catch (err) {
    console.log(err);
}
