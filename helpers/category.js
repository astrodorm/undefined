const db = require('../models');
const { Emessage } = require('../utils/err');

exports.createcategory = async (req, res) => {
  try {
    if (!req.body.categoryName)
      return res
        .status(400)
        .json({ status: 400, message: `Category name is required` });

    req.body.createdBy = req.admin.email;
    const category = await db.Category.create(req.body);
    res.status(200).json({ status: 200, data: category });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchcategories = async (req, res) => {
  try {
    const categories = await db.Category.find({}).sort({ createdAt: -1 });
    res.status(200).json({ status: 200, data: categories });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.editcategory = async (req, res) => {
  try {
    const category = await db.Category.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json({ status: 200, data: category });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.deletecategory = async (req, res) => {
  try {
    const category = await db.Category.deleteOne({ _id: req.params.id });
    if (category.ok && category.n)
      return res
        .status(200)
        .json({ status: 200, data: `category successfully deleted` });

    return res
      .status(400)
      .json({ status: 400, message: `Couldn't delete category` });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchAcategory = async (req, res) => {
  try {
    const category = await db.Category.findOne({ _id: req.params.id });
    res.status(200).json({ status: 200, data: category });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchProductsByCategory = async (req, res) => {
  try {
    let categoryID = req.params.categoryID;
    const products = await db.Product.find({ categoryID });
    res.status(200).json({ status: 200, data: products });
  } catch (e) {
    Emessage(e, res);
  }
};
