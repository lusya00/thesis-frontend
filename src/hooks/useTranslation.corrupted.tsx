import { useState, useContext, createContext, ReactNode } from 'react';

export type Language = 'en' | 'id';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.accommodation': 'Accommodation',
    'nav.homestays': 'Homestays',
    'nav.activities': 'Activities',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.book_now': 'Book Now',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    
    // Auth Pages
    'auth.login_title': 'Welcome Back',
    'auth.login_subtitle': 'Sign in to your account',
    'auth.signup_title': 'Create Account',
    'auth.signup_subtitle': 'Join our island community',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.full_name': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.remember_me': 'Remember me',
    'auth.forgot_password': 'Forgot password?',
    'auth.login_button': 'Sign In',
    'auth.signup_button': 'Create Account',
    'auth.google_login': 'Continue with Google',
    'auth.no_account': "Don't have an account?",
    'auth.have_account': 'Already have an account?',
    'auth.sign_up_link': 'Sign up',
    'auth.sign_in_link': 'Sign in',
    'auth.terms_text': 'By creating an account, you agree to our',
    'auth.terms_link': 'Terms of Service',
    'auth.privacy_link': 'Privacy Policy',
    'auth.and': 'and',
    'auth.email_placeholder': 'Enter your email',
    'auth.password_placeholder': 'Enter your password',
    'auth.confirm_password_placeholder': 'Confirm your password',
    'auth.name_placeholder': 'Enter your full name',
    'auth.phone_placeholder': '+62 812-3456-7890',
    'auth.login_success': 'Login successful!',
    'auth.signup_success': 'Account created successfully!',
    'auth.invalid_credentials': 'Invalid email or password',
    'auth.required_field': 'This field is required',
    'auth.invalid_email': 'Please enter a valid email address',
    'auth.password_mismatch': 'Passwords do not match',
    'auth.password_min_length': 'Password must be at least 8 characters',
    'auth.signing_in': 'Signing in...',
    'auth.creating_account': 'Creating account...',

    // Homepage Hero Slides
    'hero.slide1.title': 'Paradise Found',
    'hero.slide1.subtitle': 'Crystal Clear Waters',
    'hero.slide1.description': 'Escape to pristine waters just 90 minutes from Jakarta\'s bustling heart',
    'hero.slide1.feature': 'Beach Paradise',
    
    'hero.slide2.title': 'Authentic Island Life',
    'hero.slide2.subtitle': 'Local Family Homestays',
    'hero.slide2.description': 'Experience genuine hospitality in traditional homestays with modern comfort',
    'hero.slide2.feature': 'Cultural Experience',
    
    'hero.slide3.title': 'Cultural Immersion',
    'hero.slide3.subtitle': 'Island Traditions',
    'hero.slide3.description': 'Join fishing expeditions, learn traditional crafts, taste authentic island cuisine',
    'hero.slide3.feature': 'Traditional Activities',
    
    'hero.slide4.title': 'Perfect Getaway',
    'hero.slide4.subtitle': 'Island Sanctuary',
    'hero.slide4.description': 'Disconnect from the city, reconnect with nature in this tropical paradise',
    'hero.slide4.feature': 'Peaceful Retreat',
    
    // Hero Actions & UI
    'hero.title': 'Discover Paradise at Untung Jawa Island',
    'hero.subtitle': 'Experience authentic island life with stunning beaches, crystal-clear waters, and warm hospitality just a short boat ride from Jakarta.',
    'hero.explore_homestays': 'Explore Homestays',
    'hero.watch_video': 'Watch Video',
    'hero.find_perfect_stay': 'Find Your Perfect Stay',
    'hero.view_featured': 'View Featured Homestays',
    'hero.brand_tagline': 'Island Paradise • Jakarta\'s Hidden Gem',
    'hero.quick_booking': 'Quick Booking',
    'hero.find_escape': 'Find your perfect island escape in minutes',
    'hero.bookings_stat': '2.5k+ bookings',
    'hero.satisfaction_stat': '98% satisfaction',
    'hero.guests_range': '2-6 guests',
    'hero.verified': 'Verified',
    'hero.trip_time': '90 min trip',
    'hero.book_now': 'Book now',
    'hero.sign_in': 'Sign In',
    'hero.sign_up': 'Sign Up',
    'hero.join_experience': 'Join us for the complete experience',
    'hero.find_homestays': 'Find Homestays',
    'hero.island_experiences': 'Island Experiences',
    'hero.pristine_beaches': 'Pristine beaches',
    'hero.family_homestays': 'Family homestays',
    'hero.fishing_adventures': 'Fishing adventures',
    'hero.fresh_seafood': 'Fresh seafood',
    'hero.loading_paradise': 'Loading paradise...',
    
    // Homepage About Section
    'about.discover_title': 'Discover Untung Jawa Island',
    'about.discover_description': 'A hidden paradise where authentic Indonesian island culture meets pristine natural beauty. Just a short journey from Jakarta, experience life as it was meant to be lived - in harmony with the sea, the land, and the community.',
    'about.island_heritage': 'Island Heritage',
    'about.heritage_description': 'Discover the rich maritime history and cultural traditions that have shaped Untung Jawa Island for generations.',
    'about.local_community': 'Local Community',
    'about.community_description': 'Connect with warm, welcoming families who open their homes and hearts to share authentic island experiences.',
    'about.pristine_nature': 'Pristine Nature',
    'about.nature_description': 'Immerse yourself in untouched coastal beauty, crystal-clear waters, and diverse marine ecosystems.',
    'about.sustainable_tourism': 'Sustainable Tourism',
    'about.sustainability_description': 'Support eco-friendly practices that preserve the island\'s natural beauty for future generations.',
    
    // Homepage CTA Section
    'cta.ready_title': 'Ready for Your Island Adventure?',
    'cta.ready_description': 'Join us in creating unforgettable memories while supporting sustainable tourism that benefits our local island community.',
    'cta.explore_homestays': 'Explore Homestays',
    'cta.plan_journey': 'Plan Your Journey',
    
    // Homepage Homestays Section
    'homestays.section_title': 'Our Homestays',
    'homestays.view_all': 'View All Homestays',
    
    // Activities Section
    'activities.title': 'Island Activities',
    'activities.subtitle': 'Discover amazing experiences on Untung Jawa Island',
    'activities.sunrise_fishing': 'Sunrise Fishing Adventures',
    'activities.fishing_description': 'Join local fishermen as they cast their nets in the golden morning light',
    'activities.photography_tours': 'Island Photography Tours',
    'activities.photography_description': 'Capture stunning landscapes and candid moments of island life',
    'activities.coffee_culture': 'Traditional Coffee Culture',
    'activities.coffee_description': 'Learn about local coffee traditions and enjoy authentic Indonesian brews',
    'activities.mangrove_conservation': 'Mangrove Conservation',
    'activities.mangrove_description': 'Participate in eco-tourism activities that protect coastal ecosystems',
    
    // Accommodation
    'accommodation.title': 'Accommodations',
    'accommodation.subtitle': 'Experience authentic island living with our carefully selected homestays, where comfort meets local culture',
    'accommodation.search_placeholder': 'Search homestays...',
    'accommodation.filters': 'Filters',
    'accommodation.clear_filters': 'Clear filters',
    'accommodation.price_range': 'Price Range',
    'accommodation.guest_capacity': 'Guest Capacity',
    'accommodation.reset_filters': 'Reset All Filters',
    'accommodation.results': 'homestays',
    'accommodation.island_homestays': 'Island Homestays',
    'accommodation.perfect_home': 'Your Perfect Island Home',
    'accommodation.family_experience': 'Stay with local families and experience the authentic warmth of island hospitality while enjoying modern comforts',
    
    // Homestay Cards & Content
    'homestay.book_now': 'Book Now',
    'homestay.view_details': 'View Details',
    'homestay.per_night': 'per night',
    'homestay.guests': 'guests',
    'homestay.bedrooms': 'bedrooms',
    'homestay.bathrooms': 'bathrooms',
    'homestay.wifi': 'Free WiFi',
    'homestay.breakfast': 'Breakfast',
    'homestay.ac': 'Air Conditioning',
    'homestay.beachfront': 'Beachfront',
    'homestay.family_friendly': 'Family Friendly',
    'homestay.traditional': 'Traditional Style',
    'homestay.tv': 'TV',
    'homestay.bed': 'Double Bed',
    'homestay.sea_view': 'Sea View',
    'homestay.kitchen': 'Kitchen',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with our friendly team',
    'contact.description': 'Have questions about your island getaway? We\'re here to help you plan the perfect Untung Jawa experience.',
    'contact.form_title': 'Send us a message',
    'contact.name': 'Full Name',
    'contact.email': 'Email Address',
    'contact.phone': 'Phone Number',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send_message': 'Send Message',
    'contact.contact_info': 'Contact Information',
    'contact.address': 'Address',
    'contact.address_value': 'Untung Jawa Island, Kepulauan Seribu, Jakarta',
    'contact.phone_value': '+62 812 3456 7890',
    'contact.email_value': 'hello@untungjawa.com',
    'contact.hours': 'Operating Hours',
    'contact.hours_value': 'Daily: 8:00 AM - 8:00 PM',
    'contact.emergency': 'Emergency Contact',
    'contact.emergency_value': '+62 811 2345 6789',
    'contact.quick_response': 'Quick Response',
    'contact.response_description': 'We typically respond to all inquiries within 2-4 hours during business hours. For urgent matters, please call us directly.',
    'contact.booking_assistance': 'Booking Assistance',
    'contact.assistance_description': 'Need help with reservations? Our team can assist with:',
    'contact.assistance_homestay': 'Homestay availability and booking',
    'contact.assistance_activities': 'Activity scheduling and packages',
    'contact.assistance_transport': 'Transportation arrangements',
    'contact.assistance_groups': 'Group booking discounts',
    'contact.follow_us': 'Follow Us',
    'contact.social_description': 'Stay connected and see the latest from paradise:',
    'contact.form_description': 'Fill out the form below and we\'ll get back to you as soon as possible with all the information you need.',
    'contact.inquiry_type': 'What can we help you with?',
    'contact.name_placeholder': 'Your full name',
    'contact.email_placeholder': 'your.email@example.com',
    'contact.phone_placeholder': '+62 812-3456-7890',
    'contact.subject_placeholder': 'Brief subject of your inquiry',
    'contact.message_placeholder': 'Tell us about your plans, questions, or how we can help make your island experience perfect...',
    'contact.sending': 'Sending Message...',
    
    // Stats
    'stats.family_homestays': 'Family Homestays',
    'stats.comfortable_rooms': 'Comfortable Rooms',
    'stats.happy_guests': 'Happy Guests',
    'stats.average_rating': 'Average Rating',
    
    // Price ranges
    'price.all': 'All Prices',
    'price.budget': 'Budget (≤ IDR 300,000)',
    'price.mid': 'Mid-range (IDR 300,000 - 600,000)', 
    'price.luxury': 'Luxury (≥ IDR 600,000)',
    
    // Capacity
    'capacity.all': 'Any Capacity',
    'capacity.1-2': '1-2 Guests',
    'capacity.3-4': '3-4 Guests',
    'capacity.5+': '5+ Guests',
    
    // Actions
    'action.view': 'View',
    'action.book': 'Book',
    'action.filter': 'Filter Homestays',
    'action.quick_actions': 'Quick Actions',
    'action.stop_generating': 'Stop generating',
    
    // General
    'general.loading': 'Loading...',
    'general.error': 'Error',
    'general.try_again': 'Try Again',
    'general.more': 'more',
    'general.per_night': 'per night',
    'general.book_now': 'Book Now',
    'general.learn_more': 'Learn More',
    'general.loading_homestays': 'Loading Paradise Homestays...',
    'general.finding_accommodation': 'Finding your perfect island accommodation',
    'general.unable_load': 'Unable to Load Homestays',
    'general.no_homestays': 'No Homestays Available',
    'general.updating_listings': 'We\'re currently updating our homestay listings.',
    'general.check_back': 'Please check back soon for amazing island accommodations!',
    
    // Badges and Labels
    'badge.paradise_homestays': 'Paradise Homestays',
    'badge.verified': 'Verified',
    'badge.island_paradise': 'Island Paradise',
    
    // Filter placeholders and labels
    'filter.select_capacity': 'Select capacity',
    'filter.select_price': 'Select price range',
    
    // Form validation and errors
    'validation.required_field': 'This field is required',
    'validation.invalid_email': 'Please enter a valid email address',
    'validation.password_mismatch': 'Passwords do not match',
    'validation.min_length': 'Must be at least {min} characters',
    
    // Call to Action
    'cta.cant_find': 'Can\'t Find What You\'re Looking For?',
    'cta.contact_description': 'Contact us directly for personalized homestay recommendations and special requests',
    'cta.contact_team': 'Contact Our Team',
    'cta.explore_activities': 'Explore Activities',
    
    // Room Card
    'room.highlights': 'Highlights',
    'room.availability': 'Availability',
    'room.book_now': 'Book Now',
    'room.check_other_dates': 'Check Other Dates',
    'room.book_other_dates': 'Book for other dates',
    'room.under_maintenance': 'Under Maintenance',
    'room.check_availability': 'Check Availability',
    
    // Booking Form
    'booking.full_name': 'Full Name',
    'booking.email_address': 'Email Address',
    'booking.phone_number': 'Phone Number',
    'booking.special_requests': 'Special Requests (Optional)',
    'booking.payment_method': 'Payment Method',
    'booking.qris_payment': 'QRIS Payment',
    'booking.secure_payment': 'Secure Indonesian payment system',
    'booking.starting_from': 'Starting from',
    
    // Form placeholders
    'placeholder.enter_name': 'Enter your full name',
    'placeholder.enter_email': 'your@email.com',
    'placeholder.enter_phone': 'Enter your phone number',
    'placeholder.special_requests': 'Any special requirements for your island stay? (dietary preferences, accessibility needs, etc.)',
    
    // Payment methods
    'payment.popular': 'Populer',
    'payment.ewallet': 'E-Wallet',
    'payment.digital': 'Digital',
    
    // Enhanced Date Picker
    'datepicker.choose_dates': 'Pilih Tanggal Anda',
    'datepicker.select_dates': 'Pilih Tanggal Anda',
    'datepicker.selected': 'Terpilih',
    'datepicker.unavailable': 'Tidak Tersedia',
    'datepicker.past_dates': 'Tanggal lalu',
    'datepicker.some_unavailable': 'Beberapa tanggal tidak tersedia',
    'datepicker.unavailable_notice': 'Tanggal merah di kalender sudah dipesan. Silakan pilih tanggal yang tersedia.',
    'datepicker.your_selection': 'Pilihan Anda',
    'datepicker.nights': 'malam',
    'datepicker.estimated': 'Estimasi',
    'datepicker.cancel': 'Batal',
    'datepicker.proceed_booking': 'Lanjutkan ke Pemesanan',
    'datepicker.confirm_dates': 'Konfirmasi Tanggal',
    'datepicker.selected_dates': 'Tanggal terpilih',
    
    // What's Included
    'included.whats_included': 'What\'s Included:',
    'included.accommodation': 'Comfortable island accommodation',
    'included.breakfast': 'Daily Indonesian breakfast',
    'included.wifi': 'Free high-speed Wi-Fi',
    'included.beach_access': 'Beach facilities access',
    'included.support': '24/7 island support',
    'included.greeting': 'Welcome island greeting',
    
    // BookNow Page
    'booknow.page_title': 'Book Your Island Paradise',
    'booknow.page_subtitle': 'Complete your magical journey to {homestay} - where island dreams become reality',
    'booknow.page_subtitle_default': 'Find your perfect island sanctuary and embark on an unforgettable Untung Jawa adventure',
    'booknow.secure_instant_magical': 'Secure • Instant • Magical',
    'booknow.booking_details': 'Booking Details',
    'booknow.complete_reservation': 'Complete your island escape reservation',
    'booknow.select_room': 'Select Your Island Room',
    'booknow.available_for_dates': '{count} Available for Selected Dates',
    'booknow.not_available': '{count} Not Available',
    'booknow.checking_availability': 'Checking Availability...',
    'booknow.checking': 'Checking...',
    'booknow.refresh_availability': 'Refresh Availability',
    'booknow.refreshing_availability': 'Refreshing room availability',
    'booknow.checking_latest_rooms': 'Checking for the latest magical rooms...',
    'booknow.availability_updated': 'Availability Updated!',
    'booknow.availability_refreshed': 'Room availability has been refreshed with the latest data.',
    'booknow.guest_information': 'Guest Information',
    'booknow.continue_payment': 'Continue to Payment',
    'booknow.creating_booking': 'Creating Booking...',
    'booknow.booking_summary': 'Booking Summary',
    'booknow.back_to_homestay': 'Back to homestay details',
    'booknow.checkin': 'Check-in',
    'booknow.checkout': 'Check-out',
    'booknow.guests': 'Guests',
    'booknow.nights': 'Nights',
    'booknow.price_per_night': 'Price per night',
    'booknow.total': 'Total',
    'booknow.whats_included': 'What\'s Included:',
    'booknow.included_accommodation': 'Comfortable island accommodation',
    'booknow.included_breakfast': 'Daily Indonesian breakfast',
    'booknow.included_wifi': 'Free high-speed Wi-Fi',
    'booknow.included_beach': 'Beach facilities access',
    'booknow.included_support': '24/7 island support',
    'booknow.included_greeting': 'Welcome island greeting',
    'booknow.secure_payment_notice': 'Pemrosesan pembayaran aman dengan perlindungan tingkat pulau',
    'booknow.no_homestay_selected': 'Tidak ada homestay yang dipilih',
    'booknow.start_adventure': 'Mulai petualangan pulau Anda dengan memilih homestay ajaib',
    'booknow.browse_homestays': 'Jelajahi Homestay Pulau',
    'booknow.loading_booking_details': 'Memuat detail pemesanan...',
    'booknow.booking_confirmed': 'Pemesanan Dikonfirmasi!',
    'booknow.booking_success_message': 'Pemesanan Anda telah berhasil dikonfirmasi. Nomor referensi Anda adalah:',
    'booknow.whats_next': 'Apa Selanjutnya?',
    'booknow.confirmation_email_sent': 'Email konfirmasi telah dikirim ke alamat email Anda. Jika tidak melihatnya, silakan periksa folder spam.',
    'booknow.save_reference': 'Nomor referensi pemesanan Anda adalah {reference} - harap simpan untuk catatan Anda.',
    'booknow.property_notified': 'Pemilik properti akan diberitahu tentang pemesanan Anda.',
    'booknow.view_dashboard': 'Anda dapat melihat detail pemesanan di dashboard Anda.',
    'booknow.return_home': 'Kembali ke Beranda',
    'booknow.view_bookings': 'Lihat Pemesanan Saya',
  },
  id: {
    // Navigation
    'nav.home': 'Beranda',
    'nav.accommodation': 'Akomodasi',
    'nav.homestays': 'Homestays',
    'nav.activities': 'Aktivitas',
    'nav.about': 'Tentang',
    'nav.contact': 'Kontak',
    'nav.book_now': 'Pesan Sekarang',
    'nav.login': 'Masuk',
    'nav.signup': 'Daftar',
    
    // Auth Pages
    'auth.login_title': 'Selamat Datang Kembali',
    'auth.login_subtitle': 'Masuk ke akun Anda',
    'auth.signup_title': 'Buat Akun',
    'auth.signup_subtitle': 'Bergabung dengan komunitas pulau kami',
    'auth.email': 'Alamat Email',
    'auth.password': 'Kata Sandi',
    'auth.confirm_password': 'Konfirmasi Kata Sandi',
    'auth.full_name': 'Nama Lengkap',
    'auth.phone': 'Nomor Telepon',
    'auth.remember_me': 'Ingat saya',
    'auth.forgot_password': 'Lupa kata sandi?',
    'auth.login_button': 'Masuk',
    'auth.signup_button': 'Buat Akun',
    'auth.google_login': 'Lanjutkan dengan Google',
    'auth.no_account': 'Belum punya akun?',
    'auth.have_account': 'Sudah punya akun?',
    'auth.sign_up_link': 'Daftar',
    'auth.sign_in_link': 'Masuk',
    'auth.terms_text': 'Dengan membuat akun, Anda menyetujui',
    'auth.terms_link': 'Syarat Layanan',
    'auth.privacy_link': 'Kebijakan Privasi',
    'auth.and': 'dan',
    'auth.email_placeholder': 'Masukkan email Anda',
    'auth.password_placeholder': 'Masukkan kata sandi',
    'auth.confirm_password_placeholder': 'Konfirmasi kata sandi',
    'auth.name_placeholder': 'Masukkan nama lengkap',
    'auth.phone_placeholder': '+62 812-3456-7890',
    'auth.login_success': 'Login berhasil!',
    'auth.signup_success': 'Akun berhasil dibuat!',
    'auth.invalid_credentials': 'Email atau kata sandi salah',
    'auth.required_field': 'Field ini wajib diisi',
    'auth.invalid_email': 'Masukkan alamat email yang valid',
    'auth.password_mismatch': 'Kata sandi tidak cocok',
    'auth.password_min_length': 'Kata sandi minimal 8 karakter',
    'auth.signing_in': 'Sedang masuk...',
    'auth.creating_account': 'Membuat akun...',

    // Homepage Hero Slides
    'hero.slide1.title': 'Surga Ditemukan',
    'hero.slide1.subtitle': 'Air Jernih Kristal',
    'hero.slide1.description': 'Nikmati air jernih yang murni hanya 90 menit dari hiruk pikuk Jakarta',
    'hero.slide1.feature': 'Surga Pantai',
    
    'hero.slide2.title': 'Kehidupan Pulau Autentik',
    'hero.slide2.subtitle': 'Homestay Keluarga Lokal',
    'hero.slide2.description': 'Rasakan keramahan asli di homestay tradisional dengan kenyamanan modern',
    'hero.slide2.feature': 'Pengalaman Budaya',
    
    'hero.slide3.title': 'Penyelaman Budaya',
    'hero.slide3.subtitle': 'Tradisi Pulau',
    'hero.slide3.description': 'Ikuti ekspedisi memancing, belajar kerajinan tradisional, cicipi masakan pulau otentik',
    'hero.slide3.feature': 'Aktivitas Tradisional',
    
    'hero.slide4.title': 'Liburan Sempurna',
    'hero.slide4.subtitle': 'Surga Pulau',
    'hero.slide4.description': 'Lepaskan diri dari kota, terhubung kembali dengan alam di surga tropis ini',
    'hero.slide4.feature': 'Retret Damai',
    
    // Hero Actions & UI
    'hero.title': 'Temukan Surga di Pulau Untung Jawa',
    'hero.subtitle': 'Rasakan kehidupan pulau yang autentik dengan pantai menakjubkan, air jernih, dan keramahan hangat hanya dengan perjalanan perahu singkat dari Jakarta.',
    'hero.explore_homestays': 'Jelajahi Homestay',
    'hero.watch_video': 'Tonton Video',
    'hero.find_perfect_stay': 'Temukan Tempat Menginap Sempurna',
    'hero.view_featured': 'Lihat Homestay Unggulan',
    'hero.brand_tagline': 'Surga Pulau • Permata Tersembunyi Jakarta',
    'hero.quick_booking': 'Pemesanan Cepat',
    'hero.find_escape': 'Temukan pelarian pulau sempurna Anda dalam hitungan menit',
    'hero.bookings_stat': '2.5k+ pemesanan',
    'hero.satisfaction_stat': '98% kepuasan',
    'hero.guests_range': '2-6 tamu',
    'hero.verified': 'Terverifikasi',
    'hero.trip_time': 'Perjalanan 90 menit',
    'hero.book_now': 'Pesan sekarang',
    'hero.sign_in': 'Masuk',
    'hero.sign_up': 'Daftar',
    'hero.join_experience': 'Bergabunglah dengan kami untuk pengalaman lengkap',
    'hero.find_homestays': 'Cari Homestay',
    'hero.island_experiences': 'Pengalaman Pulau',
    'hero.pristine_beaches': 'Pantai murni',
    'hero.family_homestays': 'Homestay keluarga',
    'hero.fishing_adventures': 'Petualangan memancing',
    'hero.fresh_seafood': 'Makanan laut segar',
    'hero.loading_paradise': 'Memuat surga...',
    
    // Homepage About Section
    'about.discover_title': 'Temukan Pulau Untung Jawa',
    'about.discover_description': 'Surga tersembunyi di mana budaya pulau Indonesia yang autentik bertemu dengan keindahan alam yang murni. Hanya perjalanan singkat dari Jakarta, rasakan hidup sebagaimana mestinya - selaras dengan laut, tanah, dan komunitas.',
    'about.island_heritage': 'Warisan Pulau',
    'about.heritage_description': 'Temukan sejarah maritim yang kaya dan tradisi budaya yang telah membentuk Pulau Untung Jawa selama generasi.',
    'about.local_community': 'Komunitas Lokal',
    'about.community_description': 'Terhubung dengan keluarga yang hangat dan ramah yang membuka rumah dan hati mereka untuk berbagi pengalaman pulau yang autentik.',
    'about.pristine_nature': 'Alam Murni',
    'about.nature_description': 'Benamkan diri Anda dalam keindahan pantai yang tak tersentuh, air jernih, dan ekosistem laut yang beragam.',
    'about.sustainable_tourism': 'Pariwisata Berkelanjutan',
    'about.sustainability_description': 'Dukung praktik ramah lingkungan yang melestarikan keindahan alam pulau untuk generasi mendatang.',
    
    // Homepage CTA Section
    'cta.ready_title': 'Siap untuk Petualangan Pulau Anda?',
    'cta.ready_description': 'Bergabunglah dengan kami dalam menciptakan kenangan tak terlupakan sambil mendukung pariwisata berkelanjutan yang menguntungkan komunitas pulau lokal kami.',
    'cta.explore_homestays': 'Jelajahi Homestay',
    'cta.plan_journey': 'Rencanakan Perjalanan Anda',
    
    // Homepage Homestays Section
    'homestays.section_title': 'Homestay Kami',
    'homestays.view_all': 'Lihat Semua Homestay',
    
    // Activities Section
    'activities.title': 'Aktivitas Pulau',
    'activities.subtitle': 'Temukan pengalaman menakjubkan di Pulau Untung Jawa',
    'activities.sunrise_fishing': 'Petualangan Memancing Fajar',
    'activities.fishing_description': 'Bergabung dengan nelayan lokal saat mereka melempar jala di cahaya emas pagi',
    'activities.photography_tours': 'Tur Fotografi Pulau',
    'activities.photography_description': 'Abadikan pemandangan menakjubkan dan momen spontan kehidupan pulau',
    'activities.coffee_culture': 'Budaya Kopi Tradisional',
    'activities.coffee_description': 'Pelajari tradisi kopi lokal dan nikmati seduhan Indonesia yang autentik',
    'activities.mangrove_conservation': 'Konservasi Mangrove',
    'activities.mangrove_description': 'Berpartisipasi dalam aktivitas ekowisata yang melindungi ekosistem pesisir',
    
    // Accommodation
    'accommodation.title': 'Akomodasi',
    'accommodation.subtitle': 'Rasakan kehidupan pulau yang autentik dengan homestay pilihan kami, di mana kenyamanan bertemu budaya lokal',
    'accommodation.search_placeholder': 'Cari homestay...',
    'accommodation.filters': 'Filter',
    'accommodation.clear_filters': 'Hapus filter',
    'accommodation.price_range': 'Rentang Harga',
    'accommodation.guest_capacity': 'Kapasitas Tamu',
    'accommodation.reset_filters': 'Reset Semua Filter',
    'accommodation.results': 'homestay',
    'accommodation.island_homestays': 'Homestay Pulau',
    'accommodation.perfect_home': 'Rumah Pulau Sempurna Anda',
    'accommodation.family_experience': 'Menginap bersama keluarga lokal dan rasakan kehangatan otentik keramahan pulau sambil menikmati kenyamanan modern',
    
    // Homestay Cards & Content
    'homestay.book_now': 'Pesan Sekarang',
    'homestay.view_details': 'Lihat Detail',
    'homestay.per_night': 'per malam',
    'homestay.guests': 'tamu',
    'homestay.bedrooms': 'kamar tidur',
    'homestay.bathrooms': 'kamar mandi',
    'homestay.wifi': 'WiFi Gratis',
    'homestay.breakfast': 'Sarapan',
    'homestay.ac': 'AC',
    'homestay.beachfront': 'Tepi Pantai',
    'homestay.family_friendly': 'Ramah Keluarga',
    'homestay.traditional': 'Gaya Tradisional',
    'homestay.tv': 'TV',
    'homestay.bed': 'Tempat Tidur Double',
    'homestay.sea_view': 'Pemandangan Laut',
    'homestay.kitchen': 'Dapur',
    
    // Contact Page
    'contact.title': 'Hubungi Kami',
    'contact.subtitle': 'Hubungi tim ramah kami',
    'contact.description': 'Ada pertanyaan tentang liburan pulau Anda? Kami di sini untuk membantu Anda merencanakan pengalaman Untung Jawa yang sempurna.',
    'contact.form_title': 'Kirim pesan kepada kami',
    'contact.name': 'Nama Lengkap',
    'contact.email': 'Alamat Email',
    'contact.phone': 'Nomor Telepon',
    'contact.subject': 'Subjek',
    'contact.message': 'Pesan',
    'contact.send_message': 'Kirim Pesan',
    'contact.contact_info': 'Informasi Kontak',
    'contact.address': 'Alamat',
    'contact.address_value': 'Pulau Untung Jawa, Kepulauan Seribu, Jakarta',
    'contact.phone_value': '+62 812 3456 7890',
    'contact.email_value': 'hello@untungjawa.com',
    'contact.hours': 'Jam Operasional',
    'contact.hours_value': 'Setiap hari: 08:00 - 20:00',
    'contact.emergency': 'Kontak Darurat',
    'contact.emergency_value': '+62 811 2345 6789',
    'contact.quick_response': 'Respon Cepat',
    'contact.response_description': 'Kami biasanya merespon semua pertanyaan dalam 2-4 jam selama jam kerja. Untuk urusan mendesak, silakan hubungi kami langsung.',
    'contact.booking_assistance': 'Bantuan Pemesanan',
    'contact.assistance_description': 'Butuh bantuan dengan reservasi? Tim kami dapat membantu dengan:',
    'contact.assistance_homestay': 'Ketersediaan dan pemesanan homestay',
    'contact.assistance_activities': 'Penjadwalan aktivitas dan paket',
    'contact.assistance_transport': 'Pengaturan transportasi',
    'contact.assistance_groups': 'Diskon pemesanan grup',
    'contact.follow_us': 'Ikuti Kami',
    'contact.social_description': 'Tetap terhubung dan lihat yang terbaru dari surga:',
    'contact.form_description': 'Isi formulir di bawah ini dan kami akan segera menghubungi Anda dengan semua informasi yang Anda butuhkan.',
    'contact.inquiry_type': 'Apa yang bisa kami bantu?',
    'contact.name_placeholder': 'Nama lengkap Anda',
    'contact.email_placeholder': 'email.anda@contoh.com',
    'contact.phone_placeholder': '+62 812-3456-7890',
    'contact.subject_placeholder': 'Subjek singkat pertanyaan Anda',
    'contact.message_placeholder': 'Ceritakan tentang rencana, pertanyaan, atau bagaimana kami dapat membantu membuat pengalaman pulau Anda sempurna...',
    'contact.sending': 'Mengirim Pesan...',
    
    // Stats
    'stats.family_homestays': 'Homestay Keluarga',
    'stats.comfortable_rooms': 'Kamar Nyaman',
    'stats.happy_guests': 'Tamu Senang',
    'stats.average_rating': 'Rating Rata-rata',
    
    // Price ranges
    'price.all': 'Semua Harga',
    'price.budget': 'Budget (≤ IDR 300.000)',
    'price.mid': 'Menengah (IDR 300.000 - 600.000)',
    'price.luxury': 'Mewah (≥ IDR 600.000)',
    
    // Capacity
    'capacity.all': 'Kapasitas Apapun',
    'capacity.1-2': '1-2 Tamu',
    'capacity.3-4': '3-4 Tamu', 
    'capacity.5+': '5+ Tamu',
    
    // Actions
    'action.view': 'Lihat',
    'action.book': 'Pesan',
    'action.filter': 'Filter Homestay',
    'action.quick_actions': 'Aksi Cepat',
    'action.stop_generating': 'Hentikan pembuatan',
    
    // General
    'general.loading': 'Memuat...',
    'general.error': 'Error',
    'general.try_again': 'Coba Lagi',
    'general.more': 'lainnya',
    'general.per_night': 'per malam',
    'general.book_now': 'Pesan Sekarang',
    'general.learn_more': 'Pelajari Lebih Lanjut',
    'general.loading_homestays': 'Memuat Homestay Surga...',
    'general.finding_accommodation': 'Mencari akomodasi pulau sempurna Anda',
    'general.unable_load': 'Tidak Dapat Memuat Homestay',
    'general.no_homestays': 'Tidak Ada Homestay Tersedia',
    'general.updating_listings': 'Kami sedang memperbarui daftar homestay kami.',
    'general.check_back': 'Silakan periksa kembali segera untuk akomodasi pulau yang menakjubkan!',
    
    // Badges and Labels
    'badge.paradise_homestays': 'Homestay Surga',
    'badge.verified': 'Terverifikasi',
    'badge.island_paradise': 'Surga Pulau',
    
    // Filter placeholders and labels
    'filter.select_capacity': 'Pilih kapasitas',
    'filter.select_price': 'Pilih rentang harga',
    
    // Form validation and errors
    'validation.required_field': 'Field ini wajib diisi',
    'validation.invalid_email': 'Masukkan alamat email yang valid',
    'validation.password_mismatch': 'Kata sandi tidak cocok',
    'validation.min_length': 'Minimal {min} karakter',
    
    // Call to Action
    'cta.cant_find': 'Tidak Menemukan Yang Anda Cari?',
    'cta.contact_description': 'Hubungi kami langsung untuk rekomendasi homestay yang dipersonalisasi dan permintaan khusus',
    'cta.contact_team': 'Hubungi Tim Kami',
    'cta.explore_activities': 'Jelajahi Aktivitas',
    
    // Room Card
    'room.highlights': 'Sorotan',
    'room.availability': 'Ketersediaan',
    'room.book_now': 'Pesan Sekarang',
    'room.check_other_dates': 'Cek Tanggal Lain',
    'room.book_other_dates': 'Pesan untuk tanggal lain',
    'room.under_maintenance': 'Dalam Perawatan',
    'room.check_availability': 'Cek Ketersediaan',
    
    // Booking Form
    'booking.full_name': 'Nama Lengkap',
    'booking.email_address': 'Alamat Email',
    'booking.phone_number': 'Nomor Telepon',
    'booking.special_requests': 'Permintaan Khusus (Opsional)',
    'booking.payment_method': 'Metode Pembayaran',
    'booking.qris_payment': 'Pembayaran QRIS',
    'booking.secure_payment': 'Sistem pembayaran Indonesia yang aman',
    'booking.starting_from': 'Mulai dari',
    
    // Form placeholders
    'placeholder.enter_name': 'Masukkan nama lengkap Anda',
    'placeholder.enter_email': 'email.anda@contoh.com',
    'placeholder.enter_phone': 'Masukkan nomor telepon Anda',
    'placeholder.special_requests': 'Permintaan khusus untuk menginap di pulau? (preferensi makanan, kebutuhan aksesibilitas, dll.)',
    
    // Payment methods
    'payment.popular': 'Populer',
    'payment.ewallet': 'E-Wallet',
    'payment.digital': 'Digital',
    
    // Enhanced Date Picker
    'datepicker.choose_dates': 'Pilih Tanggal Anda',
    'datepicker.select_dates': 'Pilih Tanggal Anda',
    'datepicker.selected': 'Terpilih',
    'datepicker.unavailable': 'Tidak Tersedia',
    'datepicker.past_dates': 'Tanggal lalu',
    'datepicker.some_unavailable': 'Beberapa tanggal tidak tersedia',
    'datepicker.unavailable_notice': 'Tanggal merah di kalender sudah dipesan. Silakan pilih tanggal yang tersedia.',
    'datepicker.your_selection': 'Pilihan Anda',
    'datepicker.nights': 'malam',
    'datepicker.estimated': 'Estimasi',
    'datepicker.cancel': 'Batal',
    'datepicker.proceed_booking': 'Lanjutkan ke Pemesanan',
    'datepicker.confirm_dates': 'Konfirmasi Tanggal',
    'datepicker.selected_dates': 'Tanggal terpilih',
    
    // What's Included
    'included.whats_included': 'What\'s Included:',
    'included.accommodation': 'Comfortable island accommodation',
    'included.breakfast': 'Daily Indonesian breakfast',
    'included.wifi': 'Free high-speed Wi-Fi',
    'included.beach_access': 'Beach facilities access',
    'included.support': '24/7 island support',
    'included.greeting': 'Welcome island greeting',
    
    // BookNow Page
    'booknow.page_title': 'Book Your Island Paradise',
    'booknow.page_subtitle': 'Complete your magical journey to {homestay} - where island dreams become reality',
    'booknow.page_subtitle_default': 'Find your perfect island sanctuary and embark on an unforgettable Untung Jawa adventure',
    'booknow.secure_instant_magical': 'Secure • Instant • Magical',
    'booknow.booking_details': 'Booking Details',
    'booknow.complete_reservation': 'Complete your island escape reservation',
    'booknow.select_room': 'Select Your Island Room',
    'booknow.available_for_dates': '{count} Available for Selected Dates',
    'booknow.not_available': '{count} Not Available',
    'booknow.checking_availability': 'Checking Availability...',
    'booknow.checking': 'Checking...',
    'booknow.refresh_availability': 'Refresh Availability',
    'booknow.refreshing_availability': 'Refreshing room availability',
    'booknow.checking_latest_rooms': 'Checking for the latest magical rooms...',
    'booknow.availability_updated': 'Availability Updated!',
    'booknow.availability_refreshed': 'Room availability has been refreshed with the latest data.',
    'booknow.guest_information': 'Guest Information',
    'booknow.continue_payment': 'Continue to Payment',
    'booknow.creating_booking': 'Creating Booking...',
    'booknow.booking_summary': 'Booking Summary',
    'booknow.back_to_homestay': 'Back to homestay details',
    'booknow.checkin': 'Check-in',
    'booknow.checkout': 'Check-out',
    'booknow.guests': 'Guests',
    'booknow.nights': 'Nights',
    'booknow.price_per_night': 'Price per night',
    'booknow.total': 'Total',
    'booknow.whats_included': 'What\'s Included:',
    'booknow.included_accommodation': 'Comfortable island accommodation',
    'booknow.included_breakfast': 'Daily Indonesian breakfast',
    'booknow.included_wifi': 'Free high-speed Wi-Fi',
    'booknow.included_beach': 'Beach facilities access',
    'booknow.included_support': '24/7 island support',
    'booknow.included_greeting': 'Welcome island greeting',
    'booknow.secure_payment_notice': 'Pemrosesan pembayaran aman dengan perlindungan tingkat pulau',
    'booknow.no_homestay_selected': 'Tidak ada homestay yang dipilih',
    'booknow.start_adventure': 'Mulai petualangan pulau Anda dengan memilih homestay ajaib',
    'booknow.browse_homestays': 'Jelajahi Homestay Pulau',
    'booknow.loading_booking_details': 'Memuat detail pemesanan...',
    'booknow.booking_confirmed': 'Pemesanan Dikonfirmasi!',
    'booknow.booking_success_message': 'Pemesanan Anda telah berhasil dikonfirmasi. Nomor referensi Anda adalah:',
    'booknow.whats_next': 'Apa Selanjutnya?',
    'booknow.confirmation_email_sent': 'Email konfirmasi telah dikirim ke alamat email Anda. Jika tidak melihatnya, silakan periksa folder spam.',
    'booknow.save_reference': 'Nomor referensi pemesanan Anda adalah {reference} - harap simpan untuk catatan Anda.',
    'booknow.property_notified': 'Pemilik properti akan diberitahu tentang pemesanan Anda.',
    'booknow.view_dashboard': 'Anda dapat melihat detail pemesanan di dashboard Anda.',
    'booknow.return_home': 'Kembali ke Beranda',
    'booknow.view_bookings': 'Lihat Pemesanan Saya',
  }
};

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    // Get from localStorage or default to 'en'
    if (typeof window !== 'undefined') {
      const storedLang = (localStorage.getItem('language') as Language) || 'en';
      console.log('Initial language from localStorage:', storedLang);
      return storedLang;
    }
    return 'en';
  });
  
  const t = (key: string): string => {
    const translation = translations[language]?.[key as keyof typeof translations.en] || key;
    // Debug specific keys that are problematic
    if (key.includes('booknow.page_title') || key.includes('included.whats_included')) {
      console.log(`Translation for ${key} in ${language}:`, translation);
    }
    return translation;
  };
  
  const handleSetLanguage = (lang: Language) => {
    console.log('Setting language to:', lang);
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };
  
  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
} 