// @ts-skip
import { color } from './color.ts';
import { os } from './polyfill.js';

// e.g "file.ts:43"
const rpath = new RegExp(/\/([^\/]+.(?:ts|js):\d+)/);

// win32 or windows
const n = os().startsWith('win') ? '\r\n' : '\n';
const l = os().startsWith('win') ? '\\' : '/';

/**
 * prettify stack
 * @param {Error} err
 */
export const prettyStack = (err: Error) => {
    const lines = err.stack?.split(' at ') as string[];
    if (lines.length == 0) {
        console.log('No stack');
        return err.stack;
    }

    // message
    const message = lines[0].replace('Error: ', '');
    const error = `${color.bgBrightRed(' Error ')} \n${message.trim()}\n`;
    lines.shift();

    // stack
    const stack = lines
        .map(s => {
            const split = s.trim().replace('async ', '').split(' ');

            // no name if anonymous
            const [name, file] =
                split.length == 1 ? ['<anonymous>', split[0]] : split;

            // file and line
            const fline = rpath.exec(file) as string[];
            if (!fline || fline.length == 0) {
                console.log(`No file found in stack line ${s}`);
                return s;
            }

            // relative path from where this script runs from
            const relative = file
                .replace('(', '')
                .replace(')', '')
                .split(l)
                .slice(-5)
                .join('/');

            const str = [
                '^',
                color.brightYellow(fline[1]),
                name,
                n + color.darkWhite(relative) + n
            ];

            return str.join(' ');
        })
        .join(n);

    //
    return n + error + n + stack;
};
