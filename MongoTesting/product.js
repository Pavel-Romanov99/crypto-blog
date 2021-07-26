const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/shopApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected!")
    })
    .catch(err => {
        console.log("Error with connection")
        console.log(err)
    })

//constraints
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    onsale: {
        type: Boolean,
        default: false
    },
    qty: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    }
})

const Product = mongoose.model('Product', productSchema);

const bike = new Product({ name: 'Mountain bike', price: 100 })

bike.save()
    .then(data => {
        console.log(data)
        console.log('worked')
    })
    .catch(err => {
        console.log(err)
    })

//keep validators while updating
Product.findOneAndUpdate({ name: 'Mountain bike' }, { price: -2 }, { new: true, runValidators: true })

//methods on schemas
//this refers to the individual entry
productSchema.methods.addCategory = function (cat) {
    this.categories.push(cat)
    return this.save();
}
//in static methods the word this refers to the entire model
productSchema.static.fireSale = function () {
    return this.updateMany({}, { price: 0 })
}

const findProduct = async () => {
    const foundProduct = await Product.findOne({ name: 'Mountain bike' });
    foundProduct.greet();
}