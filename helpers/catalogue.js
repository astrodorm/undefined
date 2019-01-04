const csv = require('fast-csv');
const Json2csvParser = require('json2csv').Parser;
const db = require('../models');

exports.csvTemplate = async (req, res) => {
  const fields = ['itemID', 'itemName', 'thumbnail'];
  const data = '';
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(data);

  // to tell there's a file to be downloaded
  res.set('Content-Disposition', 'attachment;filename=catalogue.csv');
  // to set content-type, application/octet-stream saying we don't know the type of file
  res.set('Content-Type', 'application/octet-stream');

  res.send(csv);
};

exports.parseCSVCatalogue = async (req, res) => {
  try {
    if (!req.files || !req.files.csv)
      return res.status(400).json({ status: 400, message: `No file to parse` });

    let catalogueFile = req.files.csv;

    if (catalogueFile.mimetype != 'text/csv')
      return res
        .status(400)
        .json({ status: 400, message: `Only csv format allowed` });
    let catalogues = [];

    csv
      .fromString(catalogueFile.data.toString(), {
        headers: true,
        ignoreEmpty: true
      })
      .on('data', data => {
        catalogues.push(data);
      })
      .on('end', async () => {
        let inserted = await db.Catalogue.insertMany(catalogues);
        let insertedLength = inserted.length;
        return res
          .status(200)
          .json({ status: 200, data: { insertedLength, inserted } });
      });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getAllCatalogues = async (req, res) => {
  try {
    const catalogues = await db.Catalogue.find({});
    return res.status(200).json({ status: 200, data: catalogues });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getACatalogue = async (req, res) => {
  try {
    const catalogue = await db.Catalogue.findOne({ itemID: req.params.itemID });
    return res.status(200).json({ status: 200, data: catalogue });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
