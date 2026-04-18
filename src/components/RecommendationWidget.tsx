import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

/* ================== IMAGE ================== */
const CHARACTER_IMG = "/icon_couple-removebg-preview.png"; 
const ICON_IMG = "/icon widget untung jawa.jpg";
/* ================== WIDGET ================== */
export const RecommendationWidget = () => {
  const [showCaption, setShowCaption] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">

      {/* ================== CHARACTER BESAR ================== */}
      <AnimatePresence>
        {showCaption && (
          <motion.div className="flex items-end mb-4">
            <img
              src={CHARACTER_IMG}
              alt="character"
              style={{
                width: "150px",
                height: "180px",
                objectFit: "contain",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================== CAPTION ================== */}
      <AnimatePresence>
        {showCaption && (
          <div className="bg-white p-3 rounded-xl shadow-lg relative mb-4">
            <button
              onClick={() => setShowCaption(false)}
              className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
            >
              <X size={12} />
            </button>

            <p className="text-sm font-bold">Mau ke Untung Jawa?</p>
            <p className="text-xs text-gray-600">
              Temukan homestay terbaikmu!
            </p>

            <Link to="/rekomendasi">
              <div className="mt-2 bg-cyan-500 text-white text-xs text-center py-1 rounded">
                Coba Sekarang
              </div>
            </Link>
          </div>
        )}
      </AnimatePresence>

      {/* ================== ICON KECIL ================== */}
      <Link to="/rekomendasi">
        <motion.div
          className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-white flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <img
            src={ICON_IMG} // 🔥 INI YANG DIGANTI
            alt="icon"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // ✅ biar ga ke-crop
              backgroundColor: "white",
            }}
          />
        </motion.div>
      </Link>
    </div>
  );
};

export default RecommendationWidget;