const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
//i want to select a port in which i want to run the project. 
const PORT = 4000; 

//lets now connect to the our database platform
//inject a connection string on the first parameter of the connect()
//dont copy my credentials!
const ConnectionString = process.env.DB_CONNECT

mongoose.connect(ConnectionString, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
mongoose.connection.once('open', () => {
	console.log("Now connected to MongoDB Atlas!")
})

app.listen(PORT, () => {
	console.log(`Server is online on port: ${PORT}`); 
})