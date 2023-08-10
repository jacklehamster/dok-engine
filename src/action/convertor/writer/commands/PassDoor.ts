import { ConvertError } from "../../../error/errors";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { ObjectResolution, resolveObject } from "../../../data/resolution/ObjectResolution";

export interface PassDoorCommand extends WriterBaseCommand {
    passDoor: {
        name: StringResolution;
        inventory?: ObjectResolution;
    };
}

export class PassDoorConvertor extends Convertor<PassDoorCommand, WriterInventory, WriterContext> {
    convert(command: PassDoorCommand, writerContext: WriterContext): void {
        const nameResolution = resolveString(command.passDoor.name);
        const inventoryResolution = resolveObject(command.passDoor.inventory ?? {});
        writerContext.accumulator.add({
            description: `Convert: Pass door "${command.passDoor.name}".`,
            execute(writerExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const nameConvertValue = writerExecutor.evaluate(nameResolution);
                const nameExecResolution = resolveString(nameConvertValue ?? "");
                const passedInventoryValue = writerExecutor.evaluate(inventoryResolution) ?? {};
                const passedInventoryResolution = resolveObject(passedInventoryValue);
                const { context } = writerExecutor.inventory;

                context.accumulator.add({
                    description: `Execute: Pass door "${nameConvertValue}"`,
                    execute(executor) {
                        const doorName = executor.evaluate(nameExecResolution);
                        if (doorName) {
                            const passedInventory = executor.evaluate(passedInventoryResolution) ?? {};
                            executor.passDoor(doorName, passedInventory);    
                        } else {
                            executor.reportError({
                                code: "INVALID_DOOR",
                            });
                        }
                    }
                });
            },
        });
    }

    validate(action: WriterCommand): boolean {
        return action.passDoor !== undefined;
    }

    validationErrors(action: PassDoorCommand, errors: ConvertError[]): void {
        verifyType(action.passDoor, "name", ["string", "formula"], errors);
        verifyType(action.passDoor, "inventory", ["object", "undefined", "formula"], errors);
    }
}