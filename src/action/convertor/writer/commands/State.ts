import { ConvertError } from "../../../error/errors";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { verifyType } from "../validation/verifyType";
import { WriterExecutor } from "../WriterExecutor";
import { ObjectResolution, resolveObject } from "../../../data/resolution/ObjectResolution";

export interface StateCommand extends WriterBaseCommand {
    state: "push" | "pop";
    parameters?: ObjectResolution;
}

export class StateConvertor extends Convertor<StateCommand, WriterContext> {
    convert(command: StateCommand, writerContext: WriterContext): void {
        const inventoryResolution = resolveObject(command.parameters ?? {});
        writerContext.accumulator.add({
            description: `Convert: state ${command.state}.`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }

                const { context } = writerExecutor;
                const passedInventoryValue = writerExecutor.evaluate(inventoryResolution) ?? {};
                const passedInventoryResolution = resolveObject(passedInventoryValue);

                context.accumulator.add({
                    description: `Execute: state ${command.state}`,
                    execute(executor) {
                        if (command.state === "pop") {
                            executor.unstash(true);
                        } else if (command.state === "push") {
                            const passedInventory = executor.evaluate(passedInventoryResolution) ?? {};
                            executor.pushState(passedInventory);
                        }
                    },
                });
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.state !== undefined;
    }

    validationErrors(command: StateCommand, errors: ConvertError[]): void {
        verifyType(command, "state", ["string"], errors);
    }
}
