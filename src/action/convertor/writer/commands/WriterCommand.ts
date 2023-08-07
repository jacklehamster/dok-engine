import { AccumulateCommand } from "./Accumulate";
import { CallExternalCommand } from "./CallExternal";
import { SkipNextCommand } from "./ConditionSkipNext";
import { JumpToLabelCommand } from "./JumpToLabel";
import { SaveLabelCommand } from "./SaveLabel";

export type WriterCommand = 
    AccumulateCommand
    |CallExternalCommand
    |SkipNextCommand
    |SaveLabelCommand
    |JumpToLabelCommand
;