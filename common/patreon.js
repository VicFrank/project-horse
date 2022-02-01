const axios = require("axios");
const keys = require("../config/keys");

const getPatrons = async (cursor) => {
  const oauth = keys.paypal.oauth;
  let cursorExtension = "";

  if (cursor) {
    cursorExtension = `&page%5Bcursor%5D=${cursor}`;
  }

  try {
    let request;
    try {
      request = await axios.get(
        `https://www.patreon.com/api/oauth2/api/campaigns/2587720/pledges?page%5Bcount%5D=100&sort=created${cursorExtension}`,
        { headers: { Authorization: `Bearer ${oauth.accessToken}` } }
      );
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      }
      throw error;
    }

    const { data } = request;
    const userData = {};
    const pledges = [];
    let nextCursor;
    if (data.links.next) {
      nextCursor = data.links.next.split("&page%5Bcursor%5D=")[1];
    }

    for (const reference of data.included) {
      if (reference.type === "user") {
        const id = reference.id;
        const name = reference.attributes.full_name;
        userData[id] = name;
      }
    }

    for (const pledge of data.data) {
      if (pledge.type === "pledge") {
        const amount = pledge.attributes.amount_cents;
        const patronID = pledge.relationships.patron.data.id;
        const name = userData[patronID];

        let level = 0;

        if (amount >= 1000) {
          level = 3;
        } else if (amount >= 500) {
          level = 2;
        } else {
          level = 1;
        }

        pledges.push({
          name,
          id: patronID,
          level,
        });
      }
    }

    if (nextCursor) {
      const nextPage = await getPatrons(nextCursor);
      return pledges.concat(nextPage);
    }

    return pledges;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPatrons,
};
