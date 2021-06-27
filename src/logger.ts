// @ts-skip
import { color, TColor } from './color.ts';
import { prettyStack } from './pretty-stack.ts';

type TLogType = 'info' | 'debug' | 'warn' | 'success' | 'error';

const levels = ['minimal', 'normal', 'verbose'] as const;
export type TLogLevel = typeof levels[number];

const lmap = {} as Record<TLogLevel, number>;
levels.forEach((k, i) => (lmap[k] = i));

export class Logger {
    public trace?: boolean;
    private level: TLogLevel;
    private caller?: string;

    /**
     * construct with optional log level
     * @param {TLogLevel | undefined} level
     */
    constructor(level?: TLogLevel) {
        this.level = level || 'normal';
    }

    public info(...input: unknown[]) {
        this.log('info', ...input);
    }

    public debug(...input: unknown[]) {
        if (!this.least('verbose')) return;
        this.log('debug', ...input);
    }

    public success(...input: unknown[]) {
        if (!this.least('verbose')) return;
        this.log('success', ...input);
    }

    public warn(...input: unknown[]) {
        this.log('warn', ...input);
    }

    public error(...input: unknown[]) {
        if (!this.least('verbose')) {
            this.log('error', ...input);
            return;
        }
        // include stack if verbose
        const error = new Error(this.parseArgs(...input));
        console.log(prettyStack(error));
    }

    public mode(level: TLogLevel) {
        this.level = level;
    }

    /**
     * check if we're less or more than N level to print
     * @param {TLogLevel} min
     * @returns
     */
    private least(min: TLogLevel): boolean {
        if (lmap[min] <= lmap[this.level]) return true;
        return false;
    }

    /**
     * parse each argument of spread input
     * @param {unknown[]} input
     */
    private parseArgs(...input: unknown[]): string {
        return input
            .map(k => (typeof k == 'object' ? JSON.stringify(k) : String(k)))
            .join(' ');
    }

    /**
     * write to console
     * @param {TLogType} type
     * @param {unknown[]} input
     */
    private log(type: TLogType, ...input: unknown[]): void {
        const { trace, caller } = this;
        const pre = caller ? `[${caller}]: ` : '';

        const shade = this.getColor(type);
        const out = color[shade](pre + this.parseArgs(...input));
        trace ? console.trace(out) : console.log(out);
    }

    /**
     * get color from mode
     * @param {TLogType} type
     * @returns
     */
    private getColor(type: TLogType): TColor {
        switch (type) {
            case 'info':
                return 'white';
            case 'debug':
                return 'brightBlue';
            case 'warn':
                return 'yellow';
            case 'success':
                return 'green';
            case 'error':
                return 'brightRed';
        }
    }
}

export const log = new Logger('normal');
