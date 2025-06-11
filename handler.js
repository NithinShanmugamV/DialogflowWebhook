const axios = require("axios");

const ORDER_API_URL = "https://jsonserver-eyex.onrender.com/orders";
const ORDER_ITEMS_API_URL = "https://jsonserver-eyex.onrender.com/order-items";
const PRODUCT_API_URL = "https://jsonserver-eyex.onrender.com/products";

async function checkOrderStatus(orderId) {
  try {
    const res = await axios.get(`${ORDER_API_URL}?order_id=${orderId}`);
    if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
      const order = res.data[0];
      return { status: 200, ...order };
    }

    return { status: 404, message: `Order ${orderId} not found.` };
  } catch (error) {
    console.error(`Order fetch error:`, error.message);
    return { status: 500, message: "Internal server error while fetching order." };
  }
}

async function checkOrderItemStatus(orderId, product_sku) {
  try {
    const res = await axios.get(`${ORDER_ITEMS_API_URL}?order_id=${orderId}&product_sku=${product_sku}`);
    if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
      const order = res.data[0];
      return { status: 200, ...order };
    }

    return { status: 404, message: `Order ${orderId} not found.` };
  } catch (error) {
    console.error(`Order fetch error:`, error.message);
    return { status: 500, message: "Internal server error while fetching order." };
  }
}

async function checkProductAll(productId) {
  try {
    const res = await axios.get(`${PRODUCT_API_URL}?product_sku=${productId}`);
    if (res.status === 200 && res.data) {
      return { status: 200, ...res.data[0] };
    }

    return { status: 404, message: `Product ${productId} not found.` };
  } catch (error) {
    console.error(`Product fetch error:`, error.message);
    return { status: 500, message: "Internal server error while fetching product." };
  }
}


module.exports = {
  checkOrderStatus,
  checkOrderItemStatus,
  checkProductAll
};
