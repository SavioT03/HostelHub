const mongoose = require('mongoose')

const connectionString= process.env.connectionString

mongoose.connect(connectionString).then((res)=>{
    console.log('Successfully connected to MongoDB');
}).catch((err)=>{
    console.log(err);
    console.log('Failed to connect with MongoDB');
})