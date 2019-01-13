const csv = require('fast-csv');
const Json2csvParser = require('json2csv').Parser;
const db = require('../models');
const pool = require('../models/connect3rdParty');
const { reusable } = require('../utils/dbFunction');

exports.csvTemplateForProducts = async (req, res) => {
  const fields = ['itemCode', 'merchantID', 'categoryID'];
  const data = '';
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(data);

  // to tell there's a file to be downloaded
  res.set('Content-Disposition', 'attachment;filename=product.csv');
  // to set content-type, application/octet-stream saying we don't know the type of file
  res.set('Content-Type', 'application/octet-stream');

  res.send(csv);
};

exports.parseCSVProduct = async (req, res) => {
  try {
    if (!req.files || !req.files.csv)
      return res.status(400).json({ status: 400, message: `No file to parse` });

    let productFile = req.files.csv;

    if (productFile.mimetype != 'text/csv')
      return res
        .status(400)
        .json({ status: 400, message: `Only csv format allowed` });
    let products = [];
    let faulty = [];

    csv
      .fromString(productFile.data.toString(), {
        headers: true,
        ignoreEmpty: true
      })
      .validate(data => {
        return data.itemCode && data.merchantID && data.categoryID;
      })
      .on('data-invalid', data => {
        faulty.push(data);
      })
      .on('data', data => {
        data.isPickupAvailable = true;
        data.createdBy = req.admin.email;
        products.push(data);
      })
      .on('end', async () => {
        let inserted = await db.ProductV2.insertMany(products);
        let insertedLength = inserted.length;

        if (faulty.length >= 1) {
          return res
            .status(200)
            .json({ status: 200, data: { products, faulty, insertedLength } });
        }
        return res
          .status(200)
          .json({ status: 200, data: { products, insertedLength } });
      });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.searchForProduct = async (req, res) => {
  try {
    let value = req.body.item.toUpperCase();
    let result = await pool
      .request()
      .query(
        `select ITEMCODE, DESCRIPTION, QTY, SELLINGPRICE from STOCKTABLE where DESCRIPTION LIKE('%${value}%')`
      );
    let item = await Promise.all(
      result.recordset.map(async stuff => await reusable(stuff))
    );
    res.status(200).json(item);
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
};

exports.getProductByItemCode = async (req, res) => {
  try {
    let itemCode = req.params.itemCode;
    let result = await pool
      .request()
      .query(
        `select ITEMCODE, DESCRIPTION, QTY, SELLINGPRICE from STOCKTABLE where ITEMCODE = '${itemCode}'`
      );
    let item = await Promise.all(
      result.recordset.map(async stuff => await reusable(stuff))
    );
    res.status(200).json({ status: 200, data: item });
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
};

exports.getProductByCategory = async (req, res) => {
  let categoryID = req.params.categoryID;
  const products = await db.ProductV2.find({ categoryID });
  let category = await Promise.all(
    products.map(async stuff => await reusable(stuff))
  );
  res.status(200).json({ status: 200, data: category });
};
