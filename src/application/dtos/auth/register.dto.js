require("reflect-metadata");
const { Length, IsEmail, Matches} = require("class-validator");


class UserRegisterDTO{
    constructor({username, password, firstname, lastname, phone_number, email}){
        if (!username || !password || !firstname || !lastname || !phone_number || !email){
            throw new Error("All informations are required ")
        }
        if (typeof username !== "string"){
            throw new Error("Username must be string");
        }

        if (typeof password !== "string"){
            throw new Error("Password must be string");
        }

        if (typeof firstname !== "string"){
            throw new Error("Firstname must be string");
        }

        if (typeof lastname !== "string"){
            throw new Error("Lastname must be string");
        }

        if (typeof phone_number !== "string"){
            throw new Error("Phone number must be string");
        }

        if (typeof email !== "string"){
            throw new Error("Email number must be string");
        }
        
        this.username = username;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.phone_number = phone_number;
        this.email= email;
    }
}

Reflect.decorate([
    Length(3,45, {message : "Username must be in between 3 and 45 characters"})
], UserRegisterDTO.prototype, "username");

Reflect.decorate([
    Length(6, 100, {message : "Password must be in between 6 and 100 characters"})
], UserRegisterDTO.prototype, "password");

Reflect.decorate([
    Length(2, 45, {message : "Firstname must be in between 2 and 45 characters"})
], UserRegisterDTO.prototype, "firstname");

Reflect.decorate([
    Length(2, 45, {message : "Lastname must be in between 2 and 45 characters"})
],UserRegisterDTO.prototype, "lastname");

Reflect.decorate([
    Matches(/^(\+66|0)\d{9,15}$/, {message: "Phone number must start with +66 or 0 and contain 9–15 digits."})
],UserRegisterDTO.prototype, "phone_number");

Reflect.decorate([
    IsEmail({}, { message: "Email must be a valid email address" })
], UserRegisterDTO.prototype, "email");

module.exports = UserRegisterDTO;