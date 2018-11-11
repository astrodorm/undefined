const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const db = require('../models');
const { Emessage, Validator } = require('../utils/err');

exports.createCustomer = async (req, res) => {
  try {
    let inputs = ['firstname', 'lastname', 'email', 'oauth'];

    let errMessages = Validator(inputs, req);
    if (errMessages.length >= 1)
      return res.status(400).json({ status: 400, message: errMessages });

    if (req.body.phoneNumber && isNaN(Number(req.body.phoneNumber)))
      return res
        .status(400)
        .json({ status: 400, message: `Phone  number must be numbers only` });

    if (!isEmail(req.body.email))
      return res
        .status(400)
        .json({ status: 400, message: `Please enter an email address` });

    const exists = await db.Customer.findOne({ email: req.body.email });
    if (exists)
      return res
        .status(400)
        .json({ status: 400, message: `Customer with email already exist` });

    const customer = await db.Customer.create(req.body);
    const token = await jwt.sign({ _id: customer._id }, process.env.SECRET, {
      expiresIn: '8760h'
    });
    res.status(200).json({ status: 200, data: { customer, token } });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.customerLogin = async (req, res) => {
  try {
    const customer = await db.Customer.findOne({ email: req.body.email });
    if (!customer)
      return res
        .status(401)
        .json({ status: 401, message: `Email or Password Incorrect` });

    const pass = await customer.comparePassword(req.body.oauth);
    if (!pass)
      return res
        .status(401)
        .json({ status: 401, message: `Email or Password Incorrect` });

    const token = await jwt.sign({ _id: customer._id }, process.env.SECRET, {
      expiresIn: '8760h'
    });
    res.status(200).json({ status: 200, data: { customer, token } });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.currentlyLoggedInCustomer = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ status: 200, data: { customer: req.customer } });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.getAllCustomersForAdminUsage = async (req, res) => {
  try {
    const customers = await db.Customer.find({});
    res.status(200).json({ status: 200, data: customers });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.editCustomer = async (req, res) => {
  try {
    if (req.body.oauth) {
      req.body.oauth = await bcrypt.hash(req.body.oauth, 10);
    }
    const customer = await db.Customer.findOneAndUpdate(
      { _id: req.customer._id },
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({ status: 200, data: customer });
  } catch (e) {
    Emessage(e, res);
  }
};
