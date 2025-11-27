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
  
  const systemPrompt = `You are an expert architect and interior designer. Create a PERFECT floor plan in JSON format.

🚨 CRITICAL QUALITY REQUIREMENTS 🚨
1. Return ONLY valid JSON (no markdown, no text, no explanations)
2. EVERY room MUST have "color" and "wallColor" properties (NEVER leave them empty!)
3. Rooms MUST touch perfectly (share exact coordinates), NO gaps
4. Add "floor" property to EVERY room (0=ground, 1=first floor, etc.)
5. Add furniture to EVERY room (except hallways/stairwells)
6. Use ONE cohesive color palette throughout the entire design
7. Create visually attractive, modern designs

JSON FORMAT - PERFECT EXAMPLE:
{
  "name": "Modern 2-Bedroom Apartment",
  "rooms": [
    {
      "name": "Living Room",
      "points": [{"x": 0, "y": 0}, {"x": 7, "y": 0}, {"x": 7, "y": 6}, {"x": 0, "y": 6}],
      "color": "#D4A574",
      "floorTexture": "wood",
      "wallColor": "#C19A6B",
      "dimensions": {"width": 7, "height": 6},
      "floor": 0
    },
    {
      "name": "Kitchen",
      "points": [{"x": 7, "y": 0}, {"x": 11, "y": 0}, {"x": 11, "y": 4}, {"x": 7, "y": 4}],
      "color": "#FFFFFF",
      "floorTexture": "tile",
      "wallColor": "#F5F5F5",
      "dimensions": {"width": 4, "height": 4},
      "floor": 0
    }
  ],
  "furniture": [
    {"type": "sofa-1", "name": "Modern Sofa", "position": {"x": 3.5, "y": 2}, "rotation": 0, "scale": {"x": 1, "y": 1}, "color": "#4A5568", "floor": 0},
    {"type": "coffee-table-1", "name": "Coffee Table", "position": {"x": 3.5, "y": 3.5}, "rotation": 0, "scale": {"x": 1, "y": 1}, "color": "#8B4513", "floor": 0}
  ]
}

NOTE: This example shows PERFECT formatting:
- ✅ All rooms have color AND wallColor
- ✅ Rooms touch perfectly (Living x=7 = Kitchen x=7)
- ✅ All properties present
- ✅ Furniture has colors
- ✅ Cohesive color palette (warm earth tones)

MULTI-FLOOR BUILDINGS (apartments, offices, hotels):
For multi-story buildings, add "floor" property to each room (0=ground, 1=first, 2=second, etc.)

Example 4-Floor Building with 10 Units Per Floor:
{
  "name": "4-Story Apartment Complex",
  "rooms": [
    // GROUND FLOOR - Lobby + 10 apartments
    {"name": "Lobby", "floor": 0, "points": [{"x":0,"y":0},{"x":4,"y":0},{"x":4,"y":8},{"x":0,"y":8}], "color": "#F5F5DC", "wallColor": "#FFFFFF"},
    {"name": "Apt 101", "floor": 0, "points": [{"x":4,"y":0},{"x":10,"y":0},{"x":10,"y":4},{"x":4,"y":4}], "color": "#E8E8E8", "wallColor": "#D0D0D0"},
    {"name": "Apt 102", "floor": 0, "points": [{"x":10,"y":0},{"x":16,"y":0},{"x":16,"y":4},{"x":10,"y":4}], "color": "#E8E8E8", "wallColor": "#D0D0D0"},
    // ... apartments 103-110
    
    // FLOOR 1 - 10 apartments (same x,y layout, floor: 1)
    {"name": "Apt 201", "floor": 1, "points": [{"x":4,"y":0},{"x":10,"y":0},{"x":10,"y":4},{"x":4,"y":4}], "color": "#E8E8E8", "wallColor": "#D0D0D0"},
    // ... apartments 202-210
    
    // FLOOR 2 - 10 apartments (floor: 2)
    // FLOOR 3 - 10 apartments (floor: 3)
    
    // Stairwell connects all floors
    {"name": "Stairwell", "floor": 0, "points": [{"x":0,"y":8},{"x":4,"y":8},{"x":4,"y":12},{"x":0,"y":12}]},
    {"name": "Stairwell", "floor": 1, "points": [{"x":0,"y":8},{"x":4,"y":8},{"x":4,"y":12},{"x":0,"y":12}]},
    {"name": "Stairwell", "floor": 2, "points": [{"x":0,"y":8},{"x":4,"y":8},{"x":4,"y":12},{"x":0,"y":12}]},
    {"name": "Stairwell", "floor": 3, "points": [{"x":0,"y":8},{"x":4,"y":8},{"x":4,"y":12},{"x":0,"y":12}]}
  ],
  "furniture": [...]
}

MULTI-FLOOR LAYOUT STRATEGY:
  
For "4-floor building with 10 apartments per floor":

FLOOR 0 (Ground Floor) - ALL rooms have "floor": 0:
- Hallway: {"name":"Hallway","floor":0,"points":[{"x":0,"y":0},{"x":2,"y":0},{"x":2,"y":50},{"x":0,"y":50}],"color":"#F5F5DC","wallColor":"#FFFFFF"}
- Apt 101: {"name":"Apt 101","floor":0,"points":[{"x":2,"y":0},{"x":8,"y":0},{"x":8,"y":5},{"x":2,"y":5}],"color":"#E8E8E8","wallColor":"#D0D0D0"}
- Apt 102: {"name":"Apt 102","floor":0,"points":[{"x":2,"y":5},{"x":8,"y":5},{"x":8,"y":10},{"x":2,"y":10}],"color":"#E8E8E8","wallColor":"#D0D0D0"}
- ... Apt 103-110 (all with "floor":0)
- Stairwell: {"name":"Stairwell","floor":0,"points":[{"x":0,"y":50},{"x":4,"y":50},{"x":4,"y":54},{"x":0,"y":54}],"color":"#D7CCC8","wallColor":"#BCAAA4"}
  
FLOOR 1 (First Floor) - SAME x,y layout but "floor": 1:
- Hallway: {"name":"Hallway","floor":1,"points":[{"x":0,"y":0},{"x":2,"y":0},{"x":2,"y":50},{"x":0,"y":50}],"color":"#F5F5DC","wallColor":"#FFFFFF"}
- Apt 201: {"name":"Apt 201","floor":1,"points":[{"x":2,"y":0},{"x":8,"y":0},{"x":8,"y":5},{"x":2,"y":5}],"color":"#E8E8E8","wallColor":"#D0D0D0"}
- Apt 202: {"name":"Apt 202","floor":1,"points":[{"x":2,"y":5},{"x":8,"y":5},{"x":8,"y":10},{"x":2,"y":10}],"color":"#E8E8E8","wallColor":"#D0D0D0"}
- ... Apt 203-210 (all with "floor":1)
- Stairwell: {"name":"Stairwell","floor":1,"points":[{"x":0,"y":50},{"x":4,"y":50},{"x":4,"y":54},{"x":0,"y":54}],"color":"#D7CCC8","wallColor":"#BCAAA4"}

FLOOR 2 & 3: Repeat same pattern with "floor":2 and "floor":3

CRITICAL: EVERY room MUST have "floor" property!
- Ground floor = "floor": 0
- First floor = "floor": 1  
- Second floor = "floor": 2
- Third floor = "floor": 3

Apartment Layout (6m x 5m each):
- Living area: 3m x 3m
- Bedroom: 3m x 2m
- Bathroom: 2m x 2m
- Arrange 10 units in single row along hallway

IMPORTANT: DO NOT generate doors. The system doesn't support door generation yet.
Focus on creating beautiful, modern room layouts with proper color schemes.

CRITICAL POSITIONING RULES - ROOMS MUST TOUCH PERFECTLY:

RULE 1: Adjacent rooms MUST share the EXACT same coordinate with NO gaps
- If Room 1 ends at x=7, Room 2 MUST start at x=7 (NOT x=7.15 or x=7.5 or x=8)
- If Room 1 ends at y=6, Room 3 MUST start at y=6 (NOT y=6.15 or y=6.5 or y=7)
- Walls are 0.15m thick and handled automatically - DO NOT add wall thickness to coordinates!

CORRECT EXAMPLES (ROOMS TOUCHING):

2-Room Apartment:
Living Room: points: [{"x":0,"y":0}, {"x":7,"y":0}, {"x":7,"y":6}, {"x":0,"y":6}]
Kitchen: points: [{"x":7,"y":0}, {"x":11,"y":0}, {"x":11,"y":4}, {"x":7,"y":4}]
✓ Both rooms share x=7 wall - PERFECT!

3-Room L-Shape:
Living Room: points: [{"x":0,"y":0}, {"x":7,"y":0}, {"x":7,"y":6}, {"x":0,"y":6}]
Kitchen: points: [{"x":7,"y":0}, {"x":11,"y":0}, {"x":11,"y":4}, {"x":7,"y":4}]
Bedroom: points: [{"x":0,"y":6}, {"x":5,"y":6}, {"x":5,"y":10}, {"x":0,"y":10}]
✓ Living-Kitchen share x=7, Living-Bedroom share y=6 - PERFECT!

4-Room Connected:
Living: points: [{"x":0,"y":0}, {"x":7,"y":0}, {"x":7,"y":6}, {"x":0,"y":6}]
Kitchen: points: [{"x":7,"y":0}, {"x":11,"y":0}, {"x":11,"y":4}, {"x":7,"y":4}]
Bedroom: points: [{"x":0,"y":6}, {"x":5,"y":6}, {"x":5,"y":10}, {"x":0,"y":10}]
Bathroom: points: [{"x":5,"y":6}, {"x":8,"y":6}, {"x":8,"y":9}, {"x":5,"y":9}]
✓ All rooms perfectly connected - PERFECT!

WRONG EXAMPLES (DO NOT DO THIS):
❌ Room 1 ends at x=7, Room 2 starts at x=8 (gap!)
❌ Room 1 ends at y=6, Room 2 starts at y=7 (gap!)
❌ Room 1 ends at x=7, Room 2 starts at x=6.5 (overlap!)

ROOM SIZES (width x height in meters):
- Living Room: 7x6m
- Master Bedroom: 5x4.5m
- Bedroom: 4x4m
- Kitchen: 4.5x3.5m
- Dining Room: 4.5x4m
- Bathroom: 2.5x2.5m
- Home Office: 3.5x3m

MODERN COLOR PALETTES - Choose ONE cohesive palette per design:

Palette 1 - Scandinavian Minimalist (Light & Airy):
Living Room: #F5F5DC floor, #FFFFFF walls
Master Bedroom: #F0E6D2 floor, #F5F5F5 walls
Bedroom: #F5F5DC floor, #FAFAFA walls
Kitchen: #FFFFFF floor, #F8F9FA walls
Dining Room: #F5F5DC floor, #F0F0F0 walls
Bathroom: #FFFFFF floor, #F5F5F5 walls
Office: #F5F5DC floor, #FAFAFA walls

Palette 2 - Modern Luxe (Dark & Sophisticated):
Living Room: #2C2C2C floor, #1A1A1A walls
Master Bedroom: #3A3A3A floor, #2D2D2D walls
Bedroom: #2C2C2C floor, #252525 walls
Kitchen: #1F1F1F floor, #1A1A1A walls
Dining Room: #2C2C2C floor, #222222 walls
Bathroom: #3A3A3A floor, #2D2D2D walls
Office: #2C2C2C floor, #1F1F1F walls

Palette 3 - Warm Earth (Natural & Cozy):
Living Room: #D4A574 floor, #C19A6B walls
Master Bedroom: #C8B08D floor, #B8A07A walls
Bedroom: #D4A574 floor, #BFA080 walls
Kitchen: #E8D5C4 floor, #D4C4B0 walls
Dining Room: #C8B08D floor, #B8A07A walls
Bathroom: #E8D5C4 floor, #D4C4B0 walls
Office: #D4A574 floor, #C19A6B walls

Palette 4 - Cool Industrial (Urban & Edgy):
Living Room: #4A5568 floor, #3C4858 walls
Master Bedroom: #546E7A floor, #455A64 walls
Bedroom: #4A5568 floor, #3C4858 walls
Kitchen: #37474F floor, #2C3E50 walls
Dining Room: #546E7A floor, #455A64 walls
Bathroom: #607D8B floor, #546E7A walls
Office: #4A5568 floor, #37474F walls

Palette 5 - Vibrant Modern (Bold & Energetic):
Living Room: #E74C3C floor, #C0392B walls
Master Bedroom: #9B59B6 floor, #8E44AD walls
Bedroom: #3498DB floor, #2980B9 walls
Kitchen: #F39C12 floor, #E67E22 walls
Dining Room: #1ABC9C floor, #16A085 walls
Bathroom: #34495E floor, #2C3E50 walls
Office: #E74C3C floor, #C0392B walls

Palette 6 - Pastel Dream (Soft & Elegant):
Living Room: #FFE5E5 floor, #FFD6D6 walls
Master Bedroom: #E5E5FF floor, #D6D6FF walls
Bedroom: #E5FFE5 floor, #D6FFD6 walls
Kitchen: #FFFFE5 floor, #FFFFD6 walls
Dining Room: #FFE5FF floor, #FFD6FF walls
Bathroom: #E5FFFF floor, #D6FFFF walls
Office: #FFE5E5 floor, #FFD6D6 walls

Palette 7 - Monochrome Elegance (Timeless):
Living Room: #E8E8E8 floor, #D0D0D0 walls
Master Bedroom: #F0F0F0 floor, #E0E0E0 walls
Bedroom: #E8E8E8 floor, #D8D8D8 walls
Kitchen: #FFFFFF floor, #F5F5F5 walls
Dining Room: #E8E8E8 floor, #D0D0D0 walls
Bathroom: #F0F0F0 floor, #E0E0E0 walls
Office: #E8E8E8 floor, #D8D8D8 walls

Palette 8 - Sunset Warmth (Inviting):
Living Room: #FF9A76 floor, #FF8C61 walls
Master Bedroom: #FFB88C floor, #FFA876 walls
Bedroom: #FFCBA4 floor, #FFB88C walls
Kitchen: #FFE5D9 floor, #FFD4C4 walls
Dining Room: #FF9A76 floor, #FF8C61 walls
Bathroom: #FFE5D9 floor, #FFD4C4 walls
Office: #FFB88C floor, #FFA876 walls
  
IMPORTANT: Pick ONE palette and use it consistently across all rooms for a cohesive, modern design!

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

MODERN DESIGN PRINCIPLES:

1. **Color Harmony**: Use ONE cohesive palette throughout
   - Living spaces: Bold, statement colors
   - Bedrooms: Calming, softer tones
   - Bathrooms/Kitchens: Clean, bright colors
   - Hallways: Neutral transitions

2. **Visual Interest**: Create depth and dimension
   - Vary wall colors between adjacent rooms
   - Use complementary colors from your chosen palette
   - First wall of each room can be an accent (automatically darker)

3. **Material Variety**:
   - Living/Dining/Office: Wood floors (#D4A574, #C8B08D, #F5F5DC)
   - Bedrooms: Carpet or wood (#F0E6D2, #E8DCC4)
   - Kitchen/Bathroom: Tile (#FFFFFF, #F8F9FA, #FFFAF0)

4. **Modern Aesthetics**:
   - Clean lines and simple geometry
   - Balanced proportions (rooms 4-7m wide, 3-6m deep)
   - Logical flow between spaces
   - Adequate circulation space

5. **Sophisticated Combinations**:
   Example 1 - Monochrome Elegance:
   - Living: #E8E8E8 floor, #D0D0D0 walls
   - Kitchen: #FFFFFF floor, #F5F5F5 walls
   - Bedroom: #F0F0F0 floor, #E0E0E0 walls
   
   Example 2 - Warm Modern:
   - Living: #D4A574 floor, #C19A6B walls
   - Kitchen: #E8D5C4 floor, #D4C4B0 walls
   - Bedroom: #C8B08D floor, #B8A07A walls
   
   Example 3 - Cool Contemporary:
   - Living: #4A5568 floor, #3C4858 walls
   - Kitchen: #37474F floor, #2C3E50 walls
   - Bedroom: #546E7A floor, #455A64 walls

User Request: ${prompt}

IMPORTANT: If user asks for multiple floors/stories, create ONE floor only.
The system will automatically replicate it to create all floors.
Focus on creating a COMPLETE single floor with ALL requested rooms.

MANDATORY PROCESS FOR MULTI-FLOOR:

1. CALCULATE TOTAL ROOMS:
   - "4 floors with 10 apartments" = 40 apartments + 4 hallways + 4 stairwells = 48 rooms minimum
   - "3-story office" = 24 offices + 3 hallways + 3 stairwells = 30 rooms minimum

2. CREATE FLOOR 0 (Ground Floor):
   - Hallway: {"name":"Hallway","floor":0,"points":[{"x":0,"y":0},{"x":2,"y":0},{"x":2,"y":60},{"x":0,"y":60}],"color":"#F5F5DC","wallColor":"#FFFFFF"}
   - Apt 101: {"name":"Apt 101","floor":0,"points":[{"x":2,"y":0},{"x":8,"y":0},{"x":8,"y":6},{"x":2,"y":6}],"color":"#E8E8E8","wallColor":"#D0D0D0"}
   - Apt 102: {"name":"Apt 102","floor":0,"points":[{"x":2,"y":6},{"x":8,"y":6},{"x":8,"y":12},{"x":2,"y":12}],"color":"#E8E8E8","wallColor":"#D0D0D0"}
   - Apt 103-110: Continue pattern...
   - Stairwell: {"name":"Stairwell","floor":0,"points":[{"x":0,"y":60},{"x":4,"y":60},{"x":4,"y":64},{"x":0,"y":64}],"color":"#D7CCC8","wallColor":"#BCAAA4"}

3. COPY FLOOR 0 TO CREATE FLOOR 1:
   - Take ALL rooms from floor 0
   - Change "floor":0 to "floor":1
   - Change names: Apt 101 → Apt 201, Apt 102 → Apt 202, etc.
   - Keep EXACT SAME x,y coordinates!

4. REPEAT FOR ALL FLOORS:
   - Floor 2: Apt 301-310, "floor":2
   - Floor 3: Apt 401-410, "floor":3
   - Floor 4: Apt 501-510, "floor":4

COMPLETE EXAMPLE - 4-FLOOR BUILDING (48 rooms total):
{
  "name": "4-Story Apartment Complex",
  "rooms": [
    // FLOOR 0 - Ground (12 rooms)
    {"name":"Hallway","floor":0,"points":[{"x":0,"y":0},{"x":2,"y":0},{"x":2,"y":60},{"x":0,"y":60}],"color":"#F5F5DC","floorTexture":"tile","wallColor":"#ECEFF1","dimensions":{"width":2,"height":60}},
    {"name":"Apt 101","floor":0,"points":[{"x":2,"y":0},{"x":8,"y":0},{"x":8,"y":6},{"x":2,"y":6}],"color":"#F5F5DC","floorTexture":"wood","wallColor":"#2C3E50","dimensions":{"width":6,"height":6}},
    {"name":"Apt 102","floor":0,"points":[{"x":2,"y":6},{"x":8,"y":6},{"x":8,"y":12},{"x":2,"y":12}],"color":"#F5F5DC","floorTexture":"wood","wallColor":"#4A5568","dimensions":{"width":6,"height":6}},
    // ... Apt 103-110 (same pattern, y increases by 6)
    {"name":"Stairwell","floor":0,"points":[{"x":0,"y":60},{"x":4,"y":60},{"x":4,"y":64},{"x":0,"y":64}],"color":"#D7CCC8","floorTexture":"concrete","wallColor":"#BCAAA4","dimensions":{"width":4,"height":4}},
    
    // FLOOR 1 - First (12 rooms) - SAME x,y as floor 0!
    {"name":"Hallway","floor":1,"points":[{"x":0,"y":0},{"x":2,"y":0},{"x":2,"y":60},{"x":0,"y":60}],"color":"#F5F5DC","floorTexture":"tile","wallColor":"#ECEFF1","dimensions":{"width":2,"height":60}},
    {"name":"Apt 201","floor":1,"points":[{"x":2,"y":0},{"x":8,"y":0},{"x":8,"y":6},{"x":2,"y":6}],"color":"#F5F5DC","floorTexture":"wood","wallColor":"#2C3E50","dimensions":{"width":6,"height":6}},
    // ... Apt 202-210
    {"name":"Stairwell","floor":1,"points":[{"x":0,"y":60},{"x":4,"y":60},{"x":4,"y":64},{"x":0,"y":64}],"color":"#D7CCC8","floorTexture":"concrete","wallColor":"#BCAAA4","dimensions":{"width":4,"height":4}},
    
    // FLOOR 2 - Second (12 rooms)
    // ... Apt 301-310 with "floor":2
    
    // FLOOR 3 - Third (12 rooms)
    // ... Apt 401-410 with "floor":3
  ],
  "furniture": [...]
}

YOU MUST CREATE ALL FLOORS! Don't stop at floor 0!

🚨 MANDATORY FINAL CHECKLIST 🚨

BEFORE YOU RESPOND, COUNT YOUR ROOMS:
- User asked for "4 floors with 10 apartments" = Need 40+ apartments
- Did you create 40+ apartments? If NO → ADD MORE ROOMS NOW!
- User asked for "3-story building" = Need 3 floors (floor: 0, 1, 2)
- Did you create floor 0, 1, AND 2? If NO → ADD MORE FLOORS NOW!

CHECKLIST:
✓ Do adjacent rooms share exact coordinates? (Room1 x=7 = Room2 x=7)
✓ NO gaps between rooms on same floor?
✓ NO overlaps?
✓ EVERY room has "floor" property?
✓ Multi-floor: ALL floors use SAME x,y coordinates?
✓ ONE color palette used consistently?
✓ Modern, sophisticated color combinations?

🔴 CRITICAL MULTI-FLOOR CHECK:
- If user mentions "4 floors" → You MUST have rooms with floor: 0, 1, 2, 3
- If user mentions "10 apartments per floor" → You MUST have 10 apartments on EACH floor
- Count your rooms: floor 0 count + floor 1 count + floor 2 count + floor 3 count = total
- If total is less than requested, ADD MORE ROOMS!

🎨 FINAL QUALITY CHECKLIST - VERIFY BEFORE RESPONDING:

1. ✅ COLORS CHECK:
   - Every room has "color" property? (floor color)
   - Every room has "wallColor" property? (wall color)
   - NO rooms with missing colors?
   - NO rooms with #000000 (black) walls?
   - All colors from ONE cohesive palette?

2. ✅ GEOMETRY CHECK:
   - Adjacent rooms share EXACT coordinates?
   - NO gaps between rooms? (Room1 x=7 = Room2 x=7)
   - NO overlaps?
   - All points are valid numbers?

3. ✅ PROPERTIES CHECK:
   - Every room has "floor" property?
   - Every room has "floorTexture" property?
   - Every room has "dimensions" property?
   - Every room has "points" array with 4+ points?

4. ✅ FURNITURE CHECK:
   - Every room (except hallways) has furniture?
   - All furniture has "color" property?
   - All furniture has "floor" property matching room?
   - Furniture positioned INSIDE room bounds?

5. ✅ DESIGN CHECK:
   - Design looks modern and attractive?
   - Colors are harmonious and professional?
   - Room sizes are realistic (4-8m wide)?
   - Layout makes logical sense?

If ANY check fails, FIX IT NOW before responding!

REMEMBER: Quality over speed. Take time to create a PERFECT design!

STEP-BY-STEP LAYOUT PROCESS:

Step 1: Start with first room at origin
Living Room: x: 0 to 7, y: 0 to 6

Step 2: Add adjacent room - SHARE the wall coordinate
Kitchen: x: 7 to 11, y: 0 to 4
(Kitchen STARTS where Living ENDS at x=7)

Step 3: Add room below - SHARE the wall coordinate  
Bedroom: x: 0 to 5, y: 6 to 10
(Bedroom STARTS where Living ENDS at y=6)

Step 4: Add connecting room - SHARE both walls
Bathroom: x: 5 to 8, y: 6 to 9
(Bathroom STARTS where Bedroom ENDS at x=5, and where Living ENDS at y=6)

MANDATORY RULES:
1. NO GAPS: If Room A ends at x=7, Room B MUST start at x=7
2. NO OVERLAPS: Each coordinate belongs to only ONE room
3. Use ONE color palette consistently
4. Vary wall colors for visual interest within the chosen palette
5. Create modern, sophisticated color combinations`;

  const result = await model.generateContent(systemPrompt);
  const response = result.response;
  let text = response.text();
  
  // Clean up response
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  return JSON.parse(text);
}

// Validate and enhance AI-generated plan with strict quality checks
function validateAndFixPlan(aiPlan: any, prompt: string) {
  try {
    if (aiPlan.rooms && aiPlan.rooms.length > 0) {
      console.log(`Received ${aiPlan.rooms.length} rooms from AI`);
      
      // STEP 1: Validate and fix all rooms
      let allRooms = aiPlan.rooms.map((room: any) => {
        // Ensure room has all required properties
        const validatedRoom = {
          ...room,
          name: room.name || 'Room',
          floor: room.floor || 0,
          color: room.color || '#F5F5DC',
          wallColor: room.wallColor || '#FFFFFF',
          floorTexture: room.floorTexture || 'wood',
          dimensions: room.dimensions || { width: 5, height: 4 },
          points: room.points || [
            { x: 0, y: 0 },
            { x: room.dimensions?.width || 5, y: 0 },
            { x: room.dimensions?.width || 5, y: room.dimensions?.height || 4 },
            { x: 0, y: room.dimensions?.height || 4 }
          ]
        };
        
        // Validate points are valid numbers
        validatedRoom.points = validatedRoom.points.map((p: any) => ({
          x: typeof p.x === 'number' && !isNaN(p.x) ? p.x : 0,
          y: typeof p.y === 'number' && !isNaN(p.y) ? p.y : 0
        }));
        
        return validatedRoom;
      });
      
      // STEP 2: Check for colorless walls and fix them
      allRooms = allRooms.map((room: any) => {
        if (!room.wallColor || room.wallColor === '#000000' || room.wallColor === 'undefined') {
          // Assign color based on room type
          const roomType = room.name.toLowerCase();
          if (roomType.includes('living')) {
            room.wallColor = '#C19A6B';
            room.color = '#D4A574';
          } else if (roomType.includes('kitchen')) {
            room.wallColor = '#F5F5F5';
            room.color = '#FFFFFF';
          } else if (roomType.includes('bedroom')) {
            room.wallColor = '#B8A07A';
            room.color = '#C8B08D';
          } else if (roomType.includes('bathroom')) {
            room.wallColor = '#FAFAFA';
            room.color = '#FFFFFF';
          } else {
            room.wallColor = '#E8E8E8';
            room.color = '#F5F5DC';
          }
        }
        return room;
      });
      
      // STEP 3: Handle multi-floor requests
      const isMultiFloor = prompt.toLowerCase().match(/(\d+)[\s-]*(floor|story|level|storey)/);
      const requestedFloors = isMultiFloor ? parseInt(isMultiFloor[1]) : 1;
      
      const floorSet = new Set(allRooms.map((r: any) => r.floor || 0));
      const floorsGenerated = Array.from(floorSet);
      console.log(`Requested ${requestedFloors} floors, AI generated ${floorsGenerated.length} floors`);
      
      if (requestedFloors > floorsGenerated.length && floorsGenerated.length === 1) {
        console.log(`Replicating floor 0 to create ${requestedFloors} floors`);
        const floor0Rooms = allRooms.filter((r: any) => (r.floor || 0) === 0);
        
        for (let floorNum = 1; floorNum < requestedFloors; floorNum++) {
          const newFloorRooms = floor0Rooms.map((room: any) => ({
            ...room,
            name: room.name.replace(/\b1\d{2}\b/, (match: string) => {
              const num = parseInt(match);
              return String((floorNum + 1) * 100 + (num % 100));
            }).replace(/\bApt \d+/, `Apt ${(floorNum + 1)}0${room.name.match(/\d+$/)?.[0] || '1'}`),
            floor: floorNum
          }));
          allRooms = [...allRooms, ...newFloorRooms];
        }
        console.log(`Total rooms after replication: ${allRooms.length}`);
      }
      
      // STEP 4: Add furniture to empty rooms
      let allFurniture = aiPlan.furniture || [];
      allRooms.forEach((room: any) => {
        const roomFurniture = allFurniture.filter((f: any) => 
          (f.floor || 0) === (room.floor || 0) &&
          isInsideRoom(f.position, room)
        );
        
        if (roomFurniture.length === 0 && !room.name.toLowerCase().includes('hallway') && !room.name.toLowerCase().includes('stairwell')) {
          const newFurniture = generateRoomFurniture(room);
          allFurniture = [...allFurniture, ...newFurniture];
        }
      });
      
      // STEP 5: Validate furniture has colors
      allFurniture = allFurniture.map((item: any) => ({
        ...item,
        position: item.position || { x: 0, y: 0 },
        rotation: item.rotation || 0,
        scale: item.scale || { x: 1, y: 1 },
        color: item.color || '#8B4513',
        floor: item.floor || 0
      }));
      
      console.log(`✅ Validation complete: ${allRooms.length} rooms, ${allFurniture.length} furniture items`);
      
      return {
        name: aiPlan.name || `AI Generated ${prompt.split(' ').slice(0, 3).join(' ')}`,
        rooms: allRooms,
        furniture: allFurniture
      };
    }
  } catch (error) {
    console.log("AI plan validation failed, using template:", error);
  }
  
  return generatePerfectLayout(prompt);
}

// Check if furniture is inside room bounds
function isInsideRoom(position: any, room: any): boolean {
  if (!position || !room.points) return false;
  const points = room.points;
  const minX = Math.min(...points.map((p: any) => p.x));
  const maxX = Math.max(...points.map((p: any) => p.x));
  const minY = Math.min(...points.map((p: any) => p.y));
  const maxY = Math.max(...points.map((p: any) => p.y));
  
  return position.x >= minX && position.x <= maxX && position.y >= minY && position.y <= maxY;
}

// Generate basic furniture for a room
function generateRoomFurniture(room: any): any[] {
  const furniture: any[] = [];
  const points = room.points || [];
  if (points.length === 0) return furniture;
  
  const minX = Math.min(...points.map((p: any) => p.x));
  const maxX = Math.max(...points.map((p: any) => p.x));
  const minY = Math.min(...points.map((p: any) => p.y));
  const maxY = Math.max(...points.map((p: any) => p.y));
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const floor = room.floor || 0;
  
  const roomName = room.name.toLowerCase();
  
  // Apartment/Living space
  if (roomName.includes('apt') || roomName.includes('apartment') || roomName.includes('unit')) {
    furniture.push(
      { type: "bed-1", name: "Bed", position: { x: centerX, y: minY + 1.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#2C3E50", floor },
      { type: "nightstand-1", name: "Nightstand", position: { x: centerX + 1.2, y: minY + 1.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8B4513", floor },
      { type: "wardrobe-1", name: "Wardrobe", position: { x: maxX - 0.8, y: centerY }, rotation: 270, scale: { x: 1, y: 1 }, color: "#34495E", floor }
    );
  }
  
  // Office
  if (roomName.includes('office')) {
    furniture.push(
      { type: "desk-1", name: "Desk", position: { x: centerX, y: minY + 1 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8B4513", floor },
      { type: "chair-1", name: "Office Chair", position: { x: centerX, y: minY + 2 }, rotation: 180, scale: { x: 1, y: 1 }, color: "#34495E", floor },
      { type: "bookshelf-1", name: "Bookshelf", position: { x: maxX - 0.5, y: centerY }, rotation: 270, scale: { x: 1, y: 1 }, color: "#654321", floor }
    );
  }
  
  // Hotel room
  if (roomName.includes('room') && (roomName.includes('hotel') || roomName.match(/\d{3}/))) {
    furniture.push(
      { type: "bed-2", name: "Hotel Bed", position: { x: centerX, y: minY + 1.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#2C3E50", floor },
      { type: "nightstand-1", name: "Nightstand", position: { x: centerX + 1.5, y: minY + 1.5 }, rotation: 0, scale: { x: 1, y: 1 }, color: "#8B4513", floor },
      { type: "tv-1", name: "TV", position: { x: centerX, y: maxY - 0.8 }, rotation: 180, scale: { x: 1, y: 1 }, color: "#2C3E50", floor }
    );
  }
  
  return furniture;
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
        color: "#D4A574",
        floorTexture: "wood",
        wallColor: "#C19A6B",
        dimensions: { width: 6.5, height: 5.5 },
        floor: 0
      },
      {
        name: "Kitchen",
        points: [
          { x: 6.5, y: 0 },
          { x: 10.5, y: 0 },
          { x: 10.5, y: 3.5 },
          { x: 6.5, y: 3.5 }
        ],
        color: "#E8D5C4",
        floorTexture: "tile",
        wallColor: "#D4C4B0",
        dimensions: { width: 4, height: 3.5 },
        floor: 0
      },
      {
        name: "Bedroom",
        points: [
          { x: 0, y: 5.5 },
          { x: 5, y: 5.5 },
          { x: 5, y: 9.7 },
          { x: 0, y: 9.7 }
        ],
        color: "#C8B08D",
        floorTexture: "carpet",
        wallColor: "#B8A07A",
        dimensions: { width: 5, height: 4.2 },
        floor: 0
      },
      {
        name: "Bathroom",
        points: [
          { x: 5, y: 5.5 },
          { x: 7.5, y: 5.5 },
          { x: 7.5, y: 7.7 },
          { x: 5, y: 7.7 }
        ],
        color: "#FFFFFF",
        floorTexture: "tile",
        wallColor: "#F5F5F5",
        dimensions: { width: 2.5, height: 2.2 },
        floor: 0
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
        color: "#4A5568",
        floorTexture: "wood",
        wallColor: "#3C4858",
        dimensions: { width: 7.5, height: 6.5 },
        floor: 0
      },
      {
        name: "Dining Room",
        points: [
          { x: 7.5, y: 0 },
          { x: 12.2, y: 0 },
          { x: 12.2, y: 4.5 },
          { x: 7.5, y: 4.5 }
        ],
        color: "#546E7A",
        floorTexture: "wood",
        wallColor: "#455A64",
        dimensions: { width: 4.7, height: 4.5 },
        floor: 0
      },
      {
        name: "Kitchen",
        points: [
          { x: 7.5, y: 4.5 },
          { x: 12.2, y: 4.5 },
          { x: 12.2, y: 8.2 },
          { x: 7.5, y: 8.2 }
        ],
        color: "#FFFFFF",
        floorTexture: "tile",
        wallColor: "#F5F5F5",
        dimensions: { width: 4.7, height: 3.7 },
        floor: 0
      },
      {
        name: "Master Bedroom",
        points: [
          { x: 0, y: 6.5 },
          { x: 6, y: 6.5 },
          { x: 6, y: 11.2 },
          { x: 0, y: 11.2 }
        ],
        color: "#546E7A",
        floorTexture: "carpet",
        wallColor: "#455A64",
        dimensions: { width: 6, height: 4.7 },
        floor: 0
      },
      {
        name: "Bedroom",
        points: [
          { x: 6.5, y: 9 },
          { x: 10.7, y: 9 },
          { x: 10.7, y: 13 },
          { x: 6.5, y: 13 }
        ],
        color: "#607D8B",
        floorTexture: "carpet",
        wallColor: "#546E7A",
        dimensions: { width: 4.2, height: 4 },
        floor: 0
      },
      {
        name: "Bathroom",
        points: [
          { x: 10.7, y: 9 },
          { x: 13.2, y: 9 },
          { x: 13.2, y: 11.5 },
          { x: 10.7, y: 11.5 }
        ],
        color: "#FFFFFF",
        floorTexture: "tile",
        wallColor: "#FAFAFA",
        dimensions: { width: 2.5, height: 2.5 },
        floor: 0
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
