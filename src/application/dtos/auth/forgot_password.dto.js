require("reflect-metadata");
const {Length, IsEmail, Matches} = require("class-validator");

class ForgotPasswordDTO{
    constructor({username, email, phone_number, new_password, confirm_new_password}){
        if (!username || !email || !phone_number || !new_password || !confirm_new_password){
            throw new Error("All informations are required ")
        }
        
        if (typeof username !== "string"){
            throw new Error("Username must be string");
        }

        if (typeof email !== "string"){
            throw new Error("Password must be string");
        }

        if (typeof phone_number !== "string"){
            throw new Error("Firstname must be string");
        }

        if (typeof new_password !== "string"){
            throw new Error("Lastname must be string");
        }

        if (typeof confirm_new_password !== "string"){
            throw new Error("Phone number must be string");
        }

        this.username = username;
        this.email= email;
        this.phone_number = phone_number;
        this.new_password = new_password;
        this.confirm_new_password = confirm_new_password;
    }
}

Reflect.decorate([
    Length(3,45, {message : "Username must be in between 3 and 45 characters"})
], ForgotPasswordDTO.prototype, "username");

Reflect.decorate([
    IsEmail({}, { message: "Email must be a valid email address." })
], ForgotPasswordDTO.prototype, "email");

Reflect.decorate([
    Matches(/^(\+66|0)\d{9,15}$/, {message: "Phone number must start with +66 or 0 and contain 9–15 digits."})
], ForgotPasswordDTO.prototype, "phone_number");

Reflect.decorate([
    Length(6, 100, {message : "New password must be in between 6 and 100 characters"})
], ForgotPasswordDTO.prototype, "new_password");

Reflect.decorate([
    Length(6, 100, {message : "Confirm new password must be in between 6 and 100 characters"})
], ForgotPasswordDTO.prototype, "confirm_new_password");

module.exports = ForgotPasswordDTO