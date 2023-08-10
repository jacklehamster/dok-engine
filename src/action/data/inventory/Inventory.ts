export type Inventory = Record<string, any> & {
    stash: Record<string, any>[];
};

export const EMPTY_INVENTORY = {stash:[]};