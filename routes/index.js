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
const shoppingList = require('../helpers/shoppingList');
const order = require('../helpers/order');
const feedback = require('../helpers/feedback');
const card = require('../helpers/card');
const category = require('../helpers/category');

router
  .route('/staff')
  .post(staff.createStaff)
  .get(auth, staff.getStaff);
router.route('/staff/login').post(staff.staffLogin);
router.route('/staff/all').get(auth, staff.fetchAllStaffs);

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

router.route('/products/pickup/search').get(product.fetchProductsWherePickupIs);
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

router.route('/carts/add').post(customerAuth, shoppingList.addToCart);
router.route('/carts/remove').post(customerAuth, shoppingList.removeFromCart);
router.route('/carts').get(customerAuth, shoppingList.fetchCustomerCart);

router.route('/orders/create').get(customerAuth, order.createCustomerOrder);
router.route('/orders/status').put(auth, order.updateOrderStatus);
router.route('/orders/all').get(auth, order.getAllOrders);
router
  .route('/orders/:id')
  .get(auth, order.getOneOrder)
  .put(auth, order.updateOrder);

router.route('/feedbacks').post(customerAuth, feedback.giveFeedback);

router.route('/cards/charge').post(customerAuth, card.chargeCard);
router.route('/cards/charge/pin').post(customerAuth, card.addPin);
router.route('/cards/charge/otp').post(customerAuth, card.addOtp);
router.route('/cards/charge/phone').post(customerAuth, card.addPhone);
router.route('/cards/charge/:reference').get(customerAuth, card.getPending);

router
  .route('/category')
  .post(auth, category.createcategory)
  .get(auth, category.fetchcategories);

router
  .route('/category/:id')
  .get(auth, category.fetchAcategory)
  .put(auth, category.editcategory)
  .delete(auth, category.deletecategory);

module.exports = router;
