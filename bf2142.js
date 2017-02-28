const request = require('request-promise');
const parser = require('./parser');
const Soldier = require('./classes/soldier');
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
    .then(res => parser.parse(res, 2)).then(replace).then(parser.parse).then(replace).then(p => {
        let s = new Soldier(); s.equipments = {};
        toSoldier(s, p.arr[0], p.head)
    }).then(s => {
        return request(getOptions('http://s.bf2142.us/getawardsinfo.aspx?auth=' + auth(s.pid))).then(parser.parse).then(getAwards).then(a => { s.awards = a; return s; })
    }).then(s => {
        return request(getOptions('http://s.bf2142.us/getunlocksinfo.aspx?auth=' + auth(s.pid))).then(parser.parse).then(getunlocksinfo).then(a => { s.unlocks = a; return s; })
    })
const getOptions = function (URL) {
    return {
        url: URL,
        headers: {
            'User-Agent': 'GameSpyHTTP/1.0'
        }
    };
};
exports.getPlayers = getPlayers;

const toSoldiers = function (arr, head) {
    if (!arr) {
        return undefined;
    }
    let plist = new Array();
    arr.map(p => {
        let s = new Soldier();
        plist.push(toSoldier(s, p, head))
    });
    return plist;
};
const toSoldier = function (s, p, head) {

    for (let i = 0; i < p.length; i++) {
        if (p[i].startsWith('0.0'))
            p[i] = (parseFloat(p[i]) * 100).toFixed(2);
        if (head[i].includes('-') && !head[i].includes('gpm')) {
            if (head[i].startsWith('k')) {
                let id = head[i].substr(head[i].length - 1, 1);
                if (id === '-') id = 0;
                if (!s.kits[id])
                    s.kits[id] = {};
                s.kits[id][head[i].substring(0, head[i].length - 3)] = p[i];
            }
            if (head[i].startsWith('v')) {
                let id = head[i].substr(head[i].length - 1, 1);
                if (id === '-') id = 0;
                if (!s.vehicles[id])
                    s.vehicles[id] = {};
                s.vehicles[id][head[i].substring(0, head[i].length - 3)] = p[i];
            }
            if (head[i].startsWith('a')) {
                let id = head[i].substr(head[i].length - 1, 1);
                if (id === '-') id = 0;
                if (!s.armies[id])
                    s.armies[id] = {};
                s.armies[id][head[i].substring(0, head[i].length - 3)] = p[i];
            }
            if (head[i].startsWith('m')) {
                let id = head[i].substr(head[i].length - 1, 1);
                if (id === '-') id = 0;
                if (!s.maps[id])
                    s.maps[id] = {};
                s.maps[id][head[i].substring(0, head[i].length - 3)] = p[i];
            }
            if (head[i].startsWith('w')) {
                let id = head[i].substr(head[i].length - 1, 1);
                if (id === '-') id = 0;
                if (!s.weapons[id])
                    s.weapons[id] = {};
                s.weapons[id][head[i].substring(0, head[i].length - 3)] = p[i];
            }
            if (head[i].startsWith('w')) {
                let id = head[i].substr(head[i].length - 1, 1);
                if (id === '-') id = 0;
                if (!s.weapons[id])
                    s.weapons[id] = {};
                s.weapons[id][head[i].substring(0, head[i].length - 3)] = p[i];
            }
            if (head[i].startsWith('e')) {
                let id = head[i].substr(head[i].length - 1, 1);
                if (id === '-') id = 0;
                if (!s.equipments[id])
                    s.equipments[id] = {};
                s.equipments[id][head[i].substring(0, head[i].length - 3)] = p[i];
            }
        }
        else {
            s[head[i]] = p[i];
        }

    }
    return s;
};
const getAwards = function (p) {
    let awards = [];
    p.arr.map(data => {
        let award = {};
        for (let i = 0; i < data.length; i++) {
            award[p.head[i]] = data[i];
        }
        awards.push(award);
    });
    return awards;
};
const getunlocksinfo = function (p) {
    let unlocks = [];
    p.arr.map(data => {
        let unlock = {};
        for (let i = 0; i < data.length; i++) {
            unlock[p.head[i]] = data[i];
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