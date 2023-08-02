import { Action } from "../Action";
import { LogAction } from "./LogAction";
import { Convertor } from "../../convertor/Convertor";
import { Validator } from "../../convertor/validators/Validator";

export class LogConvertor implements Convertor {
    convert(action: LogAction): void {
        console.log.apply(null, action.log);
    }
}

export class LogValidator implements Validator {
    validate(action: Action): boolean {
        return Array.isArray(action.log);
    }
}