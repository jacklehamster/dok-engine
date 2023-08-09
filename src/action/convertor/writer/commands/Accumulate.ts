import { ConvertError } from "../../../error/errors";
import { asArray } from "../../../utils/array-utils";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { ArrayResolution } from "../../../data/resolution/ArrayResolution";
import { ObjectResolution } from "../../../data/resolution/ObjectResolution";
import { resolveAny } from "../../../data/resolution/Resolution";

export interface AccumulateCommand extends WriterBaseCommand {
    accumulate: ArrayResolution | ObjectResolution;
}

export class AccumulateConvertor extends Convertor<AccumulateCommand, WriterInventory, WriterContext> {
    convert(command: AccumulateCommand, writerContext: WriterContext): void {
        const actionsResolution = resolveAny(command.accumulate);
        writerContext.accumulator.add({
            description: `Convert: Accumulate steps using the actions in field "${command.accumulate}".`,
            execute(writerExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const actions = writerExecutor.evaluate(actionsResolution);
                const { context } = writerExecutor.inventory;
                asArray(actions).forEach(action => context.subConvertor.convert(action, context));
            },
        });
    }

    validate(action: WriterCommand): boolean {
        return action.accumulate !== undefined;
    }

    validationErrors(action: AccumulateCommand, errors: ConvertError[]): void {
        verifyType(action, "accumulate", ["array", "object", "formula"], errors);
    }
}
