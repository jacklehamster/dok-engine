import { ConvertError } from "../../../../napl/core/error/errors";
import { ArrayResolution, resolveArray } from "../../../data/resolution/ArrayResolution";
import { Resolution, resolveAny } from "../../../data/resolution/Resolution";
import { WriterContext } from "../WriterContext";
import { getSubjectResolution, shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { typeIsAnyOf } from "../../../utils/type-utils";
import { evaluateArray } from "../../../utils/array-utils";
import { WriterExecutor } from "../WriterExecutor";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { WriterBaseConvertor } from "../WriterBaseConvertor";

export interface CallCommand extends WriterBaseCommand {
    call: ArrayResolution,
    method?: StringResolution;
}

export class CallConvertor extends WriterBaseConvertor<CallCommand> {
    convert(command: CallCommand, writerContext: WriterContext): void {
        const argumentsArray = resolveArray(command.call ?? []);
        const methodConvertResolution = resolveString(command.method ?? "");
        writerContext.accumulator.add({
            description: `Convert: call: ${command.subject ?? command.method}(${command.call}).`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const { context } = writerExecutor;

                const args = writerExecutor.evaluate(argumentsArray) as Resolution[];
                if (!Array.isArray(args)) {
                    writerExecutor.reportError({
                        code: "WRONG_TYPE",
                        field: command.call + "",
                        neededType: "array",
                        wrongType: typeof(args),
                    });
                    return;
                }
                const subjectResolution = getSubjectResolution(command, writerExecutor);
                const methodResolution = resolveString(writerExecutor.evaluate(methodConvertResolution) ?? "");

                const argsValues = args.map(resolution => resolveAny(resolution));
                const argsResult = new Array(argsValues.length);
                context.accumulator.add({
                    description: `Execute: ${command.subject ?? command.method}(${JSON.stringify(args)})`,
                    execute(executor) {
                        evaluateArray(argsValues, argsResult, executor);
                        const method = executor.evaluate(methodResolution);
                        const subject = method?.length ? executor.inventory[method] : executor.evaluate(subjectResolution);
                        if (typeIsAnyOf(subject, "function")) {
                            subject.apply(null, argsResult);
                        } else {
                            executor.reportError({
                                code: "WRONG_TYPE",
                                field: "" + command.subject,
                                neededType: "function",
                                wrongType: typeof(subject),
                            });
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
        verifyType(action, "method", ["string", "undefined", "formula"], errors);
    }
}
