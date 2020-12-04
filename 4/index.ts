import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

// eslint-disable-next-line no-unused-vars
const validators: Record<string, (value: string) => boolean> = {
    // Birth Year
    byr: (value) => parseInt(value, 10) >= 1920 && parseInt(value, 10) <= 2002,
    // Issue Year
    iyr: (value) => parseInt(value, 10) >= 2010 && parseInt(value, 10) <= 2020,
    // Expiration Year
    eyr: (value) => parseInt(value, 10) >= 2020 && parseInt(value, 10) <= 2030,
    // Height
    hgt: (value) => {
        const data = value.match(/([0-9]+)(cm|in)/);
        if (!data) {
            return false;
        }

        return data[2] === 'cm'
            ? parseInt(data[1], 10) >= 150 && parseInt(data[1], 10) <= 193
            : parseInt(data[1], 10) >= 59 && parseInt(data[1], 10) <= 76;
    },
    // Hair Color
    hcl: (value) => !!value.match(/#[0-9a-f]{6}/),
    // Eye Color
    ecl: (value) => !!value.match(/(amb|blu|brn|gry|grn|hzl|oth)/),
    // Passport ID
    pid: (value) => value.length === 9 && !!value.match(/[0-9]{9}/),
    // Country ID
    cid: () => true,
};

function getPassports(data: string[]): string[] {
    const arr: string[] = [];
    let buffer: string[] = [];

    data.forEach((line) => {
        if (!line.length) {
            arr.push(buffer.join(' ').trim());
            buffer = [];
        }

        buffer.push(line);
    });

    return arr;
}

function isPassportValid(passport: string, strict = false) {
    const fieldNames = Object.keys(validators).filter((name) => name !== 'cid');
    const regex = new RegExp(`(${fieldNames.join('|')}):.*?`, 'g');
    const matches = passport.match(regex);

    if (matches?.length !== fieldNames.length) {
        return false;
    }

    if (strict) {
        const parts = passport.split(' ');
        for (let i = 0; i < parts.length; i += 1) {
            const [key, value] = parts[i].split(':');

            if (!validators[key](value)) {
                return false;
            }
        }
    }

    return true;
}

function getValidPassportCount(data: string[], strict = false): number {
    return getPassports(data).reduce((acc, passport) => (isPassportValid(passport, strict) ? acc + 1 : acc), 0);
}

function part1(data: string[]): number {
    return getValidPassportCount(data);
}

function part2(data: string[]): number {
    return getValidPassportCount(data, true);
}

try {
    readFileToArray('./4/input.txt').then((data) => {
        const testData = [
            'ecl:gry pid:860033327 eyr:2020 hcl:#fffffd',
            'byr:1937 iyr:2017 cid:147 hgt:183cm',
            '',
            'iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884',
            'hcl:#cfa07d byr:1929',
            '',
            'hcl:#ae17e1 iyr:2013',
            'eyr:2024',
            'ecl:brn pid:760753108 byr:1931',
            'hgt:179cm',
            '',
            'hcl:#cfa07d eyr:2025 pid:166559648',
            'iyr:2011 ecl:brn hgt:59in',
            '',
        ];

        strictEqual(getValidPassportCount(testData), 2);

        console.log('Part 1', part1(data));

        strictEqual(validators.byr('2002'), true, 'byr 2002 should be true');
        strictEqual(validators.byr('1919'), false, 'byr 1919 should be false');
        strictEqual(validators.byr('2003'), false, 'byr 2003 should be false');

        strictEqual(validators.iyr('2015'), true, 'iyr 2015 should be true');
        strictEqual(validators.iyr('2002'), false, 'iyr 2002 should be false');
        strictEqual(validators.iyr('2022'), false, 'iyr 2022 should be false');

        strictEqual(validators.eyr('2025'), true, 'eyr 2025 should be true');
        strictEqual(validators.eyr('2002'), false, 'eyr 2002 should be false');
        strictEqual(validators.eyr('2035'), false, 'eyr 2035 should be false');

        strictEqual(validators.hgt('60in'), true, 'hgt 60in should be true');
        strictEqual(validators.hgt('190in'), false, 'hgt 190in should be false');
        strictEqual(validators.hgt('50in'), false, 'hgt 50in should be false');
        strictEqual(validators.hgt('60cm'), false, 'hgt 60cm should be false');
        strictEqual(validators.hgt('190cm'), true, 'hgt 190cm should be true');
        strictEqual(validators.hgt('200cm'), false, 'hgt 200cm should be false');
        strictEqual(validators.hgt('190'), false, 'hgt 190 should be false');

        strictEqual(validators.hcl('#123abc'), true, 'cl #123abc should be true');
        strictEqual(validators.hcl('#123abz'), false, 'cl #123abz should be false');
        strictEqual(validators.hcl('123abc'), false, 'hcl 123abc should be false');

        strictEqual(validators.ecl('brn'), true, 'ecl brn should be true');
        strictEqual(validators.ecl('wat'), false, 'ecl wat should be false');

        strictEqual(validators.pid('000000001'), true, 'pid 000000001 should be true');
        strictEqual(validators.pid('0123456789'), false, 'pid 0123456789 should be false');
        strictEqual(validators.pid('aaaaaaaaa'), false, 'pid aaaaaaaaa should be false');
        strictEqual(validators.pid('abcdefg'), false, 'pid abcdefg should be false');

        const invalidTestData = [
            'eyr:1972 cid:100',
            'hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926',
            '',
            'iyr:2019',
            'hcl:#602927 eyr:1967 hgt:170cm',
            'ecl:grn pid:012533040 byr:1946',
            '',
            'hcl:dab227 iyr:2012',
            'ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277',
            '',
            'hgt:59cm ecl:zzz',
            'eyr:2038 hcl:74454a iyr:2023',
            'pid:3556412378 byr:2007',
            '',
        ];

        strictEqual(getValidPassportCount(invalidTestData, true), 0);

        const validTestData = [
            'pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980',
            'hcl:#623a2f',
            '',
            'eyr:2029 ecl:blu cid:129 byr:1989',
            'iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm',
            '',
            'hcl:#888785',
            'hgt:164cm byr:2001 iyr:2015 cid:88',
            'pid:545766238 ecl:hzl',
            'eyr:2022',
            '',
            'iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719',
            '',
        ];

        strictEqual(getValidPassportCount(validTestData, true), 4);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
