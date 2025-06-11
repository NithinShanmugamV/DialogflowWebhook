const express = require("express");
const {
  checkOrderStatus,
  checkProductAll,
  checkOrderItemStatus
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
            ? `Can you select product from your order`
            : result.message;
        break;
      }
      case "check-order-product": {
        const result = await checkOrderItemStatus(parameters.order_id, parameters.product_sku);
        data = result
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
          messages: [{ text: { text: [responseMessage] } }, {payload: {
            userSelect: payload.products
          }}],
        },
      });
    }
    else if(tag == "check-order-product"){
      await res.json({
        sessionInfo: {
          parameters: {
            ...data,
          },
        }
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
