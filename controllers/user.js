const User = require('../models/user')
const bcrypt = require('bcrypt');
//[Primary Section]
//Register New Account
module.exports.register = (data) => {
	let newUser = new User({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobileNo: data.mobileNo,
        password: bcrypt.hashSync(data.password, 10) 
	})
	//save the info inside the database
	return newUser.save().then((user, err) => {
        return (err) ? false : true
	})
}




//[Secondary Section]