import { useEffect, useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { customerAPI } from '../services/api';

export function CustomerList() {
  const { customers, setCustomers } = useCRM();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerAPI.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
        <button
          onClick={fetchCustomers}
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
        <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
        <button
          onClick={fetchCustomers}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {customers.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No customers yet. Add one to get started!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Phone
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {customer.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                  <td className="px-4 py-3 text-gray-600">{customer.phone}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
