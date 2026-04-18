import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Bike, MapPin, Sparkles, Users, Utensils, Wallet, Wind, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: "43", label: "Homestay Tersedia", icon: "🏡" },
  { value: "7", label: "Pertanyaan Saja", icon: "❓" },
  { value: "<1", label: "Menit", icon: "⚡" },
  { value: "100%", label: "Gratis", icon: "🎁" },
];

const features = [
  { icon: <Wallet className="h-6 w-6" />, title: "Budget", desc: "Rekomendasi disesuaikan dengan anggaran menginap kamu", color: "from-cyan-400 to-blue-500", bg: "from-cyan-50 to-blue-50", border: "border-cyan-200" },
  { icon: <Users className="h-6 w-6" />, title: "Jumlah Tamu", desc: "Disesuaikan dengan kapasitas yang kamu butuhkan", color: "from-violet-400 to-purple-500", bg: "from-violet-50 to-purple-50", border: "border-violet-200" },
  { icon: <MapPin className="h-6 w-6" />, title: "Lokasi", desc: "Pilih homestay berdasarkan jarak ke pantai dan dermaga", color: "from-emerald-400 to-teal-500", bg: "from-emerald-50 to-teal-50", border: "border-emerald-200" },
  { icon: <Wind className="h-6 w-6" />, title: "Fasilitas", desc: "AC dan WiFi sesuai kebutuhan kamu", color: "from-sky-400 to-cyan-500", bg: "from-sky-50 to-cyan-50", border: "border-sky-200" },
  { icon: <Utensils className="h-6 w-6" />, title: "Sarapan", desc: "Pilih homestay yang menyediakan sarapan atau tidak", color: "from-orange-400 to-amber-500", bg: "from-orange-50 to-amber-50", border: "border-orange-200" },
  { icon: <Bike className="h-6 w-6" />, title: "Sewa Motor", desc: "Tersedia layanan sewa motor untuk keliling pulau", color: "from-pink-400 to-rose-500", bg: "from-pink-50 to-rose-50", border: "border-pink-200" },
];

const RecommendationPage = () => {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #e0f7fa 0%, #e8f4fd 30%, #f0e6ff 60%, #fef9e7 100%)' }}>
      <EnhancedNavbar />

      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        <div className="absolute bottom-32 left-1/4 w-72 h-72 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
      </div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <Link to="/">
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-white/50 text-gray-600 font-medium text-sm hover:bg-white/90 transition-all duration-200" whileHover={{ x: -4 }}>
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Beranda
              </motion.div>
            </Link>
          </motion.div>

          {/* Hero Section dengan karakter */}
          <div className="flex flex-col lg:flex-row items-center gap-8 mb-14">

            {/* Karakter pemandu */}
            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              {/* Lingkaran background karakter */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, rgba(99,102,241,0.1) 60%, transparent 100%)',
                  width: '120%',
                  height: '120%',
                  left: '-10%',
                  top: '-10%',
                }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Speech bubble */}
              <motion.div
                className="absolute -top-4 -left-20 z-20 bg-white rounded-2xl px-3 py-2 shadow-lg border-2 border-cyan-200 max-w-[160px]"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
              >
                <p className="text-xs font-bold text-cyan-600">Halo! 👋</p>
                <p className="text-xs text-gray-600">Aku akan bantu kamu pilih homestay terbaik!</p>
                <div className="absolute bottom-[-8px] left-4 w-0 h-0" style={{ borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid white' }} />
              </motion.div>

              {/* Karakter image */}
              <motion.img
                src="/icon_cewe-removebg-preview.png"
                alt="Pemandu Quiz"
                className="relative z-10 w-48 h-48 md:w-56 md:h-56 object-contain"
                style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.15))' }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, 0, -2, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Bintang dekoratif */}
              {['⭐', '✨', '🌟'].map((star, i) => (
                <motion.span
                  key={i}
                  className="absolute pointer-events-none select-none text-lg"
                  style={{ top: `${20 + i * 30}%`, left: `${-10 + i * 5}%` }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5], rotate: [0, 20, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                >
                  {star}
                </motion.span>
              ))}
            </motion.div>

            {/* Text hero */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
                style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(99,102,241,0.15))', border: '1.5px solid rgba(34,211,238,0.4)', color: '#0891b2' }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Sparkles className="h-4 w-4" />
                Powered by Rule-Based AI
                <Sparkles className="h-4 w-4" />
              </motion.div>

              <h1
                className="text-4xl md:text-5xl font-black mb-4 leading-tight"
                style={{
                  background: 'linear-gradient(135deg, #0891b2 0%, #6366f1 50%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 8px rgba(8,145,178,0.2))',
                }}
              >
                Sistem Rekomendasi<br />Homestay
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed font-medium mb-6">
                Temukan homestay{" "}
                <span className="text-cyan-600 font-bold">paling cocok</span>{" "}
                dengan kebutuhan kamu di{" "}
                <span className="text-violet-600 font-bold">Pulau Untung Jawa</span>
              </p>

              {/* CTA Button */}
              <Link to="/rekomendasi/quiz">
                <motion.button
                  className="relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-black text-lg overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 50%, #f59e0b 100%)',
                    boxShadow: '0 8px 32px rgba(34,211,238,0.5)',
                  }}
                  whileHover={{ scale: 1.06, boxShadow: '0 12px 48px rgba(34,211,238,0.6)' }}
                  whileTap={{ scale: 0.97 }}
                  animate={{ boxShadow: ['0 8px 32px rgba(34,211,238,0.4)', '0 8px 40px rgba(99,102,241,0.5)', '0 8px 32px rgba(34,211,238,0.4)'] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <Sparkles className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">Mulai Quiz Sekarang!</span>
                  <Zap className="h-5 w-5 relative z-10" />
                </motion.button>
              </Link>

              <p className="text-xs text-gray-400 mt-3 font-medium">
                ✅ Gratis • ⚡ Kurang dari 1 menit • 🏡 43 Homestay tersedia
              </p>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="text-center py-4 px-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/60"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-black" style={{ background: 'linear-gradient(135deg, #0891b2, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 font-semibold mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-14">
            <h2 className="text-2xl font-black text-center text-gray-800 mb-2">Apa yang Kami Pertimbangkan?</h2>
            <p className="text-center text-gray-500 mb-8 font-medium">Sistem kami menganalisis 6 faktor utama untuk menemukan homestay terbaik untukmu</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${feature.bg} border ${feature.border}`}
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-3`} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    {feature.icon}
                  </div>
                  <h3 className="font-black text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mb-14">
            <div className="rounded-3xl p-8" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
              <h2 className="text-2xl font-black text-center text-gray-800 mb-8">Cara Menggunakan 🚀</h2>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {[
                  { num: "1", text: "Jawab 7 pertanyaan singkat tentang preferensi kamu" },
                  { num: "2", text: "Sistem menghitung skor kesesuaian tiap homestay" },
                  { num: "3", text: "Lihat hasil rekomendasi yang sudah diurutkan untukmu" },
                ].map((step, i) => (
                  <motion.div key={i} className="flex-1 flex flex-col items-center text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 * i }}>
                    <motion.div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-3"
                      style={{ background: 'linear-gradient(135deg, #22d3ee, #6366f1)', boxShadow: '0 6px 20px rgba(34,211,238,0.4)' }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    >
                      {step.num}
                    </motion.div>
                    <p className="text-sm text-gray-600 font-semibold leading-relaxed">{step.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="text-center">
            <p className="text-gray-500 font-medium mb-4">Siap menemukan homestay impianmu? 🏝️</p>
            <Link to="/rekomendasi/quiz">
              <motion.button
                className="relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-black text-lg overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 50%, #f59e0b 100%)', boxShadow: '0 8px 32px rgba(34,211,238,0.5)' }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }} animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity }} />
                <Sparkles className="h-6 w-6 relative z-10" />
                <span className="relative z-10">Mulai Quiz Sekarang!</span>
                <Zap className="h-5 w-5 relative z-10" />
              </motion.button>
            </Link>
            <p className="text-xs text-gray-400 mt-3 font-medium">✅ Gratis • ⚡ Kurang dari 1 menit • 🏡 43 Homestay tersedia</p>
          </motion.div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecommendationPage;