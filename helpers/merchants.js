const db = require('../models');

exports.createMerchants = async (req, res) => {
  try {
    let inputs = [
      'name',
      'location.address',
      'location.coordinates.0',
      'location.coordinates.1',
      'city'
    ];
    let err = [];
    for (let input of inputs) {
      console.log(req.body[input]);
      if (!req.body[input]) err.push(`${input} required`);
    }
    if (err.length >= 1)
      return res.status(401).json({ status: 401, message: err });

    // longitude or lng is location.coordinates.0
    // latitude or lat is location.coordinates.1
    req.body.createdBy = req.admin.email;
    const merchant = await db.Merchant.create(req.body);
    res.status(200).json({ status: 200, data: merchant });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ status: 400, message: e.message });
  }
};