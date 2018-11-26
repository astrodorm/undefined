const db = require('../models');
const { Emessage } = require('../utils/err');

exports.notFound = async (req, res) => {
  try {
    const notFound = await db.NotFound.create(req.body);
    res.status(200).json({ status: 200, data: notFound });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchNotFound = async (req, res) => {
  try {
    const notFounds = await db.NotFound.find({});
    res.status(200).json({ status: 200, data: notFounds });
  } catch (e) {
    Emessage(e, res);
  }
};
