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
    variable: StringResolution;
    value: Resolution;
}

export class InventorySetConvertor extends Convertor<InventorySetCommand, WriterInventory, WriterContext> {
    convert(command: InventorySetCommand, writerContext: WriterContext): void {
        const variableNameField = resolveString(command.variable);
        const valueFormulaField = resolveAny(command.value);
        writerContext.accumulator.add({
            description: `Convert: Update "${command.variable}" to ${command.value}.`,
            execute(writerExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const variableNameFieldValue = writerExecutor.evaluate(variableNameField);
                if (variableNameFieldValue) {
                    const variableNameValue = resolveString(variableNameFieldValue);
                    const valueFieldValue = writerExecutor.evaluate(valueFormulaField);
                    const valueFormulaValue = resolveAny(valueFieldValue);
                    const { context } = writerExecutor.inventory;
                    context.accumulator.add({
                        description: `Execute: ${variableNameFieldValue} = ${valueFieldValue}`,
                        execute(executor) {
                            const variable = executor.evaluate(variableNameValue);
                            const value = executor.evaluate(valueFormulaValue);
                            if (variable) {
                                executor.inventory[variable] = value;
                            } else {
                                writerExecutor.reportError({
                                    code: "INVALID_FORMULA",
                                    formula: variableNameFieldValue,
                                });            
                            }
                        },
                    });
                } else {
                    writerExecutor.reportError({
                        code: "INVALID_FORMULA",
                        formula: command.variable,
                    });
                }
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
