import { CRMProvider } from './context/CRMContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CustomerList } from './components/CustomerList';
import { OrderList } from './components/OrderList';
import { useState } from "react";
import CustomerActive from "./assets/customer-active.svg";
import CustomerInactive from "./assets/customer-inactive.svg";

import OrderActive from "./assets/order-active.svg";
import OrderInactive from "./assets/order-inactive.svg";

function App() {
  const [activeMenu, setActiveMenu] = useState<'customers' | 'orders'>(
    'customers'
  );

  return (
    <ErrorBoundary>
      <CRMProvider>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <aside className="w-[90px] bg-white border-r border-gray-200 flex flex-col items-center py-5">
            {/* <button  className=" w-[50px] h-[50px] rounded-full bg-[#514EF3] flex items-center justify-center">
              C
            </button> */}

            <button
              onClick={() => setActiveMenu('customers')}
              className={`
                w-[50px]
                h-[50px]
                rounded-full
                flex
                items-center
                justify-center
                transition-all
                ${
                  activeMenu === 'customers'
                    ? 'bg-[#514EF3]'
                    : 'bg-white'
                }
              `}
            >
              <img
                src={
                  activeMenu === 'customers'
                    ? CustomerActive
                    : CustomerInactive
                }
                alt="Customers"
                className="w-4 h-4"
              />
            </button>

            <button
              onClick={() => setActiveMenu('orders')}
              className={`
                w-[50px]
                h-[50px]
                rounded-full
                flex
                items-center
                justify-center
                transition-all
                ${
                  activeMenu === 'orders'
                    ? 'bg-[#514EF3]'
                    : 'bg-white'
                }
              `}
            >
              <img
                src={
                  activeMenu === 'orders'
                    ? OrderActive
                    : OrderInactive
                }
                alt="Orders"
                className="w-4 h-4"
              />
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <header className="bg-white border-b border-[#EDF2F7] px-8 py-6">
              <h1 className="text-[24px] font-semibold text-[#092C4C]">
                Mini CRM
              </h1>

              <p className="text-[#6E7C87] text-sm mt-1">
                {activeMenu === 'customers'
                  ? 'Customer Management'
                  : 'Order Management'}
              </p>
            </header>

            <div className="p-8">
              {activeMenu === 'customers' ? (
                <CustomerList />
              ) : (
                <OrderList />
              )}
            </div>
          </main>
        </div>
      </CRMProvider>
    </ErrorBoundary>
  );
}

export default App;