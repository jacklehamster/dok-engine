import { ConvertError } from "../../../../napl/core/error/errors";
import { StringResolution, resolveString } from "../../../data/resolution/StringResolution";
import { WriterContext } from "../WriterContext";
import { shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";
import { ArrayResolution, resolveArray } from "../../../data/resolution/ArrayResolution";
import { verifyType } from "../validation/verifyType";
import { evaluateArray } from "../../../utils/array-utils";
import { WriterExecutor } from "../WriterExecutor";
import { WriterBaseConvertor } from "../WriterBaseConvertor";

export interface StashCommand extends WriterBaseCommand {
    stash: ArrayResolution;
}

export class StashConvertor extends WriterBaseConvertor<StashCommand> {
    convert(command: StashCommand, writerContext: WriterContext): void {
        const stashConvertResolution = resolveArray(command.stash);
        writerContext.accumulator.add({
            description: `Convert: stash ${command.stash}.`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }
                const stashes = writerExecutor.evaluate(stashConvertResolution) as StringResolution[];
                const stashValues = stashes.map(resolution => resolveString(resolution));
                const stashResult = new Array(stashValues.length);

                const { context } = writerExecutor;
                context.accumulator.add({
                    description: `Execute: stash ${stashes}`,
                    execute(executor) {
                        evaluateArray(stashValues, stashResult, executor);
                        executor.stash(stashResult);
                    },
                });
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.stash !== undefined;
    }

    validationErrors(command: StashCommand, _context: WriterContext, errors: ConvertError[]): void {
        verifyType(command, "stash", ["array", "formula"], errors);
    }
}
