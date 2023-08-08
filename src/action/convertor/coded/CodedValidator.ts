import { ConvertError } from "../../error/errors";

type Type = "array"|"string"|"object";

export interface Validation {
    field?: string;
    type?: Type;
    error: ConvertError;
}
