export function stringOrNull(value: any): string | null {
    return typeof(value) === "string" ? value : null;
}

export function typeIsAnyOf(value: any, ...types: string[]) {
    for (let type of types) {
        if (typeof(value) === type) {
            return true;
        }
    }
    return false;
}