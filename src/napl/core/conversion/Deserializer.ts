import { CodedConvertor } from "../../../action/convertor/coded/CodedConvertor";
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
import { Convertor, ConvertorConfig } from "./Convertor";
import { MultiConvertor } from "./MultiConvertor";

const CONVERTOR_REGISTRY: {
    new (config?: ConvertorConfig["config"], deserializer?: Deserializer): Convertor;
}[] = [
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
];


export class Deserializer {
    deserialize(config: ConvertorConfig) {
        const ConvertorClass = CONVERTOR_REGISTRY.find(Const => {
            return Const.name === config.type;
        });
        if (!ConvertorClass) {
            throw new Error("Invalid convertor type: " + config.type);
        }
        return new ConvertorClass(config.config, this);
    }
}