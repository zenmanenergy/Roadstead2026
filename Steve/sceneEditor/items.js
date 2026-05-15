// Items Tab Module

let items = [];
let ingameFiles = [];
let inventoryFiles = [];

function initializeItemSelect() {
	// Fetch list of items from both folders
	Promise.all([
		fetch('../absnormal/assets/items/ingame/')
			.then(r => r.text())
			.catch(() => ''),
		fetch('../absnormal/assets/items/inventory/')
			.then(r => r.text())
			.catch(() => '')
	]).then(([ingameHtml, inventoryHtml]) => {
		// Extract filenames from directory listing
		ingameFiles = extractFilenames(ingameHtml);
		inventoryFiles = extractFilenames(inventoryHtml);
		
		// Sort for easier browsing
		ingameFiles.sort();
		inventoryFiles.sort();
		
		// Populate in-game image dropdown
		const ingameSelect = document.getElementById('itemIngameSelect');
		if (ingameSelect) {
			ingameSelect.innerHTML = '<option value="">-- Select In-Game Image --</option>';
			ingameFiles.forEach(file => {
				const option = document.createElement('option');
				option.value = file;
				option.textContent = file;
				ingameSelect.appendChild(option);
			});
		}
		
		// Populate inventory image dropdowns
		['itemInventorySelect1', 'itemInventorySelect2'].forEach(id => {
			const inventorySelect = document.getElementById(id);
			if (inventorySelect) {
				inventorySelect.innerHTML = '<option value="">-- Select Inventory Image --</option>';
				inventoryFiles.forEach(file => {
					const option = document.createElement('option');
					option.value = file;
					option.textContent = file;
					inventorySelect.appendChild(option);
				});
			}
		});
	});
}

function extractFilenames(html) {
	const fileRegex = /href="([^"]+\.(png|jpg|jpeg))"/gi;
	const matches = [];
	let match;
	while ((match = fileRegex.exec(html)) !== null) {
		matches.push(match[1]);
	}
	return matches;
}

function addItem() {
	const ingameImage = document.getElementById('itemIngameSelect').value;
	const inventoryImage1 = document.getElementById('itemInventorySelect1').value;
	const inventoryImage2 = document.getElementById('itemInventorySelect2').value;

	if (!ingameImage || !inventoryImage1 || !inventoryImage2) {
		alert('Please select in-game image, inventory image 1, and inventory image 2');
		return false;
	}

	// Switch to item mode
	currentMode = 'item';
	points = [];

	// Load the ingame image for preview
	const img = new Image();
	img.src = `../absnormal/assets/items/ingame/${ingameImage}`;
	img.onload = () => {
		currentItemIngameImage = img;
		// Reset mouse to trigger redraw if it was moved
		if (currentMouseX !== null) {
			redraw();
		}
	};
	img.onerror = () => {
		alert('Could not load image: ' + ingameImage);
		currentItemIngameImage = null;
	};

	// Instructions message - user clicks canvas to place
	alert('Move your mouse over the canvas and click to place the item');
	return true;
}

function placeItem(x, y) {
	const ingameImage = document.getElementById('itemIngameSelect').value;
	const inventoryImage1 = document.getElementById('itemInventorySelect1').value;
	const inventoryImage2 = document.getElementById('itemInventorySelect2').value;

	if (!ingameImage || !inventoryImage1 || !inventoryImage2) {
		alert('Please select in-game image, inventory image 1, and inventory image 2');
		return;
	}
	
	// Extract item name from inventory image 1 (without extension)
	const itemName = inventoryImage1.replace(/\.(png|jpg|jpeg)$/i, '');
	const lookMessage = document.getElementById('itemLookMessage').value.trim();
	
	// Load the ingame image
	const img = new Image();
	img.src = `../absnormal/assets/items/ingame/${ingameImage}`;
	img.onload = () => {
		items.push({ 
			x, 
			y, 
			name: itemName,
			ingameImage,
			inventoryImage1,
			inventoryImage2,
			lookMessage,
			imageObj: img
		});
		
		// Reset selections after placing
		document.getElementById('itemIngameSelect').value = '';
		document.getElementById('itemInventorySelect1').value = '';
		document.getElementById('itemInventorySelect2').value = '';
		document.getElementById('itemLookMessage').value = '';
		
		// Clear preview
		currentItemIngameImage = null;
		currentMouseX = null;
		currentMouseY = null;
		
		updateOutput();
		redraw();
	};
	img.onerror = () => {
		alert('Could not load image: ' + ingameImage);
	};
}

function deleteItem(index) {
	items.splice(index, 1);
	updateOutput();
	populateFormFields();
	redraw();
}

function populateItemsPanel() {
	const itemsContainer = document.getElementById('itemsListContainer');
	const itemsList = document.getElementById('itemsList');
	
	if (items.length > 0) {
		itemsContainer.style.display = 'block';
		itemsList.innerHTML = items.map((item, index) => `
			<div style="padding: 8px; background: #2d2d30; margin-bottom: 6px; border-radius: 3px; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
				<div>
					<div><strong>${item.name}</strong></div>
					<div>In-Game: <span style="color: #ce9178;">${item.ingameImage}</span></div>
				<div>Inventory 1: <span style="color: #ce9178;">${item.inventoryImage1}</span></div>
				<div>Inventory 2: <span style="color: #ce9178;">${item.inventoryImage2}</span></div>
					<div>Position: (${Math.round(item.x)}, ${Math.round(item.y)})</div>
					${item.lookMessage ? `<div>Look: <span style="color: #9cdcfe;">${item.lookMessage}</span></div>` : ''}
				</div>
				<button onclick="deleteItem(${index})" style="padding: 4px 8px; font-size: 10px; background: #d13438; color: white; border: none; border-radius: 2px; cursor: pointer;">Delete</button>
			</div>
		`).join('');
	} else {
		itemsContainer.style.display = 'none';
	}
}

function clearItems() {
	items = [];
}

function getItemsForOutput() {
	return items.map(item => {
		const out = {
			name: item.name,
			ingameImage: item.ingameImage,
			inventoryImage1: item.inventoryImage1,
			inventoryImage2: item.inventoryImage2,
			x: item.x,
			y: item.y
		};
		if (item.lookMessage) out.lookMessage = item.lookMessage;
		return out;
	});
}
