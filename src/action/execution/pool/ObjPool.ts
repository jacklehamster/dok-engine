export class ObjPool<T> {
    factory: () => T;
    clean: (elem: T) => void;
    pool: T[] = [];

    constructor(factory: () => T, clean: (elem: T) => void = () => {}) {
        this.factory = factory;
        this.clean = clean;
    }

    recycle(elem: T) {
        this.clean(elem);
        this.pool.push(elem);
    }

    get(): T {
        return this.pool.pop() ?? this.factory();
    }
}