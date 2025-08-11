import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const applications = [
    {
      title: "POS Terminal",
      subtitle: "Point of Sale System",
      description: "Complete checkout experience with fuel pump control, payment processing, and inventory management",
      icon: "🛒",
      url: "http://localhost:3000",
      color: "from-blue-500 via-purple-500 to-indigo-600",
      features: ["Product Scanning", "Payment Processing", "Fuel Pump Control", "Receipt Printing"]
    },
    {
      title: "Manager Dashboard", 
      subtitle: "Operations Control Center",
      description: "Comprehensive management interface for sales analytics, inventory tracking, and staff oversight",
      icon: "📊",
      url: "http://localhost:3002",
      color: "from-green-500 via-teal-500 to-cyan-600",
      features: ["Sales Analytics", "Inventory Management", "Staff Reports", "Performance Metrics"]
    },
    {
      title: "Training Simulator",
      subtitle: "Gamified Learning Platform", 
      description: "Interactive training system with scenarios, progress tracking, and achievement unlocking",
      icon: "🎮",
      url: "http://localhost:3004",
      color: "from-purple-500 via-pink-500 to-rose-600",
      features: ["Interactive Scenarios", "Progress Tracking", "Achievement System", "Skill Assessment"]
    }
  ];

  const stats = [
    { label: "Active Stations", value: "47", icon: "⛽" },
    { label: "Daily Transactions", value: "1,247", icon: "💳" },
    { label: "Staff Members", value: "23", icon: "👥" },
    { label: "Monthly Revenue", value: "$127K", icon: "💰" }
  ];

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        />
      ))}

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="p-8"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-4"
            >
              <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center">
                <span className="text-3xl">⛽</span>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">FuelFlow</h1>
                <p className="text-white/80 text-sm">Enterprise POS System</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass-card px-6 py-3 rounded-xl"
            >
              <div className="text-white text-right">
                <div className="text-lg font-mono">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-white/70">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center py-16 px-8"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-black text-white mb-6"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 40px rgba(59,130,246,0.8)", 
                "0 0 20px rgba(255,255,255,0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Welcome to
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              FuelFlow POS
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            The modern gas station management system that revolutionizes operations with 
            intelligent automation, real-time analytics, and gamified staff training.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6 rounded-2xl text-center"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Applications Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="px-8 pb-16"
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="text-4xl font-black text-white text-center mb-4"
            >
              Choose Your Application
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-white/70 text-center mb-12 text-lg"
            >
              Select the application that matches your role and responsibilities
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8">
              {applications.map((app, index) => (
                <motion.div
                  key={app.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="app-card glass-card p-8 rounded-3xl relative overflow-hidden group cursor-pointer"
                  onClick={() => window.open(app.url, '_blank')}
                >
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className="text-6xl mb-6 text-center"
                    >
                      {app.icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2 text-center">
                      {app.title}
                    </h3>
                    <p className="text-white/60 text-center text-sm mb-4">
                      {app.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-white/80 text-sm mb-6 leading-relaxed">
                      {app.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-8">
                      {app.features.map((feature, idx) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.5 + index * 0.2 + idx * 0.1 }}
                          className="flex items-center space-x-2 text-white/70 text-xs"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Launch Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-4 bg-gradient-to-r ${app.color} rounded-2xl text-white font-bold text-lg shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                    >
                      Launch Application
                      <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                    </motion.button>
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="text-center py-8 px-8"
        >
          <div className="glass-card inline-block px-8 py-4 rounded-2xl">
            <p className="text-white/60 text-sm">
              © 2025 FuelFlow Enterprise POS System. Built with modern technology for gas stations.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default App;