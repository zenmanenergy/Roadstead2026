// NPCs Tab Module

let npcs = [];
let npcFiles = [];

function initializeNPCSelect() {
	// Fetch list of NPCs from characters folder
	fetch('../absnormal/assets/characters/')
		.then(r => r.text())
		.catch(() => '')
		.then((html) => {
			// Extract filenames from directory listing
			npcFiles = extractFilenames(html);
			
			// Sort for easier browsing
			npcFiles.sort();
			
			// Populate NPC image dropdown
			const npcSelect = document.getElementById('npcImageSelect');
			if (npcSelect) {
				npcSelect.innerHTML = '<option value="">-- Select NPC Image --</option>';
				npcFiles.forEach(file => {
					const option = document.createElement('option');
					option.value = file;
					option.textContent = file;
					npcSelect.appendChild(option);
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

function addNPC() {
	const npcImage = document.getElementById('npcImageSelect').value;
	const name = document.getElementById('npcName').value;

	if (!npcImage || !name) {
		alert('Please select an NPC image and enter a name');
		return false;
	}

	// Switch to NPC mode
	currentMode = 'npc';
	points = [];

	// Load the NPC image for preview
	const img = new Image();
	img.src = `../absnormal/assets/characters/${npcImage}`;
	img.onload = () => {
		currentNPCImage = img;
		// Reset mouse to trigger redraw if it was moved
		if (currentMouseX !== null) {
			redraw();
		}
	};
	img.onerror = () => {
		alert('Could not load image: ' + npcImage);
		currentNPCImage = null;
	};

	return true;
}

function placeNPC(x, y) {
	const npcImage = document.getElementById('npcImageSelect').value;
	const name = document.getElementById('npcName').value;
	
	// Load and place the NPC image
	const img = new Image();
	img.src = `../absnormal/assets/characters/${npcImage}`;
	img.onload = () => {
		npcs.push({ 
			x, 
			y, 
			name,
			npcImage,
			imageObj: img
		});
		
		// Reset selections after placing
		document.getElementById('npcImageSelect').value = '';
		document.getElementById('npcName').value = '';
		
		// Clear preview
		currentNPCImage = null;
		currentMouseX = null;
		currentMouseY = null;
		
		updateOutput();
		redraw();
	};
}

function deleteNPC(index) {
	npcs.splice(index, 1);
	updateOutput();
	populateFormFields();
	redraw();
}

function populateNPCsPanel() {
	const npcsContainer = document.getElementById('npcsListContainer');
	const npcsList = document.getElementById('npcsList');
	
	if (npcs.length > 0) {
		npcsContainer.style.display = 'block';
		npcsList.innerHTML = npcs.map((npc, index) => `
			<div style="padding: 8px; background: #2d2d30; margin-bottom: 6px; border-radius: 3px; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
				<div>
					<div><strong>${npc.name}</strong></div>
					<div>Image: <span style="color: #ce9178;">${npc.npcImage}</span></div>
					<div>Position: (${Math.round(npc.x)}, ${Math.round(npc.y)})</div>
				</div>
				<button onclick="deleteNPC(${index})" style="padding: 4px 8px; font-size: 10px; background: #d13438; color: white; border: none; border-radius: 2px; cursor: pointer;">Delete</button>
			</div>
		`).join('');
	} else {
		npcsContainer.style.display = 'none';
	}
}

function clearNPCs() {
	npcs = [];
}

function getNPCsForOutput() {
	return npcs.map(npc => ({
		x: npc.x,
		y: npc.y,
		name: npc.name,
		npcImage: npc.npcImage
	}));
}
