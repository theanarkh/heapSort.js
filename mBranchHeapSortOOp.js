function HeapSort(count) {
	this.data = [];
	this.COUNT = count || 2;
}

HeapSort.prototype = {
	getData: function() {
		var arr = [];
		var i = 0;
		var len = Math.max(10, ~~(Math.random() * 30 ));
		while(i <  len) {
			arr.push(~~(Math.random() * 100 ));
			i++;
		}	
		this.data = arr;
		return arr;
	},
	makeTree: function makeTree() {
		var arr = this.data;
		var i = 1;
		var root = this.getNode(arr[0], 0);
		var position = 1;
		var count = this.COUNT;
		var queue = [root];
		var preNodePtr;
		var neededNode;
		var isFind = false;
		var preNode = root;
		while(queue.length) {
			var node = queue.shift();
			i = 1;
			while(i <= count) {
				if (position < arr.length) {
					var newNode = this.getNode(arr[position], position);
					node[i] = newNode;
					newNode.parent = node;
					newNode.pre = preNode;
					preNode.next = newNode;
					node.childs++;
					queue.push(newNode);
					preNode = newNode;
					i++;
					position++;
				} else {
					break;
				}
			}

			if (!isFind) {
				if (node.childs === 0) {
					neededNode = preNodePtr;
					isFind = true;
					this.startNode = neededNode;
					this.root = root;
				} else if (node.childs < this.COUNT){
					neededNode = node;
					isFind = true;
					this.startNode = neededNode;
					this.root = root;
				} else {
					preNodePtr = node;
				}
			}
		}
		return root;
	},
	findNode: function findNode(root) {
		var queue = [root];
		var node;
		var count = COUNT;
		var i = 1;
		var preNodePtr;

		while(queue.length) {
			node = queue.shift();
			if (node.childs === 0) {
				return preNodePtr;
			} else if (node.childs < this.COUNT) {
				return node;
			}
			preNodePtr = node;
			while(i <= count) {
				queue.push(node[i++]);
			}
			count = this.COUNT;	
		}
	},
	buildHeapTree: function buildHeapTree() {
		var node = this.startNode;
		while(node) {
			this.adjustHeapTree(node);
			node = node.pre;
		}
	},
	adjustHeapTree: function adjustHeapTree(node, endNode) {
		var i = 1;
		var max = node.val;
		var position = 0;
		var isEnd = false;
		while(i <= this.COUNT) {
			if (endNode && node[i] && node[i].position >= endNode.position) {
				isEnd = true;
				break;
			}
			if (node[i] && node[i].val > max) {
				max = node[i].val;
				position = i;
			}
			i++;
		}
		var temp;
		if (position !== 0) {
			temp = node.val;
			node.val = node[position].val;
			node[position].val = temp;
			!isEnd && this.adjustHeapTree(node[position], endNode);
		}	
	},
	heapSort: function heapSort() {
		if (!this.root.childs) {
			return;
		}
		var root = this.root;
		var node = this.startNode;
		var lastChild = this.getNodeLastChild(node);
		var endNode = lastChild;
		var temp;
		this.buildHeapTree();
		while(endNode !== root) {
			temp = root.val;
			root.val = endNode.val;
			endNode.val = temp;
			this.adjustHeapTree(root, endNode);
			endNode = endNode.pre;
		}
	},
	getNodeLastChild: function getNodeLastChild(node) {
		var count = this.COUNT;
		while(count) {
			if (node[count]) {
				return node[count];
			}
			count--;
		}
		return null;
	},
	echo: function echo() {
		var queue =[this.root];
		var result = [];
		var i = 1;
		while(queue.length) {
			i = 1;
			var node = queue.shift();
			result.push(node.val);
			while(i <= node.childs) {
				queue.push(node[i++]);
			}
		}
		this.result = result;
		console.log('sort: data',JSON.stringify(result),'\n');
	},
	assert: function assert() {
		var result = this.result;
		var i = 0;
		while(i < result.length - 2) {
			if (result[i] > result[i+1]) {
				console.log('error',i, result,'\n');
				break;
			}
			i++;
		}
	},
	start: function start() {
		this.getData();
		console.log('source data:',JSON.stringify(this.data));
		this.makeTree();
		this.heapSort();
		this.echo();
		this.assert();
	},
	getNode(val, position) {
		var node = {};
		var count = this.COUNT;
		while(count) {
			node[count--] = null;
		}
		node.position = position;
		node.parent = null;
		node.pre = null;
		node.next = null;
		node.childs = 0;
		node.val = val;
		return node;
	}
}
new HeapSort().start();
