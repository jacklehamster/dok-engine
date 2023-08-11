import { ConvertError } from "../../../error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { WriterExecutor } from "../WriterExecutor";

export interface SaveLabelCommand extends WriterBaseCommand {
    label: StringResolution;
}

export class SaveLabelConvertor extends Convertor<SaveLabelCommand, WriterContext> {
    priority: number = 1;

    convert(command: SaveLabelCommand, writerContext: WriterContext): void {
        const labelResolution = resolveString(command.label);
        writerContext.accumulator.add({
            description: `Convert: Save label ${command.label}`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const { context, labels } = writerExecutor;
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
