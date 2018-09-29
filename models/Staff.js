const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: `Admin name required`
    },
    email: {
      type: String,
      unique: true,
      required: `Email required`
    },
    oauth: {
      type: String,
      required: 'Password is required'
    },
    isAdmin: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

staffSchema.pre('save', async function(next) {
  let staff = this;
  if (staff.isModified('oauth')) {
    const hash = await bcrypt.hash(staff.oauth, 10);
    staff.oauth = hash;
    next();
  } else {
    next();
  }
});

staffSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.oauth);
};

staffSchema.methods.toJSON = function() {
  const { oauth, ...rest } = this.toObject();
  return { ...rest };
};

module.exports = mongoose.model('Staff', staffSchema);
