import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { orderAPI } from '../services/api';

interface OrderItemInput {
  name: string;
  quantity: number;
  price: number;
}

export function AddOrderForm() {
  const { customers, addOrder } = useCRM();
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [items, setItems] = useState<OrderItemInput[]>([]);
  const [currentItem, setCurrentItem] = useState<OrderItemInput>({
    name: '',
    quantity: 1,
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleAddItem = () => {
    if (!currentItem.name.trim()) {
      setError('Item name is required');
      return;
    }
    if (currentItem.quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }
    if (currentItem.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    setItems([...items, { ...currentItem }]);
    setCurrentItem({ name: '', quantity: 1, price: 0 });
    setError(null);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedCustomerId) {
      setError('Please select a customer');
      return;
    }

    if (items.length === 0) {
      setError('Please add at least one item');
      return;
    }

    try {
      setLoading(true);
      const newOrder = await orderAPI.addOrder({
        customerId: selectedCustomerId,
        items,
        totalPrice,
      });
      addOrder(newOrder);
      setSelectedCustomerId('');
      setItems([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to add order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Order</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Order added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Customer
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => {
              setSelectedCustomerId(e.target.value);
              setError(null);
            }}
            disabled={loading || customers.length === 0}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">-- Select a customer --</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        </div>

        {customers.length === 0 && (
          <p className="text-yellow-600 text-sm">
            No customers available. Please add customers first.
          </p>
        )}

        <div className="border-t-2 border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>

          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={currentItem.name}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, name: e.target.value })
                }
                placeholder="e.g., Nasi Goreng"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={currentItem.quantity}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  min="1"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={currentItem.price}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  step="0.01"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add Item
            </button>
          </div>

          {items.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Items in Order:</h4>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200"
                  >
                    <span className="text-gray-800">
                      {item.name} x{item.quantity} @ Rp{item.price.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={loading}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:bg-gray-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-lg font-bold text-gray-800">
              Total: Rp{totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || items.length === 0 || !selectedCustomerId}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding Order...' : 'Add Order'}
        </button>
      </form>
    </div>
  );
}
