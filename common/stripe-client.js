const Stripe = require("stripe");
const keys = require("../config/keys");

const secret = process.env.IS_PRODUCTION
  ? keys.stripe.production.secret
  : keys.stripe.dev.secret;

const client = new Stripe(secret);
module.exports = { client };
