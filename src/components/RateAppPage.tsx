import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Star, Heart, Send, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
const RateAppPage = () => {
  const {
    toast
  } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const handleSubmitRating = () => {
    if (rating === 0) {
      toast({
        title: "Please provide a rating",
        description: "Select at least one star to submit your rating.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Thank you for your feedback! 🙏",
      description: "Your rating helps us improve our service."
    });

    // Reset form
    setRating(0);
    setFeedback('');
  };
  const handlePlayStoreRating = () => {
    toast({
      title: "Redirecting to Play Store",
      description: "Opening Play Store to rate our app."
    });
  };
  return <AppLayout>
      <div className="h-full flex flex-col py-4 space-y-4 overflow-y-auto">
        {/* Header */}
        

        {/* Rating Header */}
        <div className="glass-card p-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border border-yellow-200">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">We Value Your Feedback!</h2>
            <p className="text-slate-600">Help us improve Advance Washing by sharing your experience</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="glass-card p-6 bg-white/95 border border-blue-200/30">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">How would you rate our app?</h3>
          
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map(star => <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} className="transition-all duration-200 hover:scale-110">
                <Star className={`w-12 h-12 ${star <= (hoveredRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              </button>)}
          </div>

          {rating > 0 && <div className="text-center">
              <p className="text-lg font-medium text-slate-800">
                {rating === 1 && "We're sorry to hear that 😞"}
                {rating === 2 && "We'll work on improving 🔧"}
                {rating === 3 && "Thanks for the feedback 👍"}
                {rating === 4 && "Great! We're glad you like it 😊"}
                {rating === 5 && "Awesome! You're amazing! 🌟"}
              </p>
            </div>}
        </div>

        {/* Feedback Text */}
        <div className="glass-card p-6 bg-white/95 border border-blue-200/30">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Tell us more (optional)</h3>
          <Textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Share your thoughts about our laundry service, app features, or suggestions for improvement..." rows={4} className="premium-input min-h-[100px] text-slate-800 bg-gray-900" />
        </div>

        {/* Submit Button */}
        <div className="glass-card p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <Button onClick={handleSubmitRating} className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            <Send className="w-5 h-5 mr-2" />
            Submit Rating
          </Button>
        </div>

        {/* Play Store Rating */}
        <div className="glass-card p-4 bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200">
          <div className="text-center space-y-3">
            <h4 className="font-semibold text-slate-800">Love our app?</h4>
            <p className="text-sm text-slate-600">Rate us on Google Play Store and help others discover us!</p>
            <Button onClick={handlePlayStoreRating} variant="outline" className="w-full border-green-300 text-green-600 hover:bg-green-50 font-medium">
              <ThumbsUp className="w-4 h-4 mr-2" />
              Rate on Play Store
            </Button>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="glass-card p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200">
          <div className="text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-slate-600">
              Your feedback helps us serve Mumbai families better! 🏠
            </p>
          </div>
        </div>
      </div>
    </AppLayout>;
};
export default RateAppPage;