export type ObjectType = { [key:string]:BasicType };
export type ArrayType = BasicType[];
export type BasicType = undefined | null | string | number | boolean | ArrayType | ObjectType;
