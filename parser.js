module.exports.parse = (text) => {
	let arr = text.split('\n');
	console.log(arr);
	let head =null;
	for(let i=0;i<arr.length-1;i++)
	{
		arr[i] = arr[i].split('\t');
		if(arr[i][0]=='H')
			head = arr[i];
	}
	arr.pop();
	arr = arr.slice(arr.indexOf(head));
	for(let i=0;i<arr.length;i++)
	{
		arr[i].shift();
	}
	return arr;
}
