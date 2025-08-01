require("reflect-metadata");
const {Length} = require("class-validator");

class UserLoginDTO{
    constructor({username, password}){
        if (!username || !password ){
            throw new Error("All informations are required ")
        }

        if (typeof username !== "string"){
            throw new Error("Username must be string");
        }

        if (typeof password !== "string"){
            throw new Error("Password must be string");
        }

        this.username = username;
        this.password = password;
    }
}

Reflect.decorate([
    Length(3,45, {message : "Username must be in between 3 and 45 characters"})
], UserLoginDTO.prototype, "username")

Reflect.decorate([
    Length(6, 100, {message : "Password must be in between 6 and 100 characters"})
], UserLoginDTO.prototype, "password");


module.exports = UserLoginDTO