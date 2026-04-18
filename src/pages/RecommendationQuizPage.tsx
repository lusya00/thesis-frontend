import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const questions = [
  { id: "budget", question: "Berapa budget kamu per malam?", emoji: "💰", guideMsg: "Halo! Aku akan bantu kamu pilih homestay terbaik! 😊", options: [{ value: "murah", label: "Di bawah Rp 300.000", sub: "Hemat & terjangkau" }, { value: "sedang", label: "Rp 300.000 - Rp 600.000", sub: "Standar nyaman" }, { value: "mahal", label: "Di atas Rp 600.000", sub: "Premium" }] },
  { id: "guests", question: "Berapa jumlah tamu yang menginap?", emoji: "👥", guideMsg: "Berapa orang yang akan ikut menginap? 🤔", options: [{ value: "1", label: "1 orang", sub: "Solo traveler" }, { value: "2", label: "2 orang", sub: "Berdua" }, { value: "4", label: "3-4 orang", sub: "Grup kecil" }, { value: "8", label: "5-8 orang", sub: "Grup besar" }, { value: "10", label: "Lebih dari 8 orang", sub: "Rombongan" }] },
  { id: "beach_priority", question: "Seberapa penting jarak ke pantai?", emoji: "🏖️", guideMsg: "Pantai adalah daya tarik utama Pulau Untung Jawa! 🌊", options: [{ value: "dekat", label: "Sangat penting", sub: "Maks 200m dari pantai" }, { value: "sedang", label: "Cukup penting", sub: "200-400m dari pantai" }, { value: "jauh", label: "Tidak terlalu penting", sub: "Jarak tidak masalah" }] },
  { id: "need_ac", question: "Apakah kamu butuh AC?", emoji: "❄️", guideMsg: "Cuaca di pulau bisa panas, pertimbangkan ya! ☀️", options: [{ value: "true", label: "Ya, AC wajib!", sub: "Saya suka udara sejuk" }, { value: "false", label: "Tidak perlu", sub: "Angin alami cukup" }] },
  { id: "need_wifi", question: "Apakah kamu butuh WiFi?", emoji: "📶", guideMsg: "WiFi penting buat tetap terhubung selama liburan! 📱", options: [{ value: "true", label: "Ya, WiFi penting!", sub: "Perlu koneksi internet" }, { value: "false", label: "Tidak perlu", sub: "Mau digital detox" }] },
  { id: "need_breakfast", question: "Mau homestay dengan sarapan?", emoji: "🍳", guideMsg: "Sarapan bisa bikin pagi lebih menyenangkan! 🌅", options: [{ value: "true", label: "Ya, saya mau sarapan!", sub: "Pagi lebih praktis" }, { value: "false", label: "Tidak perlu", sub: "Saya cari sarapan sendiri" }] },
  { id: "need_motor_rental", question: "Butuh layanan sewa motor?", emoji: "🏍️", guideMsg: "Sewa motor bikin keliling pulau jadi lebih seru! 🌴", options: [{ value: "true", label: "Ya, mau sewa motor!", sub: "Keliling pulau lebih mudah" }, { value: "false", label: "Tidak perlu", sub: "Saya jalan kaki saja" }] },
];

interface Homestay {
  id: number;
  title: string;
  total_score: number;
  category: string;
  base_price: number;
  max_guests: number;
  has_ac: boolean;
  has_wifi: boolean;
  has_breakfast: boolean;
  has_motor_rental: boolean;
  distance_to_beach: number;
}

const getCategoryColor = (category: string) => {
  if (category === "Sangat Direkomendasikan") return { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" };
  if (category === "Direkomendasikan") return { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" };
  if (category === "Cukup Direkomendasikan") return { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" };
  return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" };
};

const RecommendationQuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Homestay[]>([]);
  const [error, setError] = useState("");

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [questions[currentQuestion].id]: value }));
  };

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await submitQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const submitQuiz = async () => {
    setIsLoading(true);
    setError("");
    try {
      const payload = {
        budget: answers.budget,
        guests: Number(answers.guests),
        beach_priority: answers.beach_priority,
        need_ac: answers.need_ac === "true",
        need_wifi: answers.need_wifi === "true",
        need_breakfast: answers.need_breakfast === "true",
        need_motor_rental: answers.need_motor_rental === "true",
      };
      const response = await fetch("https://untungjawa-backend-production.up.railway.app/api/rekomendas"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
        setIsCompleted(true);
      } else {
        setError("Gagal mendapatkan rekomendasi. Coba lagi.");
      }
    } catch (err) {
      setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setResults([]);
    setError("");
  };

  // ===================== HALAMAN HASIL =====================
  if (isCompleted) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #e0f7fa 0%, #e8f4fd 30%, #f0e6ff 60%, #fef9e7 100%)' }}>
        <EnhancedNavbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                  <h1 className="text-3xl font-black text-gray-900">Hasil Rekomendasi</h1>
                </div>
                <p className="text-gray-600 font-medium">Berikut homestay yang paling sesuai dengan preferensi kamu 🏡</p>
              </div>

              {/* Karakter hasil */}
              <motion.div className="flex justify-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="relative">
                  <motion.img
                    src="/icon_cewe-removebg-preview.png"
                    alt="Pemandu"
                    className="w-28 h-28 object-contain"
                    style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))' }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-3 py-2 shadow-lg border-2 border-green-200 whitespace-nowrap"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <p className="text-xs font-bold text-green-600">Yeay! Ketemu! 🎉</p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Top 5 hasil */}
              <div className="space-y-4 mb-8">
                {results.slice(0, 5).map((homestay, index) => {
                  const colors = getCategoryColor(homestay.category);
                  return (
                    <motion.div
                      key={homestay.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-5 border border-white/60" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                              style={{ background: index === 0 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : index === 1 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'linear-gradient(135deg, #22d3ee, #3b82f6)' }}
                            >
                              #{index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-black text-gray-900">{homestay.title}</h3>
                              <p className="text-sm text-gray-500 font-medium">Rp {Number(homestay.base_price).toLocaleString("id-ID")} / malam</p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {homestay.has_ac && <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">❄️ AC</span>}
                                {homestay.has_wifi && <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-medium">📶 WiFi</span>}
                                {homestay.has_breakfast && <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium">🍳 Sarapan</span>}
                                {homestay.has_motor_rental && <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">🏍️ Motor</span>}
                                <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full font-medium">📍 {homestay.distance_to_beach}m pantai</span>
                                <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full font-medium">👥 Max {homestay.max_guests} tamu</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>{homestay.category}</span>
                            <p className="text-xs text-gray-400 mt-1 font-medium">Skor: {homestay.total_score}</p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <Link to={`/homestay/${homestay.id}`}>
                            <motion.button
                              className="w-full py-2 rounded-xl text-sm font-bold text-white"
                              style={{ background: 'linear-gradient(135deg, #22d3ee, #6366f1)' }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Lihat & Pesan Homestay →
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetQuiz} variant="outline" className="rounded-xl font-bold">🔄 Ulangi Quiz</Button>
                <Link to="/homestays">
                  <Button className="rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-500 text-white w-full">🏡 Lihat Semua Homestay</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ===================== HALAMAN QUIZ =====================
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #e0f7fa 0%, #e8f4fd 30%, #f0e6ff 60%, #fef9e7 100%)' }}>
      <EnhancedNavbar />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
      </div>

      <div className="relative z-10 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="h-7 w-7 text-cyan-500" />
              <h1 className="text-2xl md:text-3xl font-black" style={{ background: 'linear-gradient(135deg, #0891b2, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Temukan Homestay Idealmu
              </h1>
            </div>
          </motion.div>

          {/* Step dots indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-2 mb-4">
            {questions.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentQuestion ? '28px' : '10px',
                  height: '10px',
                  background: i < currentQuestion
                    ? 'linear-gradient(135deg, #22d3ee, #6366f1)'
                    : i === currentQuestion
                    ? 'linear-gradient(135deg, #22d3ee, #6366f1)'
                    : '#e2e8f0',
                  boxShadow: i === currentQuestion ? '0 2px 8px rgba(34,211,238,0.5)' : 'none',
                }}
              />
            ))}
          </motion.div>

          {/* Progress bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 px-2">
            <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
              <span>Pertanyaan {currentQuestion + 1} dari {questions.length}</span>
              <span>{Math.round(progress)}% Selesai</span>
            </div>
            <div className="w-full bg-gray-200/80 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="h-2.5 rounded-full"
                style={{ background: 'linear-gradient(90deg, #22d3ee, #6366f1)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Back button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-5">
            <Link to="/rekomendasi">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-white/50 text-gray-600 font-medium text-sm"
                whileHover={{ x: -4 }}
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </motion.div>
            </Link>
          </motion.div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">{error}</div>
          )}

          {/* Main quiz area — karakter + card */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

            {/* Karakter pemandu — KIRI */}
            <motion.div
              className="flex-shrink-0 flex flex-col items-center"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Speech bubble DI ATAS karakter dengan jarak cukup */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`bubble-${currentQuestion}`}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white rounded-2xl px-4 py-3 shadow-lg border-2 border-cyan-200 w-44 text-center mb-3"
                  style={{ boxShadow: '0 4px 20px rgba(34,211,238,0.2)' }}
                >
                  <p className="text-xs font-semibold text-gray-700 leading-snug">
                    {questions[currentQuestion].guideMsg}
                  </p>
                  {/* Arrow bawah */}
                </motion.div>
              </AnimatePresence>

              {/* Karakter image — lebih besar */}
              <motion.img
                src="/icon_cewe-removebg-preview.png"
                alt="Pemandu Quiz"
                className="w-40 h-40 md:w-48 md:h-48 object-contain"
                style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.18))' }}
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Emoji pertanyaan */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`emoji-${currentQuestion}`}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="text-4xl mt-2"
                >
                  {questions[currentQuestion].emoji}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Question card — KANAN */}
            <div className="flex-1 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    className="rounded-3xl p-6"
                    style={{
                      background: 'rgba(255,255,255,0.88)',
                      backdropFilter: 'blur(16px)',
                      border: '2px solid rgba(255,255,255,0.7)',
                      boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                    }}
                  >
                    <h2 className="text-xl font-black text-gray-800 mb-5">
                      {questions[currentQuestion].question}
                    </h2>

                    <RadioGroup
                      value={answers[questions[currentQuestion].id] || ""}
                      onValueChange={handleAnswer}
                      className="space-y-3"
                    >
                      {questions[currentQuestion].options.map((option, optIndex) => {
                        const isSelected = answers[questions[currentQuestion].id] === option.value;
                        return (
                          <motion.div
                            key={option.value}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: optIndex * 0.08 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Label
                              htmlFor={option.value}
                              className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? 'border-cyan-400 shadow-md'
                                  : 'border-gray-200 bg-white/60 hover:border-cyan-200 hover:bg-cyan-50/30'
                              }`}
                              style={isSelected ? {
                                background: 'linear-gradient(135deg, rgba(34,211,238,0.08), rgba(99,102,241,0.08))',
                                boxShadow: '0 4px 16px rgba(34,211,238,0.2)',
                              } : {}}
                            >
                              <RadioGroupItem value={option.value} id={option.value} />
                              <div className="flex-1">
                                <p className="font-bold text-gray-800 text-sm">{option.label}</p>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">{option.sub}</p>
                              </div>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: "spring", bounce: 0.5 }}
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
                                  style={{ background: 'linear-gradient(135deg, #22d3ee, #6366f1)' }}
                                >
                                  ✓
                                </motion.div>
                              )}
                            </Label>
                          </motion.div>
                        );
                      })}
                    </RadioGroup>

                    {/* Navigation */}
                    <div className="flex justify-between mt-6 gap-3">
                      <Button
                        onClick={prevQuestion}
                        disabled={currentQuestion === 0}
                        variant="outline"
                        className="rounded-xl font-bold px-5 border-2"
                      >
                        ← Sebelumnya
                      </Button>
                      <motion.button
                        onClick={nextQuestion}
                        disabled={!answers[questions[currentQuestion].id] || isLoading}
                        className="flex-1 py-3 rounded-xl text-white font-black text-sm disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #22d3ee, #6366f1)' }}
                        whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(34,211,238,0.4)' }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {/* Shimmer */}
                        <motion.div
                          className="absolute inset-0 opacity-20"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="relative z-10">
                          {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Memproses...
                            </span>
                          ) : currentQuestion === questions.length - 1 ? (
                            "🏡 Lihat Rekomendasi!"
                          ) : (
                            "Selanjutnya →"
                          )}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecommendationQuizPage;