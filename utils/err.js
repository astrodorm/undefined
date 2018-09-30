exports.Emessage = (err, res) => {
  return res.status(400).json({ status: 400, message: err.message });
};

exports.Validator = (arr, req) => {
  let errMe = [];
  for (let input of arr) {
    if (!req.body[input]) errMe.push(`${input} is required`);
  }
  return errMe;
};
