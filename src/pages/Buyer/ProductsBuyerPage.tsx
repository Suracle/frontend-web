import React, { useState, useEffect } from 'react';
import { HeaderBuyer } from '@/components/common';
import { Leaf, Sparkles, Coffee, Utensils, Calculator, MessageCircle, Bot, Send } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  fobPrice: number;
  category: string;
  icon: string;
  hsCode: string;
  tariffRate: number;
  requirements: string;
  precedents: string;
}

const ProductsBuyerPage: React.FC = () => {
  const [products] = useState<Product[]>([
    {
      id: 'PRD001',
      name: 'Premium Korean Ginseng Extract',
      description: 'High-quality red ginseng extract with 6-year-old roots, perfect for health-conscious consumers.',
      price: 89.99,
      fobPrice: 65.00,
      category: 'Health & Wellness',
      icon: 'leaf',
      hsCode: '1211.20.10',
      tariffRate: 0.0,
      requirements: 'FDA registration required, must meet dietary supplement regulations',
      precedents: 'Recent shipments required additional phytosanitary certificates due to plant-based ingredients'
    },
    {
      id: 'PRD002',
      name: 'Korean Beauty Skincare Set',
      description: 'Complete K-beauty routine with cleanser, toner, serum, and moisturizer from premium Korean brands.',
      price: 124.99,
      fobPrice: 95.00,
      category: 'Beauty & Cosmetics',
      icon: 'sparkles',
      hsCode: '3304.99.00',
      tariffRate: 0.0,
      requirements: 'FDA cosmetic labeling requirements, ingredient disclosure needed',
      precedents: 'Previous imports required updated ingredient lists for compliance with US cosmetic regulations'
    },
    {
      id: 'PRD003',
      name: 'Traditional Korean Ceramics',
      description: 'Handcrafted ceramic dinnerware set featuring traditional Korean designs and craftsmanship.',
      price: 199.99,
      fobPrice: 150.00,
      category: 'Home & Living',
      icon: 'utensils',
      hsCode: '6912.00.48',
      tariffRate: 8.5,
      requirements: 'Lead content testing required for food-contact surfaces',
      precedents: 'Similar ceramic imports faced delays due to lead testing requirements at customs'
    },
    {
      id: 'PRD004',
      name: 'Korean Green Tea Premium Grade',
      description: 'Organic green tea leaves from Jeju Island, hand-picked and processed using traditional methods.',
      price: 45.99,
      fobPrice: 28.00,
      category: 'Food & Beverage',
      icon: 'coffee',
      hsCode: '0902.10.10',
      tariffRate: 6.4,
      requirements: 'Organic certification required, pesticide residue testing',
      precedents: 'Recent tea shipments required additional organic certification documentation'
    }
  ]);

  const [searchTerm] = useState('');
  const [selectedCategory] = useState('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [tariffInfo, setTariffInfo] = useState<Record<string, any>>({});
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', content: "Hello! I'm your AI trade assistant. Ask me about import requirements, regulations, or any product-specific concerns for purchasing from Korea." }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    console.log('ProductsBuyerPage mounted');
    // Initialize quantities
    const initialQuantities: Record<string, number> = {};
    products.forEach(product => {
      initialQuantities[product.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [products]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getIcon = (iconName: string) => {
    const iconMap = {
      leaf: <Leaf size={48} />,
      sparkles: <Sparkles size={48} />,
      coffee: <Coffee size={48} />,
      utensils: <Utensils size={48} />
    };
    return iconMap[iconName as keyof typeof iconMap] || <Leaf size={48} />;
  };

  const calculateTariff = (productId: string) => {
    const product = products.find(p => p.id === productId);
    const quantity = quantities[productId] || 1;
    
    if (!product) return;
    
    const totalFobValue = product.fobPrice * quantity;
    const tariffAmount = totalFobValue * (product.tariffRate / 100);
    const totalWithTariff = totalFobValue + tariffAmount;
    
    setTariffInfo(prev => ({
      ...prev,
      [productId]: {
        tariffAmount,
        totalWithTariff,
        show: true
      }
    }));
  };

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { type: 'user', content: chatInput }]);
    setChatInput('');
    
    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        type: 'bot', 
        content: "I can help you with import requirements and regulations. Try asking something like 'What are the import requirements for [product name]?' or 'Help me understand customs requirements.'" 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBuyer />
      
      <main className="max-w-6xl mx-auto px-5 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Korean Products</h1>
          <p className="text-text-secondary">Discover premium Korean products with AI-powered customs insights</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {/* Product Image */}
              <div className="relative bg-gradient-secondary from-accent-cream to-secondary flex items-center justify-center" style={{ height: '200px' }}>
                <div className="text-white opacity-70">
                  {getIcon(product.icon)}
                </div>
                <div className="absolute top-3 left-3 bg-white bg-opacity-90 text-primary px-2 py-1 rounded-xl text-xs font-semibold">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="text-2xl font-bold text-primary mb-4">
                  {formatPrice(product.price)}
                </div>
                <div className="text-sm text-text-secondary mb-4">
                  FOB Price: {formatPrice(product.fobPrice)}
                </div>

                {/* Quantity Section */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-text-primary mb-2">Quantity</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={quantities[product.id] || 1}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus-ring-primary"
                    />
                    <button
                      onClick={() => calculateTariff(product.id)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
                    >
                      <Calculator size={16} />
                    </button>
                  </div>
                </div>

                {/* Tariff Info */}
                {tariffInfo[product.id]?.show && (
                  <div className="bg-accent-cream p-3 rounded-lg">
                    <div className="text-primary font-semibold mb-1">
                      Estimated Tariff: {formatPrice(tariffInfo[product.id].tariffAmount)}
                    </div>
                    <div className="text-xs text-text-secondary">
                      Total with tariff: {formatPrice(tariffInfo[product.id].totalWithTariff)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chatbot */}
        <div className="fixed bottom-5 right-5 z-50">
          <button
            onClick={() => setChatbotOpen(!chatbotOpen)}
            className="w-15 h-15 bg-gradient-primary text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center"
          >
            <MessageCircle size={24} />
          </button>
          
          {chatbotOpen && (
            <div className="absolute bottom-16 right-0 w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col">
              {/* Chatbot Header */}
              <div className="bg-gradient-primary text-white p-4 rounded-t-2xl flex items-center gap-3">
                <Bot size={20} />
                <div className="font-semibold">AI Trade Assistant</div>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      message.type === 'user'
                        ? 'bg-primary text-white ml-auto'
                        : 'bg-accent-cream text-text-primary'
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
              
              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 flex gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about import requirements..."
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-xl focus-ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="w-9 h-9 bg-primary text-white rounded-full hover:bg-secondary transition-colors flex items-center justify-center"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductsBuyerPage;

