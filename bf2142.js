const request = require('request-promise');
const parser = require('./parser');
const auth = require('./authToken.js').getToken;
const getPlayers = (nick) => request(getOptions('http://s.bf2142.us/playersearch.aspx?nick=' + nick + '&auth=' + auth(0)))
    .catch(console.log)
<<<<<<< HEAD
    .then(parser.parse).then(toSoldiers);
const getLeaderBoard = (type, id, n) => request(getOptions('http://s.bf2142.us/getleaderboard.aspx?type=' + type + '&id=' + id + '&pos=0&after=' + n + '&auth=' + auth(0)))
    .catch(console.log)
    .then(parser.parse).then(toSoldiers);
const getPlayer = (pid) => request(getOptions('http://s.bf2142.us/getplayerinfo.aspx?auth=' + auth(pid) + '&mode=base'))
    .catch(console.log)
    .then(parser.parse).then(toSoldier);
=======
    .then(parser.parse).then(p => toSoldiers(p.arr,p.head)));
const getLeaderBoard = (type, id, n) => getAuthToken(0).then(auth => request(getOptions('http://s.bf2142.us/getleaderboard.aspx?type=' + type + '&id=' + id + '&pos=0&after=' + n + '&auth=' + auth))
    .catch(console.log)
    .then(parser.parse).then(p =>toSoldiers(p.arr,p.head)));
const getPlayer = (pid) => getAuthToken(pid).then(auth => request(getOptions('http://s.bf2142.us/getplayerinfo.aspx?auth=' + auth + '&mode=base'))
    .catch(console.log)
    .then(body => parser.parse(body,2)).then(p =>toSoldier(p.arr[0],p.head))).catch(console.log);
>>>>>>> 599bbd5c92763f89443a9ed66266c43ae4d6f412
const getOptions = function(URL) {
    return {
        url: URL,
        headers: {
            'User-Agent': 'GameSpyHTTP/1.0'
        }
    };
};
exports.getPlayers = getPlayers;
const Soldier = function() {
    this.pid = 0;
    this.getAwards = () => request(getOptions('http://s.bf2142.us/getawardsinfo.aspx?auth=' + auth(this.pid)))
        .catch(console.log)
        .then(parser.parse)
<<<<<<< HEAD
        .then(getAwards);
    this.getUnlocks = () => request(getOptions('http://s.bf2142.us/getunlocksinfo.aspx?auth=' + auth(this.pid)))
        .catch(console.log)
        .then(parser.parse)
        .then(getunlocksinfo);
=======
        .then(p=> getAwards(p.arr,p.head)));
    this.getUnlocks = () => getAuthToken(pid).then(auth => request(getOptions('http://s.bf2142.us/getunlocksinfo.aspx?auth=' + auth))
        .catch(console.log)
        .then(parser.parse)
        .then(p=>getunlocksinfo(p.arr,p.head)));
>>>>>>> 599bbd5c92763f89443a9ed66266c43ae4d6f412
};
const toSoldiers = function(arr,head) {
	if(!arr)
	{return undefined;}
    let plist = new Array();
    arr.map(p => plist.push(toSoldier(p,head)));
    return plist;
};
const toSoldier = function(p, head) {
    let s = new Soldier();
    for (let i = 0; i < p.length; i++) {
	if(head[i]==='rnk')head[i]='rank';
        s[head[i]] = p[i];
    }
    return s;
};
const modifySoldier = function(s, head, data) {
    for (let i = 0; i < data.length; i++) {
        s[head[i]] = data[i];
    }
    return s;
};
const getAwards = function(arr,head) {
    let awards = [];
    arr.map(data => {
        let award = {};
        for (let i = 0; i < data.length; i++) {
            award[head[i]] = data[i];
        }
        awards.push(award);
    });
    return awards;
};
const getunlocksinfo = function(arr,head) {
    let unlocks = [];
    arr.map(data => {
        let unlock = {};
        for (let i = 0; i < data.length; i++) {
            unlock[head[i]] = data[i];
        }
        unlocks.push(unlock);
    });
    return unlocks;
};
module.exports.getPlayer = getPlayer;
module.exports.getPlayers = getPlayers;
module.exports.getLeaderBoard = getLeaderBoard;
