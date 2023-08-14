import { ConvertError } from "../../../error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { WriterExecutor } from "../WriterExecutor";

export interface JumpToLabelCommand extends WriterBaseCommand {
    jumpTo: StringResolution;
    pushStep?: boolean;
}

export class JumpToLabelConvertor extends Convertor<JumpToLabelCommand, WriterContext> {
    convert(command: JumpToLabelCommand, writerContext: WriterContext): void {
        const jumpToLabel = resolveString(command.jumpTo);
        writerContext.accumulator.add({
            description: `Convert: Jump to "${command.jumpTo}". pushStep: ${command.pushStep}`,
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
                                if (command.pushStep) {
                                    executor.pushStep();
                                }
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
