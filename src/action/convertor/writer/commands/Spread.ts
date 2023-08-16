import { ConvertError } from "../../../error/errors";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { getSubjectResolution, shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { WriterExecutor } from "../WriterExecutor";
import { verifyType } from "../validation/verifyType";
import { ArrayResolution, resolveArray } from "../../../data/resolution/ArrayResolution";

export interface SpreadCommand extends WriterBaseCommand {
    spread: ArrayResolution;
}

export class SpreadConvertor extends Convertor<SpreadCommand, WriterContext> {
    convert(command: SpreadCommand, writerContext: WriterContext): void {
        const spreadArray = resolveArray(command.spread);
        writerContext.accumulator.add({
            description: `Convert: Spread "${command.subject}" to ${command.spread}.`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const spreadValues = writerExecutor.evaluate(spreadArray);
                const spreadResolution = resolveArray(spreadValues ?? []);
                const subjectResolution = getSubjectResolution(command, writerExecutor);
                const { context } = writerExecutor;
                context.accumulator.add({
                    description: `Execute: Spread ${command.subject??""} to ${spreadValues?.join(",")}`,
                    execute(executor) {
                        const subject = executor.evaluate(subjectResolution);
                        const spread = executor.evaluate(spreadResolution);
                        if (Array.isArray(subject) && Array.isArray(spread)) {
                            for (let i = 0; i < spread.length; i++) {
                                const arg = spread[i];
                                if (arg) {
                                    executor.inventory[arg.toString()] = subject[i];
                                }
                            } 
                        } else {
                            writerExecutor.reportError({
                                code: "WRONG_TYPE",
                                field: "subject",
                                neededType: "array",
                                wrongType: typeof(subject),
                            });            
                        }
                    },
                });
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.spread !== undefined;
    }

    validationErrors(command: SpreadCommand, errors: ConvertError[]): void {
        verifyType(command, "spread", ["array", "formula"], errors);
    }
}
