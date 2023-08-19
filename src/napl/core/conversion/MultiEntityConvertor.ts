import { Aux } from "../../../types/Aux";
import { ConvertorsConvertor } from "./ConvertorsConvertor";
import { MultiConvertor } from "./MultiConvertor";
import { PropConvertor } from "./PropConvertor";
import { ScenesConvertor } from "./ScenesConvertor";

export const MULTI_ENTITY_CONVERTOR = new MultiConvertor<Aux>([
    new ConvertorsConvertor(),
    new ScenesConvertor(),
    new PropConvertor({ field: "name", type: "string" }),
]);