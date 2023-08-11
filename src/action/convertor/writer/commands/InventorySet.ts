import { ConvertError } from "../../../error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { getSubjectResolution, shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { Resolution, resolveAny } from "../../../data/resolution/Resolution";
import { WriterExecutor } from "../WriterExecutor";

export interface InventorySetCommand extends WriterBaseCommand {
    property: StringResolution;
    value: Resolution;
}

export class InventorySetConvertor extends Convertor<InventorySetCommand, WriterContext> {
    convert(command: InventorySetCommand, writerContext: WriterContext): void {
        const propertyField = resolveString(command.property);
        const valueFormulaField = resolveAny(command.value);
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
                const { context } = writerExecutor;
                context.accumulator.add({
                    description: `Execute: ${command.subject??""}[${propertyFieldValue}] = ${valueFieldValue}`,
                    execute(executor) {
                        const subject = executor.evaluate(subjectResolution);
                        if (typeof(subject) === "object") {
                            executor.inventory.value = subject[propertyFieldValue];
                            const value = executor.evaluate(valueFormulaValue);
                            subject[propertyFieldValue] = value;
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
        if (command.value === undefined) {
            errors.push({
                code: "MISSING_PROPERTY",
                field: "value",
                object: command,
            });
        }
    }
}
