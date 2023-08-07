import { Action } from "../../../actions/Action";
import { ConvertError } from "../../../actions/error/errors";
import { resolveString } from "../../../data/resolution/StringResolution";
import { Executor } from "../../../execution/Executor";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { verifyType } from "../validation/verifyType";
import { WriterCommand } from "./WriterCommand";

export interface JumpToLabelCommand extends Action {
    jumpTo: string;
}

export class JumpToLabelConvertor extends Convertor<JumpToLabelCommand, WriterInventory, WriterContext> {
    convert({jumpTo}: JumpToLabelCommand, writerContext: WriterContext): void {
        const jumpToLabel = resolveString(jumpTo);
        writerContext.accumulator.add({
            execute(writerExecutor) {
                const { context, labels } = writerExecutor.inventory;
                const labelValue = writerExecutor.evaluate(jumpToLabel);
                if (labelValue) {
                    context.accumulator.add({
                        execute(executor: Executor) {
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
                        formula: jumpTo,
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
