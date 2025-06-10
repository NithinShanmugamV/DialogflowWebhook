const express = require("express");
const {
  checkOrderStatus,
  checkOrderCustomer,
  checkProduct,
  checkProductAll
} = require("./handler");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const parameters = req.body.sessionInfo?.parameters || {};
  const tag = req.body.fulfillmentInfo?.tag; // This identifies the intent or step
  let responseMessage = "Sorry, I didn’t understand your request.";
  let data = null;
  let payload = null;

  try {
    switch (tag) {
      case "check-order-status": {
        const result = await checkOrderStatus(parameters.order_id);
        payload = result
        responseMessage =
          result.status === 200
            ? `Can you select the product from your order below`
            : result.message;
        break;
      }

      case "check-order-customer": {
        const result = await checkOrderCustomer(parameters.customer_id);
        responseMessage =
          result.status === 200
            ? `Your order ${result.order_id} is ${result.delivery_status}.`
            : result.message;
        break;
      }

      case "check-product": {
        const result = await checkProduct(parameters.product_id);
        responseMessage =
          result.status === 200
            ? `Product ${result.product_name} is available for ${result.cost_of_product}.`
            : result.message;
        break;
      }
      case "check-product-all": {
        const result = await checkProductAll(parameters.product_sku);
        if (result.status === 200){
          data = result,
          responseMessage =
            "Thank you for sharing product sku. Can you also share on product detail you are looking for?";
        }
        else responseMessage = "We couldn't find this product for you";

        break;
      }

      default:
        responseMessage = "Unrecognized action requested.";
    }

    if (tag == "check-product-all")
      await res.json({
        sessionInfo: {
          parameters: {
            ...data,
          },
        },
        fulfillment_response: {
          messages: [
            {
              text: {
                text: [responseMessage],
              },
            },
          ],
        },
      });
    else if(tag == "check-order-status"){
      await res.json({
        fulfillment_response: {
          messages: [{ text: { text: [responseMessage] } }, {payload: payload}],
        },
      });
    }
    else {
      await res.json({
        fulfillment_response: {
          messages: [{ text: { text: [responseMessage] } }],
        },
      });
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    await res.json({
      fulfillment_response: {
        messages: [
          { text: { text: ["There was an error processing your request."] } },
        ],
      },
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
