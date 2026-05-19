// NPCs Tab Module

let npcs = [];
let npcFiles = [];

function initializeNPCSelect() {
	fetch('../absnormal/assets/characters/')
		.then(r => r.text())
		.catch(() => '')
		.then((html) => {
			const folders = extractFolderNames(html);
			folders.sort();

			const folderSelect = document.getElementById('npcFOlderSelect');
			if (folderSelect) {
				folderSelect.innerHTML = '<option value="">-- Select NPC --</option>';
				folders.forEach(folder => {
					const option = document.createElement('option');
					option.value = folder;
					option.textContent = folder;
					folderSelect.appendChild(option);
				});
			}
		});
}

function onNPCFolderChange(folder) {
	const frameSelect = document.getElementById('npcImageSelect');
	frameSelect.innerHTML = '<option value="">-- Loading frames... --</option>';
	if (!folder) return;

	fetch(`../absnormal/assets/characters/${folder}/`)
		.then(r =>r.text())
		.catch(() => '')
		.then(html => {
			const files = extractFilenames(html);
			files.sort();
			frameSelect.innerHTML = '<option value="">-- Select Frame --</option>';
			files.forEach(file => {
				const option = document.createElement('option');
				option.value = file;
				option.textContent = file;
				frameSelect.appendChild(option);
			});
		});
}

function extractFolderNames(html) {
	const fileRegex = /href="([a-zA-Z0-9][^"]*\/)"/gi;
	const matches = []
	let match;
	while ((match = fileRegex.exec(html)) !== null) {
		const name = match[1].replace(/\$/, '');
		matches.push(name);
	}
	return matches;
}

function addNPC() {
	const npcFolder = document.getElementById('npcFolderSelect').value;
	const npcImage = document.getElementById('npcImageSelect').value;
	const name = document.getElementById('npcName').value;

	if (!npcFolder || !npcImage || !name) {
		alert('Please fill in NPC, a display frame, and enter a name');
		return false;
	}

	currentMode = 'npc';
	points = [];

	const img = new Image();
	img.src = `../absnormal/assets/characters/${npcFolder}/${npcImage}`;
	img.onload = () => {
		currentNPCImage = img;
		if (currentMouseX !== null) {
			redraw()
		}
	};
	img.onerror = () => {
		alert('Could not load image: ' + npcImage);
		currentNPCImage = null;
	};

	return true;
}

function placeNPC(x, y) {
	const npcFolder = document.getElementById('npcFolderSelect').value;
	const npcImage = document.getElementById('npcImageSelect').value;
	const name = document.getElementById('npcName').value || 'NPC';

	const img = new Image();
	img.src = `../absnormal/assets/character/${npcFolder}/${npcImage}`;
	img.onload = () => {
		npcs.push({
			x,
			y,
			name,
			npcFolder,
			npcImage,
			imageObj: img
		});

		document.getElementById('npcFolderSelect').value = '';
		document.getElementById('npcImageSelect').innerHTML = '<option value="">-- Select Folder First --</option>';
		document.getElementById('npcName').value = '';

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
				<div>Folder: <span style="color: #ce9178;">${npc.npcFolder || ''}</span></div>
				<div>Frame: <span style="color: #ce9178;">${npc.npcImage}</span></div>
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
		npcFolder: npc.npcFolder || '',
		type: npc.type
	}));
}
