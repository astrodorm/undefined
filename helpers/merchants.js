const db = require('../models');
const { Emessage, Validator } = require('../utils/err');

exports.createMerchants = async (req, res) => {
  try {
    let inputs = [
      'name',
      'location.address',
      'location.coordinates.0',
      'location.coordinates.1',
      'city'
    ];

    let errMessages = Validator(inputs, req);
    if (errMessages.length >= 1)
      return res.status(400).json({ status: 400, message: errMessages });

    // longitude or lng is location.coordinates.0
    // latitude or lat is location.coordinates.1
    req.body.createdBy = req.admin.email;
    const merchant = await db.Merchant.create(req.body);
    res.status(200).json({ status: 200, data: merchant });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchAllMerchants = async (req, res) => {
  try {
    const merchants = await db.Merchant.find({}).sort({ createdAt: -1 });
    res.status(200).json({ status: 200, data: merchants });
  } catch (e) {
    return res.status(401).json({ status: 401, message: err });
  }
};

exports.fetchMerchantsByLocation = async (req, res) => {
  try {
    const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates
          },
          $maxDistance: 10000 //10000km
        }
      }
    };

    const merchants = await db.Merchant.find(query).sort({ createdAt: -1 });
    res.status(200).json({ status: 200, data: merchants });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.searchMerchantByName = async (req, res) => {
  try {
    let q = req.query.q;

    const merchants = await db.Merchant.find({
      name: { $regex: new RegExp(q), $options: 'i' }
    }).sort({ createdAt: -1 });

    res.status(200).json({ status: 200, data: merchants });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.deleteMerchant = async (req, res) => {
  try {
    let _id = req.params.id;
    const merchant = await db.Merchant.deleteOne({ _id });

    if (merchant.ok && merchant.n)
      return res
        .status(200)
        .json({ status: 200, data: `Merchant successfully deleted` });

    return res.status(400).json({
      status: 400,
      message: `Merchant was not successfully deleted.`
    });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.editMerchant = async (req, res) => {
  try {
    let _id = req.params.id;

    const merchant = await db.Merchant.findOneAndUpdate({ _id }, req.body, {
      new: true
    });
    return res.status(200).json({ status: 200, data: merchant });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchMerchantNearBy = async (req, res) => {
  try {
    const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates
          },
          $maxDistance: 1000 //1000m
        }
      }
    };

    const merchants = await db.Merchant.find(query).sort({ createdAt: -1 });
    let nearby;
    if (merchants.length >= 1) nearby = true;
    else nearby = false;
    res.status(200).json({ status: 200, nearby });
  } catch (e) {
    Emessage(e, res);
  }
};
