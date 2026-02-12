import React from 'react';
import EnhancedNavbar from "../components/EnhancedNavbar";
import Footer from "../components/Footer";
import { Leaf, Shield, Users, TrendingUp, MapPin, Calendar, BarChart3 } from 'lucide-react';

const ConservationPage = () => {
  return (
    <>
      <EnhancedNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-20 mt-16">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Konservasi Pulau Untung Jawa
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Melindungi ekosistem mangrove dan membangun masa depan berkelanjutan
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Mangrove Benefits Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <div className="flex items-center mb-6">
              <Leaf className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold text-green-800">
                Peran Penting Mangrove untuk Menawarkan Manfaat Langsung dan Keberlanjutan Masa Depan
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Mangrove di Pulau Untung Jawa menawarkan manfaat langsung dan tidak langsung yang penting 
                  bagi masyarakat lokal, satwa liar, dan lingkungan. Mangrove menyediakan sumber daya seperti 
                  kayu untuk keperluan sehari-hari, habitat bagi burung dan kehidupan laut, serta membantu 
                  mencegah tanah longsor.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Manfaat Ekologis</h4>
                    <p className="text-sm text-gray-600">
                      Melindungi garis pantai dengan akar yang kuat, menstabilkan tanah, dan mengurangi erosi.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Manfaat Biologis</h4>
                    <p className="text-sm text-gray-600">
                      Mendukung keanekaragaman hayati sebagai tempat berkembang biak dan mencari makan.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative h-80 md:h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                <img 
                  src="/conservation/img1.jpg" 
                  alt="Ekosistem Mangrove di Pulau Untung Jawa" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Coastal Changes Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
              <h2 className="text-3xl font-bold text-orange-800">
                Perubahan Garis Pantai
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-80 md:h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                <img 
                  src="/conservation/img2.jpg" 
                  alt="Perubahan Garis Pantai di Pulau Untung Jawa" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              
              <div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Daerah pantai dan pesisir di Indonesia sedang mengalami perubahan garis pantai secara 
                  terus menerus. Pulau Untung Jawa adalah salah satu contoh dari perubahan garis pantai 
                  akibat dari kehilangan lahan. Fenomena ini terjadi karena adanya faktor alami seperti 
                  perubahan iklim dan kenaikan permukaan laut, juga disebabkan oleh aktivitas manusia.
                </p>
              </div>
            </div>
          </div>

          {/* Waste Crisis Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-red-800">
                Mendiagnosis Krisis Sampah di Pulau Untung Jawa
              </h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Pulau Untung Jawa menghadapi krisis lingkungan yang mendesak akibat penumpukan sampah laut, 
                terutama plastik, yang berasal dari sungai-sungai seperti Cisadane dan Ciliwung, dan diperparah 
                oleh angin muson serta pariwisata yang tidak teratur.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Sumber Sampah</h4>
                  <p className="text-sm text-gray-600">
                    Sungai Cisadane dan Ciliwung, angin muson, pariwisata tidak teratur
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Dampak</h4>
                  <p className="text-sm text-gray-600">
                    Mangrove, terumbu karang, dan mata pencaharian warga terancam
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Infrastruktur</h4>
                  <p className="text-sm text-gray-600">
                    Sistem pengumpulan formal terbatas, tidak ada pemilahan atau insinerator
                  </p>
                </div>
              </div>
              
              <div className="relative h-80 md:h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                <img 
                  src="/conservation/img3.jpg" 
                  alt="Sampah Plastik di Pantai Pulau Untung Jawa" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Community Action Guide */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-2xl font-bold text-purple-800">
                Panduan Aksi Berbasis Komunitas
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Manual Pengelolaan Sampah GIPE++ 2025 menyajikan strategi multi-tahap untuk memberdayakan 
                  komunitas Pulau Untung Jawa dalam mengatasi sampah laut.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                    <div>
                      <h5 className="font-semibold text-green-800">Jangka Pendek</h5>
                      <p className="text-sm text-gray-600">Pembersihan zona akumulasi musiman, pengumpulan data, pemilahan sampah</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                    <div>
                      <h5 className="font-semibold text-blue-800">Jangka Menengah</h5>
                      <p className="text-sm text-gray-600">Pelibatan sekolah, kerajinan dari sampah, edukasi lingkungan</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                    <div>
                      <h5 className="font-semibold text-purple-800">Jangka Panjang</h5>
                      <p className="text-sm text-gray-600">Pengomposan organik, sistem peletisasi plastik</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-80 md:h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                <img 
                  src="/conservation/img6.jpg" 
                  alt="Aksi Bersih-bersih Komunitas di Pulau Untung Jawa" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Mangrove Health Assessment */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-8 w-8 text-teal-600 mr-3" />
              <h2 className="text-3xl font-bold text-teal-800">
                Penilaian Kesehatan Mangrove di Pulau Untung Jawa
              </h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Pulau Untung Jawa telah mencapai keberhasilan luar biasa dalam pemulihan vegetasinya, 
                tentunya berkat upaya Pokdarwis dan berbagai LSM. Namun, munculnya ancaman lokal dan 
                yang berkaitan dengan iklim kini mengancam ketahanan jangka panjang wilayah ini.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Keberhasilan Saat Ini
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Tren peningkatan tutupan vegetasi</li>
                    <li>• Konservasi mangrove efektif</li>
                    <li>• Mangrove Laguna berkembang baik</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Ancaman Masa Depan
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Degradasi area Pantai Nemo</li>
                    <li>• Tekanan musiman September-Januari</li>
                    <li>• Proyeksi perubahan iklim</li>
                  </ul>
                </div>
              </div>
              
              <div className="relative h-80 md:h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                <img 
                  src="/conservation/img5.jpg" 
                  alt="Kesehatan Mangrove di Pulau Untung Jawa" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Self-Monitoring Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <MapPin className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-2xl font-bold text-indigo-800">
                Untung Jawa Memantau Secara Mandiri
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-80 md:h-96">
                <img 
                  src="/conservation/img4.jpg" 
                  alt="Monitoring Mangrove dengan Teknologi di Pulau Untung Jawa" 
                  className="w-full h-full object-contain rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Sebagai bagian dari tim GIPE++ 2025, kami telah mengambil inisiatif untuk memberdayakan 
                  Pokdarwis dalam penggunaan alat teknologi seperti citra satelit, agar mereka dapat terus 
                  memantau kondisi vegetasi.
                </p>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-indigo-800 mb-2">Manfaat Monitoring</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Memantau kondisi vegetasi secara real-time</li>
                    <li>• Mengukur kemajuan upaya konservasi</li>
                    <li>• Mengidentifikasi area kritis yang membutuhkan perhatian</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ConservationPage; 