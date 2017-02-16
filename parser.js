module.exports.parse = (text, headcount) => {
    let arr = text.trim().split('\n');
    //console.log(arr);
    let c = 0;
    if (!headcount) {
        headcount = 10;
    }
    let head = undefined;
	let i=0;
	let hi=0;
    for (i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split('\t');
		//console.log(arr[i]);
        if (arr[i][0] === 'H') {
            if (c < headcount) {
                head = arr[i];
				hi = i;
            } else {
                arr.splice(i);
                break;
            }
            c++;
        }
        if (arr[i][0] == '$') {
            arr.splice(i,1)
        }
    }
    if (head == undefined) {
        return {};
    }
    arr = arr.slice(hi+1);
	//console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        arr[i].shift();
    }
    head.shift();
    if (arr.includes(head)) {
        return {};
    }
    //console.log(head);
    //console.log(arr);
    return {
        'arr': arr,
        'head': head
    };
}