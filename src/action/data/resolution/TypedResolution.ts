import { resolveArray } from "./ArrayResolution";
import { resolveBoolean } from "./BooleanResolution";
import { resolveNumber } from "./NumberResolution";
import { resolveObject } from "./ObjectResolution";
import { resolveAny } from "./Resolution";
import { resolveString } from "./StringResolution";
import { ValueOf } from "./ValueOf";

export const resolveByType: Record<string, (resolution: any) => ValueOf<any>> = {
    "string": resolveString,
    "number": resolveNumber,
    "array": resolveArray,
    "boolean": resolveBoolean,
    "object": resolveObject,
    "any": resolveAny,
};