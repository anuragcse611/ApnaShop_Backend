const jwt = require('jsonwebtoken');
require('dotenv').config();

const { getUsers } = require('../schema/project.model');
const JWT_KEYS = process.env.JWT_KEYS

// module.exports = (req, res, next) => {
//     const {authorization} = req.headers
//     if(!authorization){
//         return res.status(400).json({statuscode:2, message: "You must be logged in"})
//     }
//     const token = authorization.replace("Bearer ", "")
//     jwt.verify(token, JWT_KEYS, (err, payload) => {
//         if(err){
//             return res.status(400).json({statuscode:2, message: "You must be logged in"})
//         }
//         const {email} = payload
//         const userData = USER.find(( element ) => element.email === email);
//         if(!userData){
//             return res.status(400).json({status:2, message:"Token expired login again"})
//         }
//         req.admin = userData
//         next()
//     })
// }


module.exports = (req, res, next) => {
    const {authorization} = req.headers
    if(!authorization){
        return res.status(400).json({statuscode:2, message: "No Token"})
    }
    const token = authorization.replace("Bearer ", "")
    try {
        jwt.verify(token, JWT_KEYS, (err, payload) => {
            if(err){
                return res.status(400).json({statuscode:2, message: "You must be logged in"})
            }
            if(!payload){
                return res.status(400).json({statuscode:2, message: "Token Expire login again"})
            }
            fetchData(payload.email).then(
                function(dataa) {
                    if (req.admin === null) {return res.status(500).json({statuscode:2, message: "Internal Server Error"})}
                    req.admin = dataa
                    next()
                }
            );
        });
    } catch (error) {
        console.log('Error in Require admin login middleware', error)
        res.status(500).json({statuscode:2, message: "Internal Server Error"})
    }
}
const fetchData = async (id) => {
    try {
        const userData1 =  await getUsers(id);
        var savedData = userData1[0]
        let adminDetails = {
            id          : savedData.id,
            name        : savedData.name,
            usertype    : savedData.usertype,
            email       : savedData.email,
            project     : savedData.project,
        }
        return adminDetails
    } catch (error) {
        console.log('Error in fetching data', error);
        return null
    }
}