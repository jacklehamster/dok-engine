import { AccumulateCommand } from "./Accumulate";
import { CallCommand } from "./CallMethod";
import { SkipNextCommand } from "./ConditionSkipNext";
import { DebugConversionCommand } from "./Debug";
import { InventorySetCommand } from "./InventorySet";
import { JumpToLabelCommand } from "./JumpToLabel";
import { RegisterMethodCommand } from "./RegisterScript";
import { ReturnCommand } from "./Return";
import { SaveLabelCommand } from "./SaveLabel";
import { SpreadCommand } from "./Spread";
import { StashCommand } from "./Stash";
import { UnstashCommand } from "./Unstash";

export type WriterCommand = 
    |AccumulateCommand
    |CallCommand
    |SkipNextCommand
    |SaveLabelCommand
    |JumpToLabelCommand
    |DebugConversionCommand
    |InventorySetCommand
    |StashCommand
    |UnstashCommand
    |ReturnCommand
    |RegisterMethodCommand
    |SpreadCommand
;