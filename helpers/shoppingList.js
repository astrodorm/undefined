const db = require('../models');
const {} = require('../');

exports.addToCart = async (req, res) => {
  try {
    let customerID = req.customer._id;

    let customerCart = await db.ShoppingList.findOne({ customerID });
    if (!customerCart) {
      customerCart = await db.ShoppingList.create({ customerID });
    }

    let shoppingCart = await db.ShoppingList.findOneAndUpdate(
      {
        customerID
      },
      { $addToSet: { list: req.body.productID } },
      { new: true }
    );

    res.status(200).json({ status: 200, data: shoppingCart });
  } catch (e) {
    Emessage(e, req);
  }
};
