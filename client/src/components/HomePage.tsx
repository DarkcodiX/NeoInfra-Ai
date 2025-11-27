import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Home, Plus, FolderOpen, User, Sparkles, Grid3X3, Box, Palette } from 'lucide-react';

interface HomePageProps {
  onCreateNew: () => void;
  onViewProjects: () => void;
  onViewProfile: () => void;
}

export function HomePage({ onCreateNew, onViewProjects, onViewProfile }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <style>{`
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

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}>
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">NeoInfra AI</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-xl animate-slide-up" style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}>
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 animate-slide-up-delay">
              Welcome to NeoInfra AI
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up-delay-2">
              Your intelligent floor planning assistant. Create stunning designs with AI-powered tools.
            </p>
          </div>

          <div className="flex justify-center animate-slide-up-delay-3">
            <Card 
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-opacity-100 overflow-hidden max-w-md"
              style={{ borderColor: 'rgba(209, 195, 152, 0.3)' }}
              onClick={onCreateNew}
            >
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl group-hover:scale-110 transition-transform shadow-lg" style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}>
                  <Plus className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900">Create New Design</h3>
                  <p className="text-gray-600">
                    Start a fresh floor plan from scratch with our intuitive AI-powered design tools
                  </p>
                </div>
                <Button 
                  className="w-full text-white border-0 group-hover:shadow-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-12 border" style={{ borderColor: 'rgba(209, 195, 152, 0.2)' }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Features</h2>
              <p className="text-gray-600">Everything you need to create professional floor plans</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.2) 0%, rgba(184, 168, 115, 0.2) 100%)' }}>
                  <Grid3X3 className="w-8 h-8" style={{ color: '#B8A873' }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">2D Floor Plans</h3>
                <p className="text-sm text-gray-600">
                  Draw precise layouts with drag-and-drop tools
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.2) 0%, rgba(184, 168, 115, 0.2) 100%)' }}>
                  <Box className="w-8 h-8" style={{ color: '#B8A873' }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">3D Visualization</h3>
                <p className="text-sm text-gray-600">
                  Experience your design in realistic 3D
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.2) 0%, rgba(184, 168, 115, 0.2) 100%)' }}>
                  <Palette className="w-8 h-8" style={{ color: '#B8A873' }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Custom Styling</h3>
                <p className="text-sm text-gray-600">
                  Personalize colors, materials, and finishes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
