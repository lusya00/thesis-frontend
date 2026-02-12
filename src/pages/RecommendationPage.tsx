import React from "react";
import { ArrowLeft, Sparkles, Star, MapPin, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";

const RecommendationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <EnhancedNavbar />

      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-12 w-12 text-ocean mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">System Recommendation Homestay</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover personalized homestay recommendations tailored to your preferences and needs
            </p>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Link to="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-ocean" />
                  <span>How Our Recommendation System Works</span>
                </CardTitle>
                <CardDescription>
                  Our intelligent system analyzes your preferences to suggest the perfect homestay for your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-ocean/10 rounded-full flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-ocean" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Location-Based</h3>
                        <p className="text-gray-600 text-sm">
                          Recommendations based on your current location and preferred destinations
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-ocean/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-ocean" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Group Size</h3>
                        <p className="text-gray-600 text-sm">
                          Tailored suggestions based on the number of guests in your party
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-ocean/10 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-ocean" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Seasonal Availability</h3>
                        <p className="text-gray-600 text-sm">
                          Smart suggestions considering peak seasons and availability
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-ocean/10 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-ocean" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Quality & Reviews</h3>
                        <p className="text-gray-600 text-sm">
                          Prioritizing highly-rated homestays with excellent guest feedback
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-ocean/5 to-cyan-50 p-6 rounded-lg border border-ocean/20">
                  <h3 className="font-semibold text-gray-900 mb-2">Coming Soon</h3>
                  <p className="text-gray-600">
                    Our advanced recommendation system is currently in development. Soon you'll be able to get personalized homestay suggestions based on your preferences, budget, and travel dates.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <Link to="/recommendation-quiz">
                <Button size="lg" className="bg-gradient-to-r from-ocean to-ocean-dark hover:from-ocean-dark hover:to-ocean text-white px-8 py-3">
                  Start Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecommendationPage;
