class Node {
            constructor(data) {
                this.data = data;
                this.left = null;
                this.right = null;
            }
        }
        class Tree {
            constructor(arr) {
                this.arr = arr;
                this.root = this.buildTree();
            }
            buildTree() {
                const set = new Set()
                for(let i of this.arr) {
                    set.add(i);
                }
                this.arr = Array.from(set);
                for(let i = 0;i<this.arr.length-1;i++) {
                    let pos = i;
                    for(let j=i+1;j<this.arr.length;j++) {
                        if(this.arr[j]<this.arr[pos]) pos = j;
                    }
                    let temp = this.arr[i];
                    this.arr[i] = this.arr[pos];
                    this.arr[pos] = temp;
                }
                return this.sortedArrayToBST(this.arr, 0, this.arr.length - 1);
            }
            sortedArrayToBST(arr, start, end) {
                if(start > end) return null;
                let mid = start + Math.floor((end-start) / 2);
                let root = new Node(arr[mid]);
                root.left = this.sortedArrayToBST(arr, start, mid-1);
                root.right = this.sortedArrayToBST(arr, mid+1, end);
                return root;
            }
            prettyPrint = (node, prefix = '', isLeft = true) => {
                if (node === null) {
                    return;
                }
                if (node.right !== null) {
                    this.prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
                }
                console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
                if (node.left !== null) {
                    this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
                }
            };
            insert(key) {
                let temp = this.root;
                if(temp == null) {
                    this.root = new Node(key);
                    this.arr.push(key);
                    return
                }
                let parent = null;
                while(temp != null) {
                    parent = temp;
                    if(key<temp.data) {
                        temp = temp.left;
                    }
                    else if(key>temp.data) {
                        temp = temp.right;
                    } else return temp;
                }
                if(key<parent.data) {
                    parent.left = new Node(key);
                } else if(key > parent.data) {
                    parent.right = new Node(key);
                }
                this.arr.push(key);
                for(let i = 0;i<this.arr.length-1;i++) {
                    let pos = i;
                    for(let j=i+1;j<this.arr.length;j++) {
                        if(this.arr[j]<this.arr[pos]) pos = j;
                    }
                    let temp = this.arr[i];
                    this.arr[i] = this.arr[pos];
                    this.arr[pos] = temp;
                }
            }
            deleteItem(value) {
                let curr = this.root;
                let prev = null;
                
                while(curr != null && curr.data != value) {
                    prev = curr;
                    if(value < curr.data) curr = curr.left;
                    else curr = curr.right;
                }

                if(curr == null) return this.root;

                if(curr.left == null || curr.right == null) {
                    let newCurr = (curr.left == null) ? curr.right : curr.left;
                    if(prev == null) return newCurr;
                    if(curr == prev.left) prev.left = newCurr;
                    else prev.right = newCurr;
                } else {
                    let p = null;
                    let temp = curr.right;
                    while(temp.left != null) {
                        p = temp;
                        temp = temp.left;
                    }
                    if(p != null) p.left = temp.right;
                    else curr.right = temp.right;
                    curr.data = temp.data;
                }
                let i=0;
                for(;i<this.arr.length;i++) {
                    if(this.arr[i] == value) break;
                }
                if(i==this.arr.length-1) return;
                else{ 
                    this.arr.splice(i, 1);
                    this.arr.sort();
                } 
            }
            find(value) {
                let temp = this.root;
                let count = 0;
                while(temp != null && temp.data != value) {
                    if(value<temp.data) {
                        temp = temp.left;
                    }
                    else if(value>temp.data) {
                        temp = temp.right;
                    }
                    count++;
                }
                return [temp, count];
            }
            levelOrderTraversal() {//BFS
                let q = [];
                q.push(this.root);
                let bfs = [];
                while(q.length != 0) {
                    if(q[0] != null) { 
                        if(q[0].left != null) q.push(q[0].left);
                        if(q[0].right != null) q.push(q[0].right);
                        bfs.push(q[0].data);
                        q.splice(0, 1);
                    } else return;
                }
                console.log("BFS:", bfs)
            }
            inorderTraversal(root) {
                if(root == null) return;
                this.inorderTraversal(root.left);
                console.log(root.data);
                this.inorderTraversal(root.right);
            }
            preOrderTraversal(root) {
                if(root == null) return;
                console.log(root.data);
                this.preOrderTraversal(root.left);
                this.preOrderTraversal(root.right);
            }
            postOrderTraversal(root) {
                if(root == null) return;
                this.postOrderTraversal(root.left);
                this.postOrderTraversal(root.right);
                console.log(root.data);
            }
            height(value) {
                let root;
                if(this.find(value)[0] != null) {
                    root = this.find(value)[0];
                }
                else return this.find(value)[0];
                if(root == null) return 0;
                let queue = [root];
                let depth = 0;
                while(queue.length > 0) {
                    let levelSize = queue.length;
                    for(let i=0;i<levelSize;i++) {
                        let curr = queue.shift();
                        if(curr.left) queue.push(curr.left);
                        if(curr.right) queue.push(curr.right);
                    }
                    depth++;
                }
                return depth-1;
            }
            depth(value) {
                if(this.find(value)[0] != null) {
                    return this.find(value)[1];
                }
                return this.find(value)[0];
            }
            isBalancedRec(root) {
                if(root == null) return 0;
                let lHeight = this.isBalancedRec(root.left);
                let rHeight = this.isBalancedRec(root.right);
                if(lHeight == -1 || rHeight == -1 || Math.abs(lHeight - rHeight) > 1) return -1
                return Math.max(lHeight, rHeight) + 1;
            }
            isBalance() {
                return this.isBalancedRec(this.root) > 0;
            }
            rebalance() {
                if (this.isBalance() == false) {
                    this.root = this.buildTree();
                }
            }
        }
        let obj = new Tree([5,4,3,2,1]);
        obj.prettyPrint(obj.root);
        console.log(obj.isBalance());
        obj.levelOrderTraversal();
        console.log("PreOrder: ");
        obj.preOrderTraversal(obj.root);
        console.log("PostOrder: ");
        obj.postOrderTraversal(obj.root);
        console.log("InOrder: ");
        obj.inorderTraversal(obj.root);
        obj.insert(10);
        obj.prettyPrint(obj.root);
        console.log("Is balanced:", obj.isBalance());
        obj.rebalance();
        obj.prettyPrint(obj.root);
        console.log("Is Balanced:", obj.isBalance());
        obj.levelOrderTraversal();
        console.log("PreOrder: ");
        obj.preOrderTraversal(obj.root);
        console.log("PostOrder: ");
        obj.postOrderTraversal(obj.root);
        console.log("InOrder: ");
        obj.inorderTraversal(obj.root);