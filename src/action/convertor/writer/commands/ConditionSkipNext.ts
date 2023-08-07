import { ConvertError } from "../../../actions/error/errors";
import { resolveBoolean } from "../../../data/resolution/BooleanResolution";
import { resolveAny } from "../../../data/resolution/Resolution";
import { StringResolution } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";

export interface SkipNextCommand extends WriterBaseCommand {
    skipNextOnCondition: StringResolution,
}

export class SkipNextConvertor extends Convertor<SkipNextCommand, WriterInventory, WriterContext> {
    convert(command: SkipNextCommand, writerContext: WriterContext): void {
        const conditionField = resolveAny(command.skipNextOnCondition);
        writerContext.accumulator.add({
            execute(writerExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const { context } = writerExecutor.inventory;
                const conditionFormula = writerExecutor.evaluate(conditionField);
                const condition = resolveBoolean(conditionFormula);
                //  Skip next step depending on condition
                context.accumulator.add({
                    execute(executor) {
                        const bool = executor.evaluate(condition) ?? false;
                        executor.ifCondition(bool).skipNextStep();
                    },
                });
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.skipNextOnCondition !== undefined;
    }

    validationErrors(command: SkipNextCommand, errors: ConvertError[]): void {
        verifyType(command, "skipNextOnCondition", ["boolean", "formula"], errors);
    }
}
