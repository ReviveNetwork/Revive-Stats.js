const request = require('request-promise');
const parser = require('./parser');
const getPlayers = (nick) => request(getOptions('http://bf2web.game.bf2.us/ASP/searchforplayers.aspx?nick=' + nick + '&where=a&sort=a&debug=txs&transpose=0'))
    .catch(console.log)
    .then(parser.parse).then(p => toSoldiers(p.arr, p.head)).then(p => p.sort(function (a, b) {
        let aStart = a.nick.match(new RegExp('^' + nick, 'i')) || [],
            bStart = b.nick.match(new RegExp('^' + nick, 'i')) || [];

        if (aStart.length != bStart.length) return bStart.length - aStart.length;

        else return a.nick > b.nick ? 1 : -1;
    }));
const getLeaderBoard = (type, id, n) => request(getOptions('http://bf2web.game.bf2.us/ASP/getleaderboard.aspx?type=' + type + '&id=' + id + 'after=' + n))
    .catch(console.log)
    .then(parser.parse).then(p => toSoldiers(p.arr, p.head));
const getPlayer = (pid) => request(getOptions('http://bf2web.game.bf2.us/ASP/getplayerinfo.aspx?pid=' + pid + '&info=per*,cmb*,twsc,cpcp,cacp,dfcp,kila,heal,rviv,rsup,rpar,tgte,dkas,dsab,cdsc,rank,cmsc,kick,kill,deth,suic,ospm,klpm,klpr,dtpr,bksk,wdsk,bbrs,tcdr,ban,dtpm,lbtl,osaa,vrk,tsql,tsqm,tlwf,mvks,vmks,mvn*,vmr*,fkit,fmap,fveh,fwea,wtm-,wkl-,wdt-,wac-,wkd-,vtm-,vkl-,vdt-,vkd-,vkr-,atm-,awn-,alo-,abr-,ktm-,kkl-,kdt-,kkd-'))
    .catch(console.log)
    .then(parser.parse).then(replace).then(p => toSoldier(p.arr[0], p.head));
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
    this.getAwards = () => request(getOptions('http://bf2web.game.bf2.us/ASP/getawardsinfo.aspx?pid=' + pid))
        .catch(console.log)
        .then(parser.parse)
        .then(p => getAwards(p.arr, p.head));
    this.getUnlocks = () => request(getOptions('http://bf2web.game.bf2.us/ASP/getunlocksinfo.aspx?pid=' + pid))
        .catch(console.log)
        .then(parser.parse)
        .then(p => getunlocksinfo(p.arr, p.head));
};
const toSoldiers = function (arr, head) {
    if (!arr)
    { return undefined; }
    let plist = new Array();
    arr.map(p => plist.push(toSoldier(p, head)));
    return plist;
};
const toSoldier = function (p, head) {
    if (!p)
    { return p; }
    let s = new Soldier();
    for (let i = 0; i < p.length; i++) {
        s[head[i]] = p[i];
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
    const data = require('./bf2head.json');
    for (let i = 0; i < p.head.length; i++) {
        if (data[p.head[i]])
            p.head = data[p.head[i]];
    }
    return p;
}
module.exports.getPlayer = getPlayer;
module.exports.getPlayers = getPlayers;
module.exports.getLeaderBoard = getLeaderBoard;
