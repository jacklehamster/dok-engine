import { CodedConvertor } from "../../../action/convertor/coded/CodedConvertor";
import { ReConvertor } from "../../../action/convertor/reconvertor/ReConvertor";
import { AccumulateConvertor } from "../../../action/convertor/writer/commands/Accumulate";
import { CallConvertor } from "../../../action/convertor/writer/commands/CallMethod";
import { SkipNextConvertor } from "../../../action/convertor/writer/commands/ConditionSkipNext";
import { DebugConversionConvertor } from "../../../action/convertor/writer/commands/Debug";
import { InventorySetConvertor } from "../../../action/convertor/writer/commands/InventorySet";
import { JumpToLabelConvertor } from "../../../action/convertor/writer/commands/JumpToLabel";
import { RegisterMethodConvertor } from "../../../action/convertor/writer/commands/RegisterScript";
import { ReturnConvertor } from "../../../action/convertor/writer/commands/Return";
import { SaveLabelConvertor } from "../../../action/convertor/writer/commands/SaveLabel";
import { SpreadConvertor } from "../../../action/convertor/writer/commands/Spread";
import { StashConvertor } from "../../../action/convertor/writer/commands/Stash";
import { UnstashConvertor } from "../../../action/convertor/writer/commands/Unstash";
import { Convertor } from "../conversion/Convertor";
import { MultiConvertor } from "../conversion/MultiConvertor";
import { PropConvertor } from "../conversion/PropConvertor";
import { ScenesConvertor } from "../conversion/ScenesConvertor";
import { SerialClass } from "./SerialClass";

export const CONVERTOR_REGISTRY: SerialClass<Convertor<any, any>>[] = [
    AccumulateConvertor,
    CallConvertor,
    SkipNextConvertor,
    DebugConversionConvertor,
    InventorySetConvertor,
    JumpToLabelConvertor,
    RegisterMethodConvertor,
    ReturnConvertor,
    SaveLabelConvertor,
    SpreadConvertor,
    StashConvertor,
    UnstashConvertor,
    CodedConvertor,
    MultiConvertor,
    ReConvertor,
    ScenesConvertor,
    PropConvertor,
];
