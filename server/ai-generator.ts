import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBEMVre1K_v3Gkuyff1fSdHWYs8ngpJn8c";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateFloorPlan(prompt: string) {
  console.log("Using API Key:", API_KEY ? `${API_KEY.substring(0, 10)}...` : "MISSING");
  console.log("Generating AI floor plan...");
  
  try {
    // Try AI generation first
    const aiPlan = await generateWithAI(prompt);
    
    // Validate and fix the AI plan
    const validatedPlan = validateAndFixPlan(aiPlan, prompt);
    
    return {
      id: Math.random().toString(36).substring(2, 11),
      name: validatedPlan.name,
      rooms: validatedPlan.rooms.map((room: any) => ({
        id: Math.random().toString(36).substring(2, 11),
        ...room
      })),
      walls: [],
      furniture: validatedPlan.furniture.map((item: any) => ({
        id: Math.random().toString(36).substring(2, 11),
        ...item
      })),
      scale: 1,
      gridSize: 0.5,
      created: new Date(),
      modified: new Date()
    };

  } catch (error: any) {
    console.error("AI Generation Error, using fallback:", error);
    // Fallback to perfect template if AI fails
    const fallbackPlan = generatePerfectLayout(prompt);
    
    return {
      id: Math.random().toString(36).substring(2, 11),
      name: fallbackPlan.name,
      rooms: fallbackPlan.rooms.map((room: any) => ({
        id: Math.random().toString(36).substring(2, 11),
        ...room
      })),
      walls: [],
      furniture: fallbackPlan.furniture.map((item: any) => ({
        id: Math.random().toString(36).substring(2, 11),
        ...item
      })),
      scale: 1,
      gridSize: 0.5,
      created: new Date(),
      modified: new Date()
    };
  }
}

// AI Generation with smart prompting
async function generateWithAI(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const systemPrompt = `You are a professional architect and interior designer. Generate a realistic, modern floor plan with PERFECT room positioning.

CRITICAL RULES:
1. Return ONLY valid JSON (no markdown, no code blocks, no explanations)
2. Calculate exact room positions so they NEVER overlap
3. Leave 1.0 meter gap between all rooms
4. Position rooms in a clean grid or L-shape layout

JSON FORMAT:
{
  "name": "Floor Plan Name",
  "rooms": [
    {
      "name": "Living Room",
      "points": [{"x": 0, "y": 0}, {"x": 7, "y": 0}, {"x": 7, "y": 6}, {"x": 0, "y": 6}],
      "color": "#F5F5DC",
      "floorTexture": "wood",
      "wallColor": "#FFFFFF",
      "dimensions": {"width": 7, "height": 6}
    }
  ],
  "walls": [],
  "furniture": [
    {
      "type": "sofa-1",
      "name": "Modern Sofa",
      "position": {"x": 3.5, "y": 2},
      "rotation": 0,
      "scale": {"x": 1, "y": 1},
      "color": "#4A5568"
    }
  ]
}

ROOM POSITIONING EXAMPLES:

For 2 rooms (side by side):
Room 1: x: 0-7, y: 0-6
Room 2: x: 8-12, y: 0-4  (1m gap at x=7 to x=8)

For 3 rooms (L-shape):
Room 1: x: 0-7, y: 0-6
Room 2: x: 8-12, y: 0-4  (1m gap)
Room 3: x: 0-5, y: 7-11  (1m gap)

For 4 rooms (2x2 grid):
Room 1: x: 0-6, y: 0-5
Room 2: x: 7-11, y: 0-4  (1m gap)
Room 3: x: 0-5, y: 6-10  (1m gap)
Room 4: x: 6-9, y: 6-9   (1m gap)

ROOM SIZES (width x height in meters):
- Living Room: 7x6m
- Master Bedroom: 5x4.5m
- Bedroom: 4x4m
- Kitchen: 4.5x3.5m
- Dining Room: 4.5x4m
- Bathroom: 2.5x2.5m
- Home Office: 3.5x3m

ROOM COLORS & MATERIALS:
Living Room: #F5F5DC floor, wood, #FFFFFF walls
Master Bedroom: #F8F9FA floor, carpet, #ECF0F1 walls
Bedroom: #F8F9FA floor, carpet, #FFFFFF walls
Kitchen: #FFFFFF floor, tile, #F8F9FA walls
Dining Room: #F5F5DC floor, wood, #FFFFFF walls
Bathroom: #F8F9FA floor, tile, #FFFFFF walls
Home Office: #F5F5DC floor, wood, #E8F4FD walls

FURNITURE BY ROOM:
Living Room: sofa-1, coffee-table-1, tv-1, rug-1, plant-1, lamp-1
Master Bedroom: bed-2, nightstand-1 (x2), wardrobe-2, rug-1, lamp-1
Bedroom: bed-1, nightstand-1, wardrobe-1, rug-1
Kitchen: fridge-1, counter-1, stove-1, island-1
Dining Room: dining-table-1, chair-2 (x4-6), rug-1
Bathroom: toilet-1, sink-1, shower-1
Home Office: desk-1, chair-1, bookshelf-1, lamp-1

FURNITURE POSITIONING:
- Calculate furniture position INSIDE room bounds
- For room at x: 0-7, y: 0-6, place furniture between x: 0.5-6.5, y: 0.5-5.5
- Beds/sofas: against back wall (y = room.minY + 1.5)
- TVs: opposite wall (y = room.maxY - 0.8)
- Tables: center of room
- Wardrobes: side walls

FURNITURE COLORS:
Sofas/Beds: #2C3E50, #4A5568, #6B7280
Wood furniture: #8B4513, #A0522D, #654321
Chairs: #34495E, #4A5568
Appliances: #F8F9FA, #FFFFFF
Rugs: #C0392B, #7F8C8D, #95A5A6
Plants: #27AE60

User Request: ${prompt}

IMPORTANT: Calculate exact x,y coordinates for each room so they DON'T overlap. Use the positioning examples above!`;

  const result = await model.generateContent(systemPrompt);
  const response = result.response;
  let text = response.text();
  
  // Clean up response
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  return JSON.parse(text);
}

// Validate and fix AI-generated plan - trust Gemini's layout!
function validateAndFixPlan(aiPlan: any, prompt: string) {
  try {
    // Trust Gemini's room positioning - only validate structure
    if (aiPlan.rooms && aiPlan.rooms.length > 0) {
      console.log("Using Gemini's layout directly");
      
      return {
        name: aiPlan.name || `AI Generated ${prompt.split(' ').slice(0, 3).join(' ')}`,
        rooms: aiPlan.rooms.map((room: any) => ({
          ...room,
          // Ensure points array exists
          points: room.points || [
            { x: 0, y: 0 },
            { x: room.dimensions?.width || 5, y: 0 },
            { x: room.dimensions?.width || 5, y: room.dimensions?.height || 4 },
            { x: 0, y: room.dimensions?.height || 4 }
          ]
        })),
        furniture: (aiPlan.furniture || []).map((item: any) => ({
          ...item,
          // Trust Gemini's furniture positioning
          position: item.position || { x: 0, y: 0 },
          rotation: item.rotation || 0,
          scale: item.scale || { x: 1, y: 1 }
        }))
      };
    }
  } catch (error) {
    console.log("AI plan validation failed, using template:", error);
  }
  
  // Fallback to template if validation fails
  return generatePerfectLayout(prompt);
}

// Generate perfect layout without AI
function generatePerfectLayout(prompt: string) {
  // Determine layout type from prompt
  const isApartment = prompt.toLowerCase().includes('apartment') || prompt.toLowerCase().includes('studio');
  
  if (isApartment) {
    return generateApartmentLayout();
  } else {
    return generateHouseLayout();
  }
}

function generateApartmentLayout() {
  return {
    name: "Modern Luxury Apartment",
    rooms: [
      {
        name: "Living Room",
        points: [
          { x: 0, y: 0 },
          { x: 6.5, y: 0 },
          { x: 6.5, y: 5.5 },
          { x: 0, y: 5.5 }
        ],
        color: "#F5F5DC",
        floorTexture: "wood",
        wallColor: "#FFFFFF",
        dimensions: { width: 6.5, height: 5.5 }
      },
      {
        name: "Kitchen",
        points: [
          { x: 6.8, y: 0 },
          { x: 10.8, y: 0 },
          { x: 10.8, y: 3.5 },
          { x: 6.8, y: 3.5 }
        ],
        color: "#FFFFFF",
        floorTexture: "tile",
        wallColor: "#F8F9FA",
        dimensions: { width: 4, height: 3.5 }
      },
      {
        name: "Bedroom",
        points: [
          { x: 0, y: 5.8 },
          { x: 5, y: 5.8 },
          { x: 5, y: 10 },
          { x: 0, y: 10 }
        ],
        color: "#F8F9FA",
        floorTexture: "carpet",
        wallColor: "#ECF0F1",
        dimensions: { width: 5, height: 4.2 }
      },
      {
        name: "Bathroom",
        points: [
          { x: 5.3, y: 5.8 },
          { x: 7.8, y: 5.8 },
          { x: 7.8, y: 8 },
          { x: 5.3, y: 8 }
        ],
        color: "#FFFFFF",
        floorTexture: "tile",
        wallColor: "#FFFFFF",
        dimensions: { width: 2.5, height: 2.2 }
      }
    ],
    furniture: [
      // Living Room - Modern & Stylish
      { type: "sofa-1", name: "Designer Sectional", position: { x: 3.2, y: 1.5 }, rotation: 0, scale: { x: 1.2, y: 1 }, color: "#4A5568" },
      { type: "coffee-table-1", name: "Glass Coffee Table", position: { x: 3.2, y: 3 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8B4513" },
      { type: "tv-1", name: "Entertainment Center", position: { x: 3.2, y: 5 }, rotation: 180, scale: { x: 1.2, y: 1 }, color: "#2C3E50" },
      { type: "rug-1", name: "Persian Rug", position: { x: 3.2, y: 2.8 }, rotation: 0, scale: { x: 2, y: 1.5 }, color: "#C0392B" },
      { type: "plant-1", name: "Fiddle Leaf Fig", position: { x: 0.6, y: 5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#27AE60" },
      { type: "lamp-1", name: "Floor Lamp", position: { x: 5.8, y: 1 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#2C3E50" },
      
      // Kitchen - Professional Grade
      { type: "fridge-1", name: "French Door Fridge", position: { x: 7.2, y: 0.6 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#F8F9FA" },
      { type: "counter-1", name: "Granite Counter", position: { x: 8.8, y: 0.6 }, rotation: 0, scale: { x: 1.2, y: 1 }, color: "#34495E" },
      { type: "stove-1", name: "Gas Range", position: { x: 10.2, y: 0.6 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#2C3E50" },
      { type: "island-1", name: "Kitchen Island", position: { x: 8.8, y: 2.2 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8B4513" },
      
      // Bedroom - Cozy & Elegant
      { type: "bed-1", name: "Queen Platform Bed", position: { x: 2.5, y: 6.8 }, rotation: 0, scale: { x: 1.1, y: 1 }, color: "#2C3E50" },
      { type: "nightstand-1", name: "Nightstand", position: { x: 4, y: 6.8 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8B4513" },
      { type: "wardrobe-1", name: "Built-in Wardrobe", position: { x: 4.5, y: 8.5 }, rotation: 270, scale: { x: 1, y: 1 }, color: "#34495E" },
      { type: "rug-1", name: "Shag Rug", position: { x: 2.5, y: 8 }, rotation: 0, scale: { x: 1.5, y: 1 }, color: "#95A5A6" },
      { type: "lamp-1", name: "Table Lamp", position: { x: 4, y: 6.5 }, rotation: 0, scale: { x: 0.8, y: 0.8 }, color: "#E67E22" },
      
      // Bathroom - Spa-like
      { type: "toilet-1", name: "Modern Toilet", position: { x: 5.8, y: 7.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#FFFFFF" },
      { type: "sink-1", name: "Vessel Sink", position: { x: 7.2, y: 6.2 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#FFFFFF" },
      { type: "shower-1", name: "Walk-in Shower", position: { x: 7.2, y: 7.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#ECF0F1" }
    ]
  };
}

function generateHouseLayout() {
  return {
    name: "Contemporary Dream Home",
    rooms: [
      {
        name: "Living Room",
        points: [
          { x: 0, y: 0 },
          { x: 7.5, y: 0 },
          { x: 7.5, y: 6.5 },
          { x: 0, y: 6.5 }
        ],
        color: "#F5F5DC",
        floorTexture: "wood",
        wallColor: "#FFFFFF",
        dimensions: { width: 7.5, height: 6.5 }
      },
      {
        name: "Dining Room",
        points: [
          { x: 7.8, y: 0 },
          { x: 12.5, y: 0 },
          { x: 12.5, y: 4.5 },
          { x: 7.8, y: 4.5 }
        ],
        color: "#F5F5DC",
        floorTexture: "wood",
        wallColor: "#FFFFFF",
        dimensions: { width: 4.7, height: 4.5 }
      },
      {
        name: "Kitchen",
        points: [
          { x: 7.8, y: 4.8 },
          { x: 12.5, y: 4.8 },
          { x: 12.5, y: 8.5 },
          { x: 7.8, y: 8.5 }
        ],
        color: "#FFFFFF",
        floorTexture: "tile",
        wallColor: "#F8F9FA",
        dimensions: { width: 4.7, height: 3.7 }
      },
      {
        name: "Master Bedroom",
        points: [
          { x: 0, y: 6.8 },
          { x: 6, y: 6.8 },
          { x: 6, y: 11.5 },
          { x: 0, y: 11.5 }
        ],
        color: "#F8F9FA",
        floorTexture: "carpet",
        wallColor: "#ECF0F1",
        dimensions: { width: 6, height: 4.7 }
      },
      {
        name: "Bedroom",
        points: [
          { x: 6.3, y: 8.8 },
          { x: 10.5, y: 8.8 },
          { x: 10.5, y: 12.8 },
          { x: 6.3, y: 12.8 }
        ],
        color: "#F8F9FA",
        floorTexture: "carpet",
        wallColor: "#FFFFFF",
        dimensions: { width: 4.2, height: 4 }
      },
      {
        name: "Bathroom",
        points: [
          { x: 10.8, y: 8.8 },
          { x: 13.3, y: 8.8 },
          { x: 13.3, y: 11.3 },
          { x: 10.8, y: 11.3 }
        ],
        color: "#FFFFFF",
        floorTexture: "tile",
        wallColor: "#FFFFFF",
        dimensions: { width: 2.5, height: 2.5 }
      }
    ],
    furniture: [
      // Living Room - Luxurious
      { type: "sofa-2", name: "L-Shaped Sectional", position: { x: 3.7, y: 2 }, rotation: 0, scale: { x: 1.3, y: 1.2 }, color: "#4A5568" },
      { type: "coffee-table-1", name: "Marble Coffee Table", position: { x: 3.7, y: 3.8 }, rotation: 0, scale: { x: 1.2, y: 1 }, color: "#8B4513" },
      { type: "tv-1", name: "75\" TV Console", position: { x: 3.7, y: 6 }, rotation: 180, scale: { x: 1.5, y: 1 }, color: "#2C3E50" },
      { type: "rug-1", name: "Designer Area Rug", position: { x: 3.7, y: 3.5 }, rotation: 0, scale: { x: 2.5, y: 2 }, color: "#C0392B" },
      { type: "plant-1", name: "Monstera Plant", position: { x: 0.8, y: 6 }, rotation: 0, scale: { x: 1.2, y: 1.2 }, color: "#27AE60" },
      { type: "lamp-1", name: "Arc Floor Lamp", position: { x: 6.5, y: 1.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#E67E22" },
      
      // Dining Room - Elegant
      { type: "dining-table-1", name: "8-Seater Dining Table", position: { x: 10.1, y: 2.2 }, rotation: 0, scale: { x: 1.3, y: 1.2 }, color: "#8B4513" },
      { type: "chair-2", name: "Dining Chair 1", position: { x: 8.8, y: 1.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#34495E" },
      { type: "chair-2", name: "Dining Chair 2", position: { x: 10.1, y: 1.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#34495E" },
      { type: "chair-2", name: "Dining Chair 3", position: { x: 11.4, y: 1.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#34495E" },
      { type: "chair-2", name: "Dining Chair 4", position: { x: 8.8, y: 2.9 }, rotation: 180, scale: { x: 1, y: 1 }, color: "#34495E" },
      { type: "chair-2", name: "Dining Chair 5", position: { x: 10.1, y: 2.9 }, rotation: 180, scale: { x: 1, y: 1 }, color: "#34495E" },
      { type: "chair-2", name: "Dining Chair 6", position: { x: 11.4, y: 2.9 }, rotation: 180, scale: { x: 1, y: 1 }, color: "#34495E" },
      { type: "rug-1", name: "Dining Rug", position: { x: 10.1, y: 2.2 }, rotation: 0, scale: { x: 2, y: 1.5 }, color: "#7F8C8D" },
      
      // Kitchen - Chef's Dream
      { type: "fridge-2", name: "Smart Refrigerator", position: { x: 8.3, y: 5.3 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#F8F9FA" },
      { type: "counter-1", name: "Quartz Counter", position: { x: 10.1, y: 5.3 }, rotation: 0, scale: { x: 1.5, y: 1 }, color: "#34495E" },
      { type: "stove-1", name: "Induction Cooktop", position: { x: 11.8, y: 5.3 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#2C3E50" },
      { type: "island-1", name: "Large Kitchen Island", position: { x: 10.1, y: 7.2 }, rotation: 0, scale: { x: 1.3, y: 1 }, color: "#8B4513" },
      
      // Master Bedroom - Serene Retreat
      { type: "bed-2", name: "California King Bed", position: { x: 3, y: 7.8 }, rotation: 0, scale: { x: 1.3, y: 1.2 }, color: "#2C3E50" },
      { type: "nightstand-1", name: "Left Nightstand", position: { x: 1.2, y: 7.8 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8B4513" },
      { type: "nightstand-1", name: "Right Nightstand", position: { x: 4.8, y: 7.8 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8B4513" },
      { type: "wardrobe-2", name: "Walk-in Closet", position: { x: 5.5, y: 10 }, rotation: 270, scale: { x: 1.2, y: 1 }, color: "#34495E" },
      { type: "rug-1", name: "Plush Bedroom Rug", position: { x: 3, y: 9.5 }, rotation: 0, scale: { x: 2, y: 1.5 }, color: "#95A5A6" },
      { type: "lamp-1", name: "Bedside Lamp", position: { x: 1.2, y: 7.5 }, rotation: 0, scale: { x: 0.8, y: 0.8 }, color: "#E67E22" },
      
      // Bedroom 2 - Guest Room
      { type: "bed-1", name: "Full Size Bed", position: { x: 8.4, y: 9.8 }, rotation: 0, scale: { x: 1.1, y: 1 }, color: "#2C3E50" },
      { type: "nightstand-1", name: "Nightstand", position: { x: 9.8, y: 9.8 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8B4513" },
      { type: "wardrobe-1", name: "Wardrobe", position: { x: 9.8, y: 11.8 }, rotation: 270, scale: { x: 1, y: 1 }, color: "#34495E" },
      { type: "rug-1", name: "Guest Room Rug", position: { x: 8.4, y: 10.8 }, rotation: 0, scale: { x: 1.5, y: 1 }, color: "#BDC3C7" },
      
      // Bathroom - Spa Experience
      { type: "toilet-1", name: "Wall-Mounted Toilet", position: { x: 11.3, y: 10.8 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#FFFFFF" },
      { type: "sink-1", name: "Double Vanity", position: { x: 12, y: 9.3 }, rotation: 0, scale: { x: 1.2, y: 1 }, color: "#FFFFFF" },
      { type: "shower-1", name: "Rain Shower", position: { x: 12.8, y: 10.8 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#ECF0F1" }
    ]
  };
}
