import { AccumulateCommand } from "./Accumulate";
import { CallCommand } from "./CallMethod";
import { SkipNextCommand } from "./ConditionSkipNext";
import { DebugConversionCommand } from "./Debug";
import { InventorySetCommand } from "./InventorySet";
import { JumpToLabelCommand } from "./JumpToLabel";
import { ReturnCommand } from "./Return";
import { SaveLabelCommand } from "./SaveLabel";
import { StashCommand } from "./Stash";
import { StateCommand } from "./State";
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
    |StateCommand
    |ReturnCommand
;