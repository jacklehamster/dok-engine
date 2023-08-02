export type TypedArray = Float32Array | Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array;

export type ObjectType = { [key:string]:BasicTypes };
export type ArrayType = BasicTypes[];
export type BasicTypes = undefined | null | string | number | TypedArray | boolean | ArrayType | ObjectType;
