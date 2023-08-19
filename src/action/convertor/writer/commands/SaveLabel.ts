import { ConvertError } from "../../../../napl/core/error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { WriterContext } from "../WriterContext";
import { shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { WriterExecutor } from "../WriterExecutor";
import { BooleanResolution, resolveBoolean } from "../../../data/resolution/BooleanResolution";
import { WriterBaseConvertor } from "../WriterBaseConvertor";

export interface SaveLabelCommand extends WriterBaseCommand {
    label: StringResolution;
    isGlobal?: BooleanResolution;
}

export class SaveLabelConvertor extends WriterBaseConvertor<SaveLabelCommand> {
    priority: number = 1;

    convert(command: SaveLabelCommand, writerContext: WriterContext): void {
        const labelResolution = resolveString(command.label);
        const isGlobalResolution = resolveBoolean(command.isGlobal ?? false);
        writerContext.accumulator.add({
            description: `Convert: Save label ${command.label}`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const { context, labels } = writerExecutor;
                const labelValue = writerExecutor.evaluate(labelResolution);

                const step = context.accumulator.add({ description: `label: ${labelValue}` });

                if (labelValue) {
                    if (isGlobalResolution) {
                        context.accumulator.addLabel(labelValue, step);
                    } else {
                        if (labels[labelValue] === undefined) {
                            labels[labelValue] = step;
                        } else {
                            writerExecutor.reportError({
                                code: "DUPLICATE_LABEL",
                                label: labelValue,
                            });    
                        }                        
                    }
                    } else {
                    writerExecutor.reportError({
                        code: "INVALID_FORMULA",
                        formula: command.label,
                    });
                }
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.label !== undefined;
    }

    validationErrors(command: SaveLabelCommand, _context: WriterContext, errors: ConvertError[]): void {
        verifyType(command, "label", ["string"], errors);        
    }
}
