// Clip SDK initialization requires a api key and an environment (dev, stage) for prod you dont need to pass the env

const API_KEY = "d179daba-9fb1-43ba-a83b-4ed1831d7528";

const clip = new ClipSDK(API_KEY, { env: "dev" })

// create card element
// Supported themes are: 'eco', 'dark' and default is 'bco'
// Supported locales are: 'en', 'es' and default is the browser locale
const card = clip.element.create("Card", {
    theme: 'default',
    locale: 'en',
    terms: { // terms configuration
      enabled: true,
    },
    paymentAmount: 600, // amount to process the payment,
  });
card.mount("clip");

async function createPayload(cardId, installments) {
const payload = {
    description: "Mouse Asus",
    external_reference: "627ef988-27a0-4b12-8f6c-6bd93a1f0d40",
    first_name: "Dong",
    last_name: "Lee",
    email: "dong.lee@payclip.com",
    phone: "5548516236",
    card_token: cardId,
    installments: installments,
    amount: 600,
    tip_amount: 0,
    currency: "MXN",
    country: "MX",
    webhook_url: "https://transparent.requestcatcher.com/test",
    metadata: {
        message: "some message"
    },
    location: "54.70.251.185",
    token: API_KEY // this is the api key that we use to setup the sdk
  };
  return payload;
}

async function handleSubmit(e) {
  e.preventDefault();
  // get the installments with the method getInstallments()
  const installments = card.installments();

  // call to card_token_endpoint, using the method cardToken()
  const cardToken = await card.cardToken();
    
  console.log(
    "%c Card token!",
    "color: blue; font-size: 20px; background-color: yellow;",
    cardToken
  );

    console.log(
    "%c Installments!",
    "color: blue; font-size: 20px; background-color: yellow;",
    installments
  );

  const paymentPayload = await createPayload(cardToken.id, installments);

  // Call to merchant backend to create payment, this route implements clip-backend-sdk
  fetch(" https://2yrmb9ypnh.execute-api.us-west-2.amazonaws.com/live/pay", {
    method: "POST",
    body: JSON.stringify(paymentPayload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(
        "%c Payment response!",
        "color: blue; font-size: 20px; background-color: yellow;",
        data
      );
    })
    .catch((error) => {
      console.error(error);
    });
  // ***********************************************
}

// envia el formulario
document
  .querySelector("#payment-form")
  .addEventListener("submit", async (e) => {
    await handleSubmit(e);
  });
