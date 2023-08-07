import { Action } from "../../../actions/Action";
import { ConvertError } from "../../../actions/error/errors";
import { ArrayResolution, resolveArray } from "../../../data/resolution/ArrayResolution";
import { stringOrNull } from "../../../utils/type-utils";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { verifyType } from "../validation/verifyType";
import { WriterCommand } from "./WriterCommand";

export interface AccumulateCommand extends Action {
    accumulate: ArrayResolution;
}

export class AccumulateConvertor extends Convertor<AccumulateCommand, WriterInventory, WriterContext> {
    convert(action: AccumulateCommand, context: WriterContext): void {
        const actionsResolution = resolveArray(action.accumulate);
        context.accumulator.add({
            description: `Accumulate steps using the actions in field "${action.accumulate}".`,
            execute(writerExecutor) {
                const actions = writerExecutor.evaluate(actionsResolution);
                if (!Array.isArray(actions)) {
                    writerExecutor.reportError({
                        code: "WRONG_TYPE",
                        field: stringOrNull(action.accumulate) ?? undefined,
                        wrongType: typeof(actions),
                        neededType: "array",
                    })
                    return;
                }
                const { context } = writerExecutor.inventory;
                actions.forEach(action => context.subConvertor.convert(action, context));
            },
        });
    }

    validate(action: WriterCommand): boolean {
        return action.accumulate !== undefined;
    }

    validationErrors(action: AccumulateCommand, errors: ConvertError[]): void {
        verifyType(action, "accumulate", ["array", "formula"], errors);
    }
}
