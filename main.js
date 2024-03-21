// Clip SDK initialization requires an api key or a valid JWT token and an environment (dev, stage) for prod you dont need to pass the env
const API_KEY = "58ce6b21-8ccd-4eda-a6bb-00b162973f7e";

const clip = new ClipSDK(API_KEY, { env: "dev" });

const card = clip.element.create("Card", {
    theme: "light",
    locale: "es",
    paymentAmount: 600,
    terms: {
        enabled: false 
    }
});

card.mount("checkout");


async function createPayload(cardId, installments, cardHolderData, preventionData) {
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
      prevention_data: { ...preventionData },
    };
    return JSON.stringify(payload);
  }

// listener de envio de formulario
document.querySelector("#payment-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    // Usamos el metodo cardToken() para generar el token de la tarjeta ingresada en el Card Element
    const cardToken = await card.cardToken();
    console.log("Card Token: ", cardToken);

    // Usamos el metodo installments() para obtener las cuotas seleccionadas en el Card Element
    const installments = await card.installments();
    console.log("Installments: ", installments);
    
    // Usamos el metodo cardHolderData() para obtener los datos del tarjetahabiente ingresados en el Card Element
    const cardHolderData = await card.cardholderData();
    console.log("Card Holder Data: ", cardHolderData);

    const preventionData = await card.preventionData();
    console.log("Prevention Data: ", preventionData);

    const paymentPayload = await createPayload(cardToken.id, installments, cardHolderData, preventionData);

    // Llamamamos a nuestro backend que tiene la pegada a payments
    fetch("https://qaezk1n3ra.execute-api.us-west-2.amazonaws.com/live/pay", {
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
    });

});
