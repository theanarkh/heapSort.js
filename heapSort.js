	function buildHeap(data) {
		var i = Math.floor((data.length -1)/2);
		while(i) {
			transfer(data,i,data.length-1);
			i--;
		}
		transfer(data,i,data.length-1);
	}
	function transfer(data, i, len) {
		var left = 2*i + 1;
		var right = 2*i+ 2;
		var max = i;
		var temp;
		if (i > Math.floor(len/2)) {
			return;
		}
		if (left <= len && data[left] > data[max]) {
			max = left;
		}
		if (right <= len && data[right] > data[max]) {
			max = right;
		}
		
		if (max !== i) {
			temp = data[i];
			data[i] = data[max];
			data[max] = temp;
			transfer(data, max, len);
		}
		
	}
	function heapSort(data) {
		if (data.length === 1) {
			return data;
		}
		var i = data.length - 1;
		var temp;
		buildHeap(data);
		console.log(data)
		while(i > 0) {
			temp = data[i];
			data[i] = data[0];
			data[0] = temp;	
			transfer(data, 0, i - 1);
			i--;
		}
		return data;
	}
	function getData() {
		var arr = [];
		var i = 0;
		while(i <  10) {
			arr.push(~~(Math.random() * 100 ));
			i++;
		}	
		return arr;
	}
	var data = getData()//[50, 89, 57, 19, 68, 56, 49, 45, 32, 48];
	console.log(data);
	console.log(heapSort(data));
