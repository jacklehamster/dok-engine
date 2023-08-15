import { ConvertError } from "../../../error/errors";
import { ArrayResolution, resolveArray } from "../../../data/resolution/ArrayResolution";
import { Resolution, resolveAny } from "../../../data/resolution/Resolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { getSubjectResolution, shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { typeIsAnyOf } from "../../../utils/type-utils";
import { evaluateArray } from "../../../utils/array-utils";
import { WriterExecutor } from "../WriterExecutor";

export interface CallCommand extends WriterBaseCommand {
    call: ArrayResolution,
}

export class CallConvertor extends Convertor<CallCommand, WriterContext> {
    convert(command: CallCommand, writerContext: WriterContext): void {
        const argumentsArray = resolveArray(command.call ?? []);
        writerContext.accumulator.add({
            description: `Convert: call: ${command.subject}(${command.call})`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const { context } = writerExecutor;
                const subjectResolution = getSubjectResolution(command, writerExecutor);

                const args = writerExecutor.evaluate(argumentsArray) as Resolution[];
                const argsValues = args.map(resolution => resolveAny(resolution));
                const argsResult = new Array(argsValues.length);
                context.accumulator.add({
                    description: `Execute: ${command.subject}(${args.join(",")})`,
                    execute(executor) {
                        evaluateArray(argsValues, argsResult, executor);
                        const subject = executor.evaluate(subjectResolution);
                        if (typeIsAnyOf(subject, "function")) {
                            subject.apply(null, argsResult);
                        } else {
                            executor.reportError({
                                code: "WRONG_TYPE",
                                field: "" + command.subject,
                                neededType: "function",
                            })
                        }
                    },
                });
            },
        });
    }

    validate(action: WriterCommand): boolean {
        return action.call !== undefined;
    }

    validationErrors(action: CallCommand, errors: ConvertError[]): void {
        verifyType(action, "call", ["array", "formula"], errors);
    }
}
