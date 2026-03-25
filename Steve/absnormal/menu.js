// DOTT-style menu system
let currentVerb = 'give';
let inventory = [];
let inventoryPage = 0;
const maxInventorySlots = 6;

// Initialize menu
document.addEventListener('DOMContentLoaded', () => {
	const verbButtons = document.querySelectorAll('.verb-btn');
	
	verbButtons.forEach(btn => {
		btn.addEventListener('click', (e) => {
			setVerb(e.target.dataset.verb);
		});
	});
	
	// Inventory button listeners
	document.getElementById('invUp').addEventListener('click', scrollInventoryUp);
	document.getElementById('invDown').addEventListener('click', scrollInventoryDown);
	
	// Inventory slot listeners
	const slots = document.querySelectorAll('.inv-slot');
	slots.forEach(slot => {
		slot.addEventListener('click', (e) => {
			handleInventorySlotClick(e.target.dataset.slot);
		});
	});
	
	// Set initial active button
	setVerb('give');
});

// Set the active verb and update UI
function setVerb(verb) {
	currentVerb = verb;
	
	// Update current verb display
	
	
	// Update button styling
	const verbButtons = document.querySelectorAll('.verb-btn');
	verbButtons.forEach(btn => {
		if (btn.dataset.verb === verb) {
			btn.classList.add('active');
		} else {
			btn.classList.remove('active');
		}
	});
}

// Get the current selected verb
function getCurrentVerb() {
	return currentVerb;
}

// Add item to inventory
function addToInventory(item) {
	if (inventory.length < maxInventorySlots) {
		inventory.push(item);
		updateInventoryDisplay();
		return true;
	}
	return false;
}

// Remove item from inventory
function removeFromInventory(index) {
	if (index >= 0 && index < inventory.length) {
		inventory.splice(index, 1);
		updateInventoryDisplay();
		return true;
	}
	return false;
}

// Get inventory item at index
function getInventoryItem(index) {
	return inventory[index] || null;
}

// Scroll inventory up
function scrollInventoryUp() {
	if (inventoryPage > 0) {
		inventoryPage--;
		updateInventoryDisplay();
	}
}

// Scroll inventory down
function scrollInventoryDown() {
	if (inventoryPage < Math.max(0, Math.ceil(inventory.length / maxInventorySlots) - 1)) {
		inventoryPage++;
		updateInventoryDisplay();
	}
}

// Update inventory display
function updateInventoryDisplay() {
	const slots = document.querySelectorAll('.inv-slot');
	const startIndex = inventoryPage * maxInventorySlots;
	
	slots.forEach((slot, index) => {
		const itemIndex = startIndex + index;
		const item = inventory[itemIndex];
		
		if (item) {
			// Item is stored as object with name and imagePath
			const imagePath = typeof item === 'string' ? `assets/items/${item.toLowerCase()}.png` : item.imagePath;
			slot.style.backgroundImage = `url('${imagePath}')`;
			slot.classList.add('filled');
		} else {
			slot.style.backgroundImage = 'none';
			slot.classList.remove('filled');
		}
	});
}

// Handle inventory slot click
function handleInventorySlotClick(slot) {
	const itemIndex = (inventoryPage * maxInventorySlots) + parseInt(slot);
	const item = getInventoryItem(itemIndex);
	
	if (item) {
		// Item selected - you can use this with the current verb
		console.log(`Selected item: ${item} with verb: ${currentVerb}`);
	}
}
