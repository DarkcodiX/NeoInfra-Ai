import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Home, Maximize, Armchair, DollarSign, Grid3X3, Box } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4">
              <Home className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Design Your Dream Home
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create beautiful floor plans and visualize your space in stunning 3D. 
            Professional home design tools made simple and accessible for everyone.
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
            >
              Get Started for Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={onGetStarted}
              className="text-lg px-8 py-6"
            >
              View Templates
            </Button>
          </div>
          
          <p className="text-sm text-gray-500">
            No credit card required • Start designing in seconds
          </p>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Design Your Space
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Grid3X3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2D Floor Plans</h3>
              <p className="text-gray-600">
                Draw rooms, walls, and layouts with intuitive drag-and-drop tools. 
                Snap to grid for precision.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3D Visualization</h3>
              <p className="text-gray-600">
                See your design come to life in realistic 3D. Walk through your space 
                before you build.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:border-green-200 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Armchair className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Furniture Library</h3>
              <p className="text-gray-600">
                Access 50+ furniture items from sofas to appliances. Place and arrange 
                with real dimensions.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:border-orange-200 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Maximize className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Measurement Tools</h3>
              <p className="text-gray-600">
                Measure distances and areas accurately. Get precise dimensions 
                for your space.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:border-pink-200 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Shopping List</h3>
              <p className="text-gray-600">
                Generate shopping lists with cost estimates. Know your budget 
                before you shop.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:border-cyan-200 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Room Templates</h3>
              <p className="text-gray-600">
                Start with pre-designed templates or create from scratch. 
                Save and reuse your designs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Furniture Items</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-blue-100">Design Possibilities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Free to Start</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Design Your Space?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of homeowners and professionals creating beautiful spaces.
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
          >
            Start Designing Now
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 Floor Planner. Design your dream home with ease.
          </p>
        </div>
      </footer>
    </div>
  );
}
