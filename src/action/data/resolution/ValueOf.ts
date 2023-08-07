import { Inventory } from "../inventory/Inventory";

export type ValueOf<T> = {
    valueOf(parameters?: Inventory): T | null;
}

export const EMPTY_VALUEOF: ValueOf<any> = {
    valueOf: () => null,
};