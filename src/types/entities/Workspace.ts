import { Entity } from "./Entity";
import { Scene } from "./Scene";

export class Workspace extends Entity {
    private scenes: Scene[] = [];

    constructor() {
        super();
        this.root = this;
    }

    addScene(scene: Scene): void {
        this.scenes.push(scene);
    }
}
