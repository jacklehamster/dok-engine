import { BasicType } from "../../../types/basic-types";

export type ErrorCode = "WRONG_TYPE"|"MISSING_PROPERTY"|"TOO_MANY_PROPERTIES"|"INVALID_FORMULA"|"DUPLICATE_LABEL"|"INVALID_LABEL"|"INVALID_STATE"|"INVALID_DOOR";

export type ConvertError = {
    code: ErrorCode;
    field?: string;
    [key: string]: BasicType;
}