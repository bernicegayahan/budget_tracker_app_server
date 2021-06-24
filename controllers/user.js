const User = require('../models/user')
const bcrypt = require('bcrypt');
const auth = require('../auth'); 
const moment = require('moment')

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


//login
//lets now create our login function 
module.exports.login = (params) => {
    console.log(params.email) //checking purposes
    const {email, password} = params
    return User.findOne({email}).then( user => {
      //what if there are no records found?
      if(!user) return false;
      //compare the password to hashed password in db
      let isPasswordMatched = bcrypt.compareSync(password, user.password)
      if(!isPasswordMatched) return false; 

      //and if the passwords do match, then generate an access token.
      let accessToken = auth.createAccessToken(user)
      return {
        accessToken: accessToken
      }
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
   	 	type: params.type
   	 })

   	 //we need to save the changes in the element inside our database
   	 return user.save().then((user, err) => {
         return (err) ? false : true
   	 })
   })
}

//Create New Record
module.exports.addRecord = (params) => {
  //identify the user 
  return User.findById(params.userId).then(user => {
    //describe what will happen if the user has been found.
    //lets have the app compute for the remaining balance of the user after each transaction. 

    let balanceAfterTransaction = 0

    //lets create a control structure for the app to determine if the balance needs to be reduced or increased. 
    if (user.transactions.length !== 0) {
      //meron ng existing records si user na may transactions siya
      const balanceBeforeTransaction = user.transactions[user.transactions.length - 1].balanceAfterTransaction

      //create another control structure to determine operation that will be done to the user's credit.
      if (params.typeName === 'Income') {
        //inject the sum as the new value of the balanceAfterTransaction variable
        balanceAfterTransaction = balanceBeforeTransaction + params.amount
      } else {
        //inject the difference as the new value of the balanceAfterTransaction variable
        balanceAfterTransaction = balanceBeforeTransaction - params.amount
      }
    } else {
      //wala pang existing records.
        balanceAfterTransaction = params.amount
    } 

    user.transactions.push({
       categoryName: params.categoryName,
       type: params.typeName, 
       amount: params.amount,
       description: params.description,
       balanceAfterTransaction: balanceAfterTransaction
    })

    return user.save().then((user, error) => {
      return (error) ? false : true
    })
  })
}

//Group Work
//Create a Logic for Retrieve Categories 
module.exports.getCategories = (params) => {
  return User.findById(params.userId).then(user => {
    //lets create a control structure that will describe the response to the user was found of not.
    //return user.categories
   // keep in mind that this if else is already a stretch goal
     if (typeof params.typeName === "undefined") {
        return user.categories
     } 
     return user.categories.filter((category) => {
        if (category.type === params.typeName) {
          return category
        }
     })
  })
}



//Retrieve Records Breakdown
module.exports.getRecordsBreakdownByRange = (params) => {
   return User.findById(params.userId).then(user => {
      const summary = user.categories.map((category) => {
        return { categoryName: category.name, totalAmount: 0}
      })

      user.transactions.filter((transaction) => {
        //moment is used for date manipulation
        const isSameOrAfter = moment(transaction.dateAdded).isSameOrAfter(params.fromDate, 'day')
        const isSameOrBefore = moment(transaction.dateAdded).isSameOrBefore(params.toDate, 'day')

        if(isSameOrAfter && isSameOrBefore) {
          for(let i = 0; i < summary.length; i++) {
            if(summary[i].categoryName === transaction.categoryName){
              summary[i].totalAmount += transaction.amount
            }
          }
        }
      })
      return summary
   })
}

//Retrieve Records 

//30 mins to accomplish the task 5 sending the Demo video test via postman


//[Secondary Section]

//Email Exists Checker 

//retrieve user details
module.exports.get = (params) => {
  return User.findById(params.userId).then(user => {
    return { email: user.email }
  })
}