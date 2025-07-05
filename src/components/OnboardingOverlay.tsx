import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, MapPin, Filter, Sparkles, Trophy, DollarSign, Users, Languages, Utensils, Phone, Bookmark, Baby, Search } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: React.ReactNode;
  highlight?: boolean;
  action?: string;
  tip?: string;
}

interface OnboardingOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({
  isVisible,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Muso! 👋',
      description: 'Finding the right childcare in Toronto just got easier. Muso helps you discover CWELCC centers, subsidy options, and culturally-fit daycare for your family.',
      position: 'center',
      icon: <Baby className="h-6 w-6" />,
      tip: 'This tour takes about 2 minutes and will show you everything you need to know!'
    },
    {
      id: 'overview',
      title: 'How Muso Works',
      description: 'We\'ve organized 1,000+ Toronto childcare centers with smart filters and an interactive map. Filter by your needs, explore on the map, and contact centers directly.',
      position: 'center',
      icon: <Search className="h-6 w-6" />,
      tip: 'All data is sourced from Toronto.ca and enhanced with exclusive features'
    },
    {
      id: 'filters-intro',
      title: 'Smart Filtering System',
      description: 'Start here! Use these filters to narrow down centers based on your family\'s specific needs. Watch the numbers update as you select different options.',
      targetElement: 'filter-bar',
      position: 'bottom',
      icon: <Filter className="h-6 w-6" />,
      highlight: true,
      action: 'Try clicking the CWELCC button to see it in action!'
    },
    {
      id: 'cwelcc-explained',
      title: 'CWELCC Program 🏆',
      description: 'Canada-Wide Early Learning & Child Care reduces fees to an average of $10/day. This is a game-changer for families - definitely worth filtering for!',
      targetElement: 'cwelcc-filter',
      position: 'bottom',
      icon: <Trophy className="h-6 w-6" />,
      tip: 'CWELCC centers are marked with purple pins on the map'
    },
    {
      id: 'subsidy-explained',
      title: 'Fee Subsidy Support 💰',
      description: 'Many centers accept Toronto\'s fee subsidy program, which can cover up to 100% of childcare costs for eligible families.',
      targetElement: 'subsidy-filter',
      position: 'bottom',
      icon: <DollarSign className="h-6 w-6" />,
      tip: 'You can apply for subsidy through Toronto.ca'
    },
    {
      id: 'age-groups',
      title: 'Age-Specific Programs',
      description: 'Filter by your child\'s age group: Infant (0-18 months), Toddler (18-30 months), Preschool (2.5-4 years), or School Age (4-12 years).',
      targetElement: 'exclusive-filters',
      position: 'bottom',
      icon: <Users className="h-6 w-6" />,
      action: 'Click "Age Groups" to see all available options'
    },
    {
      id: 'exclusive-features',
      title: 'Muso Exclusive Features ✨',
      description: 'Look for the sparkle icons! These unique filters help you find centers with staff who speak your language and offer specific dietary accommodations.',
      targetElement: 'exclusive-filters',
      position: 'bottom',
      icon: <Sparkles className="h-6 w-6" />,
      tip: 'These features aren\'t available anywhere else - we manually collected this data!'
    },
    {
      id: 'languages-feature',
      title: 'Multilingual Staff 🌍',
      description: 'Find centers where staff speak your family\'s language. This can make drop-offs, communication, and your child\'s comfort so much better.',
      targetElement: 'exclusive-filters',
      position: 'bottom',
      icon: <Languages className="h-6 w-6" />,
      action: 'Try the "Languages" filter to see options like Mandarin, Arabic, French, and more'
    },
    {
      id: 'dietary-feature',
      title: 'Dietary Accommodations 🍎',
      description: 'Filter for centers that provide halal, kosher, vegetarian, or allergy-friendly meals. Perfect for families with specific dietary needs.',
      targetElement: 'exclusive-filters',
      position: 'bottom',
      icon: <Utensils className="h-6 w-6" />,
      tip: 'Many centers are happy to accommodate but don\'t advertise it - we found out for you!'
    },
    {
      id: 'map-interaction',
      title: 'Interactive Map Exploration',
      description: 'The map shows all centers matching your current filters. Click any marker to see detailed information, contact details, and quick actions.',
      targetElement: 'map-container',
      position: 'top',
      icon: <MapPin className="h-6 w-6" />,
      action: 'After this tour, try clicking a marker to see center details!'
    },
    {
      id: 'center-cards',
      title: 'Detailed Center Information',
      description: 'Each center card shows everything you need: CWELCC status, subsidy availability, languages spoken, dietary services, ratings, and contact info.',
      targetElement: 'map-container',
      position: 'top',
      icon: <Phone className="h-6 w-6" />,
      tip: 'You can call centers directly or visit their websites with one click'
    },
    {
      id: 'save-feature',
      title: 'Save Your Favorites',
      description: 'Found a center you like? Click the bookmark icon to save it to your list. Perfect for comparing options or sharing with your partner.',
      targetElement: 'map-container',
      position: 'top',
      icon: <Bookmark className="h-6 w-6" />,
      tip: 'Saved centers stay in your browser for future visits'
    },
    {
      id: 'tips-and-tricks',
      title: 'Pro Tips for Success 🎯',
      description: 'Start broad, then narrow down. Try different filter combinations. Call centers directly - they often have more availability than their websites show.',
      position: 'center',
      icon: <Sparkles className="h-6 w-6" />,
      tip: 'Many parents find success by visiting centers in person, even without appointments'
    },
    {
      id: 'ready',
      title: 'You\'re Ready to Find Amazing Childcare! 🎉',
      description: 'You now know how to use all of Muso\'s features. Start exploring, save your favorites, and remember - the perfect center for your family is out there!',
      position: 'center',
      icon: <Baby className="h-6 w-6" />,
      action: 'Happy hunting! 🍀'
    }
  ];

  const currentStepData = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const skipTour = () => {
    onSkip();
  };

  // Get position for targeted elements
  const getTargetPosition = () => {
    if (!currentStepData.targetElement) return null;

    const element = document.querySelector(`[data-onboarding="${currentStepData.targetElement}"]`);
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      width: rect.width,
      height: rect.height
    };
  };

  const targetPosition = getTargetPosition();

  // Calculate tooltip position
  const getTooltipStyle = () => {
    if (currentStepData.position === 'center') {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 60
      };
    }

    if (!targetPosition) return {};

    const tooltipWidth = 450;
    const tooltipHeight = 300;
    const margin = 20;

    let style: any = {
      position: 'absolute' as const,
      zIndex: 60
    };

    switch (currentStepData.position) {
      case 'bottom':
        style.top = targetPosition.top + targetPosition.height + margin;
        style.left = Math.max(margin, Math.min(
          targetPosition.left + targetPosition.width / 2 - tooltipWidth / 2,
          window.innerWidth - tooltipWidth - margin
        ));
        break;
      case 'top':
        style.top = targetPosition.top - tooltipHeight - margin;
        style.left = Math.max(margin, Math.min(
          targetPosition.left + targetPosition.width / 2 - tooltipWidth / 2,
          window.innerWidth - tooltipWidth - margin
        ));
        break;
      case 'right':
        style.top = targetPosition.top + targetPosition.height / 2 - tooltipHeight / 2;
        style.left = targetPosition.left + targetPosition.width + margin;
        break;
      case 'left':
        style.top = targetPosition.top + targetPosition.height / 2 - tooltipHeight / 2;
        style.left = targetPosition.left - tooltipWidth - margin;
        break;
    }

    return style;
  };

  // Auto-advance for certain steps
  useEffect(() => {
    if (currentStepData.id === 'welcome' || currentStepData.id === 'overview') {
      const timer = setTimeout(() => {
        if (isVisible) {
          nextStep();
        }
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop with subtle animation */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm z-50 transition-all duration-500" />

      {/* Highlight overlay for targeted elements */}
      {targetPosition && currentStepData.highlight && (
        <div
          className="absolute bg-gradient-to-r from-indigo-400/20 to-purple-400/20 border-4 border-indigo-400 rounded-2xl z-50"
          style={{
            top: targetPosition.top - 12,
            left: targetPosition.left - 12,
            width: targetPosition.width + 24,
            height: targetPosition.height + 24,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.5)',
            animation: 'pulse 2s infinite'
          }}
        />
      )}

      {/* Spotlight effect for targeted elements */}
      {targetPosition && !currentStepData.highlight && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            top: targetPosition.top - 30,
            left: targetPosition.left - 30,
            width: targetPosition.width + 60,
            height: targetPosition.height + 60,
            background: 'radial-gradient(ellipse, transparent 40%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.7) 80%)',
            borderRadius: '50%'
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className={`w-[450px] transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        style={getTooltipStyle()}
      >
        <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 0), radial-gradient(circle at 75% 75%, white 2px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}></div>
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  {currentStepData.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{currentStepData.title}</h3>
                  <div className="text-sm opacity-90 font-medium">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                </div>
              </div>
              <button
                onClick={skipTour}
                className="text-white/70 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-xl"
                title="Skip tour"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed text-base">
                {currentStepData.description}
              </p>

              {/* Action callout */}
              {currentStepData.action && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-indigo-800 mb-1">Try it out:</div>
                      <div className="text-sm text-indigo-700">{currentStepData.action}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tip */}
              {currentStepData.tip && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-amber-800 mb-1">Pro Tip:</div>
                      <div className="text-sm text-amber-700 leading-relaxed">{currentStepData.tip}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6 mb-6">
              <div className="flex justify-between text-xs text-slate-500 mb-3">
                <span className="font-medium">Tour Progress</span>
                <span className="font-bold">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={skipTour}
                className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors duration-200 px-3 py-2 hover:bg-slate-100 rounded-xl"
              >
                Skip tour
              </button>
              
              <div className="flex items-center space-x-3">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium transition-all duration-200 hover:bg-slate-100 rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                )}
                
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105"
                >
                  <span>{currentStep === steps.length - 1 ? 'Start Exploring!' : 'Next'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow pointer for non-center tooltips */}
        {currentStepData.position !== 'center' && (
          <div className={`absolute ${
            currentStepData.position === 'bottom' ? 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full' :
            currentStepData.position === 'top' ? 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full' :
            currentStepData.position === 'right' ? 'left-0 top-1/2 transform -translate-x-full -translate-y-1/2' :
            'right-0 top-1/2 transform translate-x-full -translate-y-1/2'
          }`}>
            <div className={`w-0 h-0 ${
              currentStepData.position === 'bottom' ? 'border-l-6 border-r-6 border-b-6 border-transparent border-b-white' :
              currentStepData.position === 'top' ? 'border-l-6 border-r-6 border-t-6 border-transparent border-t-white' :
              currentStepData.position === 'right' ? 'border-t-6 border-b-6 border-r-6 border-transparent border-r-white' :
              'border-t-6 border-b-6 border-l-6 border-transparent border-l-white'
            }`} />
          </div>
        )}
      </div>

      {/* Floating help text for auto-advancing steps */}
      {(currentStepData.id === 'welcome' || currentStepData.id === 'overview') && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-60">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 px-4 py-2">
            <div className="text-sm text-slate-600 flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span>Auto-advancing in a few seconds...</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};