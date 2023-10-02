const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]
const connectionString = `mongodb+srv://sidbx:${password}@cluster0.krnoznc.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(connectionString)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const PersonModel = mongoose.model("Person", personSchema)

if (process.argv.length === 5) {
  const doc = new PersonModel({
    name: process.argv[3],
    number: process.argv[4],
  })
  doc.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  PersonModel.find({}).then((results) => {
    results.forEach((result) => console.log(result))
    mongoose.connection.close()
  })
}


