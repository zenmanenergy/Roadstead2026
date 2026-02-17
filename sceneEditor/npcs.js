// NPCs Tab Module

let npcs = [];

function addNPC() {
	const name = document.getElementById('npcName').value;
	const type = document.getElementById('npcType').value;

	if (!name || !type) {
		alert('Please fill in NPC name and type');
		return false;
	}

	// Instructions message - user clicks canvas to place
	alert('Click on canvas to place the NPC');
	return true;
}

function placeNPC(x, y) {
	const name = document.getElementById('npcName').value || 'NPC';
	const type = document.getElementById('npcType').value || 'npc';
	npcs.push({ x, y, name, type });
	updateOutput();
	redraw();
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
					<div>Type: <span style="color: #ce9178;">${npc.type}</span></div>
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
		type: npc.type
	}));
}
