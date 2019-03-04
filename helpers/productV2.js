const csv = require('fast-csv');
const Json2csvParser = require('json2csv').Parser;
const db = require('../models');
// const pool = require('../models/connect3rdParty');
const { reusable } = require('../utils/dbFunction');

const sql = require('mssql');

const config = {
  user: process.env.user,
  password: process.env.password,
  server: process.env.server,
  database: process.env.database
};

let connection = new sql.ConnectionPool(config);

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
    let pool = await connection.connect();
    let result = await pool
      .request()
      .query(
        `select ITEMCODE, DESCRIPTION, QTY, SELLINGPRICE from STOCKTABLE where QTY > 2 AND DESCRIPTION LIKE('%${value}%')`
      );
    let item = await Promise.all(
      result.recordset.map(async stuff => await reusable(stuff))
    );
    res.status(200).json(item);
    pool.close();
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
};

exports.getProductByItemCode = async (req, res) => {
  try {
    let itemCode = req.params.itemCode;
    let pool = await connection.connect();
    let result = await pool
      .request()
      .query(
        `select ITEMCODE, DESCRIPTION, QTY, SELLINGPRICE from STOCKTABLE where QTY > 2 AND ITEMCODE = '${itemCode}'`
      );
    let item = await Promise.all(
      result.recordset.map(async stuff => await reusable(stuff))
    );
    res.status(200).json({ status: 200, data: item });
    pool.close();
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
};

exports.getProductByCategory = async (req, res) => {
  try {
    let categoryID = req.params.categoryID;
    let skipCount = parseInt(req.query.skipCount);
    let limitCount = parseInt(req.query.limitCount);

    console.log("skipCount", skipCount);
    console.log("limitCount", limitCount)

    const products = await db.ProductV2.find({ categoryID }).skip(skipCount).limit(limitCount);

    console.log("products", products);

    let pool = await connection.connect();
    let category = await Promise.all(
      products.map(async stuff => {
        let r = await pool
          .request()
          .query(
            `select ITEMCODE, DESCRIPTION, QTY, SELLINGPRICE from STOCKTABLE where QTY > 2 AND ITEMCODE = '${
            stuff.itemCode
            }'`
          );
        return r.recordset[0];
      })
    );

    item = [];
    // reason for this is to remove null that map sometimes return
    for (let cat of category) {
      if (cat) {
        item.push(cat);
      }
    }

    category = await Promise.all(
      item.map(async stuff => await reusable(stuff))
    );

    res.status(200).json({ status: 200, data: category });
    pool.close();
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
};
