import ordersData from "@/services/mockData/orders.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let orders = [...ordersData];

export const orderService = {
  async getAll() {
    await delay(300);
    return [...orders];
  },

  async getById(id) {
    try {
      await delay(200);
      const order = orders.find(o => o.Id === parseInt(id));
      if (!order) {
        console.warn(`Order with ID ${id} not found`);
        return null;
      }
      return { ...order };
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  async create(orderData) {
    try {
      // Validate required order data
      if (!orderData || !orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        throw new Error('Invalid order data: items array is required and cannot be empty');
      }
      
      if (!orderData.totalAmount || orderData.totalAmount <= 0) {
        throw new Error('Invalid order data: totalAmount must be greater than 0');
      }
      
      await delay(300);
      const orderId = Math.max(...orders.map(o => o.Id), 0) + 1;
      const newOrder = {
        Id: orderId,
        orderDate: new Date().toISOString().split('T')[0],
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        trackingNumber: `TRK${String(orderId).padStart(3, '0')}`,
        status: 'processing',
        trackingHistory: [
          {
            status: 'processing',
            date: new Date().toISOString().split('T')[0],
            location: "Fulfillment Center"
          }
        ],
        ...orderData
      };
      orders.push(newOrder);
      return { ...newOrder };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async update(id, orderData) {
    try {
      await delay(200);
      const orderIndex = orders.findIndex(o => o.Id === parseInt(id));
      if (orderIndex === -1) {
        console.error(`Order with ID ${id} not found for update`);
        throw new Error('Order not found');
      }
      
      orders[orderIndex] = { ...orders[orderIndex], ...orderData };
      return { ...orders[orderIndex] };
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(200);
      const orderIndex = orders.findIndex(o => o.Id === parseInt(id));
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }
      
      const deletedOrder = orders.splice(orderIndex, 1)[0];
      return { ...deletedOrder };
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
};