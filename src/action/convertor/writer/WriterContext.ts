import { StepAccumulator } from "../../steps/StepAccumulator";
import { ActionContext, ActionConvertor } from "../ActionConvertor";
import { MULTI_WRITER_CONVERTOR } from "./WriterConvertor";
import { WriterCommand } from "./commands/WriterCommand";

export class WriterContext implements ActionContext<WriterCommand> {
    accumulator: StepAccumulator = new StepAccumulator();
    subConvertor: ActionConvertor<WriterCommand, WriterContext> = MULTI_WRITER_CONVERTOR;
}