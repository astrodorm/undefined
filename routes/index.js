const express = require('express');
const router = express.Router();
const staff = require('../helpers/staff');
const { auth } = require('../middleware/auth');
const merchant = require('../helpers/merchants');

router.route('/staff').post(staff.createStaff);
router.route('/staff/login').post(staff.staffLogin);

router.route('/merchants').post(auth, merchant.createMerchants);

module.exports = router;
