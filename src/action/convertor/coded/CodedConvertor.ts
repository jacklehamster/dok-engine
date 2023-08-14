import { Action } from "../../actions/Action";
import { ConvertError } from "../../error/errors";
import { Context, Convertor } from "../Convertor";
import { WriterContext } from "../writer/WriterContext";
import { WriterCommand } from "../writer/commands/WriterCommand";
import { Validation } from "./CodedValidator";
import { executeUntilStop } from "../../execution/utils/execution-utils";
import { WriterExecutor } from "../writer/WriterExecutor";
import { verifyDefined, verifyType } from "../writer/validation/verifyType";

interface ConverterConfig {
    priority?: number;
    field: string;
    validations?: Validation[];
    writerCommands?: WriterCommand[];
}

export class CodedConvertor<A extends Action = Action> extends Convertor<A> {
    private field: string;
    private validations: Validation[];
    private writerCommands: WriterCommand[];

    constructor({ field, priority = 0, validations = [], writerCommands = [] }: ConverterConfig) {
        super();
        this.priority = priority,
        this.field = field;
        this.validations = validations;
        this.writerCommands = writerCommands;
    }

    validate(action: Action): boolean {
        return action[this.field] !== undefined;
    }

    convert(action: A, context: Context): void {
        const writerContext: WriterContext = new WriterContext();
        this.writerCommands?.forEach(command => {
            const errors: ConvertError[] = [];
            writerContext.subConvertor.validationErrors(command, errors);
            if (errors.length) {
                throw new Error("Errors in conversion : " + JSON.stringify(errors));
            }
            writerContext.subConvertor.convert(command, writerContext);
        });
        executeUntilStop(new WriterExecutor(
            writerContext.accumulator,
            action,
            context));
    }

    validationErrors(action: A, errors: ConvertError[]): void {
        this.validations.forEach(({ field, types, defined }) => {
            if (!field) {
                return;
            }
            if (types) {
                verifyType(action, field, types, errors);
            }
            if (defined) {
                verifyDefined(action, field, errors);
            }
        });
    }

}