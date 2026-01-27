# Scene Editor

A visual editor for defining walkable areas and door hitboxes in game scenes.

## What It Does

The Scene Editor allows you to draw polygons on background images to define:
- **Walkable Areas** - regions where the player character can move
- **Door Hitboxes** - regions that trigger door interactions

The editor generates JSON files that are used by the game engine to validate player movement and detect door collisions.

## How to Use

1. **Select a Background Image** - Choose a room from the dropdown (e.g., `room_bedroom.png`)
2. **Choose Polygon Type** - Select "Walkable" or "Door" radio button
3. **Draw Polygons** - Click on the canvas to place points for your polygon
4. **Finish Polygon** - Once you have at least 3 points, switch to the other type or switch back to automatically finish the current polygon
5. **Copy JSON** - The JSON output appears on the right side automatically
6. **Save the JSON** - Copy the text and paste it into the appropriate `.json` file in `absnormal/data/`

### Polygon Colors
- **Yellow** - Current walkable polygon being drawn
- **Orange** - Current door polygon being drawn  
- **Green** - Finished walkable polygons
- **Red** - Finished door polygons

## Output Format

The editor generates JSON in this format:

```json
{
  "image": "assets/backgrounds/room_bedroom.png",
  "walkableAreas": [
    {
      "points": [[x1, y1], [x2, y2], [x3, y3], ...]
    }
  ],
  "doors": [
    {
      "points": [[x1, y1], [x2, y2], [x3, y3], ...]
    }
  ]
}
```

Each polygon is defined as an array of `[x, y]` coordinate points.

## File Locations

Save the JSON output to: `absnormal/data/[scenename].json`

Examples:
- `absnormal/data/room_bedroom.json`
- `absnormal/data/room_city.json`
- `absnormal/data/room_lab.json`

## Code Structure

### index.html
- UI layout with dropdown selector, radio buttons for polygon type, and canvas/textarea panels
- Split view: canvas on left, JSON output on right

### style.css
- Flexbox layout for responsive design
- Dark theme with syntax-highlighted textarea
- Crosshair cursor on canvas

### editor.js
- **Canvas Events** - Click handler to record polygon points with proper coordinate scaling
- **Polygon Management** - Separate arrays for `walkablePolygons` and `doorPolygons`
- **Drawing** - Renders background, completed polygons in their colors, and current polygon being drawn
- **JSON Generation** - Creates properly formatted JSON that updates in real-time

## Key Functions

- `canvas.addEventListener('click')` - Records points on canvas
- `finishPolygon()` - Saves current polygon to appropriate array (minimum 3 points)
- `clearPolygons()` - Resets everything and clears JSON
- `draw()` - Renders canvas with background and all polygons
- `drawPolygon(points, color)` - Draws individual polygon with semi-transparent fill and point markers
- `generateJSON()` - Creates JSON output including both walkable and door polygons

## Game Integration

The generated JSON files are loaded by the game engine to:
1. Validate player movement (keep character within walkable areas)
2. Detect door collisions (trigger interactions when player enters door hitbox)
3. Provide collision detection using point-in-polygon algorithms
