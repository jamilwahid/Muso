import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, MapPin, Filter, Heart, Sparkles, Trophy } from 'lucide-react';
import { useFloating, autoUpdate, offset, flip, shift, arrow } from '@floating-ui/react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  icon: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  highlightClass?: string;
  waitForElement?: boolean;
}

interface OnboardingTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isVisible,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [isWaitingForElement, setIsWaitingForElement] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  const steps: TourStep[] = [
    {
      id: 'filter-bar',
      title: 'Smart Filters',
      description: 'Use filters above to find centers that match your needs — CWELCC, age groups, languages, and more.',
      target: '[data-onboarding="filter-bar"]',
      icon: <Filter className="h-5 w-5" />,
      placement: 'bottom',
      highlightClass: 'ring-4 ring-indigo-300 ring-opacity-75',
      waitForElement: true
    },
    {
      id: 'map-area',
      title: 'Interactive Map',
      description: 'Explore centers by moving around the map. Zoom in to see more detail and discover centers in your preferred areas.',
      target: '[data-onboarding="map-area"]',
      icon: <MapPin className="h-5 w-5" />,
      placement: 'top',
      highlightClass: 'ring-4 ring-purple-300 ring-opacity-75',
      waitForElement: true
    },
    {
      id: 'map-marker',
      title: 'Center Details',
      description: 'Click any marker to view detailed info about that daycare, including contact information and special features.',
      target: '[data-onboarding="map-marker"]',
      icon: <MapPin className="h-5 w-5" />,
      placement: 'left',
      highlightClass: 'ring-4 ring-amber-300 ring-opacity-75',
      waitForElement: true
    },
    {
      id: 'save-button',
      title: 'Save to My List',
      description: 'Tap the bookmark to save centers to your list and compare them later. Build your shortlist of favorites!',
      target: '[data-onboarding="save-button"]',
      icon: <Heart className="h-5 w-5" />,
      placement: 'top',
      highlightClass: 'ring-4 ring-pink-300 ring-opacity-75',
      waitForElement: true
    }
  ];

  const currentStepData = steps[currentStep];

  const { refs, floatingStyles, context } = useFloating({
    elements: {
      reference: targetElement,
    },
    placement: currentStepData?.placement || 'bottom',
    middleware: [
      offset(16),
      flip(),
      shift({ padding: 16 }),
      arrow({ element: arrowRef })
    ],
    whileElementsMounted: autoUpdate,
  });

  // Enhanced element finder with retry logic
  const findTargetElement = (selector: string, maxRetries = 10): Promise<HTMLElement | null> => {
    return new Promise((resolve) => {
      let attempts = 0;
      
      const tryFind = () => {
        const element = document.querySelector(selector) as HTMLElement;
        
        if (element) {
          console.log(`✅ Found element for selector: ${selector}`, element);
          resolve(element);
          return;
        }
        
        attempts++;
        console.log(`⏳ Attempt ${attempts}/${maxRetries} - Element not found: ${selector}`);
        
        if (attempts >= maxRetries) {
          console.warn(`❌ Failed to find element after ${maxRetries} attempts: ${selector}`);
          resolve(null);
          return;
        }
        
        // Try again after a delay
        setTimeout(tryFind, 200);
      };
      
      tryFind();
    });
  };

  // Find and highlight target element
  useEffect(() => {
    if (!isVisible || !currentStepData) return;

    const setupStep = async () => {
      setIsWaitingForElement(true);
      
      // Clear any existing highlights
      document.querySelectorAll('[data-onboarding]').forEach(el => {
        steps.forEach(step => {
          if (step.highlightClass) {
            el.classList.remove(...step.highlightClass.split(' '));
          }
        });
      });

      console.log(`🎯 Setting up step: ${currentStepData.id}, target: ${currentStepData.target}`);
      
      // Find the target element
      const element = await findTargetElement(currentStepData.target);
      
      if (element) {
        setTargetElement(element);
        
        // Add highlight class
        if (currentStepData.highlightClass) {
          element.classList.add(...currentStepData.highlightClass.split(' '));
          console.log(`✨ Added highlight to element:`, element);
        }
        
        // Scroll into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
        
        setIsWaitingForElement(false);
      } else {
        console.error(`❌ Could not find target element: ${currentStepData.target}`);
        setIsWaitingForElement(false);
        // Still allow the tour to continue, just without highlighting
        setTargetElement(null);
      }
    };

    setupStep();

    // Cleanup function
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [currentStep, isVisible, currentStepData]);

  // Cleanup highlights when component unmounts or tour ends
  useEffect(() => {
    return () => {
      document.querySelectorAll('[data-onboarding]').forEach(el => {
        steps.forEach(step => {
          if (step.highlightClass) {
            el.classList.remove(...step.highlightClass.split(' '));
          }
        });
      });
    };
  }, []);

  const nextStep = () => {
    // Remove highlight from current element
    if (targetElement && currentStepData?.highlightClass) {
      targetElement.classList.remove(...currentStepData.highlightClass.split(' '));
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    // Remove highlight from current element
    if (targetElement && currentStepData?.highlightClass) {
      targetElement.classList.remove(...currentStepData.highlightClass.split(' '));
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Remove highlight from current element
    if (targetElement && currentStepData?.highlightClass) {
      targetElement.classList.remove(...currentStepData.highlightClass.split(' '));
    }
    onSkip();
  };

  const handleComplete = () => {
    // Remove highlight from current element
    if (targetElement && currentStepData?.highlightClass) {
      targetElement.classList.remove(...currentStepData.highlightClass.split(' '));
    }
    onComplete();
  };

  if (!isVisible || !currentStepData) return null;

  // Show loading state while waiting for element
  if (isWaitingForElement) {
    return (
      <>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" />
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="text-slate-700">Finding elements...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If no target element found, show centered modal
  if (!targetElement) {
    return (
      <>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" />
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    {currentStepData.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{currentStepData.title}</h3>
                    <div className="text-sm opacity-90">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-white/70 hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded-lg"
                  title="Skip tour"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-slate-700 leading-relaxed text-sm mb-4">
                {currentStepData.description}
              </p>

              {/* Warning about missing element */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="text-amber-600">⚠️</div>
                  <div className="text-sm text-amber-700">
                    This feature might not be visible yet. Continue to explore other features!
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Progress</span>
                  <span>{currentStep + 1}/{steps.length}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSkip}
                  className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors duration-200 px-2 py-1 hover:bg-slate-100 rounded-lg"
                >
                  Skip
                </button>
                
                <div className="flex items-center space-x-2">
                  {currentStep > 0 && (
                    <button
                      onClick={prevStep}
                      className="flex items-center space-x-1 px-3 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium transition-all duration-200 hover:bg-slate-100 rounded-lg"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      <span>Back</span>
                    </button>
                  )}
                  
                  <button
                    onClick={currentStep === steps.length - 1 ? handleComplete : nextStep}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-1 text-sm"
                  >
                    <span>{currentStep === steps.length - 1 ? 'Got it!' : 'Next'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" />

      {/* Floating tooltip */}
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className="z-[9999] max-w-sm"
      >
        <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  {currentStepData.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{currentStepData.title}</h3>
                  <div className="text-sm opacity-90">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="text-white/70 hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded-lg"
                title="Skip tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-slate-700 leading-relaxed text-sm mb-4">
              {currentStepData.description}
            </p>

            {/* Progress indicator */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Progress</span>
                <span>{currentStep + 1}/{steps.length}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors duration-200 px-2 py-1 hover:bg-slate-100 rounded-lg"
              >
                Skip
              </button>
              
              <div className="flex items-center space-x-2">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center space-x-1 px-3 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium transition-all duration-200 hover:bg-slate-100 rounded-lg"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back</span>
                  </button>
                )}
                
                <button
                  onClick={currentStep === steps.length - 1 ? handleComplete : nextStep}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-1 text-sm"
                >
                  <span>{currentStep === steps.length - 1 ? 'Got it!' : 'Next'}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div
            ref={arrowRef}
            className="absolute w-3 h-3 bg-white rotate-45 border border-white/30"
            style={{
              left: context.middlewareData.arrow?.x,
              top: context.middlewareData.arrow?.y,
            }}
          />
        </div>
      </div>
    </>
  );
};