import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Star,
  Zap,
  MapPin,
  X
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { addDays, format, differenceInDays, isSameDay, isAfter, isBefore } from 'date-fns';
import { formatCurrency } from '@/utils/format';
import { useTranslation } from '@/hooks/useTranslation';

interface BlockedPeriod {
  start_date: string;
  end_date: string;
  reason: string;
  guest_name?: string;
}

interface SuggestedPeriod {
  id: number;
  label: string;
  start_date: string;
  end_date: string;
  duration: number;
  reason: string;
  price_estimate?: number;
}

interface EnhancedDatePickerProps {
  roomId: number;
  roomName?: string;
  onDateSelect: (startDate: string, endDate: string) => void;
  onClose?: () => void;
  initialStartDate?: string;
  initialEndDate?: string;
  isEmbedded?: boolean; // For landscape desktop layout
}

const EnhancedDatePicker: React.FC<EnhancedDatePickerProps> = ({
  roomId,
  roomName,
  onDateSelect,
  onClose,
  initialStartDate,
  initialEndDate,
  isEmbedded = false
}) => {
  const { t } = useTranslation();
  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);
  const [suggestedPeriods, setSuggestedPeriods] = useState<SuggestedPeriod[]>([]);
  const [selectedRange, setSelectedRange] = useState<{ from: Date; to?: Date } | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [basePrice] = useState(300000);

  useEffect(() => {
    fetchBlockedPeriods();
  }, [roomId]);

  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      setSelectedRange({
        from: new Date(initialStartDate),
        to: new Date(initialEndDate)
      });
    }
  }, [initialStartDate, initialEndDate]);

  const fetchBlockedPeriods = async () => {
    setLoading(true);
    try {
      // ✅ FIXED: Connect to real backend data on port 5000
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms/${roomId}/blocked-periods`);

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setBlockedPeriods(data.data.blocked_periods || []);
            generateSuggestions(data.data.blocked_periods || []);
            setLoading(false);
            return;
          }
        }
      } catch (apiError) {
        console.log('Backend endpoint not available on port 5000, using empty data');
      }
      
      // ✅ FIXED: Use empty array instead of fake data
      // This way calendar shows all dates as available until backend is ready
      const emptyBlockedPeriods: BlockedPeriod[] = [];
      setBlockedPeriods(emptyBlockedPeriods);
      generateSuggestions(emptyBlockedPeriods);
    } catch (err) {
      setError('Failed to load room availability');
      console.error('Error fetching blocked periods:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = (blocked: BlockedPeriod[]) => {
    const suggestions: SuggestedPeriod[] = [];
    const today = new Date();
    
    // Find next 3 available periods
    let currentDate = new Date(today);
    let foundPeriods = 0;
    
    while (foundPeriods < 3 && differenceInDays(currentDate, today) < 90) {
      const availablePeriod = findNextAvailablePeriod(currentDate, blocked);
      
      if (availablePeriod && availablePeriod.duration >= 1) {
        suggestions.push({
          id: foundPeriods,
          label: `${format(availablePeriod.start, 'MMM dd')} - ${format(availablePeriod.end, 'MMM dd')}`,
          start_date: format(availablePeriod.start, 'yyyy-MM-dd'),
          end_date: format(availablePeriod.end, 'yyyy-MM-dd'),
          duration: availablePeriod.duration,
          reason: foundPeriods === 0 ? 'Soonest available' : 
                  foundPeriods === 1 ? 'Weekend option' : 'Longer stay',
          price_estimate: basePrice * availablePeriod.duration // Mock price
        });
        foundPeriods++;
      }
      
      currentDate = availablePeriod ? addDays(availablePeriod.end, 1) : addDays(currentDate, 1);
    }
    
    setSuggestedPeriods(suggestions);
  };

  const findNextAvailablePeriod = (startDate: Date, blocked: BlockedPeriod[]) => {
    let currentStart = new Date(startDate);
    const maxDuration = 7; // Look for up to 7-day periods
    
    for (let duration = 1; duration <= maxDuration; duration++) {
      const potentialEnd = addDays(currentStart, duration);
      
      // Check if this period conflicts with any blocked period
      const hasConflict = blocked.some(period => {
        const blockStart = new Date(period.start_date);
        const blockEnd = new Date(period.end_date);
        return isBefore(currentStart, blockEnd) && isAfter(potentialEnd, blockStart);
      });
      
      if (!hasConflict) {
        return {
          start: new Date(currentStart),
          end: new Date(potentialEnd),
          duration
        };
      }
    }
    
    return null;
  };

  const isDateBlocked = (date: Date) => {
    return blockedPeriods.some(period => {
      const start = new Date(period.start_date);
      const end = new Date(period.end_date);
      return (date >= start && date <= end);
    });
  };

  const disabledDays = (date: Date) => {
    // Disable past dates and blocked dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today) || isDateBlocked(date);
  };

  const handleSuggestionSelect = (suggestion: SuggestedPeriod) => {
    const startDate = new Date(suggestion.start_date);
    const endDate = new Date(suggestion.end_date);
    setSelectedRange({ from: startDate, to: endDate });
  };

  const handleConfirmBooking = () => {
    if (selectedRange?.from && selectedRange?.to) {
      onDateSelect(
        format(selectedRange.from, 'yyyy-MM-dd'),
        format(selectedRange.to, 'yyyy-MM-dd')
      );
    }
  };

  const calculateNights = () => {
    if (!selectedRange?.from || !selectedRange?.to) return 0;
    return differenceInDays(selectedRange.to, selectedRange.from);
  };

  const calculatePrice = () => {
    const nights = calculateNights();
    return nights * basePrice;
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5 animate-spin" />
            <span>Loading room availability...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isEmbedded) {
    // Embedded version for landscape desktop layout
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-4"
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            <span>Select Your Dates</span>
          </h3>
          {onClose && (
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Compact Calendar */}
        <div className="bg-white rounded-lg border p-4">
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={setSelectedRange}
            disabled={disabledDays}
            numberOfMonths={2}
            className="enhanced-calendar w-full"
            classNames={{
              months: "flex flex-col space-y-4 justify-center",
              month: "space-y-2 min-w-0",
              caption: "flex justify-center pt-1 relative items-center text-sm font-semibold mb-2",
              table: "w-full border-collapse",
              head_row: "flex mb-1",
              head_cell: "text-gray-600 rounded-md w-8 h-8 font-medium text-xs flex items-center justify-center",
              row: "flex w-full mt-1",
              cell: "h-8 w-8 text-center text-xs p-0 relative",
              day: "h-8 w-8 p-0 font-normal rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 flex items-center justify-center text-xs",
              day_selected: "bg-blue-500 text-white hover:bg-blue-600 font-semibold",
              day_today: "bg-blue-100 text-blue-700 font-bold border border-blue-300",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-red-500 opacity-50 bg-red-50 line-through cursor-not-allowed",
              day_range_middle: "bg-blue-100 text-blue-700",
              day_range_start: "bg-blue-500 text-white rounded-l-md",
              day_range_end: "bg-blue-500 text-white rounded-r-md",
              day_hidden: "invisible",
            }}
          />
        </div>

        {/* Compact Legend */}
        <div className="flex justify-center">
          <div className="flex gap-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>{t('datepicker.selected')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-50 border border-red-300 rounded"></div>
              <span>{t('datepicker.unavailable')}</span>
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        <AnimatePresence>
          {selectedRange?.from && selectedRange?.to && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-3"
            >
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  {format(selectedRange.from, 'MMM dd')} - {format(selectedRange.to, 'MMM dd')}
                </p>
                <p className="text-xs text-gray-500">
                  {calculateNights()} {t('datepicker.nights')} • {formatCurrency(calculatePrice(), 'IDR')}
                </p>
                <Button 
                  type="button"
                  onClick={handleConfirmBooking}
                  size="sm"
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {t('datepicker.confirm_dates')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span className="text-base sm:text-lg">{t('datepicker.choose_dates')}{roomName && ` - ${roomName}`}</span>
          </CardTitle>
          {onClose && (
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
      </Card>

      {/* ✅ FIXED: Full-width calendar layout (removed quick picks to prevent cramping) */}
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">📅 {t('datepicker.select_dates')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ✅ FIXED: Desktop-optimized calendar container */}
            <div className="calendar-container bg-white rounded-lg border p-4 sm:p-6">
              <Calendar
                mode="range"
                selected={selectedRange}
                onSelect={setSelectedRange}
                disabled={disabledDays}
                numberOfMonths={2}
                className="enhanced-calendar w-full max-w-2xl mx-auto"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0 justify-center",
                  month: "space-y-3 min-w-0 flex-1",
                  caption: "flex justify-center pt-1 relative items-center text-base font-semibold mb-3",
                  table: "w-full border-collapse",
                  head_row: "flex mb-1",
                  head_cell: "text-gray-600 rounded-md w-8 h-8 sm:w-10 sm:h-10 font-medium text-xs flex items-center justify-center",
                  row: "flex w-full mt-1",
                  cell: "h-8 w-8 sm:h-10 sm:w-10 text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-8 w-8 sm:h-10 sm:w-10 p-0 font-normal rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 flex items-center justify-center text-xs sm:text-sm",
                  day_selected: "bg-blue-500 text-white hover:bg-blue-600 font-semibold",
                  day_today: "bg-blue-100 text-blue-700 font-bold border-2 border-blue-300",
                  day_outside: "text-gray-400 opacity-50",
                  day_disabled: "text-red-500 opacity-50 bg-red-50 line-through cursor-not-allowed hover:bg-red-50",
                  day_range_middle: "bg-blue-100 text-blue-700",
                  day_range_start: "bg-blue-500 text-white rounded-l-md",
                  day_range_end: "bg-blue-500 text-white rounded-r-md",
                  day_hidden: "invisible",
                }}
              />
            </div>

            {/* ✅ FIXED: Desktop-optimized legend */}
            <div className="flex justify-center mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-4 sm:gap-8 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded shadow-sm"></div>
                  <span className="font-medium text-gray-700">{t('datepicker.selected_dates')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-50 border border-red-300 rounded shadow-sm flex items-center justify-center">
                    <div className="w-2 h-0.5 bg-red-500"></div>
                  </div>
                  <span className="font-medium text-gray-700">{t('datepicker.unavailable')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded shadow-sm"></div>
                  <span className="font-medium text-gray-700">{t('datepicker.past_dates')}</span>
                </div>
              </div>
            </div>

            {/* ✅ FIXED: Simplified blocked periods display (only if there are actual blocked periods) */}
            {blockedPeriods.length > 0 && (
              <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2 flex items-center text-sm sm:text-base">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {t('datepicker.some_unavailable')}
                </h4>
                <p className="text-xs sm:text-sm text-amber-700">
                  {t('datepicker.unavailable_notice')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Selection Summary */}
      <AnimatePresence>
        {selectedRange?.from && selectedRange?.to && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-base sm:text-lg flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>{t('datepicker.your_selection')}</span>
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {format(selectedRange.from, 'MMMM dd, yyyy')} - {format(selectedRange.to, 'MMMM dd, yyyy')}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {calculateNights()} {t('datepicker.nights')} • {t('datepicker.estimated')}: {formatCurrency(calculatePrice(), 'IDR')}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    {onClose && (
                      <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                        {t('datepicker.cancel')}
                      </Button>
                    )}
                    <Button 
                      type="button"
                      onClick={handleConfirmBooking}
                      className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">{t('datepicker.proceed_booking')}</span>
                      <span className="sm:hidden">{t('datepicker.proceed_booking')}</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>


    </motion.div>
  );
};

export default EnhancedDatePicker; 