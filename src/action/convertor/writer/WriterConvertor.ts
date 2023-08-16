import { MultiConvertor } from "../MultiConvertor";
import { WriterContext } from "./WriterContext";
import { AccumulateConvertor } from "./commands/Accumulate";
import { CallConvertor } from "./commands/CallMethod";
import { SkipNextConvertor } from "./commands/ConditionSkipNext";
import { DebugConversionConvertor } from "./commands/Debug";
import { InventorySetConvertor } from "./commands/InventorySet";
import { JumpToLabelConvertor } from "./commands/JumpToLabel";
import { RegisterMethodConvertor } from "./commands/RegisterScript";
import { ReturnConvertor } from "./commands/Return";
import { SaveLabelConvertor } from "./commands/SaveLabel";
import { SpreadConvertor } from "./commands/Spread";
import { StashConvertor } from "./commands/Stash";
import { UnstashConvertor } from "./commands/Unstash";
import { WriterCommand } from "./commands/WriterCommand";

export class MultiWriterConvertor extends MultiConvertor<WriterCommand, WriterContext> {
    constructor() {
        super(
            new AccumulateConvertor(),
            new CallConvertor(),
            new SkipNextConvertor(),
            new SaveLabelConvertor(),
            new JumpToLabelConvertor(),
            new DebugConversionConvertor(),
            new InventorySetConvertor(),
            new StashConvertor(),
            new UnstashConvertor(),
            new ReturnConvertor(),
            new RegisterMethodConvertor(),
            new SpreadConvertor(),
        );
    }
}
