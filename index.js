const app = require('./app');

const mongoose  = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// mongoose.connect(process.env.DATABASEURL).then(()=>{
//     console.log("DATABASE Connected");
// }).catch((e)=>{
//     console.log('DATABASE Not Connected' + e.message);
// })
// const port = process.env.PORT || 8080;

const PORT = process.env.PORT || 8080

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASEURL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
 
// app.listen(port,()=>{
//     console.log("Server is Running on " + port);
// });

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})