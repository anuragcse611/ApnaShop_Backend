const db = require('../utils/db');
const moment = require('moment-timezone');
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';

const getUserLogin = async (email, password) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM users WHERE user_email = ? AND user_password = ?', [email, password]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select users table', error)
        return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
    } finally {
        conn.destroy();
    }
}

const getUsers = async (email) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM users WHERE user_email = ?', [email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select users table', error)
        return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
    } finally {
        conn.destroy();
    }
}

const getOtp = async (otp,email) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('SELECT * FROM users WHERE otp = ? AND user_email= ?', [otp,email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select users table', error)
        return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
    } finally {
        conn.destroy();
    }
}

const insertUserData = async (fname,lname,email, password,date) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('INSERT INTO users (first_name, last_name, user_email, user_password, created_at) VALUES (?, ?, ?, ?, ?)', [fname,lname,email,password,date]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select users table', error)
        return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
    } finally {
        conn.destroy();
    }
}

const updateUserOtp = async (email, otp, otp_time) => {
    otp_time = moment().format("YYYY-MM-DD, HH:mm:ss");
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('update users set otp= ? , otp_time = ? where user_email=?', [otp,otp_time, email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select users table', error)
        return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
    } finally {
        conn.destroy();
    }
}

const deleteUserOtp = async (email) => {
    var conn = null
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE users SET otp = NULL WHERE user_email = ?', [email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select users table', error)
        return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
    } finally {
        conn.destroy();
    }
}

const updateUserPassword = async (email, password,time) => {
    var conn = null
    time = moment().format("YYYY-MM-DD, HH:mm:ss");
    try {
        conn = await db.connection();
        const resp = await conn.query('UPDATE users SET user_password = ? , updated_at = ? WHERE user_email = ?', [password, time,email]);
        conn.release();
        return resp[0]
    }
    catch (error) {
        console.log('Error in select users table', error)
        return { connection: false, statuscode: 0, message: "Error in users table", error: error.message }
    } finally {
        conn.destroy();
    }
}
module.exports = {getUserLogin, getUsers,getOtp,insertUserData,updateUserOtp,updateUserPassword,deleteUserOtp}