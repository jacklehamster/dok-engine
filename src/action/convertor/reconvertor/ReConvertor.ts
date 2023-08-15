import { Action } from "../../actions/Action";
import { Inventory } from "../../data/inventory/Inventory";
import { ObjectResolution, resolveObject } from "../../data/resolution/ObjectResolution";
import { ValueOf } from "../../data/resolution/ValueOf";
import { Obj } from "../../data/types/basic-types";
import { Context } from "../Convertor";
import { BaseConvertor, BaseConvertorConfig } from "../base/BaseConvertor";

export interface ReConvertorConfig extends BaseConvertorConfig {
    action: ObjectResolution;
}

export class ReConvertor<A extends Action = Action> extends BaseConvertor<A> {
    action: ValueOf<Obj>;

    constructor({action, ...baseConfig}: ReConvertorConfig) {
        super(baseConfig);
        this.action = resolveObject(action);
    }

    convert(action: A, context: Context<A>): void {
        const inventory: Inventory = {
            stash: [],
            action,
        };
        const newAction = this.action.valueOf(inventory);
        context.subConvertor.convert(newAction as A, context);
    }
}