import { CRMProvider } from './context/CRMContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AddCustomerForm } from './components/AddCustomerForm'
import { CustomerList } from './components/CustomerList'
import { AddOrderForm } from './components/AddOrderForm'
import { OrderList } from './components/OrderList'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <CRMProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Mini CRM untuk UMKM Kuliner
              </h1>
              <p className="text-gray-600">
                Kelola data pelanggan dan pesanan dengan mudah
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Forms */}
              <div className="space-y-8">
                <AddCustomerForm />
                <AddOrderForm />
              </div>

              {/* Right Column - Lists */}
              <div className="space-y-8">
                <CustomerList />
                <OrderList />
              </div>
            </div>
          </div>
        </div>
      </CRMProvider>
    </ErrorBoundary>
  )
}

export default App
