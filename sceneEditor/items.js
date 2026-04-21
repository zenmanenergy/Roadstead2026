//Items Tab Module

let items = [];
let ingameFiles = [];
let inventoryFiles = [];

function initializeItemSelect() {
    //fetch list of items from both folders
    Promise.all ([
        fetch ('../absnormal/assets/items/ingame/')
            .then (r=r.text())
            .catch (() => ''),
        fetch ('.../absnormal/assets/items/inventory/')
            .then (r => r.text ())
            .catch(() => '')
    ]) .then(([ingameHtml, inventoryHTML]) => {
        //extract filenames from directory listing
        ingameFiles = extractFilenames(ingameHtml);
        inventoryFiles = extractFilenames(inventoryHtml);

        //sort for easier browsing
        ingameFiles.sort();
        inventoryFiles.sort();

        //populate in-game image dropdown
        const ingameSelect = document.getElementById('itemIngameSelect');
        if (imageSelect) {
            ingameSelect.innerHTML = '<option value=">-- Select In-Game Image -- </option>';
            ingameFiles.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                inventorySelect.appendChild(option);
            });
        }
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
    const inventoryImage = document.getElementById('itemInventorySelect').value;

    if (!ingameImage || !inventoryImage) {
        alert('please select both in-game and inventory images');
        return false;
    }

    //switch current mode
    currentMode = 'item';
    points = [];

    //load the ingame image for preview 
    const img = new Image();
    img.src = `../absnormal/assets/items/ingame/${ingameImage}`;
    img.onload = () => {
        currentItemIngameImage = img;
        //reset mouse to trigger redraw if it was moved
        if (currentMouseX !== null) {
            redraw();
        }
    };
    img.onerror = () => {
        alert ('Could not load image: ' + ingameImage);
        currentItemIngameImage = null;
	};

	// Instructions message - user clicks canvas to place
	alert('Move your mouse over the canvas and click to place the item');
	return true;
}

function placeItem(x, y) {
	const ingameImage = document.getElementById('itemIngameSelect').value;
	const inventoryImage = document.getElementById('itemInventorySelect').value;
	
	if (!ingameImage || !inventoryImage) {
		alert('Please select both images first');
		return;
	}
    
	// Extract item name from inventory image (without extension)
	const itemName = inventoryImage.replace(/\.(png|jpg|jpeg)$/i, '');
	
	// Load the ingame image
	const img = new Image();
	img.src = `../absnormal/assets/items/ingame/${ingameImage}`;
	img.onload = () => {
		items.push({ 
			x, 
			y, 
			name: itemName,
			ingameImage,
			inventoryImage,
			imageObj: img
		});
		
		// Reset selections after placing
		document.getElementById('itemIngameSelect').value = '';
		document.getElementById('itemInventorySelect').value = '';
		
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
					<div>Inventory: <span style="color: #ce9178;">${item.inventoryImage}</span></div>
					<div>Position: (${Math.round(item.x)}, ${Math.round(item.y)})</div>
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
	return items.map(item => ({
		name: item.name,
		ingameImage: item.ingameImage,
		inventoryImage: item.inventoryImage,
		x: item.x,
		y: item.y
	}));
}
