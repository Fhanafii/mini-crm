import { useState } from 'react';
import { customerAPI } from '../services/api';
import { useCRM } from '../context/CRMContext';

interface AddCustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCustomerForm({
  isOpen,
  onClose,
}: AddCustomerFormProps) {
  const { addCustomer } = useCRM();

  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');

    setFormData({
      email: '',
      phone: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const newCustomer = await customerAPI.addCustomer({
        name: `${firstName} ${lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
      });

      addCustomer(newCustomer);

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="w-full max-w-[650px] bg-white rounded-3xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-semibold text-[#17375E]">
            Add New Customer
          </h2>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#90A0B7] text-white flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-[#17375E]">
                First Name
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full h-12 rounded-xl border border-[#E5EAF0] bg-[#F4F7FA] px-4 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-[#17375E]">
                Last Name
              </label>

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full h-12 rounded-xl border border-[#E5EAF0] bg-[#F4F7FA] px-4 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-[#17375E]">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-12 rounded-xl border border-[#E5EAF0] bg-[#F4F7FA] px-4 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-[#17375E]">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full h-12 rounded-xl border border-[#E5EAF0] bg-[#F4F7FA] px-4 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end items-center gap-6 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="text-[#17375E] font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-full bg-[#514EF3] text-white font-medium"
            >
              {loading ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}