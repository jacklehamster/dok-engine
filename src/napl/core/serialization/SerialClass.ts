import { SerializerConfig } from "./SerializerConfig";
import { Deserializer } from "./ConvertorDeserializer";


export interface SerialClass<T = any> {
    new(config?: SerializerConfig["config"], dependencies?: { deserializer?: Deserializer; }): T;
}
