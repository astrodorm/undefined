exports.success = async (response, db, req) => {
  if (response.status && response.data.status === 'success') {
    let card = await db.Card.create({
      customerID: req.customer._id,
      last4Digits: response.data.authorization.last4,
      expiryMonth: response.data.authorization.exp_month,
      expiryYear: response.data.authorization.exp_year,
      bank: response.data.authorization.bank,
      reference: response.data.reference,
      cardType: response.data.authorization.card_type,
      countryCode: response.data.authorization.country_code,
      token: response.data.authorization.authorization_code
    });

    return card;
  }
  return;
};
