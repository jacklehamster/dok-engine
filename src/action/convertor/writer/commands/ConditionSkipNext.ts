import { Action } from "../../../actions/Action";
import { ConvertError } from "../../../actions/error/errors";
import { resolveBoolean } from "../../../data/resolution/BooleanResolution";
import { resolveAny } from "../../../data/resolution/Resolution";
import { StringResolution } from "../../../data/resolution/StringResolution";
import { Executor } from "../../../execution/Executor";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { verifyType } from "../validation/verifyType";
import { WriterCommand } from "./WriterCommand";

export interface SkipNextCommand extends Action {
    skipNextOnCondition: StringResolution,
}

export class SkipNextConvertor extends Convertor<SkipNextCommand, WriterInventory, WriterContext> {
    convert({skipNextOnCondition}: SkipNextCommand, writerContext: WriterContext): void {
        const conditionField = resolveAny(skipNextOnCondition);
        writerContext.accumulator.add({
            execute(writerExecutor) {
                const { context } = writerExecutor.inventory;
                const conditionFormula = writerExecutor.evaluate(conditionField);
                const condition = resolveBoolean(conditionFormula);
                //  Skip next step depending on condition
                context.accumulator.add({
                    execute(executor: Executor) {
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
