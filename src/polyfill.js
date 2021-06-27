// @ts-skip
/**
 * determine which environment is running the script
 * @returns {string}
 */
const env = () => {
    if (typeof Deno !== 'undefined') {
        return 'deno';
    } else if (typeof process !== 'undefined') {
        return 'node';
    }
    return 'browser';
};

/**
 * get argv from env
 * @returns {Object}
 */
export const argv = () => {
    const run = env();
    switch (run) {
        case 'deno':
            return Deno.env.toObject();
        case 'node':
            return process.env;
    }
    return {};
};

/**
 * get cwd from env
 * @returns {string}
 */
export const cwd = () => {
    const run = env();
    switch (run) {
        case 'deno':
            return Deno.cwd();
        case 'node':
            return __dirname;
    }
    return '.';
};

/**
 * get os from env
 * @return {string}
 */
export const os = () => {
    const run = env();
    switch (run) {
        case 'deno':
            return Deno.build.os;
        case 'node':
            return process.platform;
    }
    return 'browser';
};
