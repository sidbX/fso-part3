const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
.then(() => console.log('connected to db'))
.catch(() => console.log('error connecting to db'))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (num) => {
                return /^\d{2,3}-\d+$/.test(num)
            },
            message: props => `${props.value} is an invalid phone number`
        }
        // validator: {
        //     (num) => {
        //         return /\d{3}-\d{3}-\d{4}/.test(v)
        //     },
        // }
    }
})

personSchema.set('toJSON',{
    transform: (document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports=mongoose.model('Person',personSchema)