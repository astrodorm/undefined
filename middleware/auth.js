const jwt = require('jsonwebtoken');
const db = require('../models');

exports.auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).json({ status: 401, message: `Access Denied` });

    let access = req.headers.authorization.split(' ')[1];
    let tokenVerification = await jwt.verify(access, process.env.SECRET);
    let staff = await db.Staff.findOne({ _id: tokenVerification._id });

    if (!staff)
      return res
        .status(401)
        .json({ status: 401, message: `Please log in as admin` });
    if (!staff.isAdmin)
      return res.status(401).json({
        status: 401,
        message: `Only admins allowed to perform this operation`
      });
    req.admin = staff;
    next();
  } catch (e) {
    return res.status(401).json({ status: 401, message: e.message });
  }
};

exports.customerAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res
        .status(401)
        .json({ status: 401, message: `Unauthorized access` });
    let access = req.headers.authorization.split(' ')[1];
    let customerVerification = await jwt.verify(access, process.env.SECRET);
    let customer = await db.Customer.findOne({ _id: customerVerification._id });
    if (!customer)
      return res
        .status(401)
        .json({ status: 401, message: `No customer found` });
    req.customer = customer;
    next();
  } catch (e) {
    return res.status(401).json({ status: 401, message: e.message });
  }
};
