module.exports.parse = (text) => {
	let arr = text.trim().split('\n');
	console.log(arr);
	let head =null;
	console.log(arr);
	for(let i=0;i<arr.length;i++)
	{
		arr[i] = arr[i].split('\t');
		if(arr[i][0]=='H')
			head = arr[i];
		if(arr[i][0]=='$')
		{arr.splice(i,1)}
	}
	arr = arr.slice(arr.indexOf(head));
	console.log(arr);
	for(let i=0;i<arr.length;i++)
	{
		arr[i].shift();
	}
	return arr;
}
