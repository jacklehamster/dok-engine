import { ValueOf } from "../data/resolution/ValueOf";
import { IExecutor } from "../execution/Executor";

export function asArray(element: any): any[] {
    return !element ? [] : Array.isArray(element) ? element : [element];
}

export function clearObject(obj: any) {
    for (const key of Object.keys(obj)) {
        delete obj[key];
    }
}

export function evaluateArray<T>(values: ValueOf<T>[], result: (T|null)[], executor: IExecutor): void {
    for (let i = 0; i < values.length; i++) {
        result[i] = executor.evaluate(values[i]);
    }
}
