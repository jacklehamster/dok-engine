import { Inventory } from "../../data/inventory/Inventory";
import { Action } from "../../actions/Action";
import { Context } from "../Convertor";

export interface WriterInventory extends Inventory {
    action:  Action;
    context: Context;
    labels: Record<string, number>;
}