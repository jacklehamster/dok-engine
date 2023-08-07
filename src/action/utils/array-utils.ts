export function asArray(element: any): any[] {
    return !element ? [] : Array.isArray(element) ? element : [element];
}

export function clearObject(obj: any) {
    for (const key of Object.keys(obj)) {
        delete obj[key];
    }
}