const Jimp = require('jimp');
const uuidv4 = require('uuid/v4');
const path = require('path');
const db = require('../models');
const { Emessage, Validator } = require('../utils/err');

exports.uploadProductImage = async (req, res, next) => {
  try {
    if (!req.files)
      return res
        .status(400)
        .json({ status: 400, message: `Product image upload expected` });

    const mimetype = req.files.thumbnail.mimetype;
    const extension = `${mimetype.split('/')[1]}`;

    if (!mimetype.includes('image'))
      return res
        .status(400)
        .json({ status: 400, message: `Only images are allowed` });

    let filepath = path.join(__dirname, '..', 'public/upload');

    req.body.thumbnail = `${filepath}/${uuidv4()}.${extension}`;
    const image = await Jimp.read(req.files.thumbnail.data);
    await image.resize(500, Jimp.AUTO).quality(70);
    await image.write(`./public/upload/${req.body.thumbnail}`);

    next();
  } catch (e) {
    Emessage(e, res);
  }
};

exports.createProduct = async (req, res) => {
  try {
    let inputs = ['productName', 'price', 'merchantID'];

    let errMessages = Validator(inputs, req);
    if (errMessages.length >= 1)
      return res.status(400).json({ status: 400, message: errMessages });

    req.body.createdBy = req.admin.email;
    const products = await db.Product.create(req.body);
    res.status(200).json({ status: 200, data: products });
  } catch (e) {
    Emessage(e, res);
  }
};
