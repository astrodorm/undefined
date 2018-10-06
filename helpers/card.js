const rp = require('request-promise-native');
const db = require('../models');
const { Emessage, Validator } = require('../utils/err');
const paystackURI = 'https://api.paystack.co';

exports.chargeCard = async (req, res) => {
  try {
    const body = {
      email: req.customer.email,
      amount: req.body.amount,
      card: {
        number: req.body.number,
        cvv: req.body.cvv,
        expiry_month: req.body.expiry_month,
        expiry_year: req.body.expiry_year
      }
    };
    const options = {
      method: 'POST',
      uri: `${paystackURI}/charge`,
      body,
      json: true,
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET}` }
    };
    const response = await rp(options);
    res.status(200).json({ status: 200, data: response });
  } catch (e) {
    console.log(e);
    if (e.error)
      return res
        .status(e.statusCode)
        .json({ status: e.statusCode, error: e.error });
    Emessage(e, res);
  }
};

exports.addPin = async (req, res) => {
  try {
    const body = {
      pin: req.body.pin,
      reference: req.body.reference
    };
    const options = {
      method: 'POST',
      uri: `${paystackURI}/charge/submit_pin`,
      body,
      json: true,
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET}` }
    };
    const response = await rp(options);
    res.status(200).json({ status: 200, data: response });
  } catch (e) {
    console.log(e);
    if (e.error)
      return res
        .status(e.statusCode)
        .json({ status: e.statusCode, error: e.error });
    Emessage(e, res);
  }
};

exports.addOtp = async (req, res) => {
  try {
    const body = {
      otp: req.body.otp,
      reference: req.body.reference
    };
    const options = {
      method: 'POST',
      uri: `${paystackURI}/charge/submit_otp`,
      body,
      json: true,
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET}` }
    };

    const response = await rp(options);
    res.status(200).json({ status: 200, data: response });
  } catch (e) {
    if (e.error)
      return res
        .status(e.statusCode)
        .json({ status: e.statusCode, error: e.error });
    Emessage(e, res);
  }
};

exports.addPhone = async (req, res) => {
  try {
    const body = {
      phone: req.body.phone,
      reference: req.body.reference
    };
    const options = {
      method: 'POST',
      uri: `${paystackURI}/charge/submit_phone`,
      body,
      json: true,
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET}` }
    };

    const response = await rp(options);
    res.status(200).json({ status: 200, data: response });
  } catch (e) {
    if (e.error)
      return res
        .status(e.statusCode)
        .json({ status: e.statusCode, error: e.error });
    Emessage(e, res);
  }
};

exports.getPending = async (req, res) => {
  try {
    const options = {
      method: 'GET',
      uri: `${paystackURI}/charge/${req.params.reference}`,
      json: true,
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET}` }
    };
    const response = await rp(options);
    res.status(200).json({ status: 200, data: response });
  } catch (e) {
    if (e.error)
      return res
        .status(e.statusCode)
        .json({ status: e.statusCode, error: e.error });
    Emessage(e, res);
  }
};
