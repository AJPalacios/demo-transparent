// Clip SDK initialization requires an api key or a valid JWT token and an environment (dev, stage) for prod you dont need to pass the env
const API_KEY = "e01f1ecc-2039-4a15-85b3-428d82935dd6";

const clip = new ClipSDK(API_KEY);

const card = clip.element.create("Card", {
  theme: "eco",
  locale: "es",
  paymentAmount: 3,
  terms: {
    enabled: true,
  },
});

card.mount("checkout");

document.querySelector("#amount").addEventListener("change", async (event) => {
  const amount = event.target.value;
  card.setAmount(amount);
});

async function createPayload(
  cardId,
  installments,
  cardHolderData,
  preventionData
) {
  const payload = {
    description: "testing card-token data",
    external_reference: "1234",
    type: "openplatform",
    entry_mode: "manual",
    customer: {
      first_name: cardHolderData.firstName,
      last_name: cardHolderData.lastName,
      email: "adan.palacios@payclip.com",
      phone: "5543069527",
    },
    payment_method: {
      token: cardId,
    },
    installments: installments,
    amount: 3,
    tip_amount: 0,
    currency: "MXN",
    country: "MX",
    webhook_url: "https://transparent.requestcatcher.com/test",

    prevention_data: {
      session_id: preventionData.session_id,
      source: "desktop",
      user_agent: preventionData.user_agent,
      device_finger_print_token: preventionData.session_id,
    },
  };
  return JSON.stringify(payload);
}

// listener de envio de formulario
document
  .querySelector("#payment-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    // Usamos el metodo cardToken() para generar el token de la tarjeta ingresada en el Card Element
    let cardToken = null;
    try {
      cardToken = await card.cardToken();
    } catch (error) {
      switch (error.code) {
        case "CL2200":
        case "CL2290":
          alert("Error: " + error.message);
          throw error;
          break;
        case "AI1300":
          console.log("Error: ", error.message);
          break;
        case "BR1116":
          console.log("Error: ", error.message);
          break;
        default:
          break;
      }
    }

    // Usamos el metodo installments() para obtener las cuotas seleccionadas en el Card Element
    const installments = await card.installments();
    console.log("Installments: ", installments);

    // Usamos el metodo cardHolderData() para obtener los datos del tarjetahabiente ingresados en el Card Element
    const cardHolderData = await card.cardholderData();
    console.log("Card Holder Data: ", cardHolderData);

    // Usamos el metodo preventionData() para obtener los datos de prevencion ingresados en el Card Element
    const preventionData = await card.preventionData();
    console.log("Prevention Data: ", preventionData);

    const paymentPayload = await createPayload(
      cardToken.id,
      installments,
      cardHolderData,
      preventionData
    );

    // Call to merchant backend to create payment
    fetch("https://api.payclip.com/payments", {
      method: "POST",
      body: paymentPayload,
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic ZTAxZjFlY2MtMjAzOS00YTE1LTg1YjMtNDI4ZDgyOTM1ZGQ2OmFjNTA5MzM5LTU1YWMtNDhkYi04ODczLTI5MWM2ZmU1YWYxNw==",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          "%c Payment response!",
          "color: blue; font-size: 20px; background-color: yellow;",
          data
        );
        if (data.status === "pending" && data.pending_action.url !== null) {
          // // create a iframe
          const iframe = document.createElement("iframe");
          iframe.src = data.pending_action.url;
          iframe.style.position = "fixed";
          iframe.style.top = "0";
          iframe.style.left = "0";
          iframe.style.width = "100vw";
          iframe.style.height = "100vh";
          iframe.style.border = "none";
          iframe.style.zIndex = "1000";
          iframe.style.backgroundColor = "white";
          iframe.allowFullscreen = true;
          document.body.appendChild(iframe);

          window.addEventListener(
            `message`,
            async (event) => {
              if (event.origin === "https://3ds.payclip.com") {
                const paymentId = event.data?.paymentId;
                if (paymentId) {
                  fetch(`https://api.payclip.com/payments/${paymentId}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Basic ZTAxZjFlY2MtMjAzOS00YTE1LTg1YjMtNDI4ZDgyOTM1ZGQ2OmFjNTA5MzM5LTU1YWMtNDhkYi04ODczLTI5MWM2ZmU1YWYxNw==`,
                    },
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (data.status === "approved") {
                        alert("Pago exitoso por 3ds");
                      } else {
                        alert("Pago fallido por 3ds");
                      }
                    });
                }
              }
            },
            false
          );
        } else if (
          data.status === "approved" &&
          data.status_detail.code === "AP-PAI01"
        ) {
          alert("Pago exitoso");
        }
      });
  });
