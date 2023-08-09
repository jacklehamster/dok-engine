import { Inventory } from "../inventory/Inventory";

export type ValueOf<T> = {
    valueOf(parameters?: Inventory): T | null;
}
