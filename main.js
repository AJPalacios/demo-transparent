const clip = new Clip.Init("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZG4");

// create card element
const card = clip.element.create("Card");
card.mount("clip");

// Define custom styles
const customStyles = {
  "form-container": {
    backgroundColor: "#f7f7f7", // Light grey background for the form
    borderRadius: "0",
    padding: "30px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)", // Soft shadow for depth
    fontFamily: "'Nunito Sans', sans-serif", // Consistent font with the page
    margin: "0 auto", // Center the form in the section
  },
  "input-wrapper input": {
    border: "solid 1px #ccc !important",
    "border-radius": "5px",
    padding: "15px 20px !important",
    fontSize: "16px",
    width: "100%",
    "margin-top": "5px !important",
    outline: "none", // Removes the default focus outline
  },
};

// create card element
const card2 = clip.element.create("Card", {
  styles: customStyles,
});
card2.mount("clip2");

const stripeStyles = {
  "form-container": {
    "background-color": "#ffffff !important",
    "border-radius": "8px !important",
    padding: "40px !important",
    "box-shadow": "0 10px 30px rgba(0,0,0,0.07) !important",
    "font-family": "'Helvetica Neue', Helvetica, sans-serif !important",
    margin: "20px auto !important",
    "max-width": "500px !important",
  },
  "input-wrapper input": {
    border: "1px solid #e6ebf1 !important",
    "border-radius": "4px !important",
    padding: "12px 14px !important",
    "font-size": "16px !important",
    width: "100% !important",
    "box-sizing": "border-box !important",
    margin: "8px 0 !important",
    outline: "none !important",
    transition: "box-shadow 0.3s ease, border-color 0.3s ease !important",
  },
  "input-wrapper input:focus": {
    "box-shadow": `0 1px 6px rgba(50,50,93,0.1), 0 1px 3px rgba(0,0,0,0.08) !important`,
    "border-color": "#635BFF !important", // Stripe's purple color for focus
  },
  "input-wrapper.validInput input": {
    "border-color": "#4caf50 !important", // Green border for valid inputs
  },
  "input-wrapper.errorInput input": {
    "border-color": "#f44336 !important", // Red border for error inputs
  },
  "input-wrapper .error-message": {
    color: "#f44336 !important",
    "font-size": "0.9rem !important",
    "margin-top": "5px !important",
    "margin-left": "14px !important",
  },
};

// create card element
const card3 = clip.element.create("Card", {
  styles: stripeStyles,
});
card3.mount("clip3");

async function createPayload(cardId) {
  const payload = {
    description: "mouse asus",
    external_reference: "627ef988-27a0-4b12-8f6c-6bd93a1f0d40", // payment request id
    type: "ecommerce",
    entry_mode: "manual",
    payer: {
      first_name: "Dong",
      last_name: "Lee",
      email: "dong.lee@payclip.com",
      phone: "5548516236",
      address: {
        postal_code: "1234567",
        street: "AnyStreet",
        number: "AnyFloor",
        city: "Abejones",
        country: "MX",
        state: "Oaxaca",
      },
      description: "product manager",
      identification: {
        id: "TEPA840621HCSXRS01",
        type: "CURP",
      },
    },
    payment_method: {
      token: cardId,
    },
    installments: 1,
    amount: 1000,
    tip_amount: 0,
    currency: "MXN",
    country: "MX",
    webhook_url: "https://hook.us1.make.com/k5f98kqxuuxgn4td6hgejrnu6lsi362p",
    // "return_url": "https://localhost:3000",
    metadata: {
      optional_info: "whatever you want to add",
    },
    prevention_data: {
      session_id: "a68653f7-2310-40af-a7f2-43065d97954a",
      device_finger_print_token: "a68653f7-2310-40af-a7f2-43065d97954c",
    },
    location: {
      ip: "54.70.251.185",
    },
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

  // this call will be a part of the backend library
  fetch("https://dev-api.payclip.com/payments", {
    method: "POST",
    body: paymentPayload,
    headers: {
      Authorization:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZG4iOiJheSUvLSx5QGopTlg_fkNPIiwiaGtpIjoxLCJleHAiOjE3MDA1MjMwOTcsImlhdCI6MTY5OTkxODI5N30.pbnDceipYOndTTMzywGA7igflT0ZQ6U2dHRLOMkGNMk",
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
