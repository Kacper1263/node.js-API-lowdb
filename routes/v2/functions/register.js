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

function addDeletionToUserStats(req){
    usersDB.read()
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace(/\./g, "-") // replace dots with "-"

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();                
    var seconds = dateObj.getSeconds();
    var minutes = dateObj.getMinutes();
    var hour = dateObj.getHours();
    
    //If < 10 - add "0" before. E.g 10:3 -> 10:03
    if(month<10) month = "0"+month
    if(hour<10) hour = "0"+hour
    if(minutes<10) minutes = "0"+minutes
    if(seconds<10) seconds = "0"+seconds

    var newDate = `${day}.${month}.${year} ${hour}:${minutes}:${seconds}`

    usersDB.set("registeredUsers."+ip, {lastDeletion: newDate}).write()
    //usersDB.get("registeredUsers."+ip).push({lastDeletion: newDate}).write()
}

module.exports = {
    isIpRegistered: isIpRegistered,
    addDeletionToUserStats: addDeletionToUserStats
}