import React, { useState } from "react";
import { ArrowLeft, Sparkles, Star, MapPin, Users, Calendar, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";

const RecommendationQuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = [
    {
      id: 'groupSize',
      question: 'How many people are traveling?',
      options: [
        { value: '1', label: 'Just me (Solo traveler)' },
        { value: '2', label: '2 people (Couple)' },
        { value: '3-4', label: '3-4 people (Small group)' },
        { value: '5+', label: '5+ people (Large group)' }
      ]
    },
    {
      id: 'budget',
      question: 'What\'s your budget range per night?',
      options: [
        { value: 'budget', label: 'Under Rp 500,000 (Budget-friendly)' },
        { value: 'mid', label: 'Rp 500,000 - Rp 1,000,000 (Mid-range)' },
        { value: 'premium', label: 'Rp 1,000,000+ (Premium)' }
      ]
    },
    {
      id: 'duration',
      question: 'How long is your stay?',
      options: [
        { value: '1-2', label: '1-2 nights (Short stay)' },
        { value: '3-7', label: '3-7 nights (Week stay)' },
        { value: '7+', label: 'More than a week (Extended stay)' }
      ]
    },
    {
      id: 'activities',
      question: 'What type of activities interest you?',
      options: [
        { value: 'beach', label: 'Beach & relaxation' },
        { value: 'adventure', label: 'Adventure & exploration' },
        { value: 'culture', label: 'Culture & local experiences' },
        { value: 'mixed', label: 'Mix of everything' }
      ]
    },
    {
      id: 'amenities',
      question: 'Which amenities are most important?',
      options: [
        { value: 'basic', label: 'Basic comforts (WiFi, AC)' },
        { value: 'comfort', label: 'Full comfort (Kitchen, TV)' },
        { value: 'luxury', label: 'Luxury amenities (Pool, Spa)' }
      ]
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <EnhancedNavbar />

        <div className="pt-20 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Quiz Completed!</h1>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Your Preferences Summary</CardTitle>
                  <CardDescription>
                    Based on your answers, we'll recommend the perfect homestays for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(answers).map(([key, value]) => {
                    const question = questions.find(q => q.id === key);
                    const option = question?.options.find(opt => opt.value === value);
                    return (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{question?.question}</span>
                        <span className="text-ocean font-semibold">{option?.label}</span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <p className="text-lg text-gray-600">
                  🎉 Great! Our recommendation system is analyzing your preferences to find the perfect homestays.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={resetQuiz} variant="outline">
                    Retake Quiz
                  </Button>
                  <Link to="/homestays">
                    <Button className="bg-gradient-to-r from-ocean to-ocean-dark hover:from-ocean-dark hover:to-ocean">
                      View Recommendations
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <EnhancedNavbar />

      <div className="pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-10 w-10 text-ocean mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Homestay</h1>
            </div>
            <p className="text-lg text-gray-600">
              Answer a few questions to get personalized recommendations
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-ocean to-ocean-dark h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <Link to="/recommendations">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Recommendations</span>
              </Button>
            </Link>
          </motion.div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {questions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[questions[currentQuestion].id] || ''}
                  onValueChange={(value) => handleAnswer(questions[currentQuestion].id, value)}
                  className="space-y-4"
                >
                  {questions[currentQuestion].options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label
                        htmlFor={option.value}
                        className="flex-1 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-ocean/50 hover:bg-ocean/5 transition-colors"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between mt-8">
                  <Button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={nextQuestion}
                    disabled={!answers[questions[currentQuestion].id]}
                    className="bg-gradient-to-r from-ocean to-ocean-dark hover:from-ocean-dark hover:to-ocean"
                  >
                    {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecommendationQuizPage;
