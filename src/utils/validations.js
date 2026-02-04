const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body; // Destructuring the data
    if (!firstName || !lastName) {
        throw new Error("Name is not validate");
    }
    else if (!validator.isEmail(email)) {
        throw new Error("Invalid email address");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Your password is not strong");
    }

}

//Validate input data while updating
const validateEditProfileData = (req) => {
    const ALLOWED_LIST = ["firstName", "lastName", "age", "photoUrl", "email", "gender", "about", "skills"]
    const isAllowed = Object.keys(req.body).every((field) => ALLOWED_LIST.includes(field));
    return isAllowed;
}

module.exports = { validateSignUpData, validateEditProfileData };           