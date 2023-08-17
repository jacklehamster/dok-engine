import { ConvertError } from "../../../../napl/core/error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { WriterContext } from "../WriterContext";
import { shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { WriterExecutor } from "../WriterExecutor";
import { WriterBaseConvertor } from "../WriterBaseConvertor";

export interface JumpToLabelCommand extends WriterBaseCommand {
    jumpTo: StringResolution;
}

export class JumpToLabelConvertor extends WriterBaseConvertor<JumpToLabelCommand> {
    convert(command: JumpToLabelCommand, writerContext: WriterContext): void {
        const jumpToLabel = resolveString(command.jumpTo);
        writerContext.accumulator.add({
            description: `Convert: Jump to "${command.jumpTo}".`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const { context, labels } = writerExecutor;
                const labelValue = writerExecutor.evaluate(jumpToLabel);
                const labelConversion = resolveString(labelValue ?? "");
                if (labelValue) {
                    context.accumulator.add({
                        description: `Execute: Jump to ${labelValue}`,
                        execute(executor) {
                            const label = executor.evaluate(labelConversion) ?? "";
                            const destination = labels[label] ?? context.accumulator.getLabel(label);
                            if (destination !== undefined) {
                                executor.jumpTo(destination);
                            } else {
                                executor.reportError({
                                    code: "INVALID_LABEL",
                                    label: labelValue,
                                })
                            }
                        },
                    });       
                } else {
                    writerExecutor.reportError({
                        code: "INVALID_FORMULA",
                        formula: command.jumpTo,
                    });
                }
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.jumpTo !== undefined;
    }

    validationErrors(command: JumpToLabelCommand, errors: ConvertError[]): void {
        verifyType(command, "jumpTo", ["string"], errors);
    }
}
