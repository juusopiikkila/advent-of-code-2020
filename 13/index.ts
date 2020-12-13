import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

interface Bus {
    line: number
    seq: number
}

function getWaitTime(data: string[]): number {
    const earliestTs = parseInt(data[0], 10);
    const busses = data[1].split(',').filter((line) => line !== 'x').map(Number);

    let minBus = -1;
    let minTs = -1;

    busses.forEach((bus) => {
        const res = bus - (earliestTs % bus);

        if (minTs === -1 || res < minTs) {
            minBus = bus;
            minTs = res;
        }
    });

    return minBus * minTs;
}

// https://www.reddit.com/r/adventofcode/comments/kc4njx/2020_day_13_solutions/gfoej57
function getSubsequent(data: string): number {
    const busses: Bus[] = data.split(',').map((bus, index) => ({
        line: parseInt(bus, 10),
        seq: index,
    })).filter((bus) => !Number.isNaN(bus.line));

    let time = 0;
    let multiplier = busses[0].line;
    let unsatisfied = 1;
    let next: Bus | undefined;

    while (unsatisfied < busses.length) {
        time += multiplier;
        next = busses[unsatisfied];

        if ((time + next.seq) % next.line === 0) {
            multiplier *= next.line;
            unsatisfied += 1;
        }
    }

    return time;
}

function part1(data: string[]): number {
    return getWaitTime(data);
}

function part2(data: string[]): number {
    return getSubsequent(data[1]);
}

try {
    readFileToArray('./13/input.txt').then((data) => {
        const testData = [
            '939',
            '7,13,x,x,59,x,31,19',
        ];

        strictEqual(getWaitTime(testData), 295);

        console.log('Part 1', part1(data));

        strictEqual(getSubsequent(testData[1]), 1068781);

        strictEqual(getSubsequent('17,x,13,19'), 3417);

        strictEqual(getSubsequent('67,7,59,61'), 754018);

        strictEqual(getSubsequent('67,x,7,59,61'), 779210);

        strictEqual(getSubsequent('67,7,x,59,61'), 1261476);

        strictEqual(getSubsequent('1789,37,47,1889'), 1202161486);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
