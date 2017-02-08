const request = require('request-promise');
const parser = require('./parser');
const getPlayers = (nick) =>  getAuthToken(0).then(auth => request(getOptions('http://s.bf2142.us/playersearch.aspx?nick=' + nick+'&auth='+auth))
	.catch(console.log)
    .then(parser.parse).then(toSoldiers));
const getLeaderBoard = (type,id,n) =>  getAuthToken(0).then(auth => request(getOptions('http://s.bf2142.us/getleaderboard.aspx?type=' + type + '&id='+id+'&pos=0&after='+n+'&auth='+auth))
	.catch(console.log)
    .then(parser.parse).then(toSoldiers));
const getPlayer = (pid) => getAuthToken(pid).then(auth => request(getOptions('http://s.bf2142.us/ASP/getplayerinfo.aspx?auth=' + auth+'&mode='+base))
	.catch(console.log)
    .then(parser.parse).then(toSoldier));
const getOptions = function(URL){
	return { 
		url:URL,
		headers: {
			'User-Agent': 'GameSpyHTTP/1.0'
			}
		};
};
exports.getPlayers = getPlayers;
const Soldier =  function(){
	this.pid = 0;
	this.getAwards = () => getAuthToken(pid).then(auth => request(getOptions('http://s.bf2142.us/getawardsinfo.aspx?auth=' + auth))
							.catch(console.log)
							.then(parser.parse)
							.then(getAwards));
	this.getUnlocks = () => getAuthToken(pid).then(auth =>request(getOptions('http://s.bf2142.us/getunlocksinfo.aspx?auth=' + auth)
							.catch(console.log)
							.then(parser.parse)
							.then(getunlocksinfo));
};
const toSoldiers = function(arr){
	let plist = new Array();
	let head = arr[0];
	arr = arr.slice(1);
	arr.map(p => plist.push(toSoldier(p,head)));
	return plist;
};
const toSoldier = function(p,head){
		let s = new Soldier();
		for(let i=0;i<p.length;i++)
		{
			s[head[i]]=p[i];
		}
		return s;
};
const modifySoldier = function(s,head,data){
	for(let i=0;i<data.length;i++)
		{
			s[head[i]]=data[i];
		}
		return s;
};
const getAwards = function(arr)
	{
		let head = arr[0];
		arr = arr.slice(1);
		let awards = [];
		arr.map(data =>{
			let award ={};
			for(let i=0;i<data.length;i++)
			{
				award[head[i]]=data[i];
			}
			awards.push(award);
		}
		);
		return awards;
	};
const getunlocksinfo = function(arr)
	{
		let head = arr[0];
		arr = arr.slice(1);
		let unlocks = [];
		arr.map(data =>{
			let unlock ={};
			for(let i=0;i<data.length;i++)
			{
				unlock[head[i]]=data[i];
			}
			unlocks.push(unlock);
		}
		);
		return unlocks;
	};
module.exports.getPlayer = getPlayer;
module.exports.getPlayers = getPlayers;
module.exports.getLeaderBoard = getLeaderBoard;
const getAuthToken = (pid) =>request('http://bf2142auth.herokuapp.com?pid=' + pid).then(body => {
	console.log('pid: '+pid);
	console.log(body);
        return body.trim();});