import React, { useState } from 'react';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useFloorPlan } from '../lib/stores/useFloorPlan';

export function AIComposer() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const { setCurrentPlan } = useFloorPlan();

  const examplePrompts = [
    "Create a modern 2-bedroom apartment with open kitchen and living room",
    "Design a cozy studio apartment with a sleeping area and workspace",
    "Generate a 3-bedroom house with master bedroom, kids room, and guest room",
    "Create a luxury penthouse with spacious living area and balcony access"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-floor-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate floor plan');
      }

      const floorPlan = await response.json();
      setCurrentPlan(floorPlan);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5" style={{ color: '#B8A873' }} />
          AI Floor Plan Composer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Describe your dream space
          </label>
          <Textarea
            placeholder="E.g., Create a modern 2-bedroom apartment with an open kitchen, spacious living room, and a balcony..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="resize-none"
            disabled={isGenerating}
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full text-white"
          style={{ background: 'linear-gradient(135deg, #D1C398 0%, #B8A873 100%)' }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Floor Plan
            </>
          )}
        </Button>

        <div className="space-y-2">
          <p className="text-xs text-gray-500">Try these examples:</p>
          <div className="space-y-1">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                disabled={isGenerating}
                className="text-xs text-left w-full p-2 rounded hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
              >
                • {example}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
