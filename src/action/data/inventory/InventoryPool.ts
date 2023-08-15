import { BaseObjPool, OBJECT_POOL } from "../../execution/pool/ObjPool";
import { Inventory } from "./Inventory";

export class InventoryPool extends BaseObjPool<Inventory> {
    inventory: Inventory;
    constructor(inventory: Inventory) {
        super();
        this.inventory = inventory;
    }

    recycle(elem?: Inventory | undefined): void {
        OBJECT_POOL.recycle(elem);
    }
    get(): Inventory {
        return Object.assign(OBJECT_POOL.get(), this.inventory);
    }
}