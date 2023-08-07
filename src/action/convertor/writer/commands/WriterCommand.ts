import { AccumulateCommand } from "./Accumulate";
import { CallExternalCommand } from "./CallExternal";
import { SkipNextCommand } from "./ConditionSkipNext";

export type WriterCommand = AccumulateCommand|CallExternalCommand|SkipNextCommand;