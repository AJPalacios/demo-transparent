const clip = new Clip.Init("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZG4");

// create card element
const card = clip.element.create('Card');
card.mount('clip');

async function createPayload(cardId) {
    const payload = {
            "description": "mouse asus",
            "external_reference": "627ef988-27a0-4b12-8f6c-6bd93a1f0d40", // payment request id
            "type": "ecommerce",
            "entry_mode": "manual",
            "payer": {
                "first_name": "Dong",
                "last_name": "Lee",
                "email": "dong.lee@payclip.com",
                "phone": "5548516236",
                "address": {
                    "postal_code": "1234567",
                    "street": "AnyStreet",
                    "number": "AnyFloor",
                    "city": "Abejones",
                    "country": "MX",
                    "state": "Oaxaca"
                },
                "description": "product manager",
                "identification": {
                    "id": "TEPA840621HCSXRS01",
                    "type": "CURP"
                }
            },
            "payment_method": {
                "token": cardId,
            },
            "installments": 1,
            "amount": 1000,
            "tip_amount": 0,
            "currency": "MXN",
            "country": "MX",
            "webhook_url": "https://hook.us1.make.com/k5f98kqxuuxgn4td6hgejrnu6lsi362p",
            // "return_url": "https://localhost:3000",
            "metadata": {
                "additional_info": "whatever we want to add",
            },
            "prevention_data": {
                "session_id": "a68653f7-2310-40af-a7f2-43065d97954a",
                "device_finger_print_token": "a68653f7-2310-40af-a7f2-43065d97954c"
            },
            "location": {
                "ip": "54.70.251.185"
            }
        }
    return JSON.stringify(payload);
}

async function handleSubmit(e) {
    e.preventDefault();
    // call to card_token_endpoint, using the method cardToken()
    const cardToken = await card.cardToken();
    console.log('%c Card token!', 'color: blue; font-size: 20px; background-color: yellow;', cardToken);

    const paymentPayload = await createPayload(cardToken.id);
    
    // this call will be a part of the backend library
   fetch('https://dev-api.payclip.com/payments', {
        method: 'POST',
        body: paymentPayload,
        headers: {
            'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZG4iOiJheSUvLSx5QGopTlg_fkNPIiwiaGtpIjoxLCJleHAiOjE3MDA1MjMwOTcsImlhdCI6MTY5OTkxODI5N30.pbnDceipYOndTTMzywGA7igflT0ZQ6U2dHRLOMkGNMk',
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('%c Payment response!', 'color: blue; font-size: 20px; background-color: yellow;', data);
    }).catch(error => {
        console.error(error);
    });
    // ***********************************************
}


// envia el formulario 

document.querySelector('#payment-form').addEventListener('submit', async (e) => {
    await handleSubmit(e);
});

const methods = document.getElementById('methods')
