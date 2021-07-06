const mongoose = require('mongoose');

const ConnectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:true,
        useUnifiedTopology:true
    });

    console.log('MongoDB Connected');

}

module.exports = ConnectDB;