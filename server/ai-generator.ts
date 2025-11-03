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

MODERN COLOR PALETTES - Choose ONE cohesive palette per design:

Palette 1 - Scandinavian Minimalist:
Living Room: #F5F5DC floor (wood), #F8F9FA walls (soft white)
Master Bedroom: #F0E6D2 floor (light wood), #E8EAF6 walls (lavender gray)
Bedroom: #F5F5DC floor (wood), #FFF8E1 walls (warm cream)
Kitchen: #FFFFFF floor (tile), #ECEFF1 walls (cool gray)
Dining Room: #F5F5DC floor (wood), #F1F8E9 walls (sage green)
Bathroom: #F8F9FA floor (tile), #E0F2F1 walls (mint)
Home Office: #F5F5DC floor (wood), #E3F2FD walls (sky blue)

Palette 2 - Modern Luxe:
Living Room: #D4C4A8 floor (oak), #2C3E50 walls (navy blue)
Master Bedroom: #E8DCC4 floor (maple), #4A5568 walls (charcoal)
Bedroom: #F0E6D2 floor (birch), #5D4E37 walls (mocha)
Kitchen: #FFFFFF floor (marble), #34495E walls (slate)
Dining Room: #C9B896 floor (walnut), #8B7355 walls (taupe)
Bathroom: #F8F9FA floor (tile), #546E7A walls (blue gray)
Home Office: #D4C4A8 floor (oak), #37474F walls (dark gray)

Palette 3 - Warm Contemporary:
Living Room: #E8DCC4 floor (honey oak), #FFF3E0 walls (peach cream)
Master Bedroom: #F0E6D2 floor (ash), #FFEBEE walls (blush pink)
Bedroom: #F5F5DC floor (pine), #FFF9C4 walls (soft yellow)
Kitchen: #FFFAF0 floor (tile), #FFE0B2 walls (apricot)
Dining Room: #E8DCC4 floor (oak), #FFCCBC walls (coral)
Bathroom: #FFF8E1 floor (tile), #FCE4EC walls (rose)
Home Office: #F0E6D2 floor (wood), #FFF8DC walls (cornsilk)

Palette 4 - Bold & Vibrant:
Living Room: #8B7355 floor (dark wood), #1A237E walls (deep indigo)
Master Bedroom: #A0826D floor (mahogany), #4A148C walls (deep purple)
Bedroom: #8B7355 floor (walnut), #006064 walls (teal)
Kitchen: #F5F5F5 floor (tile), #D32F2F walls (crimson accent)
Dining Room: #654321 floor (dark oak), #C62828 walls (burgundy)
Bathroom: #FFFFFF floor (tile), #00695C walls (emerald)
Home Office: #8B7355 floor (wood), #01579B walls (ocean blue)

Palette 5 - Earth Tones:
Living Room: #D2B48C floor (tan wood), #8D6E63 walls (terracotta)
Master Bedroom: #DEB887 floor (burlywood), #A1887F walls (warm taupe)
Bedroom: #F5DEB3 floor (wheat), #BCAAA4 walls (mushroom)
Kitchen: #FAF0E6 floor (linen tile), #D7CCC8 walls (sand)
Dining Room: #D2B48C floor (tan), #A1887F walls (clay)
Bathroom: #FFF8DC floor (tile), #EFEBE9 walls (stone)
Home Office: #DEB887 floor (wood), #D7CCC8 walls (warm gray)

Palette 6 - Coastal Breeze:
Living Room: #F5F5DC floor (driftwood), #B3E5FC walls (sky blue)
Master Bedroom: #FFF8E1 floor (sand), #80DEEA walls (aqua)
Bedroom: #FFFAF0 floor (ivory), #A7FFEB walls (seafoam)
Kitchen: #FFFFFF floor (tile), #E0F7FA walls (ice blue)
Dining Room: #F5F5DC floor (wood), #B2DFDB walls (turquoise)
Bathroom: #F0F4C3 floor (tile), #C5E1A5 walls (sea green)
Home Office: #FFF8E1 floor (wood), #81D4FA walls (ocean)

IMPORTANT: Pick ONE palette and use it consistently across all rooms for a cohesive design!

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

FURNITURE COLORS (match to your chosen palette):

Scandinavian: 
- Sofas/Beds: #E8EAF6, #B0BEC5, #90A4AE (light grays/blues)
- Wood: #D7CCC8, #BCAAA4, #A1887F (light woods)
- Accents: #5C6BC0, #42A5F5, #26C6DA (blue tones)
- Rugs: #7986CB, #64B5F6, #4DD0E1 (cool blues)

Modern Luxe:
- Sofas/Beds: #2C3E50, #34495E, #4A5568 (navy/charcoal)
- Wood: #654321, #8B4513, #A0522D (dark woods)
- Accents: #C0A062, #D4AF37, #B8860B (gold/brass)
- Rugs: #8B7355, #A0826D, #6B5D4F (rich browns)

Warm Contemporary:
- Sofas/Beds: #FFAB91, #FFCCBC, #FFE0B2 (warm peach/coral)
- Wood: #D2B48C, #DEB887, #F5DEB3 (honey woods)
- Accents: #FF7043, #FF5722, #F4511E (orange/coral)
- Rugs: #FFAB91, #BCAAA4, #A1887F (warm neutrals)

Bold & Vibrant:
- Sofas/Beds: #1A237E, #4A148C, #006064 (deep jewel tones)
- Wood: #3E2723, #4E342E, #5D4037 (espresso)
- Accents: #D32F2F, #C62828, #B71C1C (crimson)
- Rugs: #7B1FA2, #6A1B9A, #4A148C (purple/magenta)

Earth Tones:
- Sofas/Beds: #8D6E63, #A1887F, #BCAAA4 (terracotta/taupe)
- Wood: #6D4C41, #5D4037, #4E342E (walnut/mahogany)
- Accents: #FF6F00, #F57C00, #EF6C00 (burnt orange)
- Rugs: #D7CCC8, #BCAAA4, #A1887F (earth tones)

Coastal Breeze:
- Sofas/Beds: #B3E5FC, #81D4FA, #4FC3F7 (ocean blues)
- Wood: #ECEFF1, #CFD8DC, #B0BEC5 (whitewashed)
- Accents: #26C6DA, #00BCD4, #00ACC1 (turquoise)
- Rugs: #80DEEA, #4DD0E1, #26C6DA (aqua)

Plants (all palettes): #27AE60, #2ECC71, #1E8449 (green)
Appliances: #F8F9FA, #ECEFF1, #CFD8DC (stainless steel)

DESIGN ENHANCEMENTS:
1. Create visual interest with varied wall colors per room
2. Use darker/bolder colors for accent walls in living spaces
3. Keep bathrooms and kitchens lighter and brighter
4. Coordinate furniture colors with wall palette
5. Add texture variety: wood floors in living areas, carpet in bedrooms, tile in wet areas

ACCENT WALL IDEAS:
- Living Room: One wall 2-3 shades darker than others
- Master Bedroom: Headboard wall in deeper tone
- Dining Room: Feature wall behind dining table
- Home Office: Motivating color behind desk

User Request: ${prompt}

IMPORTANT: 
1. Calculate exact x,y coordinates for each room so they DON'T overlap
2. Choose ONE cohesive color palette from the options above
3. Vary wall colors between rooms for visual interest
4. Match furniture colors to your chosen palette`;

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
        color: "#E8DCC4",
        floorTexture: "wood",
        wallColor: "#2C3E50",
        dimensions: { width: 6.5, height: 5.5 }
      },
      {
        name: "Kitchen",
        points: [
          { x: 7.5, y: 0 },
          { x: 11.5, y: 0 },
          { x: 11.5, y: 3.5 },
          { x: 7.5, y: 3.5 }
        ],
        color: "#FFFFFF",
        floorTexture: "tile",
        wallColor: "#ECEFF1",
        dimensions: { width: 4, height: 3.5 }
      },
      {
        name: "Bedroom",
        points: [
          { x: 0, y: 6.5 },
          { x: 5, y: 6.5 },
          { x: 5, y: 10.7 },
          { x: 0, y: 10.7 }
        ],
        color: "#F0E6D2",
        floorTexture: "carpet",
        wallColor: "#4A5568",
        dimensions: { width: 5, height: 4.2 }
      },
      {
        name: "Bathroom",
        points: [
          { x: 6, y: 6.5 },
          { x: 8.5, y: 6.5 },
          { x: 8.5, y: 8.7 },
          { x: 6, y: 8.7 }
        ],
        color: "#F8F9FA",
        floorTexture: "tile",
        wallColor: "#B3E5FC",
        dimensions: { width: 2.5, height: 2.2 }
      }
    ],
    furniture: [
      // Living Room - Modern Luxe Style
      { type: "sofa-1", name: "Designer Sectional", position: { x: 3.2, y: 1.5 }, rotation: 0, scale: { x: 1.2, y: 1 }, color: "#34495E" },
      { type: "coffee-table-1", name: "Glass Coffee Table", position: { x: 3.2, y: 3 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#654321" },
      { type: "tv-1", name: "Entertainment Center", position: { x: 3.2, y: 5 }, rotation: 180, scale: { x: 1.2, y: 1 }, color: "#2C3E50" },
      { type: "rug-1", name: "Luxury Rug", position: { x: 3.2, y: 2.8 }, rotation: 0, scale: { x: 2, y: 1.5 }, color: "#8B7355" },
      { type: "plant-1", name: "Fiddle Leaf Fig", position: { x: 0.6, y: 5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#27AE60" },
      { type: "lamp-1", name: "Gold Floor Lamp", position: { x: 5.8, y: 1 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#C0A062" },
      
      // Kitchen - Professional Grade
      { type: "fridge-1", name: "French Door Fridge", position: { x: 7.2, y: 0.6 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#F8F9FA" },
      { type: "counter-1", name: "Granite Counter", position: { x: 8.8, y: 0.6 }, rotation: 0, scale: { x: 1.2, y: 1 }, color: "#34495E" },
      { type: "stove-1", name: "Gas Range", position: { x: 10.2, y: 0.6 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#2C3E50" },
      { type: "island-1", name: "Kitchen Island", position: { x: 8.8, y: 2.2 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8B4513" },
      
      // Bedroom - Cozy & Elegant
      { type: "bed-1", name: "Queen Platform Bed", position: { x: 2.5, y: 7.5 }, rotation: 0, scale: { x: 1.1, y: 1 }, color: "#34495E" },
      { type: "nightstand-1", name: "Nightstand", position: { x: 4, y: 7.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#A0826D" },
      { type: "wardrobe-1", name: "Built-in Wardrobe", position: { x: 4.5, y: 9.5 }, rotation: 270, scale: { x: 1, y: 1 }, color: "#4A5568" },
      { type: "rug-1", name: "Plush Rug", position: { x: 2.5, y: 9 }, rotation: 0, scale: { x: 1.5, y: 1 }, color: "#A1887F" },
      { type: "lamp-1", name: "Brass Table Lamp", position: { x: 4, y: 7.2 }, rotation: 0, scale: { x: 0.8, y: 0.8 }, color: "#D4AF37" },
      
      // Bathroom - Spa-like
      { type: "toilet-1", name: "Modern Toilet", position: { x: 6.5, y: 8.2 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#FFFFFF" },
      { type: "sink-1", name: "Vessel Sink", position: { x: 7.2, y: 7 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#FFFFFF" },
      { type: "shower-1", name: "Walk-in Shower", position: { x: 7.8, y: 8.2 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#E0F2F1" }
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
        color: "#D2B48C",
        floorTexture: "wood",
        wallColor: "#8D6E63",
        dimensions: { width: 7.5, height: 6.5 }
      },
      {
        name: "Dining Room",
        points: [
          { x: 8.5, y: 0 },
          { x: 13.2, y: 0 },
          { x: 13.2, y: 4.5 },
          { x: 8.5, y: 4.5 }
        ],
        color: "#D2B48C",
        floorTexture: "wood",
        wallColor: "#A1887F",
        dimensions: { width: 4.7, height: 4.5 }
      },
      {
        name: "Kitchen",
        points: [
          { x: 8.5, y: 5.5 },
          { x: 13.2, y: 5.5 },
          { x: 13.2, y: 9.2 },
          { x: 8.5, y: 9.2 }
        ],
        color: "#FAF0E6",
        floorTexture: "tile",
        wallColor: "#D7CCC8",
        dimensions: { width: 4.7, height: 3.7 }
      },
      {
        name: "Master Bedroom",
        points: [
          { x: 0, y: 7.5 },
          { x: 6, y: 7.5 },
          { x: 6, y: 12.2 },
          { x: 0, y: 12.2 }
        ],
        color: "#DEB887",
        floorTexture: "carpet",
        wallColor: "#A1887F",
        dimensions: { width: 6, height: 4.7 }
      },
      {
        name: "Bedroom",
        points: [
          { x: 7, y: 10.2 },
          { x: 11.2, y: 10.2 },
          { x: 11.2, y: 14.2 },
          { x: 7, y: 14.2 }
        ],
        color: "#F5DEB3",
        floorTexture: "carpet",
        wallColor: "#BCAAA4",
        dimensions: { width: 4.2, height: 4 }
      },
      {
        name: "Bathroom",
        points: [
          { x: 12.2, y: 10.2 },
          { x: 14.7, y: 10.2 },
          { x: 14.7, y: 12.7 },
          { x: 12.2, y: 12.7 }
        ],
        color: "#FFF8DC",
        floorTexture: "tile",
        wallColor: "#EFEBE9",
        dimensions: { width: 2.5, height: 2.5 }
      }
    ],
    furniture: [
      // Living Room - Earth Tones Luxe
      { type: "sofa-2", name: "L-Shaped Sectional", position: { x: 3.7, y: 2 }, rotation: 0, scale: { x: 1.3, y: 1.2 }, color: "#8D6E63" },
      { type: "coffee-table-1", name: "Live Edge Coffee Table", position: { x: 3.7, y: 3.8 }, rotation: 0, scale: { x: 1.2, y: 1 }, color: "#6D4C41" },
      { type: "tv-1", name: "75\" TV Console", position: { x: 3.7, y: 6 }, rotation: 180, scale: { x: 1.5, y: 1 }, color: "#5D4037" },
      { type: "rug-1", name: "Handwoven Rug", position: { x: 3.7, y: 3.5 }, rotation: 0, scale: { x: 2.5, y: 2 }, color: "#D7CCC8" },
      { type: "plant-1", name: "Monstera Plant", position: { x: 0.8, y: 6 }, rotation: 0, scale: { x: 1.2, y: 1.2 }, color: "#27AE60" },
      { type: "lamp-1", name: "Copper Arc Lamp", position: { x: 6.5, y: 1.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#FF6F00" },
      
      // Dining Room - Warm & Elegant
      { type: "dining-table-1", name: "8-Seater Dining Table", position: { x: 10.8, y: 2.2 }, rotation: 0, scale: { x: 1.3, y: 1.2 }, color: "#6D4C41" },
      { type: "chair-2", name: "Dining Chair 1", position: { x: 9.5, y: 1.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8D6E63" },
      { type: "chair-2", name: "Dining Chair 2", position: { x: 10.8, y: 1.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8D6E63" },
      { type: "chair-2", name: "Dining Chair 3", position: { x: 12.1, y: 1.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8D6E63" },
      { type: "chair-2", name: "Dining Chair 4", position: { x: 9.5, y: 2.9 }, rotation: 180, scale: { x: 1, y: 1 }, color: "#8D6E63" },
      { type: "chair-2", name: "Dining Chair 5", position: { x: 10.8, y: 2.9 }, rotation: 180, scale: { x: 1, y: 1 }, color: "#8D6E63" },
      { type: "chair-2", name: "Dining Chair 6", position: { x: 12.1, y: 2.9 }, rotation: 180, scale: { x: 1, y: 1 }, color: "#8D6E63" },
      { type: "rug-1", name: "Jute Dining Rug", position: { x: 10.8, y: 2.2 }, rotation: 0, scale: { x: 2, y: 1.5 }, color: "#D7CCC8" },
      
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
