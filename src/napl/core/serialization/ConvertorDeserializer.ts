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
import { SerializerConfig } from "./SerializerConfig";
import { MultiConvertor } from "../conversion/MultiConvertor";
import { PropConvertor } from "../conversion/PropConvertor";
import { ScenesConvertor } from "../conversion/ScenesConvertor";
import { SerialClass } from "./SerialClass";

const REGISTRY: SerialClass[] = [
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


export class Deserializer {
    instances: any[];
    registry: SerialClass[];
    constructor(...instances: any[]) {
        this.registry = REGISTRY;
        this.instances = instances;
    }

    deserialize(config: SerializerConfig) {
        const instance = this.instances.find(({constructor: {name}}) => name === config.type);
        if (instance) {
            return instance;
        }
        const Class = this.registry.find(Const => Const.name === config.type);
        if (!Class) {
            throw new Error("Invalid convertor type: " + config.type + ". Add it to Deserializer.ts");
        }
        return new Class(config.config, { deserializer: this });
    }
}