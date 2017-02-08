module.exports.parse = (text) => {
	let arr = text.trim().split('\n');
	let head;
	for(let i=0;i<arr.length;i++)
	{
		arr[i] = arr[i].split('\t');
		if(arr[i][0]=='H')
			head = arr[i];
		if(arr[i][0]=='$')
		{arr.splice(i,1)}
	}
	if(!head)
	{return undefined;}
	arr = arr.slice(arr.indexOf(head));
	for(let i=0;i<arr.length;i++)
	{
		arr[i].shift();
	}
	return arr;
}
