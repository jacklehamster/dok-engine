import { ConvertError } from "../../../error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";

export interface JumpToLabelCommand extends WriterBaseCommand {
    jumpTo: StringResolution;
}

export class JumpToLabelConvertor extends Convertor<JumpToLabelCommand, WriterInventory, WriterContext> {
    convert(command: JumpToLabelCommand, writerContext: WriterContext): void {
        const jumpToLabel = resolveString(command.jumpTo);
        writerContext.accumulator.add({
            description: `Convert: Jump to "${command.jumpTo}".`,
            execute(writerExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const { context, labels } = writerExecutor.inventory;
                const labelValue = writerExecutor.evaluate(jumpToLabel);
                if (labelValue) {
                    context.accumulator.add({
                        description: `Execute: Jump to ${labelValue}`,
                        execute(executor) {
                            if (labels[labelValue] !== undefined) {
                                executor.jumpTo(labels[labelValue]);
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
