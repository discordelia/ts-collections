export declare type TraverseType = "INORDER" | "PREORDER" | "POSTORDER";
export declare class BinaryTree<T> {
    private comparator;
    private root;
    constructor(comparator: Function);
    contains(item: T): boolean;
    private containsRecursive;
    insert(item: T): void;
    private insertRecursive;
    isEmpty(): boolean;
    countNodes(): number;
    private countTreeNodes;
    delete(item: T): void;
    private deleteRecursive;
    find(predicate: (item: T) => boolean): T;
    private findRecursive;
    private findSmallestValue;
    forEach(action: (item: T) => void): void;
    private forEachRecursive;
    getRootData(): T;
    search(item: T): boolean;
    private searchTree;
    traverseAndMapToArray<R>(mapper: (item: T) => R, direction?: TraverseType): R[];
    traverseAndMorph<R>(morpher: (item: T) => R, comparator?: (i1: R, i2: R) => number): BinaryTree<R>;
    toArray(direction?: TraverseType): T[];
    private toInorderArray;
    private toPostorderArray;
    private toPreorderArray;
}
