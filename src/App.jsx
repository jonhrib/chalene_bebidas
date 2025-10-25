import React, { useState, useEffect, useMemo } from 'react';
import { Home, Users, Package, Phone, Mail, MapPin, Clock, Search, Filter, Settings, Plus, Edit, Trash2, Download, Upload, Eye, EyeOff, Lock, User, Coffee, Wine, Beer, ShoppingCart, Star, Menu, X, CheckCircle, AlertCircle, Key, Instagram, Facebook, ChevronRight, Sparkles, Crown, Zap, Shield, Truck, Award, IceCream, IceCream2, LucideIceCream, Heart, MessageCircle } from 'lucide-react';
import nossaLojaImage from './assets/images/nossa-loja.png';

// Mock data initialization
const initialProducts = [
  { id: 1, name: 'Cerveja Artesanal IPA', price: 12.90, category: 'Cervejas', featured: true, description: 'Cerveja artesanal com notas cítricas e amargor equilibrado', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop' },
  { id: 2, name: 'Vinho Tinto Malbec', price: 45.50, category: 'Vinhos', featured: true, description: 'Vinho tinto argentino com corpo médio e taninos suaves', image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=400&h=300&fit=crop' },
  { id: 3, name: 'Whisky Escocês 12 anos', price: 189.90, category: 'Destilados', featured: false, description: 'Whisky single malt com notas de baunilha e carvalho', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop' },
  { id: 4, name: 'Café Gourmet em Grãos', price: 28.75, category: 'Cafés', featured: true, description: 'Grãos 100% arábica torrados na medida certa', image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=300&fit=crop' },
  { id: 5, name: 'Champagne Brut', price: 89.00, category: 'Espumantes', featured: false, description: 'Espumante seco perfeito para celebrações', image: 'https://images.unsplash.com/photo-1535958636471-bd4c8ebf70c4?w=400&h=300&fit=crop' },
  { id: 6, name: 'Cachaça Premium', price: 65.30, category: 'Destilados', featured: true, description: 'Cachaça envelhecida em carvalho francês', image: 'https://images.unsplash.com/photo-1571902943206-3058411b6e6e?w=400&h=300&fit=crop' }
];

const initialCategories = ['Cervejas', 'Vinhos', 'Destilados', 'Espumantes', 'Cafés', 'Destilados'];

const initialCompanyInfo = {
  name: 'Chalene Bebidas',
  title: 'Chalene Bebidas - Excelência em Bebidas Premium',
  phone: '(45) 99822-7929',
  email: 'contato@chalenebebidas.com.br',
  address: 'Rua Manoel Moreira Andrion, 1552 - sala 4. Foz do Iguaçu - PR',
  hours: 'Seg: Fechado | Ter: 16h-00h | Qua-Sab: 11h-00h | Dom: 09:30h-22h',
  adminUser: 'admin',
  adminPassword: 'admin123',
  adminEmail: 'admin@bebidaspremium.com.br',
  adminRecoveryEmail: 'admin@bebidaspremium.com.br'
};

const initialSocialMedia = {
  instagram: '@chalenebebidas',
  facebook: 'chalenebebidas',
  whatsapp: '(45) 99822-7929'
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [adminMode, setAdminMode] = useState(false);
  const [adminLogin, setAdminLogin] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });
  const [companyInfo, setCompanyInfo] = useState(() => {
    const saved = localStorage.getItem('companyInfo');
    return saved ? JSON.parse(saved) : initialCompanyInfo;
  });
  const [socialMedia, setSocialMedia] = useState(() => {
    const saved = localStorage.getItem('socialMedia');
    return saved ? JSON.parse(saved) : initialSocialMedia;
  });
  const [adminPanelPage, setAdminPanelPage] = useState('dashboard');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', featured: false, description: '', image: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('name');
  const [loginError, setLoginError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [productErrors, setProductErrors] = useState({});

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
  }, [companyInfo]);

  useEffect(() => {
    localStorage.setItem('socialMedia', JSON.stringify(socialMedia));
  }, [socialMedia]);

  useEffect(() => {
    const savedAdminMode = localStorage.getItem('adminMode');
    if (savedAdminMode === 'true') {
      setAdminMode(true);
    }
  }, []);

  const showAlert = (message) => {
    setSuccessMessage(message);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

  const validateProduct = (product) => {
    const errors = {};
    if (!product.name.trim()) errors.name = 'Nome do produto é obrigatório';
    if (!product.price || parseFloat(product.price) <= 0) errors.price = 'Preço deve ser maior que zero';
    if (!product.category) errors.category = 'Categoria é obrigatória';
    if (!product.description.trim()) errors.description = 'Descrição é obrigatória';
    return errors;
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (adminLogin.username === companyInfo.adminUser && adminLogin.password === companyInfo.adminPassword) {
      setAdminMode(true);
      localStorage.setItem('adminMode', 'true');
      setLoginError('');
      showAlert('Login realizado com sucesso!');
    } else {
      setLoginError('Usuário ou senha incorretos');
    }
  };

  const handleAdminLogout = () => {
    setAdminMode(false);
    setAdminLogin({ username: '', password: '' });
    setAdminPanelPage('dashboard');
    localStorage.removeItem('adminMode');
    showAlert('Logout realizado com sucesso!');
  };

  const handleAddProduct = () => {
    const errors = validateProduct(newProduct);
    if (Object.keys(errors).length > 0) {
      setProductErrors(errors);
      return;
    }

    const product = {
      id: Date.now(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      featured: !!newProduct.featured
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', category: '', featured: false, description: '', image: '' });
    setProductErrors({});
    showAlert('Produto adicionado com sucesso!');
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      const errors = validateProduct(editingProduct);
      if (Object.keys(errors).length > 0) {
        setProductErrors(errors);
        return;
      }

      setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, price: parseFloat(editingProduct.price) } : p));
      setEditingProduct(null);
      setProductErrors({});
      showAlert('Produto atualizado com sucesso!');
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    showAlert('Produto removido com sucesso!');
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      showAlert('Categoria adicionada com sucesso!');
    }
  };

  const handleUpdateCompanyInfo = () => {
    setCompanyInfo({ ...companyInfo });
    showAlert('Configurações salvas com sucesso!');
  };

  const handlePasswordRecovery = (e) => {
    e.preventDefault();
    if (recoveryEmail === companyInfo.adminEmail || recoveryEmail === companyInfo.adminRecoveryEmail) {
      setRecoverySent(true);
      setTimeout(() => {
        setForgotPassword(false);
        setRecoverySent(false);
        setRecoveryEmail('');
      }, 3000);
    } else {
      setLoginError('Email não encontrado no sistema');
    }
  };

  const handleImageUpload = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        if (isEditing && editingProduct) {
          setEditingProduct({ ...editingProduct, image: imageUrl });
        } else {
          setNewProduct({ ...newProduct, image: imageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formatPriceInput = (value) => {
    let cleaned = value.replace(/[^\d,]/g, '');
    const parts = cleaned.split(',');
    if (parts.length > 2) {
      cleaned = parts[0] + ',' + parts.slice(1).join('');
    }
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + ',' + parts[1].substring(0, 2);
    }
    return cleaned;
  };

  const handlePriceChange = (value, isEditing = false) => {
    const formatted = formatPriceInput(value);
    if (isEditing && editingProduct) {
      setEditingProduct({ ...editingProduct, price: formatted });
    } else {
      setNewProduct({ ...newProduct, price: formatted });
    }
  };

  const exportProducts = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'produtos.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showAlert('Produtos exportados com sucesso!');
  };

  const importProducts = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedProducts = JSON.parse(event.target.result);
          setProducts(importedProducts);
          showAlert('Produtos importados com sucesso!');
        } catch (error) {
          alert('Erro ao importar arquivo');
        }
      };
      reader.readAsText(file);
    }
  };

  const featuredProducts = products.filter(p => p.featured);
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || p.category === selectedCategory)
    );
    
    if (sortOption === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    }
    
    return filtered;
  }, [products, searchTerm, selectedCategory, sortOption]);

  // Estilos CSS modernos e escuros
  const styles = `
    .bg-dark-gradient {
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%);
    }
    .bg-gold-gradient {
      background: linear-gradient(135deg, #8e7a18 0%, #a8922c 50%, #c8b45c 100%);
    }
    .bg-glass {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .bg-card-dark {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .text-gold {
      color: #c8b45c;
    }
    .text-gold-light {
      color: #e5d9a6;
    }
    .border-gold {
      border-color: #8e7a18;
    }
    .hover-glow:hover {
      box-shadow: 0 0 20px rgba(142, 122, 24, 0.3);
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `;

  const renderHomePage = () => (
    <div className="min-h-screen bg-dark-gradient text-white">
      <style>{styles}</style>
      
      {/* Hero Section Moderna */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-gold/10 border border-gold/20 rounded-full px-6 py-3">
                <Sparkles className="text-gold" size={20} />
                <span className="text-gold-light text-sm font-medium">Excelência em Bebidas</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                Descubra o 
                <span className="bg-gradient-to-r from-[#6b5a12] via-[#8e7a18] to-[#a8922c] bg-clip-text text-transparent block">Mundo das</span>
                Bebidas De Qualidade
                </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                Na Chalene Bebidas, cada garrafa conta uma história. Descubra sabores únicos e experiências 
                memoráveis com nossa seleção.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setCurrentPage('products')}
                  className="group relative bg-gold-gradient text-black px-8 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10">Explorar Catálogo</span>
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button 
                  onClick={() => setCurrentPage('about')}
                  className="group border-2 border-gold text-gold-light px-8 py-4 rounded-xl font-bold hover:bg-gold/10 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Nossa História
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-glass rounded-3xl p-8 backdrop-blur-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="bg-card-dark rounded-2xl p-6 hover-glow transition-all duration-300">
                        <Wine className="text-gold mb-3" size={32} />
                        <h3 className="font-bold text-white mb-2">Vinhos Selecionados</h3>
                        <p className="text-gray-400 text-sm">Das melhores e mais acessíveis qualidades</p>
                      </div>
                      <div className="bg-card-dark rounded-2xl p-6 hover-glow transition-all duration-300">
                        <Beer className="text-gold mb-3" size={32} />
                        <h3 className="font-bold text-white mb-2">Cervejas Diversas</h3>
                        <p className="text-gray-400 text-sm">Sabores únicos e memoráveis</p>
                      </div>
                    </div>
                    <div className="space-y-4 mt-8">
                      <div className="bg-card-dark rounded-2xl p-6 hover-glow transition-all duration-300">
                        <IceCream className="text-gold mb-3" size={32} />
                        <h3 className="font-bold text-white mb-2">Gelo e Carvão</h3>
                        <p className="text-gray-400 text-sm">A melhor qualidade para sua necessidade</p>
                      </div>
                      <div className="bg-card-dark rounded-2xl p-6 hover-glow transition-all duration-300">
                        <Crown className="text-gold mb-3" size={32} />
                        <h3 className="font-bold text-white mb-2">Destilados e Outros</h3>
                        <p className="text-gray-400 text-sm">Para os verdadeiros apreciadores de qualidade</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Elementos decorativos */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gold/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                Destaques Exclusivos
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Nossas seleções mais premium, escolhidas a dedo para proporcionar experiências inesquecíveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="group bg-card-dark rounded-3xl overflow-hidden hover-glow transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-gold-gradient text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ Destaque
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-gold-light transition-colors">
                      {product.name}
                    </h3>
                    <span className="bg-gold/20 text-gold-light px-3 py-1 rounded-lg text-lg font-bold">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="text-gold fill-current" size={16} />
                      ))}
                    </div>
                    <button className="text-gold hover:text-gold-light font-medium text-sm flex items-center gap-1 transition-colors">
                      Ver detalhes
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                Por que nos Escolher?
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-glass rounded-2xl p-6 text-center hover-glow transition-all duration-300 group">
              <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="text-black" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Qualidade Premium</h3>
              <p className="text-gray-400 leading-relaxed">Produtos selecionados com os mais altos padrões de excelência.</p>
            </div>
            
            <div className="bg-glass rounded-2xl p-6 text-center hover-glow transition-all duration-300 group">
              <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Truck className="text-black" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Entrega Rápida</h3>
              <p className="text-gray-400 leading-relaxed">Entregamos em toda região com agilidade e segurança.</p>
            </div>
            
            <div className="bg-glass rounded-2xl p-6 text-center hover-glow transition-all duration-300 group">
              <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-black" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Atendimento Expert</h3>
              <p className="text-gray-400 leading-relaxed">Equipe especializada para orientar sua escolha perfeita.</p>
            </div>
            
            <div className="bg-glass rounded-2xl p-6 text-center hover-glow transition-all duration-300 group">
              <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-black" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Garantia Total</h3>
              <p className="text-gray-400 leading-relaxed">Compra 100% segura com garantia de satisfação.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderAboutPage = () => (
  <div className="min-h-screen bg-dark-gradient text-white py-20">
    <style>{styles}</style>
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-8">
              Nossa <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">História</span>
            </h1>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                Fundada em 2010, a <strong className="text-gold-light">Chalene Bebidas</strong> nasceu da paixão por 
                bebidas de qualidade e do desejo de compartilhar experiências únicas com nossos clientes.
              </p>
              <p>
                Começamos com uma pequena loja no coração da cidade e, através de muito trabalho e dedicação, 
                nos tornamos referência em bebidas premium na região.
              </p>
              <p>
                Cada produto em nosso catálogo é cuidadosamente selecionado, garantindo que apenas o que há de 
                melhor chegue até você. Nossa missão vai além da venda - queremos proporcionar momentos especiais.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-glass rounded-3xl p-8 backdrop-blur-xl">
              <img 
                src={nossaLojaImage}
                alt="Nossa loja" 
                className="w-full h-80 object-cover rounded-2xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gold/20 rounded-full blur-xl"></div>
          </div>
        </div>
        
        <div className="bg-glass rounded-3xl p-12 backdrop-blur-xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Nossos Valores
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="text-black" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Inovação</h3>
              <p className="text-gray-400">Sempre em busca das novidades e tendências do mercado.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="text-black" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Paixão</h3>
              <p className="text-gray-400">Amamos o que fazemos e isso reflete em cada produto.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="text-black" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Excelência</h3>
              <p className="text-gray-400">Compromisso com a qualidade em cada detalhe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

  const renderProductsPage = () => (
    <div className="min-h-screen bg-dark-gradient text-white py-8">
      <style>{styles}</style>
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Nossa Seleção
            </span>
          </h1>
          
          <div className="bg-glass rounded-2xl p-8 backdrop-blur-xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-full pl-12 pr-4 py-4 bg-black/30 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-gold focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="px-4 py-4 bg-black/30 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-gold focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                className="px-4 py-4 bg-black/30 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-gold focus:border-transparent"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="name">Ordenar por nome</option>
                <option value="price">Ordenar por preço</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="group bg-card-dark rounded-2xl overflow-hidden hover-glow transition-all duration-300 hover:scale-105">
              <div className="relative h-60 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                {product.featured && (
                  <div className="absolute top-3 right-3">
                    <Star className="text-gold fill-current" size={20} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white group-hover:text-gold-light transition-colors">
                    {product.name}
                  </h3>
                  <span className="bg-gold/20 text-gold-light px-2 py-1 rounded-lg text-sm font-bold">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{product.category}</span>
                  <button className="text-gold hover:text-gold-light text-sm font-medium transition-colors">
                    Ver mais
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="mx-auto text-gray-600 mb-4" size={64} />
            <p className="text-gray-400 text-lg">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  );

    const renderContactPage = () => (
    <div className="min-h-screen bg-dark-gradient text-white py-20">
        <style>{styles}</style>
        <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-glass rounded-3xl p-8 backdrop-blur-xl">
                <h1 className="text-4xl font-bold text-center mb-8">
                <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                    Fale Conosco
                </span>
                </h1>
                
                <div className="space-y-6">
                <div className="flex items-start">
                    <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center mr-4">
                    <Phone className="text-black" size={24} />
                    </div>
                    <div>
                    <h3 className="text-lg font-semibold text-white">Telefone</h3>
                    <p className="text-gray-300">{companyInfo.phone}</p>
                    <a 
                        href={`https://wa.me/5545998227929`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gold-light hover:text-gold transition-colors text-sm mt-1 inline-flex items-center"
                    >
                        <MessageCircle className="mr-1" size={14} />
                        Falar no WhatsApp
                    </a>
                    </div>
                </div>
                
                <div className="flex items-start">
                    <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center mr-4">
                    <Mail className="text-black" size={24} />
                    </div>
                    <div>
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                    <p className="text-gray-300">{companyInfo.email}</p>
                    <a 
                        href={`mailto:${companyInfo.email}`}
                        className="text-gold-light hover:text-gold transition-colors text-sm mt-1"
                    >
                        Enviar email
                    </a>
                    </div>
                </div>
                
                <div className="flex items-start">
                    <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center mr-4">
                    <MapPin className="text-black" size={24} />
                    </div>
                    <div>
                    <h3 className="text-lg font-semibold text-white">Endereço</h3>
                    <p className="text-gray-300">{companyInfo.address}</p>
                    <a 
                        href="https://maps.google.com/?q=Rua+Manoel+Moreira+Andrion,1552,+Foz+do+Iguaçu+PR"
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gold-light hover:text-gold transition-colors text-sm mt-1 inline-flex items-center"
                    >
                        <MapPin className="mr-1" size={14} />
                        Ver no Google Maps
                    </a>
                    </div>
                </div>
                
                <div className="flex items-start">
                    <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center mr-4">
                    <Clock className="text-black" size={24} />
                    </div>
                    <div>
                    <h3 className="text-lg font-semibold text-white">Horário</h3>
                    <p className="text-gray-300">{companyInfo.hours}</p>
                    </div>
                </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Redes Sociais</h3>
                <div className="flex space-x-4">
                    <a 
                    href={`https://instagram.com/${socialMedia.instagram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center hover:scale-110 transition-transform"
                    >
                    <Instagram className="text-black" size={24} />
                    </a>
                    <a 
                    href={`https://facebook.com/${socialMedia.facebook}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center hover:scale-110 transition-transform"
                    >
                    <Facebook className="text-black" size={24} />
                    </a>
                    <a 
                    href={`https://wa.me/5545998227929`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center hover:scale-110 transition-transform"
                    >
                    <MessageCircle className="text-black" size={24} />
                    </a>
                </div>
                </div>
            </div>
            
            <div className="bg-glass rounded-3xl p-8 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-center mb-6">Nossa Localização</h2>
                
                {/* Mapa do Google Maps */}
                <div className="bg-black/30 border-2 border-gold/20 rounded-2xl overflow-hidden h-96">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.238299810728!2d-54.58846792433303!3d-25.468977232987086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f69ac0a85c0d23%3A0xfd713c5bd61b5d6c!2sR.%20Manoel%20Moreira%20Andrion%2C%201552%20-%20sala%204%20-%20Vila%20Portes%2C%20Foz%20do%20Igua%C3%A7u%20-%20PR%2C%2085870-150!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(85%)' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização da Chalene Bebidas"
                    className="rounded-xl"
                ></iframe>
                </div>
                
                <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-gold-light font-semibold">Endereço:</span>
                    <span className="text-gray-300 text-right">{companyInfo.address}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gold-light font-semibold">Cidade:</span>
                    <span className="text-gray-300">Foz do Iguaçu - PR</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gold-light font-semibold">CEP:</span>
                    <span className="text-gray-300">85870-150</span>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                    <a 
                    href="https://maps.google.com/?q=Rua+Manoel+Moreira+Andrion,1552,+Foz+do+Iguaçu+PR"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gold-gradient text-black py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                    <MapPin className="mr-2" size={20} />
                    Abrir no Google Maps
                    </a>
                </div>
                </div>
            </div>
            </div>

            {/* Seção de informações adicionais */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-glass rounded-2xl p-6 text-center backdrop-blur-xl">
                <Truck className="text-gold mx-auto mb-4" size={32} />
                <h3 className="text-lg font-semibold text-white mb-2">Entrega Rápida</h3>
                <p className="text-gray-400 text-sm">Entregamos em toda Foz do Iguaçu e região</p>
            </div>
            
            <div className="bg-glass rounded-2xl p-6 text-center backdrop-blur-xl">
                <Shield className="text-gold mx-auto mb-4" size={32} />
                <h3 className="text-lg font-semibold text-white mb-2">Compra Segura</h3>
                <p className="text-gray-400 text-sm">Ambiente seguro para suas compras</p>
            </div>
            
            <div className="bg-glass rounded-2xl p-6 text-center backdrop-blur-xl">
                <Clock className="text-gold mx-auto mb-4" size={32} />
                <h3 className="text-lg font-semibold text-white mb-2">Atendimento</h3>
                <p className="text-gray-400 text-sm">Estamos aqui para te atender</p>
            </div>
            </div>
        </div>
        </div>
    </div>
    );

  // ... (mantenha as outras funções renderAdminLogin, renderAdminDashboard, etc. com o mesmo estilo escuro)

 const renderAdminLogin = () => (
     <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
         <div className="text-center mb-8">
           <Lock className="mx-auto text-amber-600 mb-4" size={48} />
           <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
           <p className="text-gray-600 mt-2">Faça login para gerenciar sua loja</p>
         </div>
         
         {!forgotPassword ? (
           <form onSubmit={handleAdminLogin}>
             <div className="mb-6">
               <label className="block text-gray-700 mb-2">Usuário</label>
               <div className="relative">
                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                 <input
                   type="text"
                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                   value={adminLogin.username}
                   onChange={(e) => setAdminLogin({...adminLogin, username: e.target.value})}
                   required
                 />
               </div>
             </div>
             
             <div className="mb-6">
               <label className="block text-gray-700 mb-2">Senha</label>
               <div className="relative">
                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                 <input
                   type={showPassword ? "text" : "password"}
                   className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                   value={adminLogin.password}
                   onChange={(e) => setAdminLogin({...adminLogin, password: e.target.value})}
                   required
                 />
                 <button
                   type="button"
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                   onClick={() => setShowPassword(!showPassword)}
                 >
                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                 </button>
               </div>
             </div>
             
             {loginError && (
               <div className="mb-4 text-red-600 text-sm flex items-center">
                 <AlertCircle size={16} className="mr-2" />
                 {loginError}
               </div>
             )}
             
             <button
               type="submit"
               className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-300 mb-4"
             >
               Entrar
             </button>
             
             <div className="text-center">
               <button
                 type="button"
                 onClick={() => setForgotPassword(true)}
                 className="text-amber-600 hover:text-amber-800 font-medium text-sm"
               >
                 <Key className="inline mr-1" size={14} />
                 Esqueci minha senha
               </button>
             </div>
           </form>
         ) : (
           <form onSubmit={handlePasswordRecovery}>
             <div className="mb-6">
               <label className="block text-gray-700 mb-2">Email de recuperação</label>
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                 <input
                   type="email"
                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                   value={recoveryEmail}
                   onChange={(e) => setRecoveryEmail(e.target.value)}
                   placeholder="seu@email.com"
                   required
                 />
               </div>
               <p className="text-sm text-gray-600 mt-2">
                 Digite o email cadastrado para receber instruções de recuperação.
               </p>
             </div>
             
             {recoverySent ? (
               <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                 <div className="flex items-center text-green-800">
                   <CheckCircle className="mr-2" size={20} />
                   <span>Email de recuperação enviado com sucesso!</span>
                 </div>
               </div>
             ) : (
               <>
                 {loginError && (
                   <div className="mb-4 text-red-600 text-sm flex items-center">
                     <AlertCircle size={16} className="mr-2" />
                     {loginError}
                   </div>
                 )}
                 
                 <div className="flex gap-4">
                   <button
                     type="submit"
                     className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-300"
                   >
                     Enviar Recuperação
                   </button>
                   <button
                     type="button"
                     onClick={() => setForgotPassword(false)}
                     className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300"
                   >
                     Cancelar
                   </button>
                 </div>
               </>
             )}
           </form>
         )}
         
         <div className="mt-6 text-center">
           <button
             onClick={() => setCurrentPage('home')}
             className="text-amber-600 hover:text-amber-800 font-medium"
           >
             Voltar para o site
           </button>
         </div>
       </div>
     </div>
   );
 
   const renderAdminDashboard = () => (
     <div className="min-h-screen bg-gray-50">
       {/* Alert de Sucesso */}
       {showSuccessAlert && (
         <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50 transform transition-all duration-300 animate-in slide-in-from-right">
           <div className="flex items-center">
             <CheckCircle className="text-green-600 mr-3" size={24} />
             <div>
               <p className="text-green-800 font-medium">{successMessage}</p>
             </div>
             <button
               onClick={() => setShowSuccessAlert(false)}
               className="ml-4 text-green-600 hover:text-green-800"
             >
               <X size={20} />
             </button>
           </div>
         </div>
       )}
 
       <div className="bg-white shadow-sm">
         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
           <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
           <button
             onClick={handleAdminLogout}
             className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
           >
             Sair
           </button>
         </div>
       </div>
       
       <div className="container mx-auto px-4 py-8">
         <div className="flex flex-wrap gap-4 mb-8">
           <button
             onClick={() => setAdminPanelPage('dashboard')}
             className={`px-6 py-3 rounded-lg font-medium transition-colors ${
               adminPanelPage === 'dashboard' 
                 ? 'bg-amber-600 text-white' 
                 : 'bg-white text-gray-700 hover:bg-gray-100'
             }`}
           >
             Dashboard
           </button>
           <button
             onClick={() => setAdminPanelPage('products')}
             className={`px-6 py-3 rounded-lg font-medium transition-colors ${
               adminPanelPage === 'products' 
                 ? 'bg-amber-600 text-white' 
                 : 'bg-white text-gray-700 hover:bg-gray-100'
             }`}
           >
             Produtos
           </button>
           <button
             onClick={() => setAdminPanelPage('categories')}
             className={`px-6 py-3 rounded-lg font-medium transition-colors ${
               adminPanelPage === 'categories' 
                 ? 'bg-amber-600 text-white' 
                 : 'bg-white text-gray-700 hover:bg-gray-100'
             }`}
           >
             Categorias
           </button>
           <button
             onClick={() => setAdminPanelPage('settings')}
             className={`px-6 py-3 rounded-lg font-medium transition-colors ${
               adminPanelPage === 'settings' 
                 ? 'bg-amber-600 text-white' 
                 : 'bg-white text-gray-700 hover:bg-gray-100'
             }`}
           >
             Configurações
           </button>
           <button
             onClick={() => setAdminPanelPage('backup')}
             className={`px-6 py-3 rounded-lg font-medium transition-colors ${
               adminPanelPage === 'backup' 
                 ? 'bg-amber-600 text-white' 
                 : 'bg-white text-gray-700 hover:bg-gray-100'
             }`}
           >
             Backup
           </button>
         </div>
         
         {adminPanelPage === 'dashboard' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white rounded-xl shadow p-6">
               <div className="flex items-center">
                 <Package className="text-amber-600 mr-4" size={32} />
                 <div>
                   <p className="text-gray-600">Total de Produtos</p>
                   <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                 </div>
               </div>
             </div>
             <div className="bg-white rounded-xl shadow p-6">
               <div className="flex items-center">
                 <Coffee className="text-amber-600 mr-4" size={32} />
                 <div>
                   <p className="text-gray-600">Categorias</p>
                   <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
                 </div>
               </div>
             </div>
             <div className="bg-white rounded-xl shadow p-6">
               <div className="flex items-center">
                 <Star className="text-amber-600 mr-4" size={32} />
                 <div>
                   <p className="text-gray-600">Produtos em Destaque</p>
                   <p className="text-2xl font-bold text-gray-800">{products.filter(p => p.featured).length}</p>
                 </div>
               </div>
             </div>
           </div>
         )}
         
         {adminPanelPage === 'products' && (
           <div className="bg-white rounded-xl shadow p-6">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-gray-800">Gerenciar Produtos</h2>
               <button
                 onClick={() => {
                   setEditingProduct(null);
                   setProductErrors({});
                 }}
                 className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
               >
                 <Plus className="inline mr-2" size={16} /> Novo Produto
               </button>
             </div>
             
             {editingProduct === null ? (
               <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                   <div>
                     <label className="block text-gray-700 mb-2">Nome do Produto *</label>
                     <input
                       type="text"
                       className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                         productErrors.name ? 'border-red-500' : 'border-gray-300'
                       }`}
                       value={newProduct.name}
                       onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                       placeholder="Nome do produto"
                     />
                     {productErrors.name && (
                       <p className="text-red-500 text-sm mt-1 flex items-center">
                         <AlertCircle size={14} className="mr-1" />
                         {productErrors.name}
                       </p>
                     )}
                   </div>
                   <div>
                     <label className="block text-gray-700 mb-2">Preço (R$) *</label>
                     <div className="relative">
                       <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                       <input
                         type="text"
                         className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                           productErrors.price ? 'border-red-500' : 'border-gray-300'
                         }`}
                         value={newProduct.price}
                         onChange={(e) => handlePriceChange(e.target.value)}
                         placeholder="0,00"
                       />
                     </div>
                     {productErrors.price && (
                       <p className="text-red-500 text-sm mt-1 flex items-center">
                         <AlertCircle size={14} className="mr-1" />
                         {productErrors.price}
                       </p>
                     )}
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                   <div>
                     <label className="block text-gray-700 mb-2">Categoria *</label>
                     <select
                       className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                         productErrors.category ? 'border-red-500' : 'border-gray-300'
                       }`}
                       value={newProduct.category}
                       onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                     >
                       <option value="">Selecione uma categoria</option>
                       {categories.map(category => (
                         <option key={category} value={category}>{category}</option>
                       ))}
                     </select>
                     {productErrors.category && (
                       <p className="text-red-500 text-sm mt-1 flex items-center">
                         <AlertCircle size={14} className="mr-1" />
                         {productErrors.category}
                       </p>
                     )}
                   </div>
                   <div className="flex items-end">
                     <label className="inline-flex items-center">
                       <input
                         type="checkbox"
                         className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                         checked={newProduct.featured}
                         onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                       />
                       <span className="ml-2 text-gray-700">Marcar como destaque</span>
                     </label>
                   </div>
                 </div>
                 
                 <div className="mb-6">
                   <label className="block text-gray-700 mb-2">Descrição *</label>
                   <textarea
                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                       productErrors.description ? 'border-red-500' : 'border-gray-300'
                     }`}
                     rows="3"
                     value={newProduct.description}
                     onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                     placeholder="Descrição do produto"
                   />
                   {productErrors.description && (
                     <p className="text-red-500 text-sm mt-1 flex items-center">
                       <AlertCircle size={14} className="mr-1" />
                       {productErrors.description}
                     </p>
                   )}
                 </div>
                 
                 <div className="mb-6">
                   <label className="block text-gray-700 mb-2">Imagem do Produto</label>
                   <div className="flex items-center gap-4">
                     {newProduct.image && (
                       <img src={newProduct.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                     )}
                     <label className="flex-1">
                       <input
                         type="file"
                         accept="image/*"
                         onChange={(e) => handleImageUpload(e)}
                         className="hidden"
                       />
                       <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-amber-500 transition-colors">
                         <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                         <p className="text-gray-600">Clique para upload ou arraste uma imagem</p>
                         <p className="text-gray-500 text-sm">PNG, JPG, JPEG (max. 5MB)</p>
                       </div>
                     </label>
                   </div>
                 </div>
                 
                 <button
                   onClick={handleAddProduct}
                   className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                 >
                   Adicionar Produto
                 </button>
               </div>
             ) : (
               <div className="space-y-4">
                 <h3 className="text-xl font-semibold text-gray-800">Editar Produto</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                   <div>
                     <label className="block text-gray-700 mb-2">Nome do Produto *</label>
                     <input
                       type="text"
                       className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                         productErrors.name ? 'border-red-500' : 'border-gray-300'
                       }`}
                       value={editingProduct.name}
                       onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                     />
                     {productErrors.name && (
                       <p className="text-red-500 text-sm mt-1 flex items-center">
                         <AlertCircle size={14} className="mr-1" />
                         {productErrors.name}
                       </p>
                     )}
                   </div>
                   <div>
                     <label className="block text-gray-700 mb-2">Preço (R$) *</label>
                     <div className="relative">
                       <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                       <input
                         type="text"
                         className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                           productErrors.price ? 'border-red-500' : 'border-gray-300'
                         }`}
                         value={editingProduct.price}
                         onChange={(e) => handlePriceChange(e.target.value, true)}
                       />
                     </div>
                     {productErrors.price && (
                       <p className="text-red-500 text-sm mt-1 flex items-center">
                         <AlertCircle size={14} className="mr-1" />
                         {productErrors.price}
                       </p>
                     )}
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                   <div>
                     <label className="block text-gray-700 mb-2">Categoria *</label>
                     <select
                       className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                         productErrors.category ? 'border-red-500' : 'border-gray-300'
                       }`}
                       value={editingProduct.category}
                       onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                     >
                       {categories.map(category => (
                         <option key={category} value={category}>{category}</option>
                       ))}
                     </select>
                     {productErrors.category && (
                       <p className="text-red-500 text-sm mt-1 flex items-center">
                         <AlertCircle size={14} className="mr-1" />
                         {productErrors.category}
                       </p>
                     )}
                   </div>
                   <div className="flex items-end">
                     <label className="inline-flex items-center">
                       <input
                         type="checkbox"
                         className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                         checked={editingProduct.featured}
                         onChange={(e) => setEditingProduct({...editingProduct, featured: e.target.checked})}
                       />
                       <span className="ml-2 text-gray-700">Marcar como destaque</span>
                     </label>
                   </div>
                 </div>
                 
                 <div className="mb-6">
                   <label className="block text-gray-700 mb-2">Descrição *</label>
                   <textarea
                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                       productErrors.description ? 'border-red-500' : 'border-gray-300'
                     }`}
                     rows="3"
                     value={editingProduct.description}
                     onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                   />
                   {productErrors.description && (
                     <p className="text-red-500 text-sm mt-1 flex items-center">
                       <AlertCircle size={14} className="mr-1" />
                       {productErrors.description}
                     </p>
                   )}
                 </div>
                 
                 <div className="mb-6">
                   <label className="block text-gray-700 mb-2">Imagem do Produto</label>
                   <div className="flex items-center gap-4">
                     {editingProduct.image && (
                       <img src={editingProduct.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                     )}
                     <label className="flex-1">
                       <input
                         type="file"
                         accept="image/*"
                         onChange={(e) => handleImageUpload(e, true)}
                         className="hidden"
                       />
                       <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-amber-500 transition-colors">
                         <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                         <p className="text-gray-600">Clique para upload ou arraste uma imagem</p>
                         <p className="text-gray-500 text-sm">PNG, JPG, JPEG (max. 5MB)</p>
                       </div>
                     </label>
                   </div>
                 </div>
                 
                 <div className="flex gap-4">
                   <button
                     onClick={handleUpdateProduct}
                     className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                   >
                     Atualizar Produto
                   </button>
                   <button
                     onClick={() => {
                       setEditingProduct(null);
                       setProductErrors({});
                     }}
                     className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                   >
                     Cancelar
                   </button>
                 </div>
               </div>
             )}
             
             <div className="mt-8">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-semibold text-gray-800">Lista de Produtos</h3>
                 <button
                   onClick={exportProducts}
                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                 >
                   <Download className="mr-2" size={16} /> Exportar
                 </button>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead className="bg-gray-100">
                     <tr>
                       <th className="px-4 py-3 text-left text-gray-700 font-semibold">Produto</th>
                       <th className="px-4 py-3 text-left text-gray-700 font-semibold">Preço</th>
                       <th className="px-4 py-3 text-left text-gray-700 font-semibold">Categoria</th>
                       <th className="px-4 py-3 text-left text-gray-700 font-semibold">Destaque</th>
                       <th className="px-4 py-3 text-left text-gray-700 font-semibold">Ações</th>
                     </tr>
                   </thead>
                   <tbody>
                     {products.map(product => (
                       <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                         <td className="px-4 py-3">
                           <div className="flex items-center">
                             <img src={product.image} alt={product.name} className="w-10 h-10 rounded mr-3 object-cover" />
                             <span className="text-gray-800">{product.name}</span>
                           </div>
                         </td>
                         <td className="px-4 py-3 text-gray-700">R$ {product.price.toFixed(2)}</td>
                         <td className="px-4 py-3 text-gray-700">{product.category}</td>
                         <td className="px-4 py-3">
                           {product.featured ? (
                             <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Sim</span>
                           ) : (
                             <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Não</span>
                           )}
                         </td>
                         <td className="px-4 py-3">
                           <div className="flex space-x-2">
                             <button
                               onClick={() => {
                                 setEditingProduct(product);
                                 setProductErrors({});
                               }}
                               className="text-blue-600 hover:text-blue-800"
                             >
                               <Edit size={18} />
                             </button>
                             <button
                               onClick={() => handleDeleteProduct(product.id)}
                               className="text-red-600 hover:text-red-800"
                             >
                               <Trash2 size={18} />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
           </div>
         )}
         
         {adminPanelPage === 'categories' && (
           <div className="bg-white rounded-xl shadow p-6">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Categorias</h2>
             
             <div className="flex gap-4 mb-6">
               <input
                 type="text"
                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                 value={newCategory}
                 onChange={(e) => setNewCategory(e.target.value)}
                 placeholder="Nova categoria"
               />
               <button
                 onClick={handleAddCategory}
                 className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
               >
                 Adicionar
               </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {categories.map(category => (
                 <div key={category} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                   <span className="text-gray-800 font-medium">{category}</span>
                   <button
                     onClick={() => {
                       setCategories(categories.filter(c => c !== category));
                       showAlert('Categoria removida com sucesso!');
                     }}
                     className="text-red-600 hover:text-red-800"
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
               ))}
             </div>
           </div>
         )}
         
         {adminPanelPage === 'settings' && (
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações da Empresa</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 mb-2">Nome da Empresa</label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">Título do Site</label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={companyInfo.title}
                    onChange={(e) => setCompanyInfo({...companyInfo, title: e.target.value})}
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">Telefone</label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                    />
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Endereço</label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                    />
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Horário de Funcionamento</label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={companyInfo.hours}
                    onChange={(e) => setCompanyInfo({...companyInfo, hours: e.target.value})}
                    />
                </div>
                
                {/* Configurações de Redes Sociais */}
                <div className="md:col-span-2 border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Redes Sociais</h3>
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">
                    <Instagram className="inline mr-2 text-pink-600" size={16} />
                    Instagram
                    </label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={socialMedia.instagram}
                    onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})}
                    placeholder="@seuinstagram"
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">
                    <Facebook className="inline mr-2 text-blue-600" size={16} />
                    Facebook
                    </label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={socialMedia.facebook}
                    onChange={(e) => setSocialMedia({...socialMedia, facebook: e.target.value})}
                    placeholder="seufacebook"
                    />
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">
                    <MessageCircle className="inline mr-2 text-green-600" size={16} />
                    WhatsApp
                    </label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={socialMedia.whatsapp}
                    onChange={(e) => setSocialMedia({...socialMedia, whatsapp: e.target.value})}
                    placeholder="(45) 99999-9999"
                    />
                    <p className="text-gray-500 text-sm mt-1">Formato: (DDD) número</p>
                </div>
                
                {/* Configurações de Admin */}
                <div className="md:col-span-2 border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Configurações de Acesso Admin</h3>
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">Usuário Admin</label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={companyInfo.adminUser}
                    onChange={(e) => setCompanyInfo({...companyInfo, adminUser: e.target.value})}
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">Senha Admin</label>
                    <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={companyInfo.adminPassword}
                    onChange={(e) => setCompanyInfo({...companyInfo, adminPassword: e.target.value})}
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">Email Admin</label>
                    <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={companyInfo.adminEmail}
                    onChange={(e) => setCompanyInfo({...companyInfo, adminEmail: e.target.value})}
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">Email de Recuperação</label>
                    <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={companyInfo.adminRecoveryEmail}
                    onChange={(e) => setCompanyInfo({...companyInfo, adminRecoveryEmail: e.target.value})}
                    />
                </div>
                </div>
                
                <div className="mt-6">
                <button
                    onClick={handleUpdateCompanyInfo}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                    Salvar Configurações
                </button>
                </div>
            </div>
            )}
         
         {adminPanelPage === 'backup' && (
           <div className="bg-white rounded-xl shadow p-6">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">Backup e Restauração</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-blue-50 p-6 rounded-lg">
                 <h3 className="text-lg font-semibold text-blue-800 mb-4">Exportar Dados</h3>
                 <p className="text-blue-700 mb-4">Baixe um arquivo JSON com todos os dados do sistema.</p>
                 <button
                   onClick={exportProducts}
                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                 >
                   <Download className="mr-2" size={16} /> Exportar Produtos
                 </button>
               </div>
               
               <div className="bg-green-50 p-6 rounded-lg">
                 <h3 className="text-lg font-semibold text-green-800 mb-4">Importar Dados</h3>
                 <p className="text-green-700 mb-4">Restaure os dados do sistema a partir de um arquivo JSON.</p>
                 <label className="block">
                   <span className="sr-only">Escolher arquivo</span>
                   <input
                     type="file"
                     accept=".json"
                     onChange={importProducts}
                     className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-green-600 file:text-white
                       hover:file:bg-green-700"
                   />
                 </label>
               </div>
             </div>
           </div>
         )}
       </div>
     </div>
   );  

  const renderFooter = () => (
    <footer className="bg-dark-gradient text-white py-16 border-t border-gray-800">
      <style>{styles}</style>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Wine className="text-gold mr-3" size={32} />
              <h3 className="text-2xl font-bold text-white">{companyInfo.name}</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Sua experiência premium em bebidas finas. Qualidade, tradição e sofisticação em cada detalhe.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gold-light mb-4">Contato</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center">
                <Phone className="mr-2" size={16} />
                {companyInfo.phone}
              </div>
              <div className="flex items-center">
                <Mail className="mr-2" size={16} />
                {companyInfo.email}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2" size={16} />
                {companyInfo.address}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gold-light mb-4">Links Rápidos</h4>
            <nav className="space-y-2">
              {['home', 'about', 'products', 'contact'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="block text-gray-400 hover:text-gold-light transition-colors text-left capitalize"
                >
                  {page === 'home' ? 'Início' : 
                   page === 'about' ? 'Quem Somos' :
                   page === 'products' ? 'Produtos' : 'Contato'}
                </button>
              ))}
            </nav>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gold-light mb-4">Newsletter</h4>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Receba nossas novidades e ofertas especiais</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Seu email" 
                  className="flex-1 px-3 py-2 bg-black/30 border border-gray-700 rounded-l-lg text-white text-sm focus:outline-none focus:border-gold"
                />
                <button className="bg-gold-gradient text-black px-4 py-2 rounded-r-lg font-semibold hover:shadow-lg transition-shadow">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} {companyInfo.name}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );

  const renderHeader = () => (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
      <style>{styles}</style>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Wine className="text-gold mr-3" size={32} />
            <h1 className="text-2xl font-bold text-white">{companyInfo.name}</h1>
          </div>
          
          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-8">
            {['home', 'about', 'products', 'contact'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`font-medium relative py-2 transition-all duration-300 ${
                  currentPage === page 
                    ? 'text-gold-light' 
                    : 'text-gray-300 hover:text-gold-light'
                }`}
              >
                {page === 'home' ? 'Início' : 
                 page === 'about' ? 'Quem Somos' :
                 page === 'products' ? 'Produtos' : 'Contato'}
                {currentPage === page && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-gradient"></div>
                )}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAdminMode(true)}
              className="bg-gold-gradient text-black px-6 py-2 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 hidden md:block"
            >
              Área Admin
            </button>
            
            {/* Menu Mobile */}
            <button 
              className="md:hidden text-gray-300 hover:text-gold-light transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800 py-4">
            <nav className="flex flex-col space-y-4">
              {['home', 'about', 'products', 'contact'].map((page) => (
                <button
                  key={page}
                  onClick={() => { setCurrentPage(page); setMobileMenuOpen(false); }}
                  className={`font-medium py-3 text-left px-4 rounded-lg transition-all ${
                    currentPage === page 
                      ? 'bg-gold/20 text-gold-light border-l-4 border-gold' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {page === 'home' ? 'Início' : 
                   page === 'about' ? 'Quem Somos' :
                   page === 'products' ? 'Produtos' : 'Contato'}
                </button>
              ))}
              <button
                onClick={() => { setAdminMode(true); setMobileMenuOpen(false); }}
                className="bg-gold-gradient text-black px-6 py-3 rounded-lg font-semibold text-left mt-4"
              >
                Área Admin
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );

  // ... (mantenha as funções restantes do admin com o mesmo estilo)

  if (adminMode) {
    return renderAdminDashboard();
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-gradient">
      {/* Alert de Sucesso Global */}
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 bg-green-900/80 backdrop-blur-xl border border-green-600 rounded-xl p-4 shadow-2xl z-50 transform transition-all duration-300 animate-in slide-in-from-right">
          <div className="flex items-center">
            <CheckCircle className="text-green-400 mr-3" size={24} />
            <div>
              <p className="text-green-100 font-medium">{successMessage}</p>
            </div>
            <button
              onClick={() => setShowSuccessAlert(false)}
              className="ml-4 text-green-400 hover:text-green-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {renderHeader()}
      
      <main className="flex-grow">
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'about' && renderAboutPage()}
        {currentPage === 'products' && renderProductsPage()}
        {currentPage === 'contact' && renderContactPage()}
      </main>
      
      {renderFooter()}
    </div>
  );
}