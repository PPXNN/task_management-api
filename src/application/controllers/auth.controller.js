const AuthService = require("../services/auth.service")

const register = async (req, res) => {
    try {
        const result = await AuthService.register(req.body);
        res.status(201).json({message : result});
    } catch (error){
        res.status(400).json({error : error.message});
    }
};

const login = async (req, res) => {
    try {
        const result = await AuthService.login(req.body);
        res.status(200).json({message : result});
    } catch (error) {
        res.status(400).json({error : error.message});
    }
};

const changePassword = async (req, res) => {
    try {
        const result = await AuthService.changePassword(req.body);
        res.status(200).json({message : result});
    } catch (error) {
        res.status(400).json({error : error.message});
    }
}

const forgotPassword = async (req, res) => {
    try {
        const result = await AuthService.forgotPassword(req.body);
        res.status(200).json({message : result})
    } catch (error) {
        res.status(400).json({error : error.message});
    }
}

module.exports = {register, login, changePassword, forgotPassword}
