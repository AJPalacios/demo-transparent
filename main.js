// Clip SDK initialization requires a api key and an environment (dev, stage) for prod you dont need to pass the env
const clip = new ClipSDK("3f310e7e-6253-426e-b75b-76169b286e02", { env: "dev" })

// create card element
// Supported themes are: 'eco', 'dark' and default is 'bco'
// Supported locales are: 'en', 'es' and default is the browser locale
const card = clip.element.create("Card", {
    theme: 'default',
    locale: 'en',
  });
card.mount("clip");

async function createPayload(cardId) {
  const payload = {
    description: "Mouse Asus",
    external_reference: "627ef988-27a0-4b12-8f6c-6bd93a1f0d40",
    first_name: "Dong",
    last_name: "Lee",
    email: "dong.lee@payclip.com",
    phone: "5548516236",
    card_token: cardId,
    installments: 1,
    amount: 2000,
    tip_amount: 0,
    currency: "MXN",
    country: "MX",
    webhook_url: "https://transparent.requestcatcher.com/test",
    metadata: {
        message: "some message"
    },
    location: "54.70.251.185"
  };
  return JSON.stringify(payload);
}

async function handleSubmit(e) {
  e.preventDefault();
  // call to card_token_endpoint, using the method cardToken()
  const cardToken = await card.cardToken();
  console.log(
    "%c Card token!",
    "color: blue; font-size: 20px; background-color: yellow;",
    cardToken
  );

  const paymentPayload = await createPayload(cardToken.id);

  // Call to merchant backend to create payment, this route implements clip-backend-sdk
  fetch("https://1f0wq8q5-3001.usw3.devtunnels.ms/api/payment", {
    method: "POST",
    body: paymentPayload,
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
