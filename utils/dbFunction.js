const db = require('../models');

exports.reusable = async stuff => {
  let itemCode = stuff.ITEMCODE;

  const cataloguePromise = db.Catalogue.findOne({
    itemCode
  });

  const productPromise = db.ProductV2.findOne({
    itemCode
  });
  const [catalogue, product] = await Promise.all([
    cataloguePromise,
    productPromise
  ]);

  let thumbnail;
  if (catalogue && catalogue.thumbnail) {
    thumbnail = catalogue.thumbnail;
  }
  let isPickupAvailable, merchantID, categoryID;
  if (product) {
    isPickupAvailable = product.isPickupAvailable;
    merchantID = product.merchantID;
    categoryID = product.categoryID;
  }
  return {
    ITEMCODE: itemCode,
    DESCRIPTION: stuff.DESCRIPTION,
    QUANTITY: stuff.QTY,
    SELLINGPRICE: stuff.SELLINGPRICE,
    image: thumbnail,
    isPickupAvailable,
    categoryID,
    merchantID
  };
};
