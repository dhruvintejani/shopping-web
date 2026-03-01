import { Order, ShippingAddress, CartItem } from '../types';

// Simulated orders storage
const orders: Order[] = [];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const orderService = {
  async createOrder(
    items: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: string
  ): Promise<Order> {
    await delay(500);

    const subtotal = items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const shipping = subtotal >= 35 ? 0 : 5.99;
    const tax = subtotal * 0.08;

    const order: Order = {
      id: `order_${Date.now()}`,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(order);
    return order;
  },

  async getOrders(): Promise<Order[]> {
    await delay(300);
    return [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getOrderById(id: string): Promise<Order | null> {
    await delay(200);
    return orders.find((o) => o.id === id) || null;
  },
};
