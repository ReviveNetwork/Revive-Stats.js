module.exports.parse = (text,headcount) => {
	let arr = text.trim().split('\n');
	//console.log(text);
	let c=0;
	if(!headcount)
	{headcount = 10;}
	let head = undefined;
	for(let i=0;i<arr.length;i++)
	{
		arr[i] = arr[i].split('\t');
		if(arr[i][0]=='H')
		{
						                        if(c<headcount)                                    {                
		    	 head = arr[i];					}
		     else
		     {
			 arr.splice(i);
			 break;
		     }
		     c++;
		}
		if(arr[i][0]=='$')
		{arr.splice(i,1)}
	}
	if(head==undefined)
	{return undefined;}
	arr = arr.slice(arr.indexOf(head+1));
	for(let i=0;i<arr.length;i++)
	{
		arr[i].shift();
	}
	if(arr.length===1)
	{arr= arr[0]}
	head.shift();
	//console.log(head);
	return {'arr':arr,'head':head};
}
