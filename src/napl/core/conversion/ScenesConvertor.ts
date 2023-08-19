import { Aux } from "../../../types/Aux";
import { Scene } from "../../../types/entities/Scene";
import { Workspace } from "../../../types/entities/Workspace";
import { Context, Convertor } from "./Convertor";
import { SerializerConfig } from "../serialization/SerializerConfig";

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
            const scene = new Scene(workspace);
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