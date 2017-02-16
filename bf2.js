const request = require('request-promise');
const parser = require('./parser');
const getPlayers = (nick) => request(getOptions('http://bf2web.game.bf2.us/ASP/searchforplayers.aspx?nick=' + nick + '&where=a&sort=a&debug=txs&transpose=0'))
    .catch(console.log)
    .then(parser.parse).then(p => toSoldiers(p.arr,p.head));
const getLeaderBoard = (type, id, n) => request(getOptions('http://bf2web.game.bf2.us/ASP/getleaderboard.aspx?type=' + type + '&id=' + id + 'after=' + n))
    .catch(console.log)
    .then(parser.parse).then(p => toSoldiers(p.arr,p.head));
const getPlayer = (pid) => request(getOptions('http://bf2web.game.bf2.us/ASP/getplayerinfo.aspx?pid=' + pid + '&info=rank'))
    .catch(console.log)
    .then(parser.parse).then(p => toSoldier(p.arr[0],p.head));
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
    this.getAwards = () => request(getOptions('http://bf2web.game.bf2.us/ASP/getawardsinfo.aspx?pid=' + pid))
        .catch(console.log)
        .then(parser.parse)
        .then(p => getAwards(p.arr,p.head));
    this.getUnlocks = () => request(getOptions('http://bf2web.game.bf2.us/ASP/getunlocksinfo.aspx?pid=' + pid))
        .catch(console.log)
        .then(parser.parse)
        .then(p => getunlocksinfo(p.arr,p.head));
};
const toSoldiers = function(arr,head) {
	if(!arr)
	{return undefined;}
    let plist = new Array();
    arr.map(p => plist.push(toSoldier(p,head)));
    return plist;
};
const toSoldier = function(p, head) {
	if(!p)
	{return p;}
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
