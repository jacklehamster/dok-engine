import { Action } from "../../actions/Action";
import { ActionContext } from "../ActionConvertor";
import { WriterContext } from "../writer/WriterContext";
import { WriterCommand } from "../writer/commands/WriterCommand";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { WriterExecutor } from "../writer/WriterExecutor";
import { BaseConvertor, BaseConvertorConfig } from "../base/BaseConvertor";

export interface CodedConvertorConfig extends BaseConvertorConfig {
    writerCommands: WriterCommand[];
}

export class CodedConvertor<A extends Action = Action> extends BaseConvertor<A> {
    private writerCommands: WriterCommand[];

    constructor(config: CodedConvertorConfig) {
        super(config);
        this.writerCommands = config.writerCommands;
    }

    convert(action: A, context: ActionContext): void {
        const writerContext: WriterContext = new WriterContext();
        const { accumulator, subConvertor } = writerContext;
        this.writerCommands?.forEach(command => {
            if (subConvertor.validate(command, writerContext)) {
                subConvertor.convert(command, writerContext);    
            }
        });
        executeUntilStop(new WriterExecutor(accumulator, action, context));
    }
}