export abstract class BaseObjPool<T> {
    abstract recycle(elem?: T): void;
    abstract get(): T;

    cleanup(elem: T): T {
        this.recycle(elem);
        return this.get();
    }
}

export class ObjPool<T> {
    private factory: () => T;
    private clean: (elem: T) => void;
    private pool: T[] = [];

    constructor(factory: () => T, clean: (elem: T) => void = () => {}) {
        this.factory = factory;
        this.clean = clean;
    }

    recycle(elem?: T) {
        if (elem) {
            this.clean(elem);
            this.pool.push(elem);    
        }
    }

    get(): T {
        return this.pool.pop() ?? this.factory();
    }
}

export const OBJECT_POOL = new ObjPool<Record<string, any>>(
    () => ({}),
    obj => {
        for (let i in obj) {
            delete obj[i];
        }
    },
);