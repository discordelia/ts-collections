import { expect } from "chai";
import { BinaryTree } from "../../src/tree/BinaryTree";
import { BinarySearchTree } from "../../src/tree/BinarySearchTree";
import { List } from "../../src/list/List";
import { IList } from "../../src/list/IList";
import {describe, it} from "mocha";
import {IQueue} from "../../src/queue/IQueue";
import {ITree} from "../../src/tree/ITree";

class Person {
    Name: string;
    Surname: string;
    Age: number;
    constructor(name: string, surname: string, age: number) {
        this.Name = name;
        this.Surname = surname;
        this.Age = age;
    }
    public toString(): string {
        return `${this.Name} ${this.Surname} (${this.Age})`;
    }
}

describe("BinaryTree", () => {
    const person: Person     = new Person("Alice", "Rivermist", 23);
    const person2: Person    = new Person("Mel", "Bluesky", 9);
    const person3: Person    = new Person("Senna", "Hikaru", 10);
    const person4: Person    = new Person("Lenka", "Polakova", 16);
    const person5: Person    = new Person("Jane", "Green", 33);
    const ageComparator      = (p1: Person, p2: Person) => p1.Age - p2.Age;
    const nameComparator     = (p1: Person, p2: Person) => p1.Name.localeCompare(p2.Name);
    describe("#add()", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
        it("should return true", () => {
            const added = tree.add(person3);
            expect(added).to.eq(true);
        });
        it("should return false", () => {
            const added = tree.add(person);
            expect(added).to.eq(false);
        });
    });
    describe("#clear()", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should clear the tree", () => {
            tree.clear();
            expect(tree.size()).to.eq(0);
        });
        it("should not invalidate the tree", () => {
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
            tree.clear();
            tree.insert(person);
            expect(tree.size()).to.eq(1);
            expect(tree.getRootData()).to.eq(person);
        });
    });
    describe("#contains()", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should return true", () => {
            expect(tree.contains(person3)).to.eq(true);
        });
        it("should return false", () => {
            expect(tree.contains(person4)).to.eq(false);
        });
    });
    describe("#delete()", () => {
        const tree = new BinaryTree<Person>(nameComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
        it("should delete person from tree", () => {
            tree.delete(person);
            expect(tree.size()).to.eq(4);
        });
        it("should not have 'Alice' at root", () => {
            expect(tree.toArray()[0].Name).to.not.eq("Alice");
        });
        it("should return set root to null", () => {
            const nullTree = new BinaryTree<Person>(ageComparator);
            nullTree.delete(person);
            expect(nullTree.getRootData()).to.eq(null);
        });
        it("should return set root to null", () => {
            const numTree = new BinaryTree<number>((n1: number, n2: number) => n1-n2);
            numTree.insert(2);
            numTree.insert(1);
            numTree.delete(1);
            expect(numTree.size()).to.eq(1);
        });
        it("should add 100 random number and then delete them randomly", () => {
            const numTree = new BinaryTree<number>((n1: number, n2: number) => n1-n2);
            const randArrayGenerator = (length: number) => {
                var arr = []
                while(arr.length < length){
                    var r = Math.floor(Math.random()*100) + 1;
                    if(arr.indexOf(r) === -1) arr.push(r);
                }
                return arr;
            }
            const randArray = randArrayGenerator(100);
            randArray.forEach(n => numTree.insert(n));
            expect(numTree.size()).to.eq(100);
            while (randArray.length != 0) {
                var rand = randArray[~~(Math.random() * randArray.length)];
                randArray.splice(randArray.indexOf(rand), 1);
                numTree.delete(rand);
            }
            expect(numTree.size()).to.eq(0);
        });
    });
    describe("#find()", () => {
        const tree = new BinaryTree<Person>(nameComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
        it("should return person with name 'Lenka'", () => {
            const lenka = tree.find(p => p.Name === 'Lenka');
            expect(lenka.Name).to.eq('Lenka');
        });
        it("should not return a person with name 'Mirei'", () => {
            const mirei = tree.find(p => p.Name === 'Mirei');
            expect(mirei).to.eq(null);
        });
        it("should return person with age 9", () => {
            const mel = tree.find(p => p.Age === 9);
            expect(mel.Age).to.eq(9);
            expect(mel.Name).to.eq('Mel');
        });
        it("should return null", () => {
            const nullTree = new BinaryTree<Person>(ageComparator);
            const result = nullTree.find(p => p.Age > 9);
            expect(result).to.eq(null);
        });
    });
    describe("#forEach()", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        const people = [person2, person3, person, person5];
        let index    = 0;
        it("should act on tree items inorderly", () => {
            tree.forEach(p => {
                expect(p.Name).to.eq(people[index++].Name);
            });
        });
        it("should not immediately quit looping", () => {
            const nullTree = new BinaryTree<Person>(ageComparator);
            nullTree.forEach(p => p.Age+=100);
            expect(nullTree.getRootData()).to.eq(null);
        });
    });
    describe("#getNodeCount()", () => {
        it("should return 0", () => {
            const tree = new BinaryTree<Person>(ageComparator);
            expect(tree.size()).to.eq(0);
        });
        it("should return 3", () => {
            const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            expect(tree.size()).to.eq(3);
        });
    });
    describe("#insert()", () => {
        const tree = new BinaryTree<Person>(nameComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
        it("should insert person to tree", () => {
            expect(tree.size()).to.eq(5);
        });
        it("should have 'Alice' at root", () => {
            expect(tree.getRootData().Name).to.eq("Alice");
        });
        it("should not add same item twice", () => {
            const tree = new BinaryTree<number>((n1: number, n2: number) => n1 - n2);
            tree.insert(1);
            tree.insert(1);
            expect(tree.size()).to.eq(1);
        });
    });
    describe("#isEmpty()", () => {
        it("should return true", () => {
            const tree = new BinaryTree<Person>(ageComparator);
            expect(tree.isEmpty()).to.eq(true);
        });
        it("should return false", () => {
            const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            expect(tree.isEmpty()).to.eq(false);
        });
    });
    describe("#remove()", () => {
        const tree = new BinaryTree<Person>(nameComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
        it("should delete person from tree", () => {
            tree.remove(person);
            expect(tree.size()).to.eq(4);
        });
        it("should not have 'Alice' at root", () => {
            expect(tree.toArray()[0].Name).to.not.eq("Alice");
        });
        it("should return true", () => {
            const deleted = tree.remove(person2);
            expect(deleted).to.eq(true);
            expect(tree.size()).to.eq(3);
        });
        it("should return false", () => {
            const deleted = tree.remove(person);
            expect(deleted).to.eq(false);
            expect(tree.size()).to.eq(3);
        });
    });
    describe("#search()", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should return true", () => {
            expect(tree.search(person3)).to.eq(true);
        });
        it("should return false", () => {
            expect(tree.search(person4)).to.eq(false);
        });
        it("should return false if tree root is null", () => {
            const nullTree = new BinaryTree<Person>(ageComparator);
            const result = nullTree.search(person);
            expect(result).to.eq(false);
        });
    });
    describe("#traverseAndMapToArray(): INORDER", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should have 529 at index: 2", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "INORDER");
            expect(result[2]).to.eq(529);
        });
        it("should have correct mapped values", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "INORDER");
            expect(result[0]).to.eq(81);
            expect(result[1]).to.eq(100);
            expect(result[2]).to.eq(529);
            expect(result[3]).to.eq(1089);
        });
    });
    describe("#traverseAndMapToArray(): PREORDER", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should have 100 at index: 2", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "PREORDER");
            expect(result[2]).to.eq(100);
        });
        it("should have correct mapped values", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "PREORDER");
            expect(result[0]).to.eq(529);
            expect(result[1]).to.eq(81);
            expect(result[2]).to.eq(100);
            expect(result[3]).to.eq(1089);
        });
    });
    describe("#traverseAndMapToArray(): POSTORDER", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should have 1089 at index: 2", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "POSTORDER");
            expect(result[2]).to.eq(1089);
        });
        it("should have correct mapped values", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "POSTORDER");
            expect(result[0]).to.eq(100);
            expect(result[1]).to.eq(81);
            expect(result[2]).to.eq(1089);
            expect(result[3]).to.eq(529);
        });
    });
    describe("#toArray(): INORDER", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should return an array with a size of 4", () => {
            let people: Person[] = [];
            people = tree.toArray();
            expect(people.length).to.eq(4);
        });
        it("should have person with age '9' (Mel) at index: 0", () => {
            let people: Person[] = [];
            people = tree.toArray();
            expect(people[0].Age).to.eq(9);
        });
        it("should have people at correct indices", () => {
            let people: Person[] = [];
            people = tree.toArray();
            expect(people[0].Age).to.eq(9);
            expect(people[1].Age).to.eq(10);
            expect(people[2].Age).to.eq(23);
            expect(people[3].Age).to.eq(33);
        });
        it("should return empty array", () => {
            let people: Person[] = [];
            tree.clear();
            people = tree.toArray();
            expect(people.length).to.eq(0);
        });
    });
    describe("#Count getter", () => {
        const tree: ITree<string> = new BinaryTree();
        tree.insert("Alice");
        tree.insert("Rei");
        tree.insert("Misaki");
        it("should have the count of 3", () => {
            expect(tree.Count).to.eq(3);
            expect(tree.Count).to.eq(tree.size());
        });
        it("should have the count of 2", () => {
            tree.remove("Alice");
            expect(tree.Count).to.eq(2);
            expect(tree.Count).to.eq(tree.size());
        });
        it("should have the count of 5", () => {
            tree.insert("Alice");
            tree.insert("Yuzuha");
            tree.insert("Megumi");
            expect(tree.Count).to.eq(5);
            expect(tree.Count).to.eq(tree.size());
        });
        it("should throw an error if assigned", () => {
            // @ts-ignore
            expect(() => tree.Count = 10).to.throw();
        });
    });
    describe("#for-of loop", () => {
        const tree = new BinaryTree<number>();
        tree.insert(50);
        tree.insert(20);
        tree.insert(10);
        tree.insert(22);
        const numArray: number[] = [];
        for (const num of tree) {
            numArray.push(num);
        }
        it("should loop over the tree", () => {
            expect(numArray).to.include(10);
            expect(numArray).to.include(20);
            expect(numArray).to.include(50);
            expect(numArray).to.include(22);
            expect(numArray).to.not.include(-1)
        });
        it("should have four items", () => {
            expect(numArray.length).to.eq(4);
        });
        it("should loop over the tree inorder-ly", () => {
            expect(numArray[0]).to.eq(10);
            expect(numArray[1]).to.eq(20);
            expect(numArray[2]).to.eq(22);
            expect(numArray[3]).to.eq(50);
        });
    });
});
