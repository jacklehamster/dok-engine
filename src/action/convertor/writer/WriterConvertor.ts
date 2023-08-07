import { MultiConvertor } from "../MultiConvertor";
import { WriterContext } from "./WriterContext";
import { WriterInventory } from "./WriterInventory";
import { AccumulateConvertor } from "./commands/Accumulate";
import { CallExternalConvertor } from "./commands/CallExternal";
import { SkipNextConvertor } from "./commands/ConditionSkipNext";
import { WriterCommand } from "./commands/WriterCommand";

export class MultiWriterConvertor extends MultiConvertor<WriterCommand, WriterInventory, WriterContext> {
    constructor() {
        super(new AccumulateConvertor(),
            new CallExternalConvertor(),
            new SkipNextConvertor(),
        );
    }    
}