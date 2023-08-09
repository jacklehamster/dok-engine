import { ConvertError } from "../../../error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { ArrayResolution, resolveArray } from "../../../data/resolution/ArrayResolution";
import { verifyType } from "../validation/verifyType";

export interface StashCommand extends WriterBaseCommand {
    stash: ArrayResolution;
}

export class StashConvertor extends Convertor<StashCommand, WriterInventory, WriterContext> {
    convert(command: StashCommand, writerContext: WriterContext): void {
        const stashConvertResolution = resolveArray(command.stash);
        writerContext.accumulator.add({
            description: `Convert: stash ${command.stash}.`,
            execute(writerExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const stashes = writerExecutor.evaluate(stashConvertResolution) as StringResolution[];
                const stashValues = stashes.map(resolution => resolveString(resolution));
                const stashResult = new Array(stashValues.length);

                const { context } = writerExecutor.inventory;
                context.accumulator.add({
                    description: `Execute: stash ${stashes}`,
                    execute(executor) {
                        executor.evaluateArray(stashValues, stashResult);
                        executor.stash(stashResult);
                    },
                });
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.stash !== undefined;
    }

    validationErrors(command: StashCommand, errors: ConvertError[]): void {
        verifyType(command, "stash", ["array"], errors);
    }
}
