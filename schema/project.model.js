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

module.exports = {getUserLogin, getUsers,insertUserData}