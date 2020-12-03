import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function dataToMap(data: string[]): string[][] {
    return data.map((line) => line.split(''));
}

function getTile(map: string[][], x: number, y: number): string | undefined {
    if (map[y] === undefined) {
        return undefined;
    }

    return map[y][x % map[0].length] || undefined;
}

function countTrees(data: string[], xIncrement = 3, yIncrement = 1): number {
    const map = dataToMap(data);
    let trees = 0;
    let x = 0;
    let y = 0;

    while (y < map.length - 1) {
        y += yIncrement;
        x += xIncrement;

        if (getTile(map, x, y) === '#') {
            trees += 1;
        }
    }

    return trees;
}

function part1(data: string[]): number {
    return countTrees(data);
}

function part2(data: string[]): number {
    return countTrees(data, 1, 1)
        * countTrees(data, 3, 1)
        * countTrees(data, 5, 1)
        * countTrees(data, 7, 1)
        * countTrees(data, 1, 2);
}

try {
    readFileToArray('./3/input.txt').then((data) => {
        const testData = [
            '..##.......',
            '#...#...#..',
            '.#....#..#.',
            '..#.#...#.#',
            '.#...##..#.',
            '..#.##.....',
            '.#.#.#....#',
            '.#........#',
            '#.##...#...',
            '#...##....#',
            '.#..#...#.#',
        ];

        strictEqual(countTrees(testData), 7);

        console.log('Part 1', part1(data));

        strictEqual(countTrees(testData, 1, 1)
            * countTrees(testData, 3, 1)
            * countTrees(testData, 5, 1)
            * countTrees(testData, 7, 1)
            * countTrees(testData, 1, 2), 336);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
