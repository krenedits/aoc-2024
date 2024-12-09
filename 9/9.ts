import { getData } from '../common';

console.time('time');
const parseData = () => {
    const data = getData('input.txt');

    const files: string[] = [];
    const spaces: string[] = [];
    let file = true;
    let i = 0;

    while (i < data.length) {
        if (file) {
            files.push(data[i]);
        } else {
            spaces.push(data[i]);
        }

        file = !file;
        i++;
    }

    return {
        files,
        spaces,
    };
};

const countFiles = () => {
    let i = 0;
    let file = true;
    let counter = 0;
    const { files, spaces } = parseData();
    let fileIndex = 0;
    let lastIndex = files.length - 1;

    while (files.length > 0) {
        if (file) {
            const first = +(files.shift() as string);
            const max = first + i;
            while (i < max) {
                counter += fileIndex * i;
                i++;
            }
            fileIndex++;
        } else {
            const first = spaces.shift();
            if (first) {
                let remainingSpace = +first;
                const max = remainingSpace + i;
                while (i < max) {
                    const last = files.pop();
                    if (last) {
                        const lastNumber = +last;
                        counter += i * lastIndex;
                        if (lastNumber > 1) {
                            files.push('' + (lastNumber - 1));
                        } else {
                            lastIndex--;
                        }
                    }
                    i++;
                }
            }
        }

        file = !file;
    }

    return counter;
};

const countFilesTwo = () => {
    let counter = 0;
    const { files, spaces } = parseData();
    const indices = files.map((_, index) => index);
    const originalSpaces = [...spaces];
    const filesCopy = [...files];
    let string = Array.from({ length: 42 }).fill('.') as (string | number)[];

    while (files.length > 0) {
        const file = +(files.pop() as string);

        const spacesCopy = spaces.slice(0, files.length);

        let j = 0;
        let index = 0;
        let inserted = false;

        while (spacesCopy.length > 0) {
            const space = +(spacesCopy.shift() as string);

            if (space >= file) {
                let k = index + +filesCopy[j];
                const max = k + file;
                while (k < max) {
                    counter += k * indices[files.length];
                    string[k] = indices[files.length];
                    k++;
                }

                filesCopy[j] = '' + (+filesCopy[j] + file);
                filesCopy.pop();
                spaces[j] = '' + (space - file);
                inserted = true;
                break;
            }

            index += space + +filesCopy[j];
            j++;
        }

        if (!inserted) {
            const startIndex =
                files.reduce((acc, value) => acc + +value, 0) +
                originalSpaces.slice(0, files.length).reduce((acc, value) => acc + +value, 0);
            let k = startIndex;
            const max = startIndex + file;
            while (k < max) {
                string[k] = indices[files.length];
                counter += k * indices[files.length];
                k++;
            }
        }
    }

    return counter;
};

const result1 = countFiles();
const result2 = countFilesTwo();

console.timeEnd('time');
console.log(result1, result2);
