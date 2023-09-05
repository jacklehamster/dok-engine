import { Entity } from "./Entity";

export class Workspace extends Entity {
    private scenes: Entity[] = [];

    constructor() {
        super();
        this.root = this;
    }

    addScene(scene: Entity): void {
        this.scenes.push(scene);
    }
}
