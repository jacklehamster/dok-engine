import { Aux } from "../../../types/Aux";
import { Workspace } from "../../../types/entities/Workspace";
import { Context, Convertor } from "./Convertor";
import { SerializerConfig } from "../serialization/SerializerConfig";
import { Entity } from "../../../types/entities/Entity";

export interface ScenesAux {
    scenes: Aux[];
}

export class ScenesConvertor extends Convertor<ScenesAux, Context<Aux, Workspace>> {
    validate(aux: Aux, context: Context<Aux, Workspace>): boolean {
        return aux.scenes && context.subject instanceof Workspace;
    }

    convert(aux: ScenesAux, context: Context<Aux, Workspace>): void {
        const workspace = context.subject;
        aux.scenes.forEach(child => {
            const scene = new Entity(workspace);
            workspace?.addScene(scene);
            context.subConvertor?.convert(child, { ...context, subject: scene });
        });
    }

    serialize(): SerializerConfig {
        return {
            type: this.type,
        };
    }
}