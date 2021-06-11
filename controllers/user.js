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


//Create Category 
module.exports.addCategory = (params) => {
   //the app needs to identify the user first 
   //were going to target the user by his/her ID
   return User.findById(params.userId).then(user => {
   	 //describe what will happen upon getting the result of the query.
   	 user.categories.push({
   	 	name: params.name,
   	 	type: params.typeName
   	 })

   	 //we need to save the changes in the element inside our database
   	 return user.save().then((user, err) => {
         return (err) ? false : true
   	 })
   })
}



//[Secondary Section]

//Email Exists Checker 