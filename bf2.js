const request = require('request-promise');
const Soldier = require('./classes/soldier');
const parser = require('./parser');
const getPlayers = (nick) => request(getOptions('http://bf2web.game.bf2.us/ASP/searchforplayers.aspx?nick=' + nick + '&where=a&sort=a&debug=txs&transpose=0'))
    .catch(console.log)
    .then(parser.parse).then(p => toSoldiers(p.arr, p.head)).then(p => p.sort(function (a, b) {
        let aStart = a.nick.match(new RegExp('^' + nick, 'i')) || [],
            bStart = b.nick.match(new RegExp('^' + nick, 'i')) || [];

        if (aStart.length != bStart.length) return bStart.length - aStart.length;

        else return a.nick > b.nick ? 1 : -1;
    })).then((p) => p.map(res => {
        delete res.kdr;
        delete res.armies;
        delete res.kits;
        delete res.armies;
        delete res.vehicles;
        delete res.maps;
        delete res.weapons;
        return res;
    }));
const getLeaderBoard = (type, id, n) => request(getOptions('http://bf2web.game.bf2.us/ASP/getleaderboard.aspx?type=' + type + '&id=' + id + 'after=' + n))
    .catch(console.log)
    .then(parser.parse).then(p => toSoldiers(p.arr, p.head)).then((p) => p.map(res => {
        delete res.kdr;
        delete res.armies;
        delete res.kits;
        delete res.armies;
        delete res.vehicles;
        delete res.maps;
        delete res.weapons;
        return res;
    }));
const getPlayer = (pid) => request(getOptions('http://bf2web.game.bf2.us/ASP/getplayerinfo.aspx?pid=' + pid + '&info=per*,cmb*,twsc,cpcp,cacp,dfcp,kila,heal,rviv,rsup,rpar,tgte,dkas,dsab,cdsc,rank,cmsc,kick,kill,deth,suic,ospm,klpm,klpr,dtpr,bksk,wdsk,bbrs,tcdr,ban,dtpm,lbtl,osaa,vrk,tsql,tsqm,tlwf,mvks,vmks,mvn*,vmr*,fkit,fmap,fveh,fwea,wtm-,wkl-,wdt-,wac-,wkd-,vtm-,vkl-,vdt-,vkd-,vkr-,atm-,awn-,alo-,abr-,ktm-,kkl-,kdt-,kkd-'))
    .catch(console.log)
    .then(parser.parse).then(replace).then(p => {
        let s = new Soldier();
        return toSoldier(s, p.arr[0], p.head)
    }).then(s => {
        return request(getOptions('http://bf2web.game.bf2.us/ASP/getawardsinfo.aspx?pid=' + s.pid)).then(parser.parse).then(replace).then(getAwards).then(a => { s.awards = a; return s; })
    }).then(s => {
        return request(getOptions('http://bf2web.game.bf2.us/ASP/getunlocksinfo.aspx?pid=' + s.pid)).then(parser.parse).then(replace).then(getunlocksinfo).then(a => { s.unlocks = a; return s; })
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
    if (!arr)
    { return undefined; }
    let plist = new Array();
    arr.map(p => {
        let s = new Soldier();

        plist.push(toSoldier(s, p, head))
    });
    return plist;
};
const toSoldier = function (s, p, head) {
    if (!p)
    { return p; }
    for (let i = 0; i < p.length; i++) {
        if (head[i].includes('-') && !head[i].includes('gpm')) {
            let id = head[i].split('-')[1];
            head[i] = head[i].split('-')[0];
            if (head[i].startsWith('k')) {
                if (!s.kits[id])
                    s.kits[id] = {};
                s.kits[id][replace(head[i].substring(1))] = p[i];
            }
            if (head[i].startsWith('v')) {
                if (!s.vehicles[id])
                    s.vehicles[id] = {};
                s.vehicles[id][replace(head[i].substring(1))] = p[i];
            }
            if (head[i].startsWith('a')) {
                if (!s.armies[id])
                    s.armies[id] = {};
                s.armies[id][replace(head[i].substring(1))] = p[i];
            }
            if (head[i].startsWith('m')) {
                if (!s.maps[id])
                    s.maps[id] = {};
                s.maps[id][replace(head[i].substring(1))] = p[i];
            }
            if (head[i].startsWith('w')) {
                if (!s.weapons[id])
                    s.weapons[id] = {};
                s.weapons[id][replace(head[i].substring(1))] = p[i];
            }
        }
        else {
            s[head[i]] = p[i];
        }

    }
    s.kdr = (parseFloat(s.kills) / parseFloat(s.deaths)).toFixed(2);
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
    return unlocks.filter(data => {
        if (data.state == 's') {
            delete data.state;
            return data
        };
    });
};
const replace = (p) => {

    if (!p) return undefined;
    const data = require('./bf2head.json');
    if (typeof p == "string") {
        if (data[p])
            p = data[p];
        return p;
    }
    for (let i = 0; i < p.head.length; i++) {
        if (data[p.head[i]])
            p.head[i] = data[p.head[i]];
    }
    return p;
}
module.exports.getPlayer = getPlayer;
module.exports.getPlayers = getPlayers;
module.exports.getLeaderBoard = getLeaderBoard;
