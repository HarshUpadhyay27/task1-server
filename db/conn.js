const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/task1", {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('connection sucessfully')
}).catch((e)=>{
    console.log('No connection' + e)
})