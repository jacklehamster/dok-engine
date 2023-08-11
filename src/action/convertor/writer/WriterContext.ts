import { StepAccumulator } from "../../steps/StepAccumulator";
import { Context, Convertor } from "../Convertor";
import { MultiWriterConvertor } from "./WriterConvertor";
import { WriterCommand } from "./commands/WriterCommand";

export class WriterContext implements Context<WriterCommand> {
    accumulator: StepAccumulator = new StepAccumulator();
    subConvertor: Convertor<WriterCommand, WriterContext> = new MultiWriterConvertor();
}