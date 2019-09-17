//#region db settings
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync') 
//users db
const usersAdapter = new FileSync('users.json')
const usersDB = low(usersAdapter)
//#endregion

usersDB.defaults({ registeredUsers: {}}).write() //default variables for database

/** 
 * Check is IP registered in DB
 * @example isIpRegistered(req).ip // will return ip 
 * isIpRegistered(req).registered // will return true or false
 * @param {Request} req express request param
 */
function isIpRegistered(req){
    usersDB.read()
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace(/\./g, "-") // replace dots with "-"

    if(usersDB.get("registeredUsers."+ip).value() == null){
        return {registered: false, ip: ip}
    }
    else{
        return {registered: true, ip: ip}
    }
}

module.exports = isIpRegistered