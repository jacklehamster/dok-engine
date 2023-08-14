import { MultiConvertor } from "../MultiConvertor";
import { WriterContext } from "./WriterContext";
import { AccumulateConvertor } from "./commands/Accumulate";
import { CallConvertor } from "./commands/CallMethod";
import { SkipNextConvertor } from "./commands/ConditionSkipNext";
import { DebugConversionConvertor } from "./commands/Debug";
import { InventorySetConvertor } from "./commands/InventorySet";
import { JumpToLabelConvertor } from "./commands/JumpToLabel";
import { SaveLabelConvertor } from "./commands/SaveLabel";
import { StashConvertor } from "./commands/Stash";
import { StateConvertor } from "./commands/State";
import { StepStackConvertor } from "./commands/StepStack";
import { UnstashConvertor } from "./commands/Unstash";
import { WriterCommand } from "./commands/WriterCommand";

export class MultiWriterConvertor extends MultiConvertor<WriterCommand, WriterContext> {
    constructor() {
        super(new AccumulateConvertor(),
            new CallConvertor(),
            new SkipNextConvertor(),
            new SaveLabelConvertor(),
            new JumpToLabelConvertor(),
            new DebugConversionConvertor(),
            new InventorySetConvertor(),
            new StashConvertor(),
            new UnstashConvertor(),
            new StateConvertor(),
            new StepStackConvertor(),
        );
    }
}
