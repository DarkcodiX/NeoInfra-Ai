import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Home } from 'lucide-react';

interface AuthPageProps {
  onAuth: () => void;
  onBack: () => void;
}

export function AuthPage({ onAuth, onBack }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, rgba(209, 195, 152, 0.1) 0%, rgba(184, 168, 115, 0.05) 100%)' }}>
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
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block">
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 animate-slide-up">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}>
                <Home className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">NeoInfra AI</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight animate-slide-up-delay">
              Design Your Dream Home
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed animate-slide-up-delay-2">
              Create stunning floor plans with professional tools. Visualize your space in 3D, 
              add furniture, and bring your vision to life.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 animate-slide-up-delay-3">
              <div className="space-y-2">
                <div className="text-3xl font-bold" style={{ color: '#B8A873' }}>50+</div>
                <div className="text-sm text-gray-600">Furniture Items</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold" style={{ color: '#B8A873' }}>100%</div>
                <div className="text-sm text-gray-600">Free to Start</div>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur animate-slide-up-delay">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp
                ? 'Sign up to start designing your space'
                : 'Sign in to continue designing'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    className="h-11"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 text-white font-medium border-0"
                style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-900"
                onClick={onBack}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
