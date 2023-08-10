import { ConvertError } from "../../../error/errors";
import { asArray } from "../../../utils/array-utils";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { shouldConvert } from "../convert-utils";
import { verifyType } from "../validation/verifyType";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { resolveAny } from "../../../data/resolution/Resolution";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { ArrayResolution } from "../../../data/resolution/ArrayResolution";
import { ObjectResolution } from "../../../data/resolution/ObjectResolution";

export interface CreateDoorCommand extends WriterBaseCommand {
    door: {
        name: StringResolution;
        actions: ArrayResolution | ObjectResolution;
    };
}

export class CreateDoorConvertor extends Convertor<CreateDoorCommand, WriterInventory, WriterContext> {
    convert(command: CreateDoorCommand, writerContext: WriterContext): void {
        const nameResolution = resolveString(command.door.name);
        const actionsResolution = resolveAny(command.door.actions);
        writerContext.accumulator.add({
            description: `Convert: Accumulate steps using the actions for door "${command.door.name}".`,
            execute(writerExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const nameConvertValue = writerExecutor.evaluate(nameResolution);
                const nameExecResolution = resolveString(nameConvertValue ?? "");
                const actions = writerExecutor.evaluate(actionsResolution);
                const { context } = writerExecutor.inventory;

                context.accumulator.add({
                    description: `Execute: Create door ${nameConvertValue}`,
                    execute(executor) {
                        const doorName = executor.evaluate(nameExecResolution);
                        const door = executor.createDoor(doorName ?? "");
                        asArray(actions).forEach(action => context.subConvertor.convert(action, {
                            subConvertor: context.subConvertor,
                            accumulator: door.accumulator,
                        }));
}
                });
            },
        });
    }

    validate(action: WriterCommand): boolean {
        return action.door !== undefined;
    }

    validationErrors(action: CreateDoorCommand, errors: ConvertError[]): void {
        verifyType(action.door, "name", ["string", "formula"], errors);
        verifyType(action.door, "actions", ["array", "object", "formula"], errors);
    }
}
