import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

interface CRMContextType {
  customers: Customer[];
  orders: Order[];
  setCustomers: (customers: Customer[]) => void;
  setOrders: (orders: Order[]) => void;
  addCustomer: (customer: Customer) => void;
  addOrder: (order: Order) => void;
  getOrdersByCustomer: (customerId: string) => Order[];
  getCustomerById: (customerId: string) => Customer | undefined;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCustomers = localStorage.getItem('crm_customers');
    const savedOrders = localStorage.getItem('crm_orders');
    
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save to localStorage whenever customers change
  useEffect(() => {
    localStorage.setItem('crm_customers', JSON.stringify(customers));
  }, [customers]);

  // Save to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('crm_orders', JSON.stringify(orders));
  }, [orders]);

  const addCustomer = (customer: Customer) => {
    setCustomers([...customers, customer]);
  };

  const addOrder = (order: Order) => {
    setOrders([...orders, order]);
  };

  const getOrdersByCustomer = (customerId: string): Order[] => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getCustomerById = (customerId: string): Customer | undefined => {
    return customers.find(customer => customer.id === customerId);
  };

  return (
    <CRMContext.Provider
      value={{
        customers,
        orders,
        setCustomers,
        setOrders,
        addCustomer,
        addOrder,
        getOrdersByCustomer,
        getCustomerById,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}
