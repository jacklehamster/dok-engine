import { SerializerConfig } from "../../../napl/core/serialization/SerializerConfig";
import { ActionConvertor } from "../ActionConvertor";
import { WriterContext } from "./WriterContext";
import { WriterCommand } from "./commands/WriterCommand";


export abstract class WriterBaseConvertor<A extends WriterCommand> extends ActionConvertor<A, WriterContext> {
    serialize(): SerializerConfig {
        return {
            type: this.type,
        };
    }
}
