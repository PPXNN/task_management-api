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

module.exports = { register, login};