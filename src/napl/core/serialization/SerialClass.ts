import { SerializerConfig } from "./SerializerConfig";
import { ConvertorDeserializer } from "./ConvertorDeserializer";


export interface SerialClass<T = any> {
    new(config?: SerializerConfig["config"], dependencies?: { deserializer?: ConvertorDeserializer; }): T;
}
