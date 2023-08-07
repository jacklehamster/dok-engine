import { ConvertError } from "../../../actions/error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { WriterContext } from "../WriterContext";
import { WriterBaseConvertor } from "../WriterConvertor";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand, shouldConvert } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";

export interface SaveLabelCommand extends WriterBaseCommand {
    label: StringResolution;
}

export class SaveLabelConvertor extends WriterBaseConvertor {
    convert(command: SaveLabelCommand, writerContext: WriterContext): void {
        const labelResolution = resolveString(command.label);
        writerContext.accumulator.add({
            execute(writerExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }

                const { context, labels } = writerExecutor.inventory;
                const labelValue = writerExecutor.evaluate(labelResolution);
                if (labelValue) {
                    if (labels[labelValue] === undefined) {
                        labels[labelValue] = context.accumulator.add({ description: `label: ${labelValue}` });
                    } else {
                        writerExecutor.reportError({
                            code: "DUPLICATE_LABEL",
                            label: labelValue,
                        });    
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

    validationErrors(command: SaveLabelCommand, errors: ConvertError[]): void {
        verifyType(command, "label", ["string"], errors);        
    }
}
