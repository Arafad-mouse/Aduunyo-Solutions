import { Building2, Smartphone, Store, Wifi, ArrowRight, CheckCircle2 } from 'lucide-react';
import React from 'react';

// Custom color constant for the brand
const brandColor = '#5ba44c';


const services = [
  {
    title: 'FINANCIAL INSTITUTIONS',
    icon: <Building2 className="w-8 h-8" style={{ color: '#5ba44c' }} />,
    description: 'Collaborate with us to offer seamless device financing solutions to your customers while minimizing risks and maximizing returns.'
  },
  {
    title: 'RESELLERS & DISTRIBUTORS',
    icon: <Store className="w-8 h-8" style={{ color: '#5ba44c' }} />,
    description: 'Expand your sales with our flexible financing options that make your products more accessible to a wider customer base.'
  },
  {
    title: 'RETAILERS',
    icon: <Smartphone className="w-8 h-8" style={{ color: '#5ba44c' }} />,
    description: 'Boost your sales by offering attractive financing options to your customers with our easy-to-integrate solutions.'
  },
  {
    title: 'TELECOMS',
    icon: <Wifi className="w-8 h-8" style={{ color: '#5ba44c' }} />,
    description: 'Enhance your service offerings with our device financing solutions, helping customers afford the latest technology.'
  }
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="py-16" style={{ backgroundColor: '#5ba44c', color: 'black' }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{color: 'white'}}>Our Partners & Clients</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed" style={{color: 'white', textAlign: 'justify'}}>
            Partner with us to make device financing secure and profitable with our comprehensive solution.
            Improve payment rates and minimize defaults with our robust risk management features.
          </p>
        </div>
      </div>
      <br></br>
      <br></br>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full mr-4" style={{ backgroundColor: 'rgba(249, 249, 249, 0.2)' }}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <a 
                href="#contact" 
                className="font-medium inline-flex items-center transition-colors duration-300"
                style={{ color: '#5ba44c' }}
              >
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
      <br></br>
      <br></br>

      {/* About Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Why Partner With Us?</h2>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">For Resellers & Distributors</h2>
              <p className="text-gray-700 mb-6 leading-relaxed" style={{ textAlign: 'justify' }}>
                Aduunyo Microfinance offers comprehensive financial services tailored for businesses of all sizes. 
                Our solutions help you increase your sales volume while we handle the financing aspect, ensuring 
                a seamless experience for both you and your customers.
              </p>
              
              <div className="space-y-3">
                {[
                  'Competitive financing rates',
                  'Quick approval process',
                  'Flexible payment terms',
                  'Dedicated account management',
                  'Real-time reporting dashboard'
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" style={{ color: '#5ba44c' }} />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">Ready to get started?</h2>
              <p className="text-gray-700 mb-6">
                Join our network of partners and start offering flexible financing options to your customers today.
              </p>
              <button 
                className="text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 hover:opacity-90"
                style={{ backgroundColor: '#5ba44c' }}
              >
                Contact Our Partnership Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
