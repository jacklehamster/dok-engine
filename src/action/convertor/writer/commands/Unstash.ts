import { Convertor } from "../../Convertor";
import { WriterContext } from "../WriterContext";
import { WriterInventory } from "../WriterInventory";
import { shouldConvert } from "../convert-utils";
import { WriterBaseCommand } from "./WriterBaseCommand";
import { WriterCommand } from "./WriterCommand";

export interface UnstashCommand extends WriterBaseCommand {
    unstash: {};
}

export class UnstashConvertor extends Convertor<UnstashCommand, WriterInventory, WriterContext> {
    convert(command: UnstashCommand, writerContext: WriterContext): void {
        writerContext.accumulator.add({
            description: `Convert: unstash.`,
            execute(writerExecutor) {
                if (!shouldConvert(command, writerExecutor)) {
                    return;
                }

                const { context } = writerExecutor.inventory;
                context.accumulator.add({
                    description: `Execute: unstash`,
                    execute(executor) {
                        executor.unstash();
                    },
                });
            },
        });
    }

    validate(command: WriterCommand): boolean {
        return command.unstash !== undefined;
    }
}
