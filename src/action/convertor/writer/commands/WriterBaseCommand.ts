import { Action } from "../../../actions/Action";
import { BooleanResolution, resolveBoolean } from "../../../data/resolution/BooleanResolution";
import { Executor } from "../../../execution/Executor";
import { WriterInventory } from "../WriterInventory";

export interface WriterBaseCommand extends Action {
    condition?: BooleanResolution;
    [key: string]: any;
};

export function shouldConvert(command: WriterBaseCommand, executor: Executor<WriterInventory>) {
    if (command.condition === undefined) {
        return true;
    }
    const conditionResult = executor.evaluate(resolveBoolean(command.condition));

    if (conditionResult == null) {
        executor.reportError({
            code: "INVALID_FORMULA",
            formula: command.condition,
        })    
    }

    if (!conditionResult) {
        return false;
    }
    return true;
}