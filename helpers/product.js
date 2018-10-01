const Jimp = require('jimp');
const uuidv4 = require('uuid/v4');
const path = require('path');
const db = require('../models');
const { Emessage, Validator } = require('../utils/err');

exports.uploadProductImage = async (req, res, next) => {
  try {
    if (!req.files) {
      return next();
    }

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

    if (isNaN(Number(req.body.price)))
      return res
        .status(400)
        .json({ status: 400, message: `Expecting price in figures` });

    req.body.createdBy = req.admin.email;
    const products = await db.Product.create(req.body);
    res.status(200).json({ status: 200, data: products });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.editProduct = async (req, res) => {
  try {
    let _id = req.params.id;
    const product = await db.Product.findOneAndUpdate({ _id }, req.body, {
      new: true
    });

    res.status(200).json({ status: 200, data: product });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchAllProducts = async (req, res) => {
  try {
    const products = await db.Product.find({});
    res.status(200).json({ status: 200, data: products });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchProductsWherePickupIs = async (req, res) => {
  try {
    const pickupProducts = await db.Product.find({
      isPickupAvailable: true
    });

    res.status(200).json({ status: 200, data: pickupProducts });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const product = await db.Product.deleteOne({ _id: req.params.id });
    if (product.ok && product.n)
      return res
        .status(200)
        .json({ status: 200, data: `product successfully deleted` });

    return res
      .status(400)
      .json({ status: 400, message: `Couldn't delete product` });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchAProduct = async (req, res) => {
  try {
    const product = await db.Product.findOne({
      _id: req.params.id
    }).populate('merchantID', 'name city state location.address');
    res.status(200).json({ status: 200, data: product });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.searchForProduct = async (req, res) => {
  try {
    const q = req.query.q;
    const products = await db.Product.find({
      productName: {
        $regex: new RegExp(q),
        $options: 'i'
      }
    });

    res.status(200).json({ status: 200, data: products });
  } catch (e) {
    Emessage(e, res);
  }
};
