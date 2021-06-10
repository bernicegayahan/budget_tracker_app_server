const express = require('express')
const app = express()

//i want to select a port in which i want to run the project. 
const PORT = 4000; 

app.listen(PORT, () => {
	console.log(`Server is online on port: ${PORT}`); 
})