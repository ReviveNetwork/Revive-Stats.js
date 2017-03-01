var stats = {
    bf2: require('./bf2'),
    bf2142: require('./bf2142'),
    auth: require('./authToken')
}
module.exports = stats;
var fs = require('fs');
//module.exports.bf2.getPlayer("1111542").then(p => fs.writeFile("out.json", JSON.stringify(p), console.log));
module.exports.bf2142.getPlayer("1908093").then(p => fs.writeFile("out.json", JSON.stringify(p), console.log));
//console.log(require('./authToken.js').parseToken('bSCZgQN08cGhavVXAhY7CA__'));
//console.log(module.exports.auth.getToken('1908093'))
