const request = require('request-promise');
const parser = require('./parser');
const auth = require('./authToken.js').getToken;
const getPlayers = (nick) => request(getOptions('http://s.bf2142.us/playersearch.aspx?nick=' + nick + '&auth=' + auth(0)))
    .catch(console.log)
    .then(parser.parse).then(p => toSoldiers(p.arr, p.head)).then(p => p.sort(function (a, b) {
        let aStart = a.nick.match(new RegExp('^' + nick, 'i')) || [],
            bStart = b.nick.match(new RegExp('^' + nick, 'i')) || [];

        if (aStart.length != bStart.length) return bStart.length - aStart.length;

        else return a.nick > b.nick ? 1 : -1;
    }));
const getLeaderBoard = (type, id, n) => request(getOptions('http://s.bf2142.us/getleaderboard.aspx?type=' + type + '&id=' + id + '&pos=0&after=' + n + '&auth=' + auth(0)))
    .catch(console.log)
    .then(parser.parse).then(p => toSoldiers(p.arr, p.head));
const getPlayer = (pid) => request(getOptions('http://s.bf2142.us/getplayerinfo.aspx?auth=' + auth(pid) + '&mode=base'))
    .catch(console.log)
    .then(res => parser.parse(res, 2)).then(replace).then(p => toSoldier(p.arr[0], p.head));
const getOptions = function (URL) {
    return {
        url: URL,
        headers: {
            'User-Agent': 'GameSpyHTTP/1.0'
        }
    };
};
exports.getPlayers = getPlayers;
const Soldier = function () {
    this.pid = 0;
    this.getAwards = () => getAuthToken(pid).then(auth => request(getOptions('http://s.bf2142.us/getawardsinfo.aspx?auth=' + auth(pid)))
        .catch(console.log)
        .then(parser.parse)
        .then(p => getAwards(p.arr, p.head)));
    this.getUnlocks = () => getAuthToken(pid).then(auth => request(getOptions('http://s.bf2142.us/getunlocksinfo.aspx?auth=' + auth(pid)))
        .catch(console.log)
        .then(parser.parse)
        .then(p => getunlocksinfo(p.arr, p.head)));
};
const toSoldiers = function (arr, head) {
    if (!arr) {
        return undefined;
    }
    let plist = new Array();
    arr.map(p => plist.push(toSoldier(p, head)));
    return plist;
};
const toSoldier = function (p, head) {
    let s = new Soldier();
    for (let i = 0; i < p.length; i++) {
        if (head[i] === 'rnk') head[i] = 'rank';
        s[head[i]] = p[i];
        if (s[head[i]].startsWith('0.0'))
            s[head[i]] = parseFloat(s[head[i]]).toFixed(2);
    }
    return s;
};
const modifySoldier = function (s, head, data) {
    for (let i = 0; i < data.length; i++) {
        s[head[i]] = data[i];
    }
    return s;
};
const getAwards = function (arr, head) {
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
const getunlocksinfo = function (arr, head) {
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
const replace = (p) => {
    if (!p) return undefined;
    const data = require('./bf2142head.json');
    for (let i = 0; i < p.head.length; i++) {
        if (data[p.head[i]])
            p.head[i] = data[p.head[i]];
    }
    return p;
}
module.exports.getPlayer = getPlayer;
module.exports.getPlayers = getPlayers;
module.exports.getLeaderBoard = getLeaderBoard;