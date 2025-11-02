import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBEMVre1K_v3Gkuyff1fSdHWYs8ngpJn8c";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateFloorPlan(prompt: string) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
  });

  const systemPrompt = `You are an expert floor plan designer. Generate a valid JSON floor plan based on user requirements.

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations, no code blocks.

The JSON structure must be:
{
  "name": "Floor Plan Name",
  "rooms": [
    {
      "name": "Room Name",
      "points": [{"x": 0, "y": 0}, {"x": 5, "y": 0}, {"x": 5, "y": 4}, {"x": 0, "y": 4}],
      "color": "#hex",
      "floorTexture": "wood/tile/carpet",
      "wallColor": "#hex",
      "dimensions": {"width": 5, "height": 4}
    }
  ],
  "walls": [],
  "furniture": [
    {
      "type": "bed-double/sofa-modern/dining-table/etc",
      "name": "Furniture Name",
      "position": {"x": 2.5, "y": 2},
      "rotation": 0,
      "scale": {"x": 1, "y": 1}
    }
  ]
}

Rules:
- Use meters for dimensions (typical room: 3-6m)
- Points must form closed polygons (clockwise)
- Available furniture IDs: sofa-1, sofa-2, chair-1, chair-2, armchair-1, bench-1, dining-table-1, dining-table-2, coffee-table-1, coffee-table-2, desk-1, desk-2, side-table-1, bed-1, bed-2, bed-3, wardrobe-1, wardrobe-2, nightstand-1, dresser-1, fridge-1, fridge-2, stove-1, counter-1, island-1, dishwasher-1, microwave-1, bathtub-1, shower-1, toilet-1, sink-1, vanity-1, bookshelf-1, cabinet-1, shelf-1, drawer-1, plant-1, lamp-1, rug-1, mirror-1, tv-1
- Use "type" field with furniture IDs above
- Colors in hex format
- Position furniture logically within rooms
- Rotation in degrees (0-360)
- Make designs realistic and functional

User Request: ${prompt}`;

  console.log("Using API Key:", API_KEY ? `${API_KEY.substring(0, 10)}...` : "MISSING");
  console.log("Model:", "gemini-pro");
  
  try {
    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    let text = response.text();
    
    // Clean up response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const floorPlanData = JSON.parse(text);
    
    // Add required fields
    return {
      id: Math.random().toString(36).substring(2, 11),
      name: floorPlanData.name || "AI Generated Design",
      rooms: floorPlanData.rooms.map((room: any) => ({
        id: Math.random().toString(36).substring(2, 11),
        ...room
      })),
      walls: floorPlanData.walls || [],
      furniture: floorPlanData.furniture.map((item: any) => ({
        id: Math.random().toString(36).substring(2, 11),
        color: "#8B4513",
        ...item
      })),
      scale: 1,
      gridSize: 0.5,
      created: new Date(),
      modified: new Date()
    };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    throw new Error(`Failed to generate floor plan: ${error.message}`);
  }
}
