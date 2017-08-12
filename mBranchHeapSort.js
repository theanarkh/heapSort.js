var COUNT = 3;
/*
	获取待排序数据，数据的个数和值随机生成
*/
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
/*
	节点构造函数
	@param val {any} 节点的值
	@param position {int} 节点的位置，即第几个节点
*/
function Node(val, position) {
	// 叉数，例如二叉树
	var count = COUNT;
	// 初始化节点的孩子为null
	while(count) {
		this[count--] = null;
	}
	this.position = position;
	// 父节点、前继节点、后继节点
	this.parent = null;
	this.pre = null;
	this.next = null;
	// 孩子个数
	this.childs = 0;
	this.val = val;
}
/*
	构造COUNT叉树
*/
function makeTree(arr) {
	var i = 1;
	var root = new Node(arr[0], 0);
	var position = 1;
	var count = COUNT;
	// 初始化队列
	var queue = [root];
	// 保存上一个遍历的节点，用于前后节点的连接
	var preNodePtr;
	// 构造m叉树完成后，从哪个节点开始遍历这棵树，从最后一个非叶子节点开始
	var neededNode;
	// 是否已经找到了最后一个非叶子节点
	var isFind = false;
	// 用于寻找最后的非叶子节点
	var preNode = root;
	// 利用队列进行广度遍历
	while(queue.length) {
		var node = queue.shift();
		i = 1;
		// 给当前节点配置孩子数据，个数为COUNT
		while(i <= count) {
			// 判断当前的节点数是否已经超过数据的长度
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
			} 
			// 全部数据赋值完成
			else {
				break;
			}
		}
		// 是否找到了最后的非叶子节点
		if (!isFind) {
			// 当前节点的孩子数为0，说明前一节点为最后一个非叶子节点
			if (node.childs === 0) {
				neededNode = preNodePtr;
				isFind = true;
				return {
					root: root,
					startNode: neededNode
				};
			} 
			// 当前节点的孩子数小于分支数COUNT，说明当前节点为最后的非叶子节点
			else if (node.childs < COUNT){
				neededNode = node;
				isFind = true;
				return {
					root: root,
					startNode: neededNode
				};
			}
			// 保存前一个节点
			else {
				preNodePtr = node;
			}
		}
	}
	return root;
}
// 找出一棵树的最后非叶子节点，已经在makeTree里实现
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
// 根据一颗无序的m叉树构建m叉大堆树
function buildHeapTree(root, startNode) {
	var node = startNode;
	// 从最后一个非叶子节点开始，到根节点结束，遍历其中的所有节点，调整成m叉堆的形式，最后根节点为值最大的节点
	while(node) {
		adjustHeapTree(node);
		node = node.pre;
	}
	return root;
}
// 以node节点为根节点，endNode为结束节点。把node子树调整成m叉堆，
function adjustHeapTree(node, endNode) {
	var i = 1;
	var max = node.val;
	var position = 0;
	var isEnd = false;
	while(i <= COUNT) {
		// 是否已经到达了结束节点，是则结束所有步骤
		if (endNode && node[i] && node[i].position >= endNode.position) {
			isEnd = true;
			break;
		}
		// 找到node节点和孩子中的最大值。
		if (node[i] && node[i].val > max) {
			max = node[i].val;
			position = i;
		}
		i++;
	}
	var temp;
	// 如果node节点的值不是最大的，那么和值最大的孩子节点进行值的互换
	if (position !== 0) {
		temp = node.val;
		node.val = node[position].val;
		node[position].val = temp;
		/*
			是否已经到达结束节点，是的话不需要再进行调整后续的子树，因为孩子节点的position和父节点的大
			以被置换值的孩子节点为根节点，调整成m叉树	
		*/
		!isEnd && adjustHeapTree(node[position], endNode);
	}	
}

/*
	对排序的主流程
*/
function heapSort(root, startNode) {
	if (!root.childs) {
		return;
	}
	
	var node = startNode;
	// 获取整个树的最后一个节点，即最后一个非叶子节点的最后一个节点
	var lastChild = getNodeLastChild(node);
	var endNode = lastChild;
	var temp;
	// 首先构建m叉堆
	buildHeapTree(root, startNode);
	while(endNode !== root) {
		// 把m叉堆中值最大的节点，即根节点的值和最后一个孩子的值互换
		temp = root.val;
		root.val = endNode.val;
		endNode.val = temp;
		// 以根节点为起点，endNode为终点，调整子树为m叉堆
		adjustHeapTree(root, endNode);
		// 终点根节点方向，往前挪一位，此时，endNode后面的节点都是有序的
		endNode = endNode.pre;
	}
}
// 或许某个节点的最后一个孩子节点
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
// 广度遍历root为根节点的m叉树
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
// 断言堆排序算法产生的数据是升序的
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
start();
