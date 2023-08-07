import { BasicType } from "../../data/types/basic-types";

export type ErrorCode = "WRONG_TYPE"|"MISSING_PROPERTY"|"TOO_MANY_PROPERTIES";

export type ConvertError = {
    code: ErrorCode;
    field?: string;
    [key: string]: BasicType;
}