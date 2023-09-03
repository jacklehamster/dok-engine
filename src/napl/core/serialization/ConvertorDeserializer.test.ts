import { ConvertorDeserializer } from "./ConvertorDeserializer";

describe('describe', () => {
    it('test deserialize', () => {
        const deserializer = new ConvertorDeserializer();

        const convertor = deserializer.deserialize({
            type: "AccumulateConvertor",
        });

        console.log(convertor);
    });
});