const mongoose = require('mongoose')

const connectdb=  async() =>{
    try {
        await mongoose.connect(process.env.DB)
        console.log("successfull database connected");
        
    } catch (error) {
        console.log("failed to connected",error);
        
    }
}

module.exports = connectdb