import { X2 } from 'https://raw.githubusercontent.com/oscario2/x2/v0.0.1/index.ts';
import { log } from '../index.ts';

// to debug, set "debug.javascript.usePreview" to false
const { describe, it } = new X2('Logger');

describe('logger', () => {
    it('should print error with stack', () => {
        log.mode('verbose');
        log.error('hello');
    });

    it('should print object and primitive', () => {
        log.info(123, 'hello', { a: { b: 1 } });
    });
}).run();
