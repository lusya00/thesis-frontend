import React from 'react';
import { motion } from 'framer-motion';
import { 
  Anchor, 
  Sun, 
  Waves, 
  MapPin, 
  Users, 
  Heart, 
  Star,
  Compass,
  Fish,
  Camera,
  Coffee,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

const EnhancedAboutSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Anchor,
      titleKey: "about.island_heritage",
      descriptionKey: "about.heritage_description",
      color: "from-ocean to-ocean-dark"
    },
    {
      icon: Users,
      titleKey: "about.local_community",
      descriptionKey: "about.community_description",
      color: "from-emerald-500 to-emerald-700"
    },
    {
      icon: Waves,
      titleKey: "about.pristine_nature",
      descriptionKey: "about.nature_description",
      color: "from-sand-dark to-orange-600"
    },
    {
      icon: Heart,
      titleKey: "about.sustainable_tourism",
      descriptionKey: "about.sustainability_description",
      color: "from-pink-500 to-rose-600"
    }
  ];

  const stats = [
    { number: "50+", labelKey: "stats.family_homestays", icon: MapPin },
    { number: "2.5k+", labelKey: "stats.happy_guests", icon: Star },
    { number: "15+", label: "Island Activities", icon: Compass },
    { number: "100%", label: "Authentic Experience", icon: Heart }
  ];

  const experiences = [
    {
      titleKey: "activities.sunrise_fishing",
      descriptionKey: "activities.fishing_description",
      icon: Fish,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop"
    },
    {
      titleKey: "activities.photography_tours",
      descriptionKey: "activities.photography_description",
      icon: Camera,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    },
    {
      titleKey: "activities.coffee_culture",
      descriptionKey: "activities.coffee_description",
      icon: Coffee,
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop"
    },
    {
      titleKey: "activities.mangrove_conservation",
      descriptionKey: "activities.mangrove_description",
      icon: Leaf,
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden" id="about">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-ocean/5 to-tropical/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-br from-sand-light/10 to-sand-dark/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 motion-safe-fallback"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="p-4 bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-2xl">
                <Anchor className="w-8 h-8 text-ocean" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1 -right-1"
              >
                <Sun className="w-6 h-6 text-sand-dark" />
              </motion.div>
            </motion.div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-ocean-dark mb-6">
            {t('about.discover_title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('about.discover_description')}
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-ocean-dark mb-3 font-playfair">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t(feature.descriptionKey)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-ocean via-ocean-dark to-cyan-900 rounded-3xl"></div>
          <div className="relative bg-black/20 backdrop-blur-sm rounded-3xl p-8 md:p-16 text-center border border-white/10 overflow-hidden">
            
            {/* Enhanced floating elements for better visual depth */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"
              />
            </div>

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 font-playfair text-shadow-dark">
              Our Island Impact
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                      className="inline-flex p-4 bg-white/25 backdrop-blur-sm rounded-full mb-4 border border-white/20 shadow-lg"
                    >
                      <Icon className="w-6 h-6 text-white icon-shadow-dark" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      className="text-3xl md:text-4xl font-bold text-white mb-2 text-shadow-dark"
                    >
                      {stat.number}
                    </motion.div>
                    <p className="text-white/95 font-medium text-shadow-soft">{t(stat.labelKey)}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        </motion.div>

        {/* Island Experiences */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4 font-playfair">
              {t('about.authentic_experiences_title')}
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.authentic_experiences_description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((experience, index) => {
              const Icon = experience.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-none">
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={experience.image}
                        alt={t(experience.titleKey)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-white font-bold text-lg font-playfair">
                            {t(experience.titleKey)}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-gray-600 leading-relaxed">
                        {t(experience.descriptionKey)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-sand-light/20 to-sand-dark/20 rounded-3xl p-8 md:p-12">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex p-4 bg-gradient-to-r from-ocean to-tropical rounded-2xl mb-6"
            >
              <Waves className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4 font-playfair">
              {t('cta.ready_title')}
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('cta.ready_description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-ocean to-ocean-dark hover:from-ocean-dark hover:to-cyan-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <MapPin className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  {t('cta.explore_homestays')}
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-ocean/30 text-ocean hover:bg-ocean/5 hover:border-ocean transition-all duration-300"
                >
                  <Compass className="w-5 h-5 mr-2" />
                  {t('cta.plan_journey')}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedAboutSection; 