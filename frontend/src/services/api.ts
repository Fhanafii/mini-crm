import axios from 'axios';
import { Customer, Order } from '../context/CRMContext';

const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API calls
export const customerAPI = {
  getAllCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await apiClient.get<Customer[]>('/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  addCustomer: async (customer: {
    name: string;
    email: string;
    phone: string;
  }): Promise<Customer> => {
    try {
      const response = await apiClient.post<{
        message: string;
        customer: Customer;
      }>('/customers', customer);
      return response.data.customer;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  },
};

// Order API calls
export const orderAPI = {
  addOrder: async (orderData: {
    customerId: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    totalPrice: number;
  }): Promise<Order> => {
    try {
      const response = await apiClient.post<{
        message: string;
        order: Order;
      }>('/orders', orderData);
      return response.data.order;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  getOrdersByCustomer: async (customerId: string): Promise<Order[]> => {
    try {
      const response = await apiClient.get<Order[]>(
        `/orders?customerId=${customerId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
};
