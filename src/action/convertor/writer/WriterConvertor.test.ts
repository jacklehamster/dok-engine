import { ConvertorDeserializer } from "../../../napl/core/serialization/ConvertorDeserializer";
import { MULTI_WRITER_CONVERTOR } from "./WriterConvertor";

describe('WriterConvertor', () => {
    it('serialize', () => {
        const serialized = MULTI_WRITER_CONVERTOR.serialize();
        const deserializer = new ConvertorDeserializer();
        const deserialized = deserializer.deserialize(serialized);
        expect(deserialized.serialize()).toEqual(serialized);
    });
});