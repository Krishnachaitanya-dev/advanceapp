import React, { useEffect, useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Shirt, Clock, Award, Sparkles, ChevronRight, Package, Bed, Star, Layers, Zap, Shield, Droplets, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { useAndroidBackButton } from '@/hooks/useAndroidBackButton';
const HomePage = () => {
  const {
    services,
    loading: servicesLoading
  } = useServices();
  const {
    orders,
    loading: ordersLoading
  } = useOrders();
  const {
    user
  } = useAuth();
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });

  // Handle Android back button
  useAndroidBackButton();

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced service icon mapping with better colors
  const getServiceIcon = (serviceName: string, index: number) => {
    const lowerName = serviceName.toLowerCase();
    if (lowerName.includes('normal') && lowerName.includes('wash') && lowerName.includes('fold')) {
      return <Shirt className="w-6 h-6 text-blue-600" />;
    }
    if (lowerName.includes('steam') || lowerName.includes('iron')) {
      return <Zap className="w-6 h-6 text-amber-500" />;
    }
    if (lowerName.includes('bedsheet') || lowerName.includes('bed')) {
      return <Bed className="w-6 h-6 text-purple-500" />;
    }
    if (lowerName.includes('quilt')) {
      return <Layers className="w-6 h-6 text-green-500" />;
    }
    if (lowerName.includes('premium')) {
      return <Star className="w-6 h-6 text-yellow-500" />;
    }
    if (lowerName.includes('wash') && lowerName.includes('fold') && !lowerName.includes('normal')) {
      return <Package className="w-6 h-6 text-teal-500" />;
    }
    const defaultIcons = [<Shirt className="w-6 h-6 text-blue-600" />, <Sparkles className="w-6 h-6 text-purple-500" />, <Bed className="w-6 h-6 text-green-500" />, <Shield className="w-6 h-6 text-orange-500" />];
    return defaultIcons[index % defaultIcons.length];
  };

  // Get featured services (first 4)
  const featuredServices = services.slice(0, 4).map((service, index) => ({
    id: service.id,
    name: service.name,
    icon: getServiceIcon(service.name, index),
    description: service.description || '',
    price: service.base_price_per_kg
  }));

  // Get active orders
  const activeOrders = orders.filter(order => !['delivered', 'cancelled'].includes(order.status));
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
      case 'confirmed':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'picked_up':
        return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'in_process':
        return 'bg-gradient-to-r from-orange-500 to-orange-600';
      case 'ready_for_delivery':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };
  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'picked_up':
        return 'Picked Up';
      case 'in_process':
        return 'In Process';
      case 'ready_for_delivery':
        return 'Ready for Delivery';
      default:
        return status;
    }
  };

  // Mumbai weather-aware message
  const getWeatherMessage = () => {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 9) {
      return "🌧️ Monsoon special: Quick-dry services available!";
    }
    return "☀️ Perfect weather for fresh laundry!";
  };

  // Floating emojis data
  const floatingEmojis = [{
    emoji: '🧺',
    delay: 0,
    duration: 8
  }, {
    emoji: '👕',
    delay: 2,
    duration: 10
  }, {
    emoji: '✨',
    delay: 4,
    duration: 6
  }, {
    emoji: '💧',
    delay: 1,
    duration: 9
  }, {
    emoji: '🌟',
    delay: 3,
    duration: 7
  }, {
    emoji: '👔',
    delay: 5,
    duration: 8
  }];
  return <AppLayout>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating Bubbles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => <div key={i} className="absolute w-4 h-4 bg-blue-100 rounded-full opacity-20 animate-bounce" style={{
          left: `${10 + i * 12}%`,
          top: `${20 + i % 3 * 30}%`,
          animationDelay: `${i * 0.5}s`,
          animationDuration: `${3 + i % 2}s`
        }} />)}
        </div>

        {/* Floating Emojis */}
        {floatingEmojis.map((item, i) => <div key={i} className="absolute text-2xl opacity-30 animate-pulse" style={{
        left: `${15 + i * 15}%`,
        top: `${10 + i % 4 * 20}%`,
        animationDelay: `${item.delay}s`,
        animationDuration: `${item.duration}s`
      }}>
            {item.emoji}
          </div>)}

        {/* Moving Wave Pattern */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-5">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="animate-pulse" fill="currentColor" />
          </svg>
        </div>

        {/* Interactive Cursor Glow */}
        <div className="absolute w-96 h-96 bg-gradient-radial from-blue-100 to-transparent opacity-10 rounded-full pointer-events-none transition-all duration-300 ease-out" style={{
        left: mousePosition.x - 192,
        top: mousePosition.y - 192
      }} />
      </div>

      <div className="space-y-4 mumbai-pattern relative z-10 py-0 my-px">
        {/* Enhanced Hero Section with 3D Effects */}
        <div className="glass-card p-4 relative overflow-hidden group transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl my-0 py-2 mx-2">
          {/* 3D Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-100 to-transparent rounded-full -ml-12 -mb-12 opacity-30 group-hover:rotate-45 transition-transform duration-700 px-0 py-0 mx-[4px]"></div>
          
          {/* Animated Water Drops */}
          <div className="absolute top-4 right-8">
            <Droplets className="w-6 h-6 text-blue-400 animate-pulse opacity-60" />
          </div>
          <div className="absolute bottom-6 left-8">
            <Wind className="w-5 h-5 text-teal-400 animate-bounce opacity-60" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-700 mb-1 bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text">
                  Premium Laundry Service ✨
                </h2>
                <p className="text-slate-500 text-sm px-0">Professional care at your doorstep </p>
              </div>
              <div className="text-right">
                
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 mb-4 border border-blue-100 shadow-inner">
              <p className="text-blue-700 text-sm font-medium text-center">
                {getWeatherMessage()}
              </p>
            </div>
            
            <Link to="/services">
              <Button className="premium-button text-white font-semibold w-full h-14 text-base shadow-xl bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center">
                  Schedule Pickup 📅
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-300 transform -skew-x-12"></div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Services Preview with 3D Cards */}
        <div className="py-0 my-0">
          <div className="flex justify-between items-center mb-4 my-1">
            <h3 className="text-xl font-bold text-slate-700 flex items-center">
              Popular Services 🔥
            </h3>
            <Link to="/services">
              <Button variant="ghost" className="text-slate-500 flex items-center p-0 text-sm hover:text-slate-700 interactive-scale group">
                View All 
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {servicesLoading ? <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="glass-card p-4 animate-pulse">
                  <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded"></div>
                </div>)}
            </div> : <div className="grid grid-cols-2 gap-3 py-0 my-px">
              {featuredServices.map((service, index) => <div key={service.id} className="glass-card p-4 flex flex-col items-center text-center group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer relative overflow-hidden" style={{
            animationDelay: `${index * 150}ms`
          }}>
                  {/* 3D Card Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12 group-hover:translate-x-full"></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl mb-3 bg-gradient-to-br from-white to-gray-50 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
                      {service.icon}
                    </div>
                    <h4 className="text-slate-700 font-semibold text-sm mb-2 leading-tight group-hover:text-slate-800 transition-colors">
                      {service.name}
                    </h4>
                    <div className="text-slate-600 font-bold text-base mb-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text group-hover:text-transparent transition-all">
                      ₹{service.price}/kg 💰
                    </div>
                    <p className="text-slate-500 text-xs line-clamp-2 group-hover:text-slate-600 transition-colors">
                      {service.description}
                    </p>
                  </div>
                </div>)}
            </div>}
        </div>

        {/* Enhanced Active Orders with Premium Effects */}
        <div className="glass-card p-4 relative overflow-hidden group my-1">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-100 to-transparent rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          
          <div className="flex items-center justify-between mb-3 relative z-10">
            <h3 className="text-xl font-bold text-slate-700 flex items-center">
              Active Orders 📦
            </h3>
            <Clock className="w-6 h-6 text-slate-400 animate-pulse" />
          </div>
          
          {ordersLoading ? <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="animate-pulse">
                  <div className="flex justify-between items-center p-4 bg-slate-100 rounded-xl">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                    </div>
                    <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
                  </div>
                </div>)}
            </div> : activeOrders.length > 0 ? <div className="space-y-3">
              {activeOrders.slice(0, 2).map((order, index) => <div key={order.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 via-white to-blue-50 rounded-2xl border border-slate-100 interactive-scale group hover:shadow-lg transition-all duration-300 hover:border-blue-200" style={{
            animationDelay: `${index * 100}ms`
          }}>
                  <div className="flex-1">
                    <p className="text-slate-700 font-bold text-sm mb-1 flex items-center">
                      #{order.order_number} 🏷️
                    </p>
                    <p className="text-slate-500 text-xs">
                      {order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items 👕
                    </p>
                  </div>
                  <div className={`${getStatusColor(order.status)} text-white text-xs font-bold px-4 py-2 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 relative overflow-hidden`}>
                    <span className="relative z-10">{formatStatus(order.status)}</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  </div>
                </div>)}
              
              <Link to="/orders">
                <Button variant="outline" className="w-full border-slate-200 bg-white hover:bg-slate-50 text-slate-700 mt-3 h-12 font-medium interactive-scale group hover:border-blue-300 transition-all duration-300">
                  View All Orders 📋
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div> : <div className="text-center py-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 via-teal-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-5 gentle-float shadow-lg">
                <Package className="w-10 h-10 text-blue-500" />
              </div>
              <h4 className="text-slate-700 font-semibold mb-2 text-lg">No Active Orders 📭</h4>
              <p className="text-slate-500 mb-4 text-sm">Ready to start your laundry journey? ✨</p>
              <Link to="/services">
                <Button className="premium-button text-white font-medium h-12 px-10 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 transform transition-all duration-300 hover:scale-105">
                  Create Your First Order 🚀
                </Button>
              </Link>
            </div>}
        </div>

        {/* Enhanced Mumbai Trust Badge with Animation */}
        <div className="glass-card p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-amber-200 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-orange-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="flex items-center justify-center space-x-3 relative z-10">
            <Award className="w-6 h-6 text-amber-600 animate-pulse" />
            <span className="text-amber-700 font-bold text-sm bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text">
              Trusted by 10,000+ Mumbai families 🏠❤️
            </span>
            <Award className="w-6 h-6 text-amber-600 animate-pulse" style={{
            animationDelay: '0.5s'
          }} />
          </div>
        </div>
      </div>
    </AppLayout>;
};
export default HomePage;