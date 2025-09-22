import ordersData from "@/services/mockData/orders.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let orders = [...ordersData];

export const orderService = {
  async getAll() {
    await delay(300);
    return [...orders];
  },

  async getById(id) {
    await delay(200);
    const order = orders.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async create(orderData) {
    await delay(500);
    const newOrder = {
      Id: Math.max(...orders.map(o => o.Id)) + 1,
...orderData,
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      trackingNumber: `TRK${String(newOrder.Id).padStart(3, '0')}`,
      trackingUpdates: [
        {
          date: new Date().toISOString().split('T')[0],
          status: "Order Processed",
          location: "Fulfillment Center"
        }
      ]
    };
    orders.push(newOrder);
    return { ...newOrder };
  },

  async updateStatus(id, status) {
    await delay(300);
    const orderIndex = orders.findIndex(o => o.Id === parseInt(id));
    if (orderIndex === -1) {
      throw new Error("Order not found");
    }
    orders[orderIndex].status = status;
    return { ...orders[orderIndex] };
  }
};