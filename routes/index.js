const express = require('express');
const router = express.Router();
const staff = require('../helpers/staff');
const { auth } = require('../middleware/auth');
const merchant = require('../helpers/merchants');

router
  .route('/staff')
  .post(staff.createStaff)
  .get(auth, staff.getStaff);
router.route('/staff/login').post(staff.staffLogin);

router
  .route('/merchants')
  .post(auth, merchant.createMerchants)
  .get(auth, merchant.fetchAllMerchants);

router.route('/merchants/near').get(merchant.fetchMerchantsByLocation);
router.route('/merchants/search').get(merchant.searchMerchantByName);

router.route('/merchants/:id').delete(auth, merchant.deleteMerchant);

module.exports = router;
