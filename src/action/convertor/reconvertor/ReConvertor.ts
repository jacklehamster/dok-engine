import { Action } from "../../actions/Action";
import { Inventory } from "../../data/inventory/Inventory";
import { ObjectResolution, resolveObject } from "../../data/resolution/ObjectResolution";
import { ValueOf } from "../../data/resolution/ValueOf";
import { Obj } from "../../../types/basic-types";
import { ActionContext } from "../ActionConvertor";
import { BaseConvertor, BaseConvertorConfig } from "../base/BaseConvertor";

export interface ReConvertorConfig extends BaseConvertorConfig {
    action: ObjectResolution;
}

export class ReConvertor<A extends Action = Action> extends BaseConvertor<A> {
    action: ValueOf<Obj>;

    constructor(config: ReConvertorConfig) {
        super(config);
        this.action = resolveObject(config.action);
    }

    convert(action: A, context: ActionContext<A>): void {
        const inventory: Inventory = {
            action,
        };
        const newAction = this.action.valueOf(inventory);
        context.subConvertor.convert(newAction as A, context);
    }
}