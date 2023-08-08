import { AccumulateCommand } from "./Accumulate";
import { CallExternalCommand } from "./CallExternal";
import { CallCommand } from "./CallMethod";
import { SkipNextCommand } from "./ConditionSkipNext";
import { DebugConversionCommand } from "./DebugConversionCommand";
import { InventorySetCommand } from "./InventorySet";
import { JumpToLabelCommand } from "./JumpToLabel";
import { SaveLabelCommand } from "./SaveLabel";

export type WriterCommand = 
    |AccumulateCommand
    |CallExternalCommand
    |CallCommand
    |SkipNextCommand
    |SaveLabelCommand
    |JumpToLabelCommand
    |DebugConversionCommand
    |InventorySetCommand
;