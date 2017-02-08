module.exports.parse = (text) => {
	let arr = text.split('\n');
	let arr2 =[];
	let head =null;
	arr2.push(arr.map(line => {
		if(line.startsWith('H'))
			head = line;
		return line.split('\t').slice(1);
	}
	)
	);
	arr = arr2;
	arr2= null;
	head = head.split('\t').slice(1);
	arr = arr.slice(arr.indexOf(head));
	return arr;
}
