const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => console.log('connected to db'))
  .catch(() => console.log('error connecting to db'))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (num) => /^\d{2,3}-\d+$/.test(num),
      message: (props) => `${props.value} is an invalid phone number`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    returnedObject.id = returnedObject._id.toString()
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete returnedObject._id
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
