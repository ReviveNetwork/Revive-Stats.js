const request = require('request-promise');
const parser = require('./parser');
const auth = require('./authToken.js').getToken;
const getPlayers = (nick) => request(getOptions('http://s.bf2142.us/playersearch.aspx?nick=' + nick + '&auth=' + auth(0)))
    .catch(console.log)
    .then(parser.parse).then(toSoldiers);
const getLeaderBoard = (type, id, n) => request(getOptions('http://s.bf2142.us/getleaderboard.aspx?type=' + type + '&id=' + id + '&pos=0&after=' + n + '&auth=' + auth(0)))
    .catch(console.log)
    .then(parser.parse).then(toSoldiers);
const getPlayer = (pid) => request(getOptions('http://s.bf2142.us/getplayerinfo.aspx?auth=' + auth(pid) + '&mode=base'))
    .catch(console.log)
    .then(parser.parse).then(toSoldier);
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
        .then(getAwards);
    this.getUnlocks = () => request(getOptions('http://s.bf2142.us/getunlocksinfo.aspx?auth=' + auth(this.pid)))
        .catch(console.log)
        .then(parser.parse)
        .then(getunlocksinfo);
};
const toSoldiers = function(arr) {
	if(!arr)
	{return undefined;}
    let plist = new Array();
    let head = arr[0];
    arr = arr.slice(1);
    arr.map(p => plist.push(toSoldier(p,head)));
    return plist;
};
const toSoldier = function(p, head) {
	if(!p)
	{return undefined;}
	if(!head)
	{let head = p[0];
    p = p.slice(1);}
    let s = new Soldier();
    for (let i = 0; i < p.length; i++) {
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
const getAwards = function(arr) {
    let head = arr[0];
    arr = arr.slice(1);
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
const getunlocksinfo = function(arr) {
    let head = arr[0];
    arr = arr.slice(1);
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
