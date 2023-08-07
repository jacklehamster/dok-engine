export interface Externals {
    [key: string]: any;
}

export function getDefaultExternals() {
    return {
        log: console.log,
    };
}