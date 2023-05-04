import Crypto from "crypto";

function hashPwd(pwd, salt) {
    return Crypto.pbkdf2Sync(pwd, salt,1000, 64, `sha512`).toString(`hex`)
}

function validateHashedPassword(pwd, dbpwd) {
    if ( pwd == dbpwd) {
        return true
    } else {
        return false;
    }
}

export {hashPwd,validateHashedPassword};