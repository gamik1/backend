const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.CLUSTER}/${process.env.DBNAME}?retryWrites=true&w=majority`);
mongoose.connection.on("connected", function(){    
    console.log("Application is connected to Databse");
})