import { StepAccumulator } from "../../steps/StepAccumulator";
import { Context, Convertor } from "../Convertor";
import { MultiWriterConvertor } from "./WriterConvertor";
import { WriterCommand } from "./commands/WriterCommand";
import { WriterInventory } from "./WriterInventory";
import { Executor } from "../../execution/Executor";
import { resolveBoolean } from "../../data/resolution/BooleanResolution";
import { WriterBaseCommand } from "./commands/WriterBaseCommand";

export class WriterContext implements Context<WriterCommand, WriterInventory> {
    accumulator: StepAccumulator<WriterInventory> = new StepAccumulator<WriterInventory>();
    subConvertor: Convertor<WriterCommand, WriterInventory, WriterContext> = new MultiWriterConvertor();
    externals = {};

    shouldConvert(command: WriterBaseCommand, executor: Executor<WriterInventory>) {
        if (command.condition === undefined) {
            return true;
        }
        const conditionResult = executor.evaluate(resolveBoolean(command.condition));

        if (conditionResult == null) {
            executor.reportError({
                code: "INVALID_FORMULA",
                formula: command.condition,
            })    
        }

        if (!conditionResult) {
            return false;
        }
        return true;
    }
}