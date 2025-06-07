const express = require("express");
const { checkOrderStatus, checkOrderCustomer, checkProduct, checkCustomer, checkCustomerEmail, } = require("./handler");

const app = express();
app.use(express.json());


app.post("/webhook", async (req, res) => {
  const parameters = req.body.sessionInfo?.parameters || {};
  const tag = req.body.fulfillmentInfo?.tag; // This identifies the intent or step

  let responseMessage = "Sorry, I didn’t understand your request.";

  try {
    switch (tag) {
      case "check-order-status": {
        const result = await checkOrderStatus(parameters.order_id);
        responseMessage = result.status === 200
          ? `Your order ${result.order_id} is ${result.delivery_status}.`
          : result.message;
        break;
      }

      case "check-order-customer": {
        const result = await checkOrderCustomer(parameters.customer_id);
        responseMessage = result.status === 200
          ? `Your order ${result.order_id} is ${result.delivery_status}.`
          : result.message;
        break;
      }

      case "check-product": {
        const result = await checkProduct(parameters.product_id);
        console.log(result)
        responseMessage = result.status === 200
          ? `Product ${result.product_name} is available for ${result.cost_of_product}.`
          : result.message;
        break;
      }

    //   case "check-customer": {
    //     const result = await checkCustomer(parameters.customerId);
    //     responseMessage = result.status === 200
    //       ? `Account ${parameters.accountId} has balance ${result.balance}.`
    //       : result.message;
    //     break;
    //   }
    //   case "check-customer-email": {
    //     const result = await checkCustomer(parameters.email);
    //     responseMessage = result.status === 200
    //       ? `Account ${parameters.accountId} has balance ${result.balance}.`
    //       : result.message;
    //     break;
    //   }

      default:
        responseMessage = "Unrecognized action requested.";
    }

    await res.json({
      fulfillment_response: {
        messages: [{ text: { text: [responseMessage] } }],
      },
    });
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
