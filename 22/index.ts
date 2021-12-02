import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function getDecks(stack: string[]): [number[], number[]] {
    const player1: number[] = [];
    const player2: number[] = [];
    let currentPlayer = 1;

    stack.forEach((line) => {
        if (!line.length) {
            return;
        }

        const matches = line.match(/^Player ([0-9+]):$/);
        if (matches) {
            currentPlayer = Number(matches[1]);
            return;
        }

        if (currentPlayer === 1) {
            player1.push(Number(line));
        } else if (currentPlayer === 2) {
            player2.push(Number(line));
        }
    });

    return [player1, player2];
}

class Game {
    private number: number;

    private player1: number[];

    private player2: number[];

    private hashes: string[] = [];

    private debug: boolean;

    constructor(decks: [number[], number[]], number = 1, debug = false) {
        [this.player1, this.player2] = decks;
        this.number = number;
        this.debug = debug;
    }

    private log(text: string) {
        if (!this.debug) {
            return;
        }

        console.log(text);
    }

    play() {
        let round = 1;

        while (this.player1.length && this.player2.length) {
            console.log(`-- Round ${round} --`);
            console.log(`Player 1's deck ${this.player1.join(', ')}`);
            console.log(`Player 2's deck ${this.player2.join(', ')}`);

            const card1 = this.player1.shift();
            const card2 = this.player2.shift();

            console.log(`Player 1 plays ${card1}`);
            console.log(`Player 2 plays ${card2}`);

            if (!card1 || !card2) {
                throw new Error('No card');
            }

            if (card1 > card2) {
                console.log('Player 1 wins the round!');
                this.player1.push(card1, card2);
            } else if (card2 > card1) {
                console.log('Player 2 wins the round!');
                this.player2.push(card2, card1);
            } else {
                throw new Error('Draw');
            }

            console.log('');

            round += 1;
        }

        console.log('== Post-game results ==');
        console.log(`Player 1's deck ${this.player1.join(', ')}`);
        console.log(`Player 2's deck ${this.player2.join(', ')}`);

        const winner = this.player1.length ? this.player1 : this.player2;

        return winner.reduce((acc, card, index, arr) => acc + (card * (arr.length - index)), 0);
    }

    playRecursive() {
        this.log(`=== Game ${this.number} ===`);
        this.log('');

        let round = 1;

        while (this.player1.length && this.player2.length) {
            this.log(`-- Round ${round} (Game ${this.number}) --`);
            this.log(`Player 1's deck ${this.player1.join(', ')}`);
            this.log(`Player 2's deck ${this.player2.join(', ')}`);

            const hash = `${this.player1.join('.')}|${this.player2.join('.')}`;

            if (this.hashes.includes(hash)) {
                this.log('Player 1 wins the game!');

                return [
                    1,
                    0,
                ];
            }

            this.hashes.push(hash);

            const card1 = this.player1.shift();
            const card2 = this.player2.shift();

            if (!card1 || !card2) {
                throw new Error('No card');
            }

            this.log(`Player 1 plays ${card1}`);
            this.log(`Player 2 plays ${card2}`);

            if (card1 <= this.player1.length && card2 <= this.player2.length) {
                this.log('Playing a sub-game to determine the winner...');
                this.log('');

                const game = (new Game([
                    [...this.player1.slice(0, card1)],
                    [...this.player2.slice(0, card2)],
                ], this.number + 1));

                const results = game.playRecursive();

                if (results[0] === 1) {
                    this.player1.push(card1, card2);
                } else if (results[0] === 2) {
                    this.player2.push(card2, card1);
                }
            } else if (card1 > card2) {
                this.log(`Player 1 wins round ${round} of game ${this.number}!`);
                this.player1.push(card1, card2);
            } else if (card2 > card1) {
                this.log(`Player 2 wins round ${round} of game ${this.number}!`);
                this.player2.push(card2, card1);
            } else {
                throw new Error('Draw');
            }

            this.log('');

            round += 1;
        }

        if (this.number === 1) {
            this.log('== Post-game results ==');
            this.log(`Player 1's deck ${this.player1.join(', ')}`);
            this.log(`Player 2's deck ${this.player2.join(', ')}`);
        } else {
            this.log(`The winner of game ${this.number} is player ${this.player1.length ? 1 : 2}!`);
            this.log('');
            this.log(`...anyway, back to game ${this.number - 1}.`);
        }

        const winner = this.player1.length ? this.player1 : this.player2;

        return [
            this.player1.length ? 1 : 2,
            winner.reduce((acc, card, index, arr) => acc + (card * (arr.length - index)), 0),
        ];
    }
}

function part1(data: string[]): number {
    return (new Game(getDecks(data))).play();
}

function part2(data: string[]): number {
    return (new Game(getDecks(data))).playRecursive()[1];
}

try {
    readFileToArray('./22/input.txt').then((data) => {
        const testData = [
            'Player 1:',
            '9',
            '2',
            '6',
            '3',
            '1',
            '',
            'Player 2:',
            '5',
            '8',
            '4',
            '7',
            '10',
        ];

        strictEqual((new Game(getDecks(testData), 1, true)).play(), 306);

        console.log('Part 1', part1(data));

        strictEqual((new Game(getDecks(testData), 1, true)).playRecursive()[1], 291);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
