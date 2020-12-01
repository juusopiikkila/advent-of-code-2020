import { promises } from 'fs';

export async function readFileToArray(path: string): Promise<string[]> {
    const data = await promises.readFile(path);
    return data.toString().split('\n').slice(0, -1);
}
