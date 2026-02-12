import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import HomestayCard from "./accommodation/HomestayCard";
import type { Homestay } from "./accommodation/types";
import { homestayService, adaptHomestayForDisplay } from "@/lib/services/homestayService";
import { useTranslation } from "@/hooks/useTranslation";

const HomestaySection = () => {
  const { t, language } = useTranslation();
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedHomestays = async () => {
      try {
        setLoading(true);
        const data = await homestayService.getAllHomestays(language);
        
        // Map backend homestay data to the frontend Homestay type and take only 4
        const adaptedHomestays = data.map(adaptHomestayForDisplay).slice(0, 4);
        setHomestays(adaptedHomestays);
      } catch (error) {
        console.error("Error fetching homestays:", error);
        setError("Failed to load homestays");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHomestays();
  }, [language]);

  return (
    <section id="homestays" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-heading mx-auto">{t('homestays.section_title')}</h2>
          <div className="w-24 h-1 bg-ocean mx-auto mt-2 mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {t('homestays.section_description')}
          </p>
        </div>

        {/* Homestay cards */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-ocean" />
            <span className="ml-2">{t('general.loading_homestays')}</span>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homestays.map((homestay) => (
              <HomestayCard key={homestay.id} homestay={homestay} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/homestays" className="btn-primary">
            {t('homestays.view_all')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomestaySection;
