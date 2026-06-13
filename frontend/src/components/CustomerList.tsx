import { useEffect, useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { customerAPI } from '../services/api';
import { AddCustomerForm } from './AddCustomerForm';

export function CustomerList() {
  const { customers, setCustomers } = useCRM();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-slate-800">
            Total: {customers.length} customers
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#514EF3] text-white px-6 py-3 rounded-full"
          >
            Add New Customer
          </button>
        </div>

        {customers.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center">
            No customers found
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden border">
            <table className="w-full">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="text-left px-8 py-5">Name</th>
                  <th className="text-left px-8 py-5">Email</th>
                  <th className="text-left px-8 py-5">Phone</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-8 py-6">
                      {customer.name}
                    </td>

                    <td className="px-8 py-6">
                      {customer.email}
                    </td>

                    <td className="px-8 py-6">
                      {customer.phone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <AddCustomerForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
