import {AbstractSet, ICollection, ISet, ITree, RedBlackTree} from "../../imports";
import {Predicate} from "../shared/Predicate";
import {OrderComparator} from "../shared/OrderComparator";
import {Comparators} from "../shared/Comparators";

export class TreeSet<TElement> extends AbstractSet<TElement> implements ISet<TElement> {
    private readonly tree: ITree<TElement>;

    public constructor(
        iterable: Iterable<TElement> = [] as TElement[],
        comparator: OrderComparator<TElement> = Comparators.orderComparator
    ) {
        super(comparator);
        this.tree = new RedBlackTree<TElement>(comparator, iterable);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.tree;
    }

    public add(element: TElement): boolean {
        return this.tree.add(element);
    }

    public clear(): void {
        this.tree.clear();
    }

    public headSet(toElement: TElement, inclusive: boolean = false): ISet<TElement> {
        const enumerable = this.where(e => this.orderComparator(e, toElement) <= 0).skipLast(+!inclusive);
        return new TreeSet(enumerable, this.orderComparator);
    }

    public remove(element: TElement): boolean {
        return this.tree.remove(element);
    }

    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        return this.tree.removeAll(collection);
    }

    public removeIf(predicate: Predicate<TElement>): boolean {
        return this.tree.removeIf(predicate);
    }

    public retainAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean {
        return this.tree.retainAll(collection);
    }

    public size(): number {
        return this.tree.size();
    }

    public subSet(fromElement: TElement, toElement: TElement, fromInclusive: boolean = true, toInclusive: boolean = false): ISet<TElement> {
        const enumerable = this.where(e => this.orderComparator(e, fromElement) >= 0 && this.orderComparator(e, toElement) <= 0)
            .skip(+!fromInclusive).skipLast(+!toInclusive);
        return new TreeSet(enumerable, this.orderComparator);
    }

    public tailSet(fromElement: TElement, inclusive: boolean = false): ISet<TElement> {
        const enumerable = this.where(e => this.orderComparator(e, fromElement) >= 0).skip(+!inclusive);
        return new TreeSet(enumerable, this.orderComparator);
    }
}
