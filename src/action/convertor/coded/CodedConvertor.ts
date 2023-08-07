import { Action } from "../../actions/Action";
import { ConvertError } from "../../actions/error/errors";
import { ExecutorBase } from "../../execution/Executor";
import { Context, Convertor } from "../Convertor";
import { WriterContext } from "../writer/WriterContext";
import { WriterCommand } from "../writer/commands/WriterCommand";
import { WriterInventory } from "../writer/WriterInventory";
import { Validation } from "./CodedValidator";

interface ConverterConfig {
    field: string;
    validations?: Validation[];
    writerCommands?: WriterCommand[];
}

export class CodedConvertor extends Convertor {
    private field: string;
    private validations: Validation[];
    private writerCommands: WriterCommand[];

    constructor({ field, validations = [], writerCommands = [] }: ConverterConfig) {
        super();
        this.field = field;
        this.validations = validations;
        this.writerCommands = writerCommands;
    }

    validate(action: Action): boolean {
        return action[this.field] !== undefined;
    }

    convert(action: Action, context: Context): void {
        const writerContext: WriterContext = new WriterContext();
        this.writerCommands?.forEach(command => {
            const errors: ConvertError[] = [];
            writerContext.subConvertor.validationErrors(command, errors);
            if (errors.length) {
                throw new Error("Errors in conversion : " + JSON.stringify(errors));
            }
            writerContext.subConvertor.convert(command, writerContext);
        });
        const executor: ExecutorBase<WriterInventory> = new ExecutorBase<WriterInventory>({
            inventory: {
                action,
                context,
            },
            accumulator: writerContext.accumulator,
        });
        executor.executeUtilStop();
    }

    validationErrors(action: Action, errors: ConvertError[]): void {
        this.validations.forEach(({ field, type, error }) => {
            const fieldValue = action[field ?? this.field];
            switch (type) {
                case 'array':
                    if (!Array.isArray(fieldValue)) {
                        errors.push(error);
                    }
                    break;
                case 'string':
                    if (typeof(fieldValue) !== "string") {
                        errors.push(error);
                    }
                    break;
            }
        });
    }

}