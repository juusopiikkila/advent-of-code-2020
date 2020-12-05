import { deepStrictEqual } from 'assert';
import { readFileToArray } from '../utils';

interface Seat {
    row: number
    column: number
    id: number
}

function calculatePlacement(spec: string, max: number): number {
    const up = ['B', 'R'];
    let range: number[] = [];

    for (let i = 0; i <= max; i += 1) {
        range.push(i);
    }

    spec.split('').forEach((dir) => {
        const lower = range.slice(0, range.length / 2);
        const upper = range.slice(range.length / 2);

        range = (up.indexOf(dir) !== -1) ? upper : lower;
    });

    return range[0];
}

function getSeat(spec: string): Seat {
    const rowSpec = spec.substr(0, 7);
    const columnSpec = spec.substr(7, 3);

    const row = calculatePlacement(rowSpec, 127);
    const column = calculatePlacement(columnSpec, 7);

    return {
        row,
        column,
        id: (row * 8) + column,
    };
}

function part1(data: string[]): number {
    return data.reduce((acc, line) => {
        const seat = getSeat(line);
        return (acc === -1 || seat.id > acc) ? seat.id : acc;
    }, -1);
}

function part2(data: string[]): number {
    const seatIds = data.map((line) => getSeat(line).id);

    seatIds.sort();

    for (let i = 0; i < seatIds.length; i += 1) {
        if (seatIds[i + 1] !== seatIds[i] + 1) {
            return seatIds[i] + 1;
        }
    }

    return -1;
}

try {
    readFileToArray('./5/input.txt').then((data) => {
        deepStrictEqual(getSeat('FBFBBFFRLR'), {
            row: 44,
            column: 5,
            id: 357,
        });

        deepStrictEqual(getSeat('BFFFBBFRRR'), {
            row: 70,
            column: 7,
            id: 567,
        });

        deepStrictEqual(getSeat('FFFBBBFRRR'), {
            row: 14,
            column: 7,
            id: 119,
        });

        deepStrictEqual(getSeat('BBFFBBFRLL'), {
            row: 102,
            column: 4,
            id: 820,
        });

        console.log('Part 1', part1(data));

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
