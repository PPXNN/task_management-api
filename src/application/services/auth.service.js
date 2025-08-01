const UserRepository = require("../../data/data-sources/repositories/user.repository")
const bcrypt = require("bcrypt");
const UserRegisterDTO = require("../dtos/auth/register.dto")
const UserLoginDTO = require("../dtos/auth/login.dto")
const ChangePasswordDTO = require("../dtos/auth/change_password.dto")
const ForgotPasswordDTO = require("../dtos/auth/forgot_password.dto")
const {validate} = require("class-validator")

class AuthService {
    static async register(userData){

        const dto = new UserRegisterDTO(userData);
        const errors = await validate(dto);

        if (errors.length > 0){
            const error = errors[0];
            const msg_error = Object.values(error.constraints)[0];
            throw new Error(msg_error);
        }

        const { username, password, firstname, lastname, phone_number, email } = dto;

        const userExist = await UserRepository.findUser(username);
        if (userExist){
            throw new Error("User is already existed");
        }

        const hash_password = await bcrypt.hash(password, 10);
        const user_id = await UserRepository.createUser(username, hash_password);

        const result = await UserRepository.createUserInfo(user_id, firstname, lastname, phone_number, email);
        if (!result){
            throw new Error("Failed to register user info");
        }
        return "User registered successfully";
    }

    static async login(userData){
        const dto = new UserLoginDTO(userData);
        const errors = await validate(dto);
        if (errors.length >0){
            const error = errors[0];
            const msg_error = Object.values(error.constraints)[0];
            throw new Error(msg_error);
        }

        const {username, password} = dto;

        const user = await UserRepository.findUser(username);
        if (!user){
            throw new Error("User does not exist");
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword){
            throw new Error("Your password is incorrect");
        }
        
        return "Login successfully";

    }

    static async changePassword(userData){
        const dto = new ChangePasswordDTO(userData);
        const errors = await validate(dto);
        if (errors.length >0){
            const error = errors[0];
            const msg_error = Object.values(error.constraints)[0];
            throw new Error(msg_error);
        }

        const {username, old_password, new_password, confirm_new_password} = dto;

        const user = await UserRepository.findUser(username);
        if (!user){
            throw new Error("User does not exist");
        }

        const comparePassword = await bcrypt.compare(old_password, user.password);

        if (!comparePassword){
            throw new Error("Your old password is incorrect");
        }

        if (new_password !== confirm_new_password){
            throw new Error("new password or confirm new_password does not match");
        }

        const hashPassword = await bcrypt.hash(new_password, 10);
        const updateInfo = await UserRepository.changePassword(user.user_id, hashPassword);

        if (!updateInfo){
            throw new Error("Failed to change password");
        }
        return "Password has changed successfully";

    }

    static async forgotPassword(userData){
        const dto = new ForgotPasswordDTO(userData)
        const errors = await validate(dto)
        if (errors.length >0){
            const error = errors[0];
            const msg_error = Object.values(error.constraints)[0];
            throw new Error(msg_error);
        }

        const {username, email, phone_number, new_password, confirm_new_password} = userData;

        const user = await UserRepository.findUser(username);
        if (!user){
            throw new Error("User does not exist");
        }

        const userInfo = await UserRepository.findMatchEmailPhoneNum(user.user_id, email, phone_number);
        if (!userInfo){
            throw new Error("Phone number or email does not match");
        }
        
        if (new_password !== confirm_new_password){
            throw new Error("new password or confirm new_password does not match");
        }

        const hashNewPassword = await bcrypt.hash(new_password, 10);
        const updateInfo = await UserRepository.changePassword(user.user_id, hashNewPassword)

        if (!updateInfo){
            throw new Error("Failed to change password");
        }
        return "Password has changed successfully";
    }
}

module.exports = AuthService


