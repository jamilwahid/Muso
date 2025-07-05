import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowDown, MapPin, Filter, Sparkles, Trophy, DollarSign } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: React.ReactNode;
  highlight?: boolean;
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
      description: 'Your sidekick in the childcare hunt. Let\'s take a quick tour to help you find the perfect daycare for your family.',
      position: 'center',
      icon: <Sparkles className="h-6 w-6" />
    },
    {
      id: 'filters-intro',
      title: 'Smart Filtering System',
      description: 'Use these filters to narrow down centers based on your specific needs. Each filter shows how many centers match your criteria.',
      targetElement: 'filter-bar',
      position: 'bottom',
      icon: <Filter className="h-6 w-6" />,
      highlight: true
    },
    {
      id: 'cwelcc-filter',
      title: 'CWELCC Program',
      description: 'Find centers participating in Canada-Wide Early Learning & Child Care for reduced fees.',
      targetElement: 'cwelcc-filter',
      position: 'bottom',
      icon: <Trophy className="h-6 w-6" />
    },
    {
      id: 'subsidy-filter',
      title: 'Subsidy Available',
      description: 'Filter for centers that accept fee subsidies to help with childcare costs.',
      targetElement: 'subsidy-filter',
      position: 'bottom',
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      id: 'exclusive-features',
      title: 'Muso Exclusive Features ✨',
      description: 'Look for the sparkle icon! These unique filters help you find centers with specific languages and dietary services.',
      targetElement: 'exclusive-filters',
      position: 'bottom',
      icon: <Sparkles className="h-6 w-6" />
    },
    {
      id: 'map-interaction',
      title: 'Interactive Map',
      description: 'Click any marker to view detailed information about that center. The map shows all centers matching your current filters.',
      targetElement: 'map-container',
      position: 'top',
      icon: <MapPin className="h-6 w-6" />
    },
    {
      id: 'ready',
      title: 'You\'re All Set! 🎉',
      description: 'Start exploring childcare centers in Toronto. Remember, you can always adjust your filters to see different results.',
      position: 'center',
      icon: <Sparkles className="h-6 w-6" />
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

    const tooltipWidth = 400;
    const tooltipHeight = 200;
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

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300" />

      {/* Highlight overlay for targeted elements */}
      {targetPosition && currentStepData.highlight && (
        <div
          className="absolute bg-white/10 border-4 border-indigo-400 rounded-2xl animate-pulse z-50"
          style={{
            top: targetPosition.top - 8,
            left: targetPosition.left - 8,
            width: targetPosition.width + 16,
            height: targetPosition.height + 16,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        />
      )}

      {/* Spotlight effect for targeted elements */}
      {targetPosition && !currentStepData.highlight && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            top: targetPosition.top - 20,
            left: targetPosition.left - 20,
            width: targetPosition.width + 40,
            height: targetPosition.height + 40,
            background: 'radial-gradient(circle, transparent 50%, rgba(0, 0, 0, 0.7) 70%)',
            borderRadius: '50%'
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className={`w-96 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        style={getTooltipStyle()}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  {currentStepData.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{currentStepData.title}</h3>
                  <div className="text-sm opacity-90">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                </div>
              </div>
              <button
                onClick={skipTour}
                className="text-white/70 hover:text-white transition-colors duration-200 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-slate-700 leading-relaxed mb-6">
              {currentStepData.description}
            </p>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={skipTour}
                className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors duration-200"
              >
                Skip tour
              </button>
              
              <div className="flex items-center space-x-3">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors duration-200"
                  >
                    Back
                  </button>
                )}
                
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
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
              currentStepData.position === 'bottom' ? 'border-l-4 border-r-4 border-b-4 border-transparent border-b-white' :
              currentStepData.position === 'top' ? 'border-l-4 border-r-4 border-t-4 border-transparent border-t-white' :
              currentStepData.position === 'right' ? 'border-t-4 border-b-4 border-r-4 border-transparent border-r-white' :
              'border-t-4 border-b-4 border-l-4 border-transparent border-l-white'
            }`} />
          </div>
        )}
      </div>
    </>
  );
};