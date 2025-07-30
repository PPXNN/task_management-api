const conn = require("../../data/data-sources/db-datasource/database");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    const { username, password, firstname, lastname, phone_number, email } = req.body;
    const db = await conn();
    

    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username])

    if (rows.length > 0){
        return res.status(400).json({message: "User is already existed"});
    }

    const hash_password = await bcrypt.hash(password, 10);
    const [user] = await db.execute("INSERT INTO users(username, password) VALUES(?, ?)", [username, hash_password]);

    const user_id = user.insertId;
    await db.execute("INSERT INTO user_info(user_id, firstname, lastname, phone_number, email) VALUES(?, ?, ?, ?, ?)", [user_id, firstname, lastname, phone_number, email]);

    res.status(201).json({message: "User Register"});


}

const login = async (req, res) => {
    const {username, password} = req.body;
    const db = await conn()

    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username])
    if (rows.length === 0){
        return res.status(400).json({message: "User does not exist"})
    }

    const user = rows[0];
    const compare_password = await bcrypt.compare(password, user.password);

    if (!compare_password){
        return res.status(400).json({message : "Your password is incorrect"})
    }

    res.status(201).json({message : "Login successfully"})


}

const change_password = async (req, res) => {
    const {username, old_password, new_password, confirm_new_password} = req.body;
    const db = await conn();

    const [user_check] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (user_check.length === 0){
        return res.status(400).json({error : "Username is not found"})
    }

    const user = user_check[0];
    const compare_password = await bcrypt.compare(old_password, user.password);

    if (!compare_password){
        return res.status(400).json({ error: "Your old password is incorrect"})
    }

    if (new_password === confirm_new_password){
        const hash_password = await bcrypt.hash(new_password, 10);
        await db.execute("UPDATE users SET password = ? WHERE username = ?", [hash_password, username]);

        return res.status(201).json({message : "Password has changed successfully"})
    }

    res.status(400).json({error : "new password or confirm new_password does not match"})
}

const forgot_password = async (req, res) => {
    const {username, email, phone_number, new_password, confirm_new_password} = req.body;
    const db = await conn();

    const [user_check] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (user_check.length === 0){
        return res.status(400).json({error : "Username is not found"});
    }

    const user = user_check[0];

    const [user_info_check] = await db.execute("SELECT * FROM user_info WHERE user_id = ? AND phone_number = ? AND email = ?", [user.user_id, phone_number, email]);
    if (user_info_check.length === 0){
        return res.status(400).json({error : "Phone number or email does not match"});
    }

    if (new_password === confirm_new_password){
        const hash_password = await bcrypt.hash(new_password, 10);

        await db.execute("UPDATE users SET password = ? WHERE user_id = ?", [hash_password, user.user_id])
        return res.status(201).json({message : "Password has changed successfully"})
    }

    res.status(400).json({error : "new password or confirm new_password does not match"})




}

module.exports = { register, login, change_password, forgot_password};