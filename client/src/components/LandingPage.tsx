import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Home, Maximize, Armchair, Grid3X3, Box, Ruler, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-stone-200 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">FLOOR PLANNER</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors">Pricing</a>
              <Button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-amber-50 to-orange-50 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(249,115,22,0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200">
              <span className="text-sm font-medium text-amber-800">Professional Design Tools</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
              Create Spaces<br />You'll Love
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Design beautiful floor plans with professional-grade tools. 
              Visualize your dream home in stunning 3D.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-6 text-lg h-auto shadow-lg hover:shadow-xl transition-all"
              >
                Start Your Transformation
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            
            <div className="pt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Start in seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white scroll-mt-20">
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
            <Card className="border border-stone-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Grid3X3 className="w-7 h-7 text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">2D Floor Plans</h3>
                <p className="text-gray-600 leading-relaxed">
                  Draw precise layouts with intuitive drag-and-drop tools. Snap to grid for perfect alignment and professional results.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-stone-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Box className="w-7 h-7 text-orange-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">3D Visualization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience your design in realistic 3D. Walk through your space and see every detail before building.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-stone-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Armchair className="w-7 h-7 text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Furniture Library</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access an extensive collection of furniture and fixtures. Place items with accurate dimensions and styling.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-stone-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Ruler className="w-7 h-7 text-orange-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Precise Measurements</h3>
                <p className="text-gray-600 leading-relaxed">
                  Measure distances and calculate areas with accuracy. Get exact dimensions for construction and planning.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-stone-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Maximize className="w-7 h-7 text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Custom Dimensions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Define exact room sizes and adjust layouts to fit your specific needs. Complete control over every measurement.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-stone-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Home className="w-7 h-7 text-orange-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Room Templates</h3>
                <p className="text-gray-600 leading-relaxed">
                  Start with professionally designed templates or create from scratch. Save and reuse your favorite layouts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/30 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple Process
            </h2>
            <p className="text-lg text-gray-600">
              Get started with your design in three easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl text-white text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Draw Your Layout</h3>
              <p className="text-gray-600 leading-relaxed">
                Create rooms and define walls with simple drag-and-drop tools. Adjust dimensions to match your space.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl text-white text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Add Furniture</h3>
              <p className="text-gray-600 leading-relaxed">
                Place furniture from our extensive library. Arrange and customize to create your perfect space.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl text-white text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Visualize in 3D</h3>
              <p className="text-gray-600 leading-relaxed">
                See your design come to life in stunning 3D. Walk through and refine until it's perfect.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-bold">50+</div>
              <div className="text-amber-100 text-lg">Furniture Items</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-bold">Unlimited</div>
              <div className="text-amber-100 text-lg">Design Possibilities</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-bold">100%</div>
              <div className="text-amber-100 text-lg">Free to Start</div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join designers and homeowners creating beautiful spaces. Start your transformation today.
            </p>
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-10 py-7 text-lg h-auto shadow-lg hover:shadow-xl transition-all"
            >
              Start My Transformation
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-gray-500 pt-2">
              No credit card required • Get started in seconds
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">FLOOR PLANNER</span>
              </div>
              <p className="text-sm leading-relaxed">
                Professional design tools for creating beautiful spaces.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-amber-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-amber-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center text-sm">
            <p>© 2024 Floor Planner. Design your dream home with professional tools.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
