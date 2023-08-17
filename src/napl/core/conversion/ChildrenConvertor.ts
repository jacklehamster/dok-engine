import { Aux } from "../../../types/Aux";
import { Entity } from "../../../types/Entity";
import { Obj } from "../../../types/basic-types";
import { Context, Convertor, ConvertorConfig } from "./Convertor";

export interface ChildrenAux {
    children: Obj[];
}

export class ChildrenConvertor extends Convertor<ChildrenAux> {
    validate(aux: Aux): boolean {
        return aux.children?.length;
    }

    convert(aux: ChildrenAux, context: Context): void {
        const subject = context.subject;
        const children: Entity[] = [];
        subject.children = children;
        aux.children.forEach(child => {
            const childSubject = {};
            children.push(childSubject);
            context.subConvertor.convert(child, { ...context, subject: childSubject });
        });
    }

    serialize(): ConvertorConfig {
        return {
            type: this.type,
        };
    }
}