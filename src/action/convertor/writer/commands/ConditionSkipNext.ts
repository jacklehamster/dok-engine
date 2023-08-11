import { ConvertError } from "../../../error/errors";
import { resolveBoolean } from "../../../data/resolution/BooleanResolution";
import { Resolution, resolveAny } from "../../../data/resolution/Resolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { IExecutor } from "../../../execution/Executor";
import { WriterExecutor } from "../WriterExecutor";

export interface SkipNextCommand extends WriterBaseCommand {
    skipNextOnCondition: Resolution,
}

export class SkipNextConvertor extends Convertor<SkipNextCommand, WriterContext> {
    convert(command: SkipNextCommand, writerContext: WriterContext): void {
        const conditionField = resolveAny(command.skipNextOnCondition);
        writerContext.accumulator.add({
            description: `Convert: Skip next if "${command.skipNextOnCondition}".`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const { context } = writerExecutor;
                const conditionFormula = writerExecutor.evaluate(conditionField);
                const condition = resolveBoolean(conditionFormula);
                //  Skip next step depending on condition
                context.accumulator.add({
                    description: `Execute: Skip next if "${conditionFormula}".`,
                    execute(executor: IExecutor) {
                        const bool = executor.evaluate(condition) ?? false;
                        executor.ifCondition(bool)?.skipNextStep();
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
