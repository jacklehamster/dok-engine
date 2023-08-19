import { MULTI_ACTION_CONVERTOR } from "../../action/convertor/MultiActionConvertor";
import { MULTI_WRITER_CONVERTOR } from "../../action/convertor/writer/WriterConvertor";
import { Context } from "../../napl/core/conversion/Convertor";
import { INITIAL_CONVERTORS } from "../../napl/core/conversion/ConvertorsConvertor";
import { MULTI_ENTITY_CONVERTOR } from "../../napl/core/conversion/MultiEntityConvertor";
import { Aux } from "../Aux";
import { Workspace } from "./Workspace";

const CONFIG: Aux = {
    name: "Workspace1",
    convertors: [
        MULTI_ENTITY_CONVERTOR.serialize(),
        MULTI_ACTION_CONVERTOR.serialize(),
        MULTI_WRITER_CONVERTOR.serialize(),
    ],
    scenes: [
        {   
            name: "Scene1",
        },
    ],
};

describe('scenes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('convert scene', () => {
        const context: Context = { subject: new Workspace() };
        INITIAL_CONVERTORS.convert(CONFIG, context);
        context.subConvertor?.convert(CONFIG, context);
        console.log(context.subject);
    });
});
