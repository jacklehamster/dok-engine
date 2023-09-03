import { SerializerConfig } from "./SerializerConfig";
import { SerialClass } from "./SerialClass";
import { CONVERTOR_REGISTRY } from "./ConvertorRegistry";


export class ConvertorDeserializer {
    instances: any[];
    registry: SerialClass[];
    constructor({ instances, registry }: { instances?: any[]; registry?: SerialClass[] } = {}) {
        this.registry = registry ?? CONVERTOR_REGISTRY;
        this.instances = instances ?? [];
    }

    deserialize(config: SerializerConfig) {
        const instance = this.instances.find(({constructor: {name}}) => name === config.type);
        if (instance) {
            return instance;
        }
        const Class = this.registry.find(({name}) => name === config.type);
        if (!Class) {
            throw new Error("Invalid convertor type: " + config.type + ". Add it to Deserializer.ts");
        }
        return new Class(config.config, { deserializer: this });
    }
}
