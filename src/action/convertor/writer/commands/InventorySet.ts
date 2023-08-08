import { ConvertError } from "../../../error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { Resolution, resolveAny } from "../../../data/resolution/Resolution";

export interface InventorySetCommand extends WriterBaseCommand {
    variable?: Resolution;
    property: StringResolution;
    value: Resolution;
}

export class InventorySetConvertor extends Convertor<InventorySetCommand, WriterInventory, WriterContext> {
    convert(command: InventorySetCommand, writerContext: WriterContext): void {
        const variableNameField = resolveAny(command.variable);
        const propertyField = resolveString(command.property);
        const valueFormulaField = resolveAny(command.value);
        writerContext.accumulator.add({
            description: `Convert: Update "${command.variable}" to ${command.value}.`,
            execute(writerExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const propertyFieldValue = writerExecutor.evaluate(propertyField);
                if (!propertyFieldValue) {
                    console.error("Property field missing.");
                    return;
                }
                
                const variableName = writerExecutor.evaluate(variableNameField);
                const valueFieldValue = writerExecutor.evaluate(valueFormulaField);
                const variableNameValue = resolveAny(variableName);
                const valueFormulaValue = resolveAny(valueFieldValue);
                const { context } = writerExecutor.inventory;
                context.accumulator.add({
                    description: `Execute: ${variableNameValue}[${propertyFieldValue}] = ${valueFieldValue}`,
                    execute(executor) {
                        const variable = executor.evaluate(variableNameValue);
                        const subject = variable ?? executor.inventory;
                        if (typeof(subject) === "object") {
                            executor.inventory.value = subject[propertyFieldValue];
                            const value = executor.evaluate(valueFormulaValue);
                                subject[propertyFieldValue] = value;
                        } else {
                            writerExecutor.reportError({
                                code: "WRONG_TYPE",
                                field: variableName,
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
        return command.variable !== undefined;
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
