module.exports.parse = (text) => {
	let arr = text.trim().split('\n');
	console.log(arr);
	let head =null;
	let end = arr.length;
	for(let i=0;i<arr.length-1;i++)
	{
		arr[i] = arr[i].split('\t');
		if(arr[i][0]=='H')
			head = arr[i];
		if(arr[i][0]=='$')
		{end=i;}
	}
	arr = arr.slice(arr.indexOf(head),end);
	for(let i=0;i<arr.length;i++)
	{
		arr[i].shift();
	}
	return arr;
}
