function getData() {
	var arr = [];
	var i = 0;
	var len = 50000;//Math.max(10, ~~(Math.random() * 30 ));
	while(i <  len) {
		arr.push(~~(Math.random() * 100 ));
		i++;
	}	
	return arr;
}

var COUNT = 6;
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
	return result;
}
// 插入排序 
function insertSort(arr) {
	for (var i = 1;i<arr.length;i++) {
	var j=i-1;
	var key = arr[i];
	while (j>=0 && key<arr[j]) {
		arr[j+1] = arr[j];
		j--;
	}
	arr[j+1] = key;
	}
}

// 希尔排序
function shellSortRecursion(arr,step) {
	if(step<1) {
		return;
	}
	for (var i = step;i<arr.length;i++) {
		var j = i-step;
		var key = arr[i];
		while (j>=0 && key<arr[j]) {
			arr[j+step] = arr[j];
			j-=step;
		}
		arr[j+step] = key;
	}
	step = Math.floor(step/2);
	shellSortRecursion(arr,step);
}

function start() {
	var data = getData();
	var start = new Date().getTime();
	var {root, startNode} = makeTree(data);
	heapSort(root, startNode);
	//insertSort(data)
	//shellSortRecursion(data,5)
	console.log((new Date().getTime() - start)/1000);
}
start();
