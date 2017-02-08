const request = require('request-promise');
const parser = require('./parser');
const getPlayers = (nick) => request(getOptions('http://bf2web.game.bf2.us/ASP/searchforplayers.aspx?nick=' + nick + '&where=a&sort=a&debug=txs&transpose=0'))
    .catch(console.log)
    .then(parser.parse).then(toSoldiers);
const getLeaderBoard = (type, id, n) => request(getOptions('http://bf2web.game.bf2.us/ASP/getleaderboard.aspx?type=' + type + '&id=' + id + 'after=' + n))
    .catch(console.log)
    .then(parser.parse).then(toSoldiers);
const getPlayer = (pid) => request(getOptions('http://bf2web.game.bf2.us/ASP/getplayerinfo.aspx?pid=' + pid + '&info=rank'))
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
    this.getAwards = () => request(getOptions('http://bf2web.game.bf2.us/ASP/getawardsinfo.aspx?pid=' + pid))
        .catch(console.log)
        .then(parser.parse)
        .then(getAwards);
    this.getUnlocks = () => request(getOptions('http://bf2web.game.bf2.us/ASP/getunlocksinfo.aspx?pid=' + pid))
        .catch(console.log)
        .then(parser.parse)
        .then(getunlocksinfo);
};
const toSoldiers = function(arr) {
    let plist = new Array();
    let head = arr[0];
    arr = arr.slice(1);
    arr.map(p => {let s = toSoldier(p, head);if(!s)plist.push(s)});
    return plist;
};
const toSoldier = function(p, head) {
    let s = new Soldier();
	if(!p ||!head)
	{return null;}
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