import { ConvertError } from "../../../../napl/core/error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { WriterContext } from "../WriterContext";
import { getSubjectResolution, shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { Resolution, resolveAny } from "../../../data/resolution/Resolution";
import { WriterExecutor } from "../WriterExecutor";
import { verifyDefined } from "../validation/verifyType";
import { BooleanResolution, resolveBoolean } from "../../../data/resolution/BooleanResolution";
import { asArray } from "../../../utils/array-utils";
import { WriterBaseConvertor } from "../WriterBaseConvertor";

export interface InventorySetCommand extends WriterBaseCommand {
    property: StringResolution;
    value: Resolution;
    asArray?: BooleanResolution;
}

export class InventorySetConvertor extends WriterBaseConvertor<InventorySetCommand> {
    convert(command: InventorySetCommand, writerContext: WriterContext): void {
        const propertyField = resolveString(command.property);
        const valueFormulaField = resolveAny(command.value);
        const asArrayField = resolveBoolean(command.asArray);
        writerContext.accumulator.add({
            description: `Convert: Update "${command.property}" to ${command.value}.`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const propertyFieldValue = writerExecutor.evaluate(propertyField);
                if (!propertyFieldValue) {
                    console.error("Property field missing.");
                    return;
                }
                const subjectResolution = getSubjectResolution(command, writerExecutor);
                const valueFieldValue = writerExecutor.evaluate(valueFormulaField);
                const valueFormulaValue = resolveAny(valueFieldValue);
                const asArrayFormulaResolution = resolveBoolean(writerExecutor.evaluate(asArrayField));
                const { context } = writerExecutor;
                context.accumulator.add({
                    description: `Execute: ${command.subject??""}[${propertyFieldValue}] = ${valueFieldValue}`,
                    execute(executor) {
                        const subject = executor.evaluate(subjectResolution);
                        const asArrayValue = executor.evaluate(asArrayFormulaResolution);
                        if (typeof(subject) === "object") {
                            executor.inventory.value = subject[propertyFieldValue];
                            const value = executor.evaluate(valueFormulaValue);
                            delete executor.inventory.value;
                            subject[propertyFieldValue] = asArrayValue ? asArray(value) : value;
                        } else {
                            writerExecutor.reportError({
                                code: "WRONG_TYPE",
                                field: "subject",
                                neededType: "object",
                                wrongType: typeof(subject),
                            });            
                        }
                    },
                });
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.property !== undefined;
    }

    validationErrors(command: InventorySetCommand, errors: ConvertError[]): void {
        verifyDefined(command, "value", errors);
    }
}
