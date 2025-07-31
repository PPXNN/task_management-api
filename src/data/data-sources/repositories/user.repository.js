const conn = require("../db-datasource/database")

const UserRepository = {
    async findUser(username){
        const db = await conn();
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);

        return rows.length > 0 ? rows[0] : null;
    },

    async createUser(username, hashPassword){
        const db = await conn();
        const [result] = await db.execute("INSERT INTO users(username, password) VALUES(?, ?)", [username, hashPassword]);

        return result.insertId;
    },

    async createUserInfo(user_id, firstname, lastname, phone_number, email){
        const db = await conn();
        const [result] = await db.execute("INSERT INTO user_info(user_id, firstname, lastname, phone_number, email) VALUES(?, ?, ?, ?, ?)", 
            [user_id, firstname, lastname, phone_number, email]
        ); 
        return result.affectedRows > 0;
    },

    async changePassword(user_id, hashNewPassword){
        const db = await conn();
        const [result] = await db.execute("UPDATE users SET password = ? WHERE user_id = ?", [hashNewPassword, user_id]);
        
        return result.affectedRows > 0;
    },

    async findMatchEmailPhoneNum(user_id, email, phone_number){
        const db = await conn();
        const [rows] = await db.execute("SELECT * FROM user_info WHERE user_id = ? AND phone_number = ? AND email = ?", 
            [user_id, phone_number, email]
        );

        return rows.length > 0 ? rows[0] : null;
    }
};

module.exports = UserRepository