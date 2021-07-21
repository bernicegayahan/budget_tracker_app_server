const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'First Name is Required']
	},
	lastName: {
		type: String,
		required: [true, 'Last Name is Required']
	},
	email: {
		type: String,
		required: [true, 'Email Address is Required']
	},
	mobileNo: {
		type: String,
		required: [true, 'Mobile Number is Required']
	},
	password: {
		type: String,
		required: [true, 'Password is Required']
	},
	categories: [
		{
			name: {
				type: String,
				required: [true, 'Category Name is Required']
			},
			type: {
				type: String,
				required: [true, 'Category Type is Required']
			} //if the object is an income or an expense.
		}
	],
	transactions: [
		//we want the user to be able to create multiple transactions
		{
			categoryName: {
				type: String,
				required: [true, 'Category Name is required']
			},
			type: {
				type: String,
				required: [true, 'Transaction Type is required']
			},
			amount: {
				type: Number,
				required: [true, 'Transaction Amount is required']
			},
			description: {
				type: String, //we want to be an optional parameter
				default: null
			},
			balanceAfterTransaction: {
				type: Number,
				required: [true, 'Balance is Required']
			},
			dateAdded: {
				type: Date,
				default: new Date()
			}
		}
	]
})

module.exports = mongoose.model('User', userSchema)
