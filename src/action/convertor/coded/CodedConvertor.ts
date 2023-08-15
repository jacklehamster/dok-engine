import { Action } from "../../actions/Action";
import { ConvertError } from "../../error/errors";
import { Context } from "../Convertor";
import { WriterContext } from "../writer/WriterContext";
import { WriterCommand } from "../writer/commands/WriterCommand";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { WriterExecutor } from "../writer/WriterExecutor";
import { BaseConvertor, BaseConvertorConfig } from "../base/BaseConvertor";

export interface ConvertorConfig extends BaseConvertorConfig {
    writerCommands?: WriterCommand[];
}

export class CodedConvertor<A extends Action = Action> extends BaseConvertor<A> {
    private writerCommands: WriterCommand[];

    constructor({ writerCommands = [], ...baseConfig }: ConvertorConfig) {
        super(baseConfig);
        this.writerCommands = writerCommands;
    }

    convert(action: A, context: Context): void {
        const writerContext: WriterContext = new WriterContext();
        const { accumulator, subConvertor } = writerContext;
        this.writerCommands?.forEach(command => {
            const errors: ConvertError[] = [];
            subConvertor.validationErrors(command, errors);
            if (errors.length) {
                throw new Error("Errors in conversion : " + JSON.stringify(errors));
            }
            subConvertor.convert(command, writerContext);
        });
        executeUntilStop(new WriterExecutor(accumulator, action, context));
    }
}