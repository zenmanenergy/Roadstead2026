// Character hitbox configuration
const HITBOX = {
	SPRITE_WIDTH: 192,
	SPRITE_HEIGHT: 192,
	CENTER_OFFSET_X: 96,  // Half of sprite width
	CENTER_OFFSET_Y: 96,  // Half of sprite height
	FEET_OFFSET: 84,      // Distance from center to feet
	
	// Get center hitbox position
	getCenter(x, y) {
		return {
			x: x + this.CENTER_OFFSET_X,
			y: y + this.CENTER_OFFSET_Y
		};
	},
	
	// Get feet hitbox position (for doors and walkable areas)
	getFeet(x, y) {
		return {
			x: x + this.CENTER_OFFSET_X,
			y: y + this.CENTER_OFFSET_Y + this.FEET_OFFSET
		};
	},
	
	// Shift polygon from center-based to feet-based coordinates
	shiftPolygonToFeet(points) {
		return points;  // No shift - walkable areas are already correct
	}
};
