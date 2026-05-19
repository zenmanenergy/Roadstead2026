// Action definitions and UI helpers for the scene editor

const SCENE_NAMES = ['bedroom', 'room_lab', 'room_city_0', 'room_city_1', 'room_doctor', 'room_pharmacy'];

const ACTION_DEFS = [
	{
		id: 'showMessage',
		label: 'Show Message',
		description: 'Displays text in the status bar at the bottom of the screen for 3 seconds.',
		params: [
			{ name: 'message', type: 'text', label: 'Message',
			  description: 'The text that appears in the status bar.' }
		]
	},
	{
		id: 'showCantDo',
		label: "Can't Do",
		description: 'Shows a failure message. Use this when the player tries something that should not work.',
		params: [
			{ name: 'message', type: 'text', label: 'Message',
			  description: 'Optional. If left blank, the game will say "I can\'t do that."' }
		]
	},
	{
		id: 'takeItem',
		label: 'Take Item',
		description: 'Picks up this item and adds it to the player\'s inventory. The item disappears from the scene.',
		params: []
	},
	{
		id: 'removeItem',
		label: 'Remove From Inventory',
		description: 'Takes a specific item out of the player\'s inventory.',
		params: [
			{ name: 'itemName', type: 'itemSelect', label: 'Item',
			  description: 'The inventory item to remove from the player.' }
		]
	},
	{
		id: 'swapItem',
		label: 'Swap Item',
		description: 'Removes one inventory item. Combine with chainActions to give a different item at the same time.',
		params: [
			{ name: 'removeItem', type: 'itemSelect', label: 'Take Away',
			  description: 'The item to remove from the player\'s inventory.' },
			{ name: 'giveItem', type: 'text', label: 'Give Back (name)',
			  description: 'The name of the item to give back. That item must be added separately in chainActions.' }
		]
	},
	{
		id: 'combineItems',
		label: 'Combine Items',
		description: 'Checks if the player has both items. If yes, removes them both and shows a message.',
		params: [
			{ name: 'item1', type: 'itemSelect', label: 'Item 1',
			  description: 'The first inventory item the player must have.' },
			{ name: 'item2', type: 'itemSelect', label: 'Item 2',
			  description: 'The second inventory item the player must have.' },
			{ name: 'result', type: 'text', label: 'Result Name',
			  description: 'A name for the combined result, shown in the status bar.' }
		]
	},
	{
		id: 'requireItem',
		label: 'Require Item',
		description: 'Checks if the player has a specific item, then runs one of two actions depending on the result.',
		params: [
			{ name: 'itemName', type: 'itemSelect', label: 'Required Item',
			  description: 'The player must have this item in their inventory.' },
			{ name: 'onSuccess', type: 'actionPicker', label: 'If Player Has It',
			  description: 'This action runs when the player HAS the required item.' },
			{ name: 'onFail', type: 'actionPicker', label: 'If Player Lacks It',
			  description: 'This action runs when the player does NOT have the required item.' }
		]
	},
	{
		id: 'startDialog',
		label: 'Start Dialog',
		description: 'Triggers a named conversation. The dialog system will be built separately.',
		params: [
			{ name: 'dialogId', type: 'text', label: 'Dialog ID',
			  description: 'A unique name for this conversation, e.g. "doctorGreeting". You\'ll use this same ID when building the dialog system.' }
		]
	},
	{
		id: 'changeScene',
		label: 'Change Scene',
		description: 'Immediately moves the player to a different scene.',
		params: [
			{ name: 'scene', type: 'sceneSelect', label: 'Scene',
			  description: 'The scene the player will be transported to.' }
		]
	},
	{
		id: 'setFlag',
		label: 'Set Flag',
		description: 'Sets a named true/false flag in the game. Flags persist the whole session and can be tested with Check Flag.',
		params: [
			{ name: 'flag', type: 'text', label: 'Flag Name',
			  description: 'Invent a name for this flag, e.g. "labDoorOpen" or "talkedToDoctor". Use this same name in Check Flag.' },
			{ name: 'value', type: 'checkbox', label: 'Set to True',
			  description: 'Checked = set the flag to true. Unchecked = set the flag to false.' }
		]
	},
	{
		id: 'checkFlag',
		label: 'Check Flag',
		description: 'Tests whether a named flag is true or false, then runs one of two actions depending on the result.',
		params: [
			{ name: 'flag', type: 'text', label: 'Flag Name',
			  description: 'The exact name of the flag to test. Must match the name used in Set Flag.' },
			{ name: 'onTrue', type: 'actionPicker', label: 'If Flag is True',
			  description: 'Runs this action when the flag is TRUE.' },
			{ name: 'onFalse', type: 'actionPicker', label: 'If Flag is False',
			  description: 'Runs this action when the flag is FALSE.' }
		]
	},
	{
		id: 'openObject',
		label: 'Open Object',
		description: 'Swaps a scene item\'s image to show it in an open state (e.g. a door opening, a box lid lifting).',
		params: [
			{ name: 'itemName', type: 'itemSelect', label: 'Item',
			  description: 'The scene item whose image will change.' },
			{ name: 'newImage', type: 'text', label: 'Open Image Filename',
			  description: 'Filename of the open-state image, e.g. "door_open.png". Must exist in the items/ingame/ folder.' }
		]
	},
	{
		id: 'closeObject',
		label: 'Close Object',
		description: 'Swaps a scene item\'s image to show it in a closed state.',
		params: [
			{ name: 'itemName', type: 'itemSelect', label: 'Item',
			  description: 'The scene item whose image will change.' },
			{ name: 'newImage', type: 'text', label: 'Closed Image Filename',
			  description: 'Filename of the closed-state image. Must exist in the items/ingame/ folder.' }
		]
	},
	{
		id: 'hideItem',
		label: 'Hide Item',
		description: 'Makes this item disappear from the scene without adding it to inventory. Use for items consumed or used in place.',
		params: []
	},
	{
		id: 'replaceItem',
		label: 'Replace Item',
		description: 'Hides one scene item and makes another visible. Use when an object transforms into something different.',
		params: [
			{ name: 'oldItem', type: 'itemSelect', label: 'Item to Hide',
			  description: 'This scene item will disappear.' },
			{ name: 'newItem', type: 'itemSelect', label: 'Item to Show',
			  description: 'This scene item will appear. It must already exist in the scene JSON.' }
		]
	},
	{
		id: 'chainActions',
		label: 'Chain Actions',
		description: 'Runs multiple actions one after another. Use this to combine simple actions into a complex interaction.',
		params: [
			{ name: 'actions', type: 'actionList', label: 'Actions in Order',
			  description: 'Each action in this list runs in sequence, top to bottom.' }
		]
	}
];

const ITEM_VERBS = ['look', 'take', 'use', 'give', 'open', 'close', 'push', 'pull'];
const NPC_VERBS  = ['look', 'talk', 'use', 'give'];

// ===== Build verb action rows =====
function buildVerbActionRows(containerId, targetType) {
	const container = document.getElementById(containerId);
	if (!container) return;
	const verbs = targetType === 'npc' ? NPC_VERBS : ITEM_VERBS;
	container.innerHTML = '';

	verbs.forEach(verb => {
		const row = document.createElement('div');
		row.style.cssText = 'margin-bottom:6px; padding:6px; background:#2d2d30; border-radius:3px;';

		const header = document.createElement('div');
		header.style.cssText = 'display:flex; align-items:center; gap:8px;';

		const verbLabel = document.createElement('label');
		verbLabel.textContent = `on ${verb}:`;
		verbLabel.style.cssText = 'font-size:11px; color:#9cdcfe; min-width:60px; flex-shrink:0;';
		header.appendChild(verbLabel);

		const select = document.createElement('select');
		select.id = `${targetType}-${verb}-action`;
		select.style.cssText = 'flex:1; padding:2px 4px; font-size:11px; background:#1e1e1e; color:#d4d4d4; border:1px solid #3e3e42; border-radius:2px;';

		const defOpt = document.createElement('option');
		defOpt.value = '';
		defOpt.textContent = '-- No Action --';
		select.appendChild(defOpt);
		ACTION_DEFS.forEach(def => {
			const opt = document.createElement('option');
			opt.value = def.id;
			opt.textContent = def.label;
			select.appendChild(opt);
		});

		select.onchange = () => {
			const def = ACTION_DEFS.find(d => d.id === select.value);
			const descEl = document.getElementById(`${targetType}-${verb}-action-desc`);
			if (descEl) {
				descEl.textContent = def ? def.description : '';
				descEl.style.display = def ? 'block' : 'none';
			}
			renderActionParams(`${targetType}-${verb}`, false);
		};

		header.appendChild(select);
		row.appendChild(header);

		const actionDesc = document.createElement('div');
		actionDesc.id = `${targetType}-${verb}-action-desc`;
		actionDesc.style.cssText = 'display:none; font-size:10px; color:#858585; margin:4px 0 0 68px; padding:4px 6px; background:#1a1a1a; border-left:2px solid #007acc; border-radius:2px;';
		row.appendChild(actionDesc);

		const paramsDiv = document.createElement('div');
		paramsDiv.id = `${targetType}-${verb}-params`;
		paramsDiv.style.cssText = 'margin-top:2px;';
		row.appendChild(paramsDiv);

		container.appendChild(row);
	});
}

// ===== Render param inputs =====
function renderActionParams(prefix, isNested) {
	const paramsContainer = document.getElementById(`${prefix}-params`);
	if (!paramsContainer) return;
	paramsContainer.innerHTML = '';

	const select = document.getElementById(`${prefix}-action`);
	if (!select || !select.value) return;
	const def = ACTION_DEFS.find(d => d.id === select.value);
	if (!def || def.params.length === 0) return;

	const indent = isNested ? '0' : '68px';

	def.params.forEach(param => {
		if (isNested && (param.type === 'actionPicker' || param.type === 'actionList')) return;

		const paramId = `${prefix}-param-${param.name}`;

		const wrapper = document.createElement('div');
		wrapper.style.cssText = `margin-top:6px; padding-left:${indent};`;

		const labelRow = document.createElement('div');
		labelRow.style.cssText = 'display:flex; align-items:center; gap:6px;';

		const lbl = document.createElement('label');
		lbl.textContent = param.label + ':';
		lbl.style.cssText = 'font-size:10px; color:#9cdcfe; min-width:90px; flex-shrink:0; cursor:pointer; text-decoration:underline dotted; text-underline-offset:2px;';
		lbl.title = 'Click for help';
		lbl.onclick = () => {
			const d = document.getElementById(`${paramId}-desc`);
			if (d) d.style.display = d.style.display === 'none' ? 'block' : 'none';
		};
		labelRow.appendChild(lbl);

		if (param.type === 'text') {
			const input = document.createElement('input');
			input.type = 'text';
			input.id = paramId;
			input.style.cssText = 'flex:1; padding:2px 4px; font-size:11px; background:#1e1e1e; color:#d4d4d4; border:1px solid #3e3e42; border-radius:2px;';
			labelRow.appendChild(input);
		} else if (param.type === 'checkbox') {
			const input = document.createElement('input');
			input.type = 'checkbox';
			input.id = paramId;
			input.checked = true;
			labelRow.appendChild(input);
		} else if (param.type === 'itemSelect') {
			labelRow.appendChild(buildItemSelect(paramId));
		} else if (param.type === 'sceneSelect') {
			labelRow.appendChild(buildSceneSelect(paramId));
		}

		wrapper.appendChild(labelRow);

		const descDiv = document.createElement('div');
		descDiv.id = `${paramId}-desc`;
		descDiv.textContent = param.description;
		descDiv.style.cssText = 'display:none; font-size:10px; color:#858585; margin-top:3px; padding:3px 6px; background:#1a1a1a; border-left:2px solid #007acc; border-radius:2px;';
		wrapper.appendChild(descDiv);

		if (param.type === 'actionPicker' && !isNested) {
			const pickerDiv = document.createElement('div');
			pickerDiv.style.cssText = 'margin-top:4px; border:1px solid #3e3e42; border-radius:2px; padding:6px; background:#252526;';
			buildMiniPicker(pickerDiv, paramId);
			wrapper.appendChild(pickerDiv);
		}

		if (param.type === 'actionList' && !isNested) {
			const listWrapper = document.createElement('div');
			listWrapper.style.cssText = 'margin-top:4px;';

			const countInput = document.createElement('input');
			countInput.type = 'hidden';
			countInput.id = `${paramId}-count`;
			countInput.value = '0';
			listWrapper.appendChild(countInput);

			const listEl = document.createElement('div');
			listEl.id = `${paramId}-list`;
			listWrapper.appendChild(listEl);

			const addBtn = document.createElement('button');
			addBtn.textContent = '+ Add Action';
			addBtn.type = 'button';
			addBtn.style.cssText = 'margin-top:4px; padding:3px 10px; font-size:10px; background:#0e639c; color:white; border:none; border-radius:2px; cursor:pointer;';
			addBtn.onclick = () => addToActionList(paramId);
			listWrapper.appendChild(addBtn);

			wrapper.appendChild(listWrapper);
		}

		paramsContainer.appendChild(wrapper);
	});
}

// ===== Mini picker (one level deep, used inside actionPicker and actionList rows) =====
function buildMiniPicker(container, prefix) {
	const simpleActions = ACTION_DEFS.filter(d =>
		!d.params.some(p => p.type === 'actionPicker' || p.type === 'actionList')
	);

	const row = document.createElement('div');
	row.style.cssText = 'display:flex; align-items:center; gap:6px;';

	const lbl = document.createElement('label');
	lbl.textContent = 'Action:';
	lbl.style.cssText = 'font-size:10px; color:#aaa; min-width:50px; flex-shrink:0;';
	row.appendChild(lbl);

	const sel = document.createElement('select');
	sel.id = `${prefix}-action`;
	sel.style.cssText = 'flex:1; padding:2px 4px; font-size:10px; background:#1e1e1e; color:#d4d4d4; border:1px solid #3e3e42; border-radius:2px;';
	sel.onchange = () => renderActionParams(prefix, true);

	const defOpt = document.createElement('option');
	defOpt.value = '';
	defOpt.textContent = '-- No Action --';
	sel.appendChild(defOpt);
	simpleActions.forEach(def => {
		const opt = document.createElement('option');
		opt.value = def.id;
		opt.textContent = def.label;
		sel.appendChild(opt);
	});

	row.appendChild(sel);
	container.appendChild(row);

	const paramsDiv = document.createElement('div');
	paramsDiv.id = `${prefix}-params`;
	paramsDiv.style.cssText = 'margin-top:4px;';
	container.appendChild(paramsDiv);
}

// ===== Add a row to a chainActions list =====
function addToActionList(prefix) {
	const countEl = document.getElementById(`${prefix}-count`);
	const count = parseInt(countEl.value) || 0;
	const listEl = document.getElementById(`${prefix}-list`);

	const rowDiv = document.createElement('div');
	rowDiv.id = `${prefix}-row-${count}`;
	rowDiv.style.cssText = 'border:1px solid #3e3e42; border-radius:2px; padding:6px; margin-bottom:4px; background:#252526;';

	buildMiniPicker(rowDiv, `${prefix}-${count}`);

	const removeBtn = document.createElement('button');
	removeBtn.textContent = 'Remove';
	removeBtn.type = 'button';
	removeBtn.style.cssText = 'margin-top:4px; padding:2px 8px; font-size:10px; background:#d13438; color:white; border:none; border-radius:2px; cursor:pointer;';
	removeBtn.onclick = () => { rowDiv.style.display = 'none'; };
	rowDiv.appendChild(removeBtn);

	listEl.appendChild(rowDiv);
	countEl.value = count + 1;
}

// ===== Dropdown builders =====
function buildItemSelect(id) {
	const sel = document.createElement('select');
	sel.id = id;
	sel.style.cssText = 'flex:1; padding:2px 4px; font-size:11px; background:#1e1e1e; color:#d4d4d4; border:1px solid #3e3e42; border-radius:2px;';
	const blank = document.createElement('option');
	blank.value = '';
	blank.textContent = '-- Select Item --';
	sel.appendChild(blank);
	if (typeof items !== 'undefined') {
		items.forEach(item => {
			const opt = document.createElement('option');
			opt.value = item.name;
			opt.textContent = item.name;
			sel.appendChild(opt);
		});
	}
	return sel;
}

function buildSceneSelect(id) {
	const sel = document.createElement('select');
	sel.id = id;
	sel.style.cssText = 'flex:1; padding:2px 4px; font-size:11px; background:#1e1e1e; color:#d4d4d4; border:1px solid #3e3e42; border-radius:2px;';
	const blank = document.createElement('option');
	blank.value = '';
	blank.textContent = '-- Select Scene --';
	sel.appendChild(blank);
	SCENE_NAMES.forEach(scene => {
		const opt = document.createElement('option');
		opt.value = scene;
		opt.textContent = scene;
		sel.appendChild(opt);
	});
	return sel;
}

// ===== Read helpers =====
function readActionDef(prefix) {
	const select = document.getElementById(`${prefix}-action`);
	if (!select || !select.value) return null;
	const actionId = select.value;
	const def = ACTION_DEFS.find(d => d.id === actionId);
	if (!def) return null;

	const params = {};
	def.params.forEach(param => {
		const paramId = `${prefix}-param-${param.name}`;
		if (param.type === 'text' || param.type === 'itemSelect' || param.type === 'sceneSelect') {
			const el = document.getElementById(paramId);
			if (el) params[param.name] = el.value;
		} else if (param.type === 'checkbox') {
			const el = document.getElementById(paramId);
			if (el) params[param.name] = el.checked;
		} else if (param.type === 'actionPicker') {
			const nested = readActionDef(paramId);
			if (nested) params[param.name] = nested;
		} else if (param.type === 'actionList') {
			params[param.name] = readActionList(paramId);
		}
	});

	return { action: actionId, params };
}

function readActionList(prefix) {
	const countEl = document.getElementById(`${prefix}-count`);
	const count = parseInt(countEl ? countEl.value : '0') || 0;
	const result = [];
	for (let i = 0; i < count; i++) {
		const rowEl = document.getElementById(`${prefix}-row-${i}`);
		if (rowEl && rowEl.style.display !== 'none') {
			const action = readActionDef(`${prefix}-${i}`);
			if (action) result.push(action);
		}
	}
	return result;
}

function readAllVerbActions(targetType) {
	const verbs = targetType === 'npc' ? NPC_VERBS : ITEM_VERBS;
	const actions = {};
	verbs.forEach(verb => {
		const def = readActionDef(`${targetType}-${verb}`);
		if (def) actions[verb] = def;
	});
	return Object.keys(actions).length > 0 ? actions : undefined;
}

function resetVerbActions(targetType) {
	const verbs = targetType === 'npc' ? NPC_VERBS : ITEM_VERBS;
	verbs.forEach(verb => {
		const sel = document.getElementById(`${targetType}-${verb}-action`);
		if (sel) sel.value = '';
		const params = document.getElementById(`${targetType}-${verb}-params`);
		if (params) params.innerHTML = '';
		const desc = document.getElementById(`${targetType}-${verb}-action-desc`);
		if (desc) { desc.textContent = ''; desc.style.display = 'none'; }
	});
}
