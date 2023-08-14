type Type = "array"|"string"|"object"|"undefined"|"number"|"function"|"bigint"|"boolean";

export interface Validation {
    field?: string;
    types?: Type[];
    defined?: boolean;
}
