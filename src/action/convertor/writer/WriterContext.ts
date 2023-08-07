import { StepAccumulator } from "../../steps/StepAccumulator";
import { Context, Convertor } from "../Convertor";
import { MultiWriterConvertor } from "./WriterConvertor";
import { WriterCommand } from "./commands/WriterCommand";
import { WriterInventory } from "./WriterInventory";

export class WriterContext implements Context<WriterCommand, WriterInventory> {
    accumulator: StepAccumulator<WriterInventory> = new StepAccumulator<WriterInventory>();
    subConvertor: Convertor<WriterCommand, WriterInventory, WriterContext> = new MultiWriterConvertor();
    externals = {};
}