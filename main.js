// Clip SDK initialization requires an api key or a valid JWT token and an environment (dev, stage) for prod you dont need to pass the env
const API_KEY = "58ce6b21-8ccd-4eda-a6bb-00b162973f7e";

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
    paymentAmount: 600,
  });
card.mount("clip");

// Merchant logic to create payment payload and send it to backend that implements clip-backend-sdk

async function createPayload(cardId, installments, cardHolderData) {
  const payload = {
    description: "Mouse Asus",
    external_reference: "627ef988-27a0-4b12-8f6c-6bd93a1f0d40",
    first_name: cardHolderData.firstName,
    last_name: cardHolderData.lastName,
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
  };
  return JSON.stringify(payload);
}

async function handleSubmit(e) {
  e.preventDefault();
  // get the installments with the method getInstallments()
  const installments = card.installments();
  const cardHolderData = card.cardholderData();
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

  const paymentPayload = await createPayload(cardToken.id, installments, cardHolderData);

  // Call to merchant backend to create payment, this route implements clip-backend-sdk
  fetch("https://dev-tools.clip.mx/transparent/pay", {
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
      
      if (data.status === "success") {
        

      } if (data.status === "pending") {
        console.log("Redirecting to 3ds !");
        window.location.href = data.pending_action.redirect_to_url.url
      }
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

  // const paymentAlert = document.querySelector("#resultado")
  // paymentAlert.innerHTML = `
  // <div class="alert alert-success" role="alert">
  //   <h4 class="alert-heading">Payment success!</h4>
  //   <p>Payment id: 123></p>
  //   <hr>
  //   <p class="mb-0">Payment status: aPPROVED</p>
  // </div> `;

// manejo del monto dinamico
const amountInput = document.querySelector("#amount");
amountInput.addEventListener("change", (e) => {
  card.setAmount(e.target.value);
});
