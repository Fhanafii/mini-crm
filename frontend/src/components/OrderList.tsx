import { useEffect, useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { orderAPI } from '../services/api';

export function OrderList() {
  const { customers, orders, setOrders, getCustomerById } = useCRM();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      if (customers.length > 0) {
        // Fetch orders for each customer
        const allOrders = [];
        for (const customer of customers) {
          const customerOrders = await orderAPI.getOrdersByCustomer(customer.id);
          allOrders.push(...customerOrders);
        }
        setOrders(allOrders);
      }
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCustomerId(e.target.value ? e.target.value : null);
  };

  const filteredOrders = selectedCustomerId
    ? orders.filter(order => order.customerId === selectedCustomerId)
    : orders;

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
        <button
          onClick={fetchAllOrders}
          className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
        <button
          onClick={fetchAllOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Customer
        </label>
        <select
          value={selectedCustomerId || ''}
          onChange={handleFilterChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">-- All Orders --</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          {selectedCustomerId
            ? 'No orders for this customer'
            : 'No orders yet. Create one to get started!'}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const customer = getCustomerById(order.customerId);
            return (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Order #{order.id.substring(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Customer: {customer?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      Rp{order.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded p-3 mb-3">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                    Items:
                  </h4>
                  <ul className="space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        • {item.name} x{item.quantity} @ Rp
                        {item.price.toLocaleString()}
                        {' '}= Rp
                        {(item.quantity * item.price).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
