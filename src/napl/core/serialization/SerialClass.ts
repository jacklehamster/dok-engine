import { SerializerConfig } from "./SerializerConfig";
import { Deserializer } from "./Deserializer";


export interface SerialClass<T = any> {
    new(config?: SerializerConfig["config"], dependencies?: { deserializer?: Deserializer; }): T;
}
