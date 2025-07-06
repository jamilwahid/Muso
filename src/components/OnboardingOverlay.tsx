import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, MapPin, Filter, Sparkles, Trophy, DollarSign, Baby, Search } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tip?: string;
  action?: string;
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
      icon: <Baby className="h-6 w-6" />,
      tip: 'This quick tour will show you the key features in under 2 minutes!'
    },
    {
      id: 'filters',
      title: 'Smart Filtering System',
      description: 'Use the filter bar at the top to narrow down centers. Start with CWELCC (Canada-Wide program for $10/day childcare) and subsidy options, then add specific needs like age groups and languages.',
      icon: <Filter className="h-6 w-6" />,
      action: 'The filters update results in real-time as you select options'
    },
    {
      id: 'cwelcc',
      title: 'CWELCC Program 🏆',
      description: 'The purple CWELCC button filters for centers in Canada\'s $10/day childcare program. This can save families thousands of dollars per year!',
      icon: <Trophy className="h-6 w-6" />,
      tip: 'CWELCC centers are highly sought after - definitely worth checking out'
    },
    {
      id: 'exclusive',
      title: 'Muso Exclusive Features ✨',
      description: 'Look for sparkle icons! These unique filters help you find centers with staff who speak your language and offer specific dietary accommodations - data you won\'t find anywhere else.',
      icon: <Sparkles className="h-6 w-6" />,
      tip: 'We manually collected this information to help families find the perfect cultural fit'
    },
    {
      id: 'map',
      title: 'Interactive Map',
      description: 'Switch between Map and List views using the toggle in the top bar. The map shows all centers matching your current filters. Click any marker to see detailed information and contact details.',
      icon: <MapPin className="h-6 w-6" />,
      action: 'Try switching between Map and List views, then click a marker!'
    },
    {
      id: 'ready',
      title: 'You\'re Ready! 🎉',
      description: 'Start by selecting your preferred filters, explore the map, and save centers you like. Remember - many centers have more availability than their websites show, so call directly!',
      icon: <Search className="h-6 w-6" />,
      tip: 'Pro tip: Visit centers in person when possible - it makes a huge difference!'
    }
  ];

  const currentStepData = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 150);
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
      }, 150);
    }
  };

  // Auto-advance welcome step
  useEffect(() => {
    if (currentStepData.id === 'welcome') {
      const timer = setTimeout(() => {
        if (isVisible) {
          nextStep();
        }
      }, 3500);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Simple backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]" />

      {/* Centered modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div className={`w-full max-w-lg transition-all duration-200 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white relative overflow-hidden">
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
                  onClick={onSkip}
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
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={onSkip}
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
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <span>{currentStep === steps.length - 1 ? 'Start Exploring!' : 'Next'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-advance indicator */}
      {currentStepData.id === 'welcome' && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[10001]">
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