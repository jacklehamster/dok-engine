import { Action } from "../../../actions/Action";
import { ConvertError } from "../../../actions/error/errors";
import { isFormula } from "../../../data/formula/formula-utils";
import { Inventory } from "../../../data/inventory/Inventory";
import { resolveBoolean } from "../../../data/resolution/BooleanResolution";
import { resolveAny } from "../../../data/resolution/Resolution";
import { StringResolution } from "../../../data/resolution/StringResolution";
import { Executor } from "../../../execution/Executor";
import { typeIsAnyOf } from "../../../utils/type-utils";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { WriterCommand } from "./WriterCommand";

export interface SkipNextCommand extends Action {
    skipNextOnCondition: StringResolution,
}

export class SkipNextConvertor extends Convertor<SkipNextCommand, WriterInventory, WriterContext> {
    convert({skipNextOnCondition}: SkipNextCommand, writerContext: WriterContext): void {
        const conditionField = resolveAny(skipNextOnCondition);
        writerContext.accumulator.add({
            execute(writerInventory, writerExecutor) {
                const conditionFormula = writerExecutor.evaluate(conditionField);
                const condition = resolveBoolean(conditionFormula);
                //  Skip next step depending on condition
                writerInventory.context.accumulator.add({
                    execute(_: Inventory, executor: Executor) {
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
        if (!typeIsAnyOf(command.skipNextOnCondition, "boolean") && !isFormula(command.skipNextOnCondition)) {
            errors.push({
                code: "WRONG_TYPE",
                field: "skipNextOnCondition",
                wrongType: typeof(command.skipNextOnCondition),
                neededType: "boolean|Formula",
            });
        }
    }
}
