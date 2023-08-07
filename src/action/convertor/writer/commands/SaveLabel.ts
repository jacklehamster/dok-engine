import { Action } from "../../../actions/Action";
import { ConvertError } from "../../../actions/error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { verifyType } from "../validation/verifyType";
import { WriterCommand } from "./WriterCommand";

export interface SaveLabelCommand extends Action {
    label: StringResolution;
}

export class SaveLabelConvertor extends Convertor<SaveLabelCommand, WriterInventory, WriterContext> {
    convert({label}: SaveLabelCommand, writerContext: WriterContext): void {
        const labelResolution = resolveString(label);
        writerContext.accumulator.add({
            execute(writerExecutor) {
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
                        formula: label,
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
