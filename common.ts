import * as fs from 'fs';

const getData = (path: string): string => {
    return fs.readFileSync(path, 'utf8');
};

const getLines = <T extends string = string>(path: string): T[] => {
    return getData(path)
        .split('\n')
        .filter((line) => line !== '') as T[];
};

export { getData, getLines };
