class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class LinkedList {
    constructor(val) {
        this.head = new ListNode(val);
        this.tail = this.head;
    }

    push(nextNode) {
        nextNode.next = this.tail;
        this.tail = nextNode;
    }
}

export { ListNode, LinkedList };