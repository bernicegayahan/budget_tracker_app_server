const User = require('../models/user')
const bcrypt = require('bcrypt');
const auth = require('../auth');
const { findById } = require('../models/user');
const moment = require('moment')

//[Primary Section]

//Email exists checker
module.exports.emailExists = (params) => {
  return User.find({ email: params.email }).then(result => {
    return result.length > 0 ? true : false
  })
}

//Register New Account
module.exports.register = (data) => {
  let newUser = new User({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    mobileNo: data.mobileNo,
    password: bcrypt.hashSync(data.password, 10),
    //loginType: 'email'

  })
  //save the info inside the database
  return newUser.save().then((user, err) => {
    return (err) ? false : true
  })
}

//login
module.exports.login = (params) => {
  console.log(params.email) //checking purposes
  const { email, password } = params
  return User.findOne({ email }).then(user => {
    //what if there are no records found?
    if (!user) return false;
    //compare the password to hashed password in db
    let isPasswordMatched = bcrypt.compareSync(password, user.password)
    if (!isPasswordMatched) return false;

    //and if the passwords do match, then generate an access token.
    let accessToken = auth.createAccessToken(user)
    return {
      accessToken: accessToken
    }
  })
}

//get details
module.exports.get = (params) => {
  return User.findById(params.userId).then(user => {
    user.password = undefined
    return user
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

// addRecord
module.exports.addRecord = (params) => {
  return User.findById(params.userId).then(user => {
    // describe what will happen if te user has been fond
    // lets have the app compute for the remaining balance of the user after each transaction.
    let balanceAfterTransaction = 0

    // lets create a control structure for the app to determine if the balance needs to be reduced or increased.
    if (user.transactions.length !== 0) {
      // have existing transaction record
      balanceBeforeTransaction = user.transactions[user.transactions.length - 1].balanceAfterTransaction

      // create another control structure to determine operation that will be done to the users creadit
      if (params.typeName === 'income') {
        // imject the sum as a new value of the balanceAfterTransaction variable
        balanceAfterTransaction = balanceBeforeTransaction + params.amount
      }
      else {
        // imject the difference as a new value of the balanceAfterTransaction variable
        balanceAfterTransaction = balanceBeforeTransaction - params.amount
      }

    }
    else {
      // no transaction record
      balanceAfterTransaction = params.amount
    }

    // identify the user
    return User.findById(params.userId)
      .then(user => {
        user.transactions.push({
          categoryName: params.categoryName,
          type: params.type,
          amount: params.amount,
          description: params.description,
          balanceAfterTransaction: balanceAfterTransaction
        })

        return user.save()
          .then((user, error) => {
            return (error) ? false : true
          })
      })
  })
}
//retrieve categories

module.exports.getCategories = (params) => {
  return User.findById(params.userId).then(user => {
    //lets create a control structure that will describe the response to the user was found or not
    //return user.categories
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

//[Secondary Section]


//retrieve user details
module.exports.get = (params) => {
  return User.findById(params.userId).then(user => {
    return { email: user.email }
  })
}
// getCategories
module.exports.getCategories = (params) => {
  return User.findById(params.userId).then(user => {
    // return user.categories
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
      return { categoryName: category.name, totalAmount: 0 }
    })

    user.transactions.filter((transaction) => {
      //moment is used for date manipulation
      const isSameOrAfter = moment(transaction.dateAdded).isSameOrAfter(params.fromDate, 'day')
      const isSameOrBefore = moment(transaction.dateAdded).isSameOrBefore(params.toDate, 'day')

      if (isSameOrAfter && isSameOrBefore) {
        for (let i = 0; i < summary.length; i++) {
          if (summary[i].categoryName === transaction.categoryName) {
            summary[i].totalAmount += transaction.amount
          }
        }
      }
    })
    return summary
  })
}


