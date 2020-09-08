export class Enumerable<T> implements IEnum<T> {
    private readonly iterator: EnumerableIterator<T>;

    public constructor(private data: Array<T> | IterableIterator<T>) {
        if (data instanceof Array) {
            this.iterator = function* () {
                for (const d of data) {
                    yield d;
                }
            };
        } else {
            this.iterator = () => data;
        }
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return this.iterator();
    }

    public static from<S>(source: Array<S>): Enumerable<S> {
        return new Enumerable<S>(source);
    }

    public all(predicate?: Predicate<T>): boolean {
        return new EnumerableCore(this.iterator).all(predicate);
    }

    public any(predicate?: Predicate<T>): boolean {
        return new EnumerableCore(this.iterator).any(predicate);
    }

    public append(item: T): IEnum<T> {
        return new EnumerableCore(this.iterator).append(item);
    }

    public average(selector?: Selector<T, number>): number {
        return new EnumerableCore(this.iterator).average(selector);
    }

    public concat(enumerable: IEnum<T>): IEnum<T> {
        return new EnumerableCore(this.iterator).concat(enumerable);
    }

    public contains(item: T, comparator?: Comparator<T>): boolean {
        return new EnumerableCore(this.iterator).contains(item, comparator);
    }

    public count(): number {
        return new EnumerableCore(this.iterator).count();
    }

    public distinct(comparator?: Comparator<T>): IEnum<T> {
        return new EnumerableCore(this.iterator).distinct(comparator);
    }

    public elementAt(index: number): T {
        return new EnumerableCore(this.iterator).elementAt(index);
    }

    public select<R>(selector: Selector<T, R>): IEnum<R> {
        return new EnumerableCore(this.iterator).select(selector);
    }

    public sum(selector: Selector<T, number>): number {
        return new EnumerableCore(this.iterator).sum(selector);
    }

    public union(enumerable: IEnum<T>, comparator?: Comparator<T>): IEnum<T> {
        return new EnumerableCore(this.iterator).union(enumerable, comparator);
    }

    public where(comparator: Predicate<T>): IEnum<T> {
        return new EnumerableCore(this.iterator).where(comparator);
    }

    public toArray(): T[] {
        return Array.from(this.iterator());
    }
}

class EnumerableCore<T> implements IEnum<T> {
    public static readonly defaultComparator: Comparator<any> = <E>(i1: E, i2: E) => i1 < i2 ? -1 : i1 > i2 ? 1 : 0;
    public constructor(private readonly iterator: EnumerableIterator<T>) {
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return this.iterator();
    }

    public all(predicate?: Predicate<T>): boolean {
        for (const d of this) {
            if (!predicate(d)) {
                return false;
            }
        }
        return true;
    }

    public any(predicate?: Predicate<T>): boolean {
        for (const d of this) {
            if (predicate(d)) {
                return true;
            }
        }
        return false;
    }

    public append(item: T): IEnum<T> {
        return new EnumerableCore(() => this.appendCore(item));
    }

    public average(selector?: Selector<T, number>): number {
        let total: number = 0;
        let count: number = 0;
        for (const d of this) {
            total += selector(d);
            count++;
        }
        return total / count;
    }

    public concat(enumerable: IEnum<T>): IEnum<T> {
        return new EnumerableCore(() => this.concatCore(enumerable));
    }

    public contains(item: T, comparator?: Comparator<T>): boolean {
        if (!comparator) {
            comparator = EnumerableCore.defaultComparator;
        }
        for (const d of this) {
            if(comparator(d, item) === 0) {
                return true;
            }
        }
        return false;
    }

    public count(): number {
        let count: number = 0;
        for (const d of this) {
            count++;
        }
        return count;
    }

    public distinct(comparator?: Comparator<T>): IEnum<T> {
        return new EnumerableCore(() => this.unionCore(Enumerable.from([]), comparator));
    }

    public elementAt(index: number): T {
        if (index < 0) {
            throw new Error("index is smaller than 0.");
        }
        let ix: number = 0;
        for (const item of this) {
            if (index === ix) {
                return item;
            }
            ++ix;
        }
    }

    public select<R>(selector: Selector<T, R>): IEnum<R> {
        return new EnumerableCore<R>(() => this.selectCore(selector));
    }

    public sum(selector: Selector<T, number>): number {
        let total: number = 0;
        for (const d of this) {
            total += selector(d);
        }
        return total;
    }

    public toArray(): Array<T> {
        return Array.from(this);
    }

    public union(enumerable: IEnum<T>, comparator?: Comparator<T>): IEnum<T> {
        return new EnumerableCore(() => this.unionCore(enumerable, comparator));
    }

    public where(predicate: Predicate<T>): IEnum<T> {
        return new EnumerableCore<T>(() => this.whereCore(predicate));
    }

    private* appendCore(item: T): IterableIterator<T> {
        yield* this;
        yield item;
    }

    private* concatCore(enumerable: IEnum<T>): IterableIterator<T> {
        yield* this;
        yield* enumerable;
    }

    private* selectCore<R>(selector: Selector<T, R>): IterableIterator<R> {
        for (const d of this) {
            yield selector(d);
        }
    }

    private* unionCore(enumerable: IEnum<T>, comparator?: Comparator<T>): IterableIterator<T> {
        const distinctList: Array<T> = [];
        if (!comparator) {
            comparator = EnumerableCore.defaultComparator;
        }
        for (const source of [this, enumerable]) {
            for (const item of source) {
                let exists = false;
                for (const existingItem of distinctList) {
                    if (comparator(item, existingItem) === 0) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    yield item;
                    distinctList.push(item);
                }
            }
        }
    }

    private* whereCore(predicate: Predicate<T>): IterableIterator<T> {
        for (const d of this) {
            if (predicate(d)) {
                yield d;
            }
        }
    }
}

interface IEnum<T> extends Iterable<T> {
    all(comparator?: Predicate<T>): boolean;

    any(comparator?: Predicate<T>): boolean;

    append(item: T): IEnum<T>;

    average(selector?: Selector<T, number>): number;

    concat(enumerable: IEnum<T>): IEnum<T>;

    contains(item: T, comparator?: Comparator<T>): boolean;

    count(): number;

    distinct(comparator?: Comparator<T>): IEnum<T>;

    elementAt(index: number): T;

    select<R>(selector: Selector<T, R>): IEnum<R>;

    sum(selector: Selector<T, number>): number;

    toArray(): T[];

    union(enumerable: IEnum<T>, comparator?: Comparator<T>): IEnum<T>;

    where(comparator: Predicate<T>): IEnum<T>;
}


interface Predicate<T> {
    (item: T): boolean;
}

interface Selector<T, R> {
    (item: T): R;
}

interface Comparator<T> {
    (item1: T, item2: T): number;
}

interface EnumerableIterator<T> {
    (): IterableIterator<T>;
}
