import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Users, MapPin, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { type Homestay } from "./types";
import { useTranslation } from "@/hooks/useTranslation";

interface HomestayCardProps {
  homestay: Homestay;
}

const HomestayCard = ({ homestay }: HomestayCardProps) => {
  const { t } = useTranslation();
  
  return (
    <Card key={homestay.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-sand group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={homestay.image}
          alt={homestay.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 bg-ocean/90 backdrop-blur-sm text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
          {homestay.price}/{t('homestay.per_night')}
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-ocean-dark group-hover:text-ocean transition-colors">{homestay.name}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-ocean-light" />
          <span>Untung Jawa Island</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{homestay.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {homestay.amenities.slice(0, 3).map((amenity, index) => {
            const IconComponent = amenity.icon;
            return (
            <div 
              key={index} 
                className="flex items-center gap-1 bg-gray-100 hover:bg-ocean-light/10 px-2 py-1 rounded-full text-xs transition-colors"
            >
                <IconComponent className="h-3 w-3 text-ocean" />
              <span>{amenity.translationKey ? t(amenity.translationKey) : amenity.name}</span>
              </div>
            );
          })}
          {homestay.amenities.length > 3 && (
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
              <span>+{homestay.amenities.length - 3} {t('general.more')}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-yellow-700">{homestay.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
            <Users className="h-4 w-4 text-ocean-dark" />
            <span className="text-sm">{homestay.capacity}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link to={`/homestay/${homestay.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-ocean hover:text-ocean group">
              <span>{t('homestay.view_details')}</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to={`/book?homestay=${homestay.id}`} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all text-white font-medium">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t('homestay.book_now')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomestayCard;
