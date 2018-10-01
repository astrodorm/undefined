const express = require('express');
const router = express.Router();
const staff = require('../helpers/staff');
const { auth, customerAuth } = require('../middleware/auth');
const merchant = require('../helpers/merchants');
const courier = require('../helpers/courier');
const customer = require('../helpers/customer');
const drivers = require('../helpers/driver');
const product = require('../helpers/product');
const shopper = require('../helpers/shoppers');

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

router
  .route('/merchants/:id')
  .delete(auth, merchant.deleteMerchant)
  .put(auth, merchant.editMerchant);

router
  .route('/couriers')
  .post(auth, courier.createCourier)
  .get(auth, courier.fetchCouriers);

router
  .route('/couriers/:id')
  .put(auth, courier.editCourier)
  .delete(auth, courier.deleteCourier)
  .get(auth, courier.FetchACourier);

router
  .route('/customers')
  .post(customer.createCustomer)
  .get(customerAuth, customer.currentlyLoggedInCustomer);

router.route('/customers/login').post(customer.customerLogin);

router
  .route('/customers/admin')
  .get(auth, customer.getAllCustomersForAdminUsage);

router
  .route('/drivers')
  .post(auth, drivers.createdriver)
  .get(auth, drivers.fetchdrivers);

router
  .route('/drivers/:id')
  .put(auth, drivers.editdriver)
  .get(auth, drivers.fetchAdriver)
  .delete(auth, drivers.deletedriver);

router
  .route('/products')
  .post(auth, product.uploadProductImage, product.createProduct)
  .get(product.fetchAllProducts);

router.route('/products/pickup').get(product.fetchProductsWherePickupIs);
router.route('/products/search').get(product.searchForProduct);

router
  .route('/products/:id')
  .put(auth, product.uploadProductImage, product.editProduct)
  .delete(auth, product.removeProduct)
  .get(product.fetchAProduct);

router
  .route('/shoppers')
  .post(auth, shopper.createshopper)
  .get(auth, shopper.fetchshoppers);

router
  .route('/shoppers/:id')
  .get(auth, shopper.fetchAshopper)
  .put(auth, shopper.editshopper)
  .delete(auth, shopper.deleteshopper);

module.exports = router;
