const UserRepository = require("../../data/data-sources/repositories/user.repository")
const bcrypt = require("bcrypt");

class AuthService {
    static async register(userData){
        const { username, password, firstname, lastname, phone_number, email } = userData;

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
        const {username, password} = userData;

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
        const {username, old_password, new_password, confirm_new_password} = userData;

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


