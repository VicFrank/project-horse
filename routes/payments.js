const express = require("express");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const router = express.Router();

const players = require("../db/players");
const logs = require("../db/logs");
const cosmetics = require("../db/cosmetics");
const auth = require("../auth/auth");
const {
  cheapPaypalClient,
  expensivePaypalClient,
  paypal,
} = require("../common/paypal-client");
const stripeClient = require("../common/stripe-client");
const keys = require("../config/keys");

router.post("/paypal/:steamID", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const orderID = req.body.orderID;
    const itemID = req.body.itemID;
    const paypalType = req.body.paypalType;

    let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

    let paypalClient;
    if (paypalType === "cheap") {
      paypalClient = cheapPaypalClient;
    } else if (paypalType === "expensive") {
      paypalClient = expensivePaypalClient;
    } else {
      return res.status(400).send({ message: "Didn't clarify paypal client" });
    }

    // send paypal the order ID
    let order;
    try {
      order = await paypalClient().execute(request);
      const intentEvent = { itemID, order };
      await logs.addTransactionLog(steamID, "paypal_intent", intentEvent);
    } catch (error) {
      console.log(error);
      return res.send(500);
    }

    // Make sure this is a valid player
    const playerExists = await players.doesPlayerExist(steamID);
    if (!playerExists)
      return res.status(400).send({ message: "Invalid SteamID" });

    // make sure this is a valid payment
    // this returns a float, so round
    const paidAmount = Math.floor(order.result.purchase_units[0].amount.value);
    const itemData = await cosmetics.getItemPrice(itemID);
    const { cost_usd, reward, item_type } = itemData;

    if (!itemData) return res.status(400).send({ message: "Invalid ItemID" });
    if (paidAmount !== cost_usd)
      return res.status(400).send({ message: "Invalid Payment" });

    // Call PayPal to capture the order
    request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
      const capture = await paypalClient().execute(request);
      const purchaseEvent = { itemID, capture };
      await logs.addTransactionLog(steamID, "paypal", purchaseEvent);
    } catch (err) {
      console.log(err);
      return res.send(500);
    }

    await players.realMoneyPurchase(steamID, item_type, reward);

    res.status(200).send({ message: `Payment Success` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

async function handlePaypalWebhooks(body) {
  const { event_type, resource } = body;
  if (!resource) return;
  const { plan_id } = resource;

  // TODO: determine the plan from the plan_id

  // What happens if a player already has an ongoing subscription, and
  // their automatic payment triggers?
  // Keep in mind that the automatic billing could/will happen before their
  // battle pass subscription changes.
  // a.) already has subscription of this tier
  //     - extend the duration of the current subscription by 1 month
  // b.) already has a subscription of a lower tier
  //     - override their old subscription, and upgrade to this tier
  //     - a player could lost a lot of value if they had several month
  //       purchased of the old tier.
  // c.) already has a subscription of a higher tier
  //     - give the player an extended subscription to that tier,
  //       starting when their current subscription ends

  switch (event_type) {
    case BILLING.SUBSCRIPTION.CREATED:
      // TODO: increase the subscription duration of this tier
      break;
    case PAYMENT.SALE.COMPLETED:
      // triggers when a subscription is auto paid
      // TODO: see if this triggers on normal payments
      // TODO: increase the subscription duration of this tier
      break;
    case BILLING.SUBSCRIPTION.UPDATED:
    // this can potentially trigger off different things
    // (I don't think without me allowing it, but Paypal's documentation
    //  is fucking terrible) https://developer.paypal.com/docs/subscriptions/full-integration/subscription-management/#update-subscription
    // The one we're interested in is a player upgrading/downgrading their subscription
    // Revisions are only effective the next billing cycle, so we shouldn't change their
    // tier until the next cycle, but might want to track that they changed it.
  }
}

router.post("/webhooks/paypal", async (req, res) => {
  const headers = req.headers;
  const eventBody = req.body;

  const webhookId = process.env.IS_PRODUCTION
    ? keys.paypal.production.webhookID
    : keys.paypal.dev.webhookID;

  paypal.notification.webhookEvent.verify(
    headers,
    eventBody,
    webhookId,
    function (error, response) {
      if (error) {
        console.log(error);
        return res.status(400).send({ message: "Something went wrong" });
      } else {
        if (response.verification_status === "SUCCESS") {
          handlePaypalWebhooks(eventBody);
          return res.status(200);
        } else {
          // Note that mock webhook events will fail
          // Comment this out for production
          handlePaypalWebhooks(eventBody);
          return res.status(401);
        }
      }
    }
  );
});

router.post("/stripe/intents", async (req, res) => {
  const { name, amount, steamID } = req.body;

  const itemData = await cosmetics.getItemPrice(name);
  const { cost_usd } = itemData;

  if (!itemData) return res.status(400).send({ message: "Invalid ItemID" });
  if (amount / 100 !== cost_usd)
    return res.status(400).send({ message: "Invalid Payment Amount" });

  const paymentIntent = await stripeClient.client.paymentIntents.create({
    amount,
    currency: "usd",
    payment_method_types: ["card"],
    metadata: { steamID, itemID: name, isPaymentIntent: true },
  });

  res.send(paymentIntent);
});

// This is only for payment intents,
// because apparently in production the charge succeeded webhook was not working
async function stripePaymentIntentSucceeded(intent) {
  const { steamID, itemID } = intent.metadata;

  // Handle payments purchasing a specific item
  if (itemID) {
    const itemData = await cosmetics.getItemPrice(itemID);
    const { item_type, reward } = itemData;

    try {
      await logs.addTransactionLog(steamID, "stripe", { intent });
      await players.realMoneyPurchase(steamID, item_type, reward);
    } catch (error) {
      console.log(error);
    }
  }
}

async function stripeChargeSucceeded(intent) {
  const itemID = intent.metadata.itemID;
  const isPaymentIntent = intent.metadata.isPaymentIntent;

  // Ignore payment intents, those are handled in another webhook
  if (isPaymentIntent) {
    return;
  }

  // Handle payments purchasing a specific item
  if (itemID) {
    const itemData = await cosmetics.getItemPrice(itemID);
    const steamID = intent.metadata.steamID;
    const { item_type, reward } = itemData;

    try {
      await logs.addTransactionLog(steamID, "stripe", { intent });
      await players.realMoneyPurchase(steamID, item_type, reward);
    } catch (error) {
      console.log(error);
    }
  } else {
    // assume this is a subscription payment
    const { amount, customer } = intent;

    // Add 31 days to this tier
    // stripe subscriptions are monthly, and some months have fewer than 31 days
    // because of this, on those months, the user gets a few extra days
    const player = players.getStripeSubscriptionByCustomerID(customer);

    if (!player) {
      const message = `Customer with ID ${customer} not found to give a subscription to`;
      console.log(message);
      // send a log to myself (VicFrank)
      logs.addTransactionLog("76561198030851434", "error", { message });
      return;
    }

    const steamID = player.steam_id;

    // TODO: Update this
    switch (amount) {
      case 200:
        // Silver battle pass
        players.addBattlePassTier(steamID, 1, 31);
        break;
      case 500:
        // Gold battle pass
        players.addBattlePassTier(steamID, 2, 31);
        break;
      case 1500:
        // Plat battle pass
        players.addBattlePassTier(steamID, 3, 31);
        break;
      default:
        console.log("We got a payment we didn't know how to handle!", intent);
        break;
    }
  }
}

async function handleStripeSourceChargeable(intent) {
  const { amount, id, currency } = intent;
  const { itemID } = intent.metadata;
  const isValid = await isValidStripeTransaction(itemID, amount);
  if (isValid) {
    stripeClient.client.charges.create({
      amount: amount,
      currency: currency,
      source: id,
      metadata: intent.metadata,
    });
  }
}

async function handleStripeSubscription(session) {
  const steamID = session.metadata.steamID;
  const customerID = session.customer;
  players.addStripeSubscription(steamID, customerID, "active");
}

async function isValidStripeTransaction(itemID, amount) {
  const itemData = await cosmetics.getItemPrice(itemID);
  const { cost_usd } = itemData;

  if (!itemData || amount / 100 != cost_usd) return false;

  return true;
}

router.get("/stripe/checkout_session", async (req, res) => {
  const { sessionID } = req.query;
  const session = await stripeClient.client.checkout.sessions.retrieve(
    sessionID
  );
  res.send(session);
});

router.post("/stripe/cancel_subscription", async (req, res) => {
  const deletedSubscription = await stripeClient.client.subscriptions.del(
    req.body.subscriptionID
  );
  res.send(deletedSubscription);
});

router.get(
  "/stripe/subscriptions/:steamID",
  auth.userAuth,
  async (req, res) => {
    try {
      const steamID = req.params.steamID;
      const subscription = await players.getStripeSubscription(steamID);

      const { customer_id } = subscription;

      const subscriptionData = await stripeClient.client.subscriptions.retrieve(
        customer_id
      );
      console.log(subscriptionData);
      res.status(200).json(subscriptionData);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  }
);

router.post("/stripe/create_checkout_session", async (req, res) => {
  const { priceID, steamID } = req.body;
  const baseUrl = process.env.IS_PRODUCTION
    ? "https://www.pathofguardians.com"
    : "http://localhost:8080";

  // handle existing customers
  let customer;
  try {
    const currentSub = await players.getStripeSubscription(steamID);
    if (currentSub && currentSub.customer_id) {
      customer = currentSub.customer_id;
    }
  } catch (error) {
    console.log(error);
    return res.send(500);
  }

  let session;
  try {
    session = await stripeClient.client.checkout.sessions.create({
      customer,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${baseUrl}/subscriptions/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscriptions/stripe/cancel`,
      metadata: {
        steamID,
      },
    });
  } catch (error) {
    console.log(error);
    return res.send(500);
  }

  return res.send({ sessionId: session.id });
});

router.post("/stripe/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  const secret = process.env.IS_PRODUCTION
    ? keys.stripe.production.webhook
    : keys.stripe.dev.webhook;

  let event;
  try {
    event = stripeClient.client.webhooks.constructEvent(
      req.rawBody,
      sig,
      secret
    );
  } catch (err) {
    console.log(err);
    res.status(400).send("Webhook Error");
    return;
  }

  const intent = event.data.object;

  switch (event.type) {
    case "payment_intent.succeeded":
      stripePaymentIntentSucceeded(intent);
      break;
    case "payment_intent.payment_failed":
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      console.log("Failed:", intent.id, message);
      break;
    case "source.chargeable":
      // make a charge request
      handleStripeSourceChargeable(intent);
      break;
    case "charge.succeeded":
      // This is called whenever a charge succeedes, but apparently
      // in production, it sometimes is not called for vanilla stripe
      // payments???
      // Alipay charge success, give them their stuff
      stripeChargeSucceeded(intent);
      break;
    case "checkout.session.completed":
      // a user successfully subscribed using stripe checkout
      handleStripeSubscription(intent);
      break;
  }

  res.json({ received: true });
});

module.exports = router;
