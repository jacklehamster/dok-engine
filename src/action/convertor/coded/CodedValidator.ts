import { ConvertError } from "../../error/errors";

type Type = "array"|"string";

export interface Validation {
    field?: string;
    type?: Type;
    error: ConvertError;
}
