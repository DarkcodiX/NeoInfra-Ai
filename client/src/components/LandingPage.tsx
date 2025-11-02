import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Home, Maximize, Armchair, Grid3X3, Box, Ruler, ChevronRight, Palette, Download, Users, Sparkles, Clock, Shield } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Apply the exact same animation classes from hero section
            const children = entry.target.querySelectorAll('.stagger-item');
            children.forEach((child, index) => {
              // Remove initial hidden state
              child.classList.remove('stagger-item');
              
              // Apply hero-style animation classes with longer delays
              const delay = 0.3 + (index * 0.25);
              child.style.animation = `slideUp 0.8s ease-out ${delay}s both`;
            });
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const element = ref.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return ref;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const featuresRef = useScrollAnimation();
  const benefitsRef = useScrollAnimation();
  const howItWorksRef = useScrollAnimation();
  const statsRef = useScrollAnimation();
  const whoItsForRef = useScrollAnimation();
  const ctaRef = useScrollAnimation();

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        .scroll-section {
          opacity: 1;
        }
        .stagger-item {
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out 0.2s both;
        }
        .animate-slide-up-delay {
          animation: slideUp 0.8s ease-out 0.4s both;
        }
        .animate-slide-up-delay-2 {
          animation: slideUp 0.8s ease-out 0.6s both;
        }
        .animate-slide-up-delay-3 {
          animation: slideUp 0.8s ease-out 0.8s both;
        }
      `}</style>

      <nav className="fixed top-0 w-full bg-transparent backdrop-blur-md z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}>
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-white drop-shadow-lg">NeoInfra AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white drop-shadow-lg hover:opacity-80 transition-opacity">Features</a>
              <a href="#benefits" className="text-white drop-shadow-lg hover:opacity-80 transition-opacity">Benefits</a>
              <a href="#how-it-works" className="text-white drop-shadow-lg hover:opacity-80 transition-opacity">How It Works</a>
              <Button 
                onClick={onGetStarted}
                className="text-white px-6 shadow-lg border-0"
                style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section 
        className="relative min-h-screen flex items-center justify-center pt-20"
        style={{
          backgroundImage: 'url(/hero-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl animate-slide-up">
              Get a Designer<br />Space You'll Love
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg animate-slide-up-delay">
              Transform your vision into reality with professional floor planning tools. 
              Design, visualize, and create stunning spaces in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-up-delay-2">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="text-white px-10 py-7 text-lg h-auto shadow-2xl hover:shadow-3xl transition-all border-0"
                style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}
              >
                Start My Transformation
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/90 animate-slide-up-delay-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="drop-shadow">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="drop-shadow">Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="drop-shadow">Start in seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" ref={featuresRef} className="py-24 bg-white scroll-mt-20 scroll-section">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600">
              Professional design tools that make creating your dream space simple and intuitive
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="stagger-item border border-stone-200 hover:shadow-lg transition-all duration-300 group" style={{ borderColor: 'rgba(209, 195, 152, 0.3)' }}>
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.2) 0%, rgba(184, 168, 115, 0.2) 100%)' }}>
                  <Grid3X3 className="w-7 h-7" style={{ color: '#B8A873' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">2D Floor Plans</h3>
                <p className="text-gray-600 leading-relaxed">
                  Draw precise layouts with intuitive drag-and-drop tools. Snap to grid for perfect alignment and professional results.
                </p>
              </CardContent>
            </Card>
            
            <Card className="stagger-item border border-stone-200 hover:shadow-lg transition-all duration-300 group" style={{ borderColor: 'rgba(209, 195, 152, 0.3)' }}>
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.2) 0%, rgba(184, 168, 115, 0.2) 100%)' }}>
                  <Box className="w-7 h-7" style={{ color: '#B8A873' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">3D Visualization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience your design in realistic 3D. Walk through your space and see every detail before building.
                </p>
              </CardContent>
            </Card>
            
            <Card className="stagger-item border border-stone-200 hover:shadow-lg transition-all duration-300 group" style={{ borderColor: 'rgba(209, 195, 152, 0.3)' }}>
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.2) 0%, rgba(184, 168, 115, 0.2) 100%)' }}>
                  <Armchair className="w-7 h-7" style={{ color: '#B8A873' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Furniture Library</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access an extensive collection of furniture and fixtures. Place items with accurate dimensions and styling.
                </p>
              </CardContent>
            </Card>
            
            <Card className="stagger-item border border-stone-200 hover:shadow-lg transition-all duration-300 group" style={{ borderColor: 'rgba(209, 195, 152, 0.3)' }}>
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.2) 0%, rgba(184, 168, 115, 0.2) 100%)' }}>
                  <Ruler className="w-7 h-7" style={{ color: '#B8A873' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Precise Measurements</h3>
                <p className="text-gray-600 leading-relaxed">
                  Measure distances and calculate areas with accuracy. Get exact dimensions for construction and planning.
                </p>
              </CardContent>
            </Card>
            
            <Card className="stagger-item border border-stone-200 hover:shadow-lg transition-all duration-300 group" style={{ borderColor: 'rgba(209, 195, 152, 0.3)' }}>
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.2) 0%, rgba(184, 168, 115, 0.2) 100%)' }}>
                  <Palette className="w-7 h-7" style={{ color: '#B8A873' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Custom Styling</h3>
                <p className="text-gray-600 leading-relaxed">
                  Personalize colors, materials, and finishes. Create a unique design that reflects your style and preferences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="stagger-item border border-stone-200 hover:shadow-lg transition-all duration-300 group" style={{ borderColor: 'rgba(209, 195, 152, 0.3)' }}>
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.2) 0%, rgba(184, 168, 115, 0.2) 100%)' }}>
                  <Download className="w-7 h-7" style={{ color: '#B8A873' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Export & Share</h3>
                <p className="text-gray-600 leading-relaxed">
                  Download your designs in multiple formats. Share your vision with contractors, designers, or family.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="benefits" ref={benefitsRef} className="py-24 scroll-mt-20 scroll-section" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.1) 0%, rgba(184, 168, 115, 0.05) 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600">
              The most powerful and easy-to-use floor planning solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="stagger-item text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg">
                <Clock className="w-8 h-8" style={{ color: '#D1C398' }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Save Time</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Create professional designs in minutes, not hours. Streamlined workflow gets results fast.
              </p>
            </div>

            <div className="stagger-item text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg">
                <Users className="w-8 h-8" style={{ color: '#B8A873' }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Easy Collaboration</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Share your designs and get feedback. Work together with family or professionals seamlessly.
              </p>
            </div>

            <div className="stagger-item text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8" style={{ color: '#D1C398' }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Professional Results</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Industry-standard tools deliver presentation-quality designs that impress clients and contractors.
              </p>
            </div>

            <div className="stagger-item text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg">
                <Shield className="w-8 h-8" style={{ color: '#B8A873' }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Secure & Private</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your designs are safe with us. Bank-level security ensures your projects stay private and protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" ref={howItWorksRef} className="py-24 bg-white scroll-mt-20 scroll-section">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple Process
            </h2>
            <p className="text-lg text-gray-600">
              Get started with your design in three easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="stagger-item text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-white text-3xl font-bold shadow-xl" style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}>
                1
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Draw Your Layout</h3>
              <p className="text-gray-600 leading-relaxed">
                Create rooms and define walls with simple drag-and-drop tools. Adjust dimensions to match your exact space requirements.
              </p>
            </div>
            
            <div className="stagger-item text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-white text-3xl font-bold shadow-xl" style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}>
                2
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Add Furniture</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse our extensive furniture library and place items exactly where you want them. Customize colors and finishes to your taste.
              </p>
            </div>
            
            <div className="stagger-item text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-white text-3xl font-bold shadow-xl" style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}>
                3
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Visualize in 3D</h3>
              <p className="text-gray-600 leading-relaxed">
                Switch to 3D view and walk through your design. Experience your space before making any commitments or purchases.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="py-24 text-white scroll-section" style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">
            <div className="stagger-item space-y-3">
              <div className="text-6xl md:text-7xl font-bold">50+</div>
              <div className="text-white/90 text-lg">Furniture Items</div>
              <p className="text-white/70 text-sm">Curated collection of premium furniture and fixtures</p>
            </div>
            <div className="stagger-item space-y-3">
              <div className="text-6xl md:text-7xl font-bold">Unlimited</div>
              <div className="text-white/90 text-lg">Design Possibilities</div>
              <p className="text-white/70 text-sm">Create as many unique floor plans as you want</p>
            </div>
            <div className="stagger-item space-y-3">
              <div className="text-6xl md:text-7xl font-bold">100%</div>
              <div className="text-white/90 text-lg">Free to Start</div>
              <p className="text-white/70 text-sm">No hidden fees, no credit card, no obligations</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={whoItsForRef} className="py-24 scroll-section" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.08) 0%, rgba(184, 168, 115, 0.05) 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-12 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Perfect for Everyone
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'rgba(209, 195, 152, 0.2)' }}>
                        <ChevronRight className="w-4 h-4" style={{ color: '#B8A873' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Homeowners</h4>
                        <p className="text-gray-600 text-sm">Plan renovations and visualize changes before you commit</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'rgba(209, 195, 152, 0.2)' }}>
                        <ChevronRight className="w-4 h-4" style={{ color: '#B8A873' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Interior Designers</h4>
                        <p className="text-gray-600 text-sm">Create professional presentations for your clients quickly</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'rgba(209, 195, 152, 0.2)' }}>
                        <ChevronRight className="w-4 h-4" style={{ color: '#B8A873' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Real Estate Agents</h4>
                        <p className="text-gray-600 text-sm">Show property potential with staged floor plans</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'rgba(209, 195, 152, 0.2)' }}>
                        <ChevronRight className="w-4 h-4" style={{ color: '#B8A873' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Contractors</h4>
                        <p className="text-gray-600 text-sm">Communicate project scope clearly with visual plans</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-12 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.2) 0%, rgba(184, 168, 115, 0.15) 100%)' }}>
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-xl" style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}>
                      <Home className="w-14 h-14 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Start Designing Today</h3>
                    <Button 
                      size="lg" 
                      onClick={onGetStarted}
                      className="text-white px-8 py-6 text-base h-auto shadow-lg border-0"
                      style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}
                    >
                      Create Your First Design
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" ref={ctaRef} className="py-24 bg-white scroll-mt-20 scroll-section">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join thousands of designers and homeowners creating beautiful spaces. 
              Start your journey today with our powerful design tools.
            </p>
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="text-white px-10 py-7 text-lg h-auto shadow-lg hover:shadow-xl transition-all border-0"
              style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}
            >
              Begin Your Transformation
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-gray-500 pt-2">
              No credit card required • Free forever • Start designing now
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}>
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">NeoInfra AI</span>
              </div>
              <p className="text-sm leading-relaxed">
                Professional design tools for creating beautiful spaces. Transform your vision into reality.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:opacity-80 transition-opacity" style={{ color: '#D1C398' }}>Features</a></li>
                <li><a href="#benefits" className="hover:opacity-80 transition-opacity" style={{ color: '#D1C398' }}>Benefits</a></li>
                <li><a href="#how-it-works" className="hover:opacity-80 transition-opacity" style={{ color: '#D1C398' }}>How It Works</a></li>
                <li><a href="#pricing" className="hover:opacity-80 transition-opacity" style={{ color: '#D1C398' }}>Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: '#D1C398' }}>About Us</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: '#D1C398' }}>Contact</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: '#D1C398' }}>Privacy Policy</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: '#D1C398' }}>Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: '#D1C398' }}>Help Center</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: '#D1C398' }}>Video Tutorials</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: '#D1C398' }}>Design Blog</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: '#D1C398' }}>Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center text-sm">
            <p>© 2024 NeoInfra AI. Design your dream home with professional-grade tools.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
