const express = require('express');
require('dotenv').config({ path: 'variables.env' });
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(fileUpload());

app.use('/api', routes);

let filepath = path.join(__dirname, '..', 'public/upload');
console.log(filepath);
app.use('/static', express.static(filepath));

app.use((req, res, next) => {
  const err = new Error('No route Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
