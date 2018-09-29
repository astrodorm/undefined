const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const merchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: `Merchant name is required`
    },
    location: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: [
        {
          type: Number,
          required: `You must enter coordinates`
        }
      ],
      address: {
        type: String,
        required: `You must provide an address`
      }
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    createdBy: String
  },
  { timestamps: true }
);

merchantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Merchant', merchantSchema);
