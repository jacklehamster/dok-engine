import { MultiConvertor } from "../MultiConvertor";
import { WriterContext } from "./WriterContext";
import { WriterInventory } from "./WriterInventory";
import { AccumulateConvertor } from "./commands/Accumulate";
import { CallConvertor } from "./commands/CallMethod";
import { SkipNextConvertor } from "./commands/ConditionSkipNext";
import { DebugConversionConvertor } from "./commands/DebugConversionCommand";
import { InventorySetConvertor } from "./commands/InventorySet";
import { JumpToLabelConvertor } from "./commands/JumpToLabel";
import { SaveLabelConvertor } from "./commands/SaveLabel";
import { WriterCommand } from "./commands/WriterCommand";

export class MultiWriterConvertor extends MultiConvertor<WriterCommand, WriterInventory, WriterContext> {
    constructor() {
        super(new AccumulateConvertor(),
            new CallConvertor(),
            new SkipNextConvertor(),
            new SaveLabelConvertor(),
            new JumpToLabelConvertor(),
            new DebugConversionConvertor(),
            new InventorySetConvertor(),
        );
    }
}
