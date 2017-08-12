var fs = require('fs');
function getData() {
	var arr = [];
	var i = 0;
	var len = Math.max(10, ~~(Math.random() * 30 ));
	while(i <  len) {
		arr.push(~~(Math.random() * 100 ));
		i++;
	}	
	return arr;
}
var COUNT = 3;
function Node(val, position) {
	var count = COUNT;
	while(count) {
		this[count--] = null;
	}
	this.position = position;
	this.parent = null;
	this.pre = null;
	this.next = null;
	this.childs = 0;
	this.val = val;
}

function makeTree(arr) {
	var i = 1;
	var root = new Node(arr[0], 0);
	var position = 1;
	var count = COUNT;
	var queue = [];
	var preNodePtr;
	var neededNode;
	var isFind = false;
	var preNode = root;
	queue.push(root);
	while(queue.length) {
		var node = queue.shift();
		i = 1;
		while(i <= count) {
			if (position < arr.length) {
				var newNode = new Node(arr[position], position);
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
				return {
					root: root,
					startNode: neededNode
				};
			} else if (node.childs < COUNT){
				neededNode = node;
				isFind = true;
				return {
					root: root,
					startNode: neededNode
				};
			} else {
				preNodePtr = node;
			}
		}
	}
	return root;
}
function findNode(root) {
	var queue = [root];
	var node;
	var count = COUNT;
	var i = 1;
	var preNodePtr;

	while(queue.length) {
		node = queue.shift();
		if (node.childs === 0) {
			return preNodePtr;
		} else if (node.childs < COUNT) {
			return node;
		}
		preNodePtr = node;
		while(i <= count) {
			queue.push(node[i++]);
		}
		count = COUNT;	
	}
}
function buildHeapTree(root, startNode) {
	var node = startNode;
	
	while(node) {
		adjustHeapTree(node);
		node = node.pre;
	}
	return root;
}

function adjustHeapTree(node, endNode) {
	var i = 1;
	var max = node.val;
	var position = 0;
	var isEnd = false;
	while(i <= COUNT) {
		
		if (endNode && node[i] && node[i].position >= endNode.position) {// node === endNode
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
		!isEnd && adjustHeapTree(node[position], endNode);
	}	
}

function heapSort(root, startNode) {
	if (!root.childs) {
		return;
	}
	
	var node = startNode;
	var lastChild = getNodeLastChild(node);
	var endNode = lastChild;
	var temp;
	buildHeapTree(root, startNode);
	while(endNode !== root) {
		temp = root.val;
		root.val = endNode.val;
		endNode.val = temp;
		//console.log(echo(root))
		
		adjustHeapTree(root, endNode);
		endNode = endNode.pre;
	}
	//console.log(root)
}
function getNodeLastChild(node) {
	var count = COUNT;
	while(count) {
		if (node[count]) {
			return node[count];
		}
		count--;
	}
	return null;
}
function echo(root) {
	var queue =[root];
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
	console.log('sort: data',JSON.stringify(result),'\n');
	return result;
}
function assert(result) {
	var i = 0;
	while(i < result.length - 2) {
		if (result[i] > result[i+1]) {
			console.log('error',i, result,'\n');
			break;
		}
		i++;
	}
}
function start() {
	var data = getData();
	console.log('source data:',JSON.stringify(data));
	var {root, startNode} = makeTree(data);
	heapSort(root, startNode);
	assert(echo(root));
}
var end = 10000;
var i = 0;
var time = setInterval(function() {
	if (i > end) {
		clearInterval(time);
	}
	i++;
	start();
},10)
//console.log(root)
