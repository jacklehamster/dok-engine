import { ConvertorConfig } from "../../../napl/core/conversion/Convertor";
import { ActionConvertor } from "../ActionConvertor";
import { WriterContext } from "./WriterContext";
import { WriterCommand } from "./commands/WriterCommand";


export abstract class WriterBaseConvertor<A extends WriterCommand> extends ActionConvertor<A, WriterContext> {
    serialize(): ConvertorConfig {
        return {
            type: this.type,
        };
    }
}
