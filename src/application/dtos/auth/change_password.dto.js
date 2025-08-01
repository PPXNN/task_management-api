require("reflect-metadata");
const {Length} = require("class-validator");

class ChangePasswordDTO{
    constructor({username, old_password, new_password, confirm_new_password}){
        if (!username || !old_password || !new_password || !confirm_new_password){
            throw new Error("All informations are required ")
        }

        if (typeof username !== "string"){
            throw new Error("Username must be string");
        }

        if (typeof old_password !== "string"){
            throw new Error("Old password must be string");
        }

        if (typeof new_password !== "string"){
            throw new Error("New password must be string");
        }

        if (typeof confirm_new_password !== "string"){
            throw new Error("Confirm new password must be string");
        }
        
        this.username = username;
        this.old_password = old_password;
        this.new_password = new_password;
        this.confirm_new_password = confirm_new_password;
    }
}

Reflect.decorate([
    Length(3,45, {message : "Username must be in between 3 and 45 characters"})
], ChangePasswordDTO.prototype, "username");

Reflect.decorate([
    Length(6, 100, {message : "Old password must be in between 6 and 100 characters"})
], ChangePasswordDTO.prototype, "old_password");

Reflect.decorate([
    Length(6, 100, {message : "New password must be in between 6 and 100 characters"})
], ChangePasswordDTO.prototype, "new_password");

Reflect.decorate([
    Length(6, 100, {message : "Confirm new password must be in between 6 and 100 characters"})
], ChangePasswordDTO.prototype, "confirm_new_password");

module.exports = ChangePasswordDTO