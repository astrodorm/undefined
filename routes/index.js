const express = require('express');
const router = express.Router();
const staff = require('../helpers/staff');

router.route('/staff').post(staff.createStaff);
router.route('/staff/login').post(staff.staffLogin);

module.exports = router;
