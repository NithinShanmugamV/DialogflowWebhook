const axios = require("axios");

const STORE_API_URL = "https://jsonserver-eyex.onrender.com/orders";
const PRODUCT_API_URL = "https://jsonserver-eyex.onrender.com/products";
const CUSTOMER_API_URL = "https://jsonserver-eyex.onrender.com/customers";

async function checkOrderStatus(orderId) {
  try {
    const res = await axios.get(`${STORE_API_URL}?order_id=${orderId}`);

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

async function checkOrderCustomer(customer_id) {
  try {
    const res = await axios.get(`${STORE_API_URL}?customer_id=${customer_id}`);

    if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
      const order = res.data[0];
      console.log(res.data)
      return { status: 200, ...order };
    }

    return { status: 404, message: `Order ${orderId} not found.` };
  } catch (error) {
    console.error(`Order fetch error:`, error.message);
    return { status: 500, message: "Internal server error while fetching order." };
  }
}

async function checkProduct(productId) {
  try {
    const res = await axios.get(`${PRODUCT_API_URL}?product_id=${productId}`);

    if (res.status === 200 && res.data) {
      return { status: 200, ...res.data[0] };
    }

    return { status: 404, message: `Product ${productId} not found.` };
  } catch (error) {
    console.error(`Product fetch error:`, error.message);
    return { status: 500, message: "Internal server error while fetching product." };
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

async function checkCustomer(customerId) {
  try {
    const res = await axios.get(`${CUSTOMER_API_URL}?customer_id=${accountId}`);

    if (res.status === 200 && res.data) {
      return { status: 200, ...res.data };
    }

    return { status: 404, message: `Account ${accountId} not found.` };
  } catch (error) {
    console.error(`Account fetch error:`, error.message);
    return { status: 500, message: "Internal server error while fetching account." };
  }
}
async function checkCustomerEmail(email) {
  try {
    const res = await axios.get(`${CUSTOMER_API_URL}?email=${email}`);

    if (res.status === 200 && res.data) {
      return { status: 200, ...res.data };
    }

    return { status: 404, message: `Account ${email} not found.` };
  } catch (error) {
    console.error(`Account fetch error:`, error.message);
    return { status: 500, message: "Internal server error while fetching account." };
  }
}

module.exports = {
  checkOrderStatus,
  checkOrderCustomer,
  checkProduct,
  checkCustomer,
  checkCustomerEmail,
  checkProductAll
};
