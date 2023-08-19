import { Deserializer } from "./Deserializer";

describe('describe', () => {
    it('test deserialize', () => {
        const deserializer = new Deserializer();

        const convertor = deserializer.deserialize({
            type: "AccumulateConvertor",
        });

        console.log(convertor);
    });
});