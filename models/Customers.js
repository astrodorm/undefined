const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true
    },
    lastname: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: `Email is required`,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: Number,
      trim: true
    },
    gender: {
      type: String,
      trim: true
    },
    birthday: String,
    oauth: {
      type: String,
      required: `Password is required`
    },
    deviceType: String
  },
  { timestamps: true }
);

customerSchema.pre('save', async function(next) {
  let customer = this;
  if (customer.isModified('oauth')) {
    const hash = await bcrypt.hash(customer.oauth, 10);
    customer.oauth = hash;
    next();
  } else {
    next();
  }
});

customerSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.oauth);
};

customerSchema.methods.toJSON = function() {
  const { oauth, ...rest } = this.toObject();
  return { ...rest };
};

module.exports = mongoose.model('Customer', customerSchema);
