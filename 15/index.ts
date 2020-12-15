import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

class Game {
    numbers: number[]

    occurrences = new Map()

    constructor(start: string) {
        this.numbers = start.split(',').map(Number);
    }

    play(to = 2020): number {
        let next = 0;

        for (let counter = 1; counter < to; counter += 1) {
            const current = counter <= this.numbers.length ? this.numbers[counter - 1] : next;

            next = this.occurrences.has(current) ? counter - this.occurrences.get(current) : 0;

            this.occurrences.set(current, counter);
        }

        return next;
    }
}

function part1(data: string[]): number {
    return new Game(data[0]).play();
}

function part2(data: string[]): number {
    return new Game(data[0]).play(30000000);
}

try {
    readFileToArray('./15/input.txt').then((data) => {
        strictEqual(new Game('0,3,6').play(), 436);

        strictEqual(new Game('1,3,2').play(), 1);

        strictEqual(new Game('2,1,3').play(), 10);

        strictEqual(new Game('1,2,3').play(), 27);

        strictEqual(new Game('2,3,1').play(), 78);

        strictEqual(new Game('3,2,1').play(), 438);

        strictEqual(new Game('3,1,2').play(), 1836);

        console.log('Part 1', part1(data));

        strictEqual(new Game('0,3,6').play(30000000), 175594);

        strictEqual(new Game('1,3,2').play(30000000), 2578);

        strictEqual(new Game('2,1,3').play(30000000), 3544142);

        strictEqual(new Game('1,2,3').play(30000000), 261214);

        strictEqual(new Game('2,3,1').play(30000000), 6895259);

        strictEqual(new Game('3,2,1').play(30000000), 18);

        strictEqual(new Game('3,1,2').play(30000000), 362);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
