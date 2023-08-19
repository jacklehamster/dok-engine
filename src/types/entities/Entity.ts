import { Workspace } from "./Workspace";

export class Entity {
    root?: Workspace;
    name?: string;
    type?: string = this.constructor.name;

    onStart?(): void;

    constructor(parent?: Entity) {
        this.root = parent?.root;
    }
}

export type EntityKey = keyof Entity;