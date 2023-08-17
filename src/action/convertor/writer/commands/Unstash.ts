import { WriterContext } from "../WriterContext";
import { WriterBaseConvertor } from "../WriterBaseConvertor";
import { WriterExecutor } from "../WriterExecutor";
import { shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";

export interface UnstashCommand extends WriterBaseCommand {
    unstash: {};
}

export class UnstashConvertor extends WriterBaseConvertor<UnstashCommand> {
    convert(command: UnstashCommand, writerContext: WriterContext): void {
        writerContext.accumulator.add({
            description: `Convert: unstash.`,
            execute(writerExecutor: WriterExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }

                const { context } = writerExecutor;
                context.accumulator.add({
                    description: `Execute: unstash`,
                    execute(executor) {
                        executor.unstash(false);
                    },
                });
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.unstash !== undefined;
    }
}
