// Action Registry
// Each action receives (params, ctx) where ctx is built by buildActionContext() in game.js

function executeAction(actionDef, ctx) {
	if (!actionDef || !actionDef.action) return;
	const fn = actionRegistry[actionDef.action];
	if (fn) {
		fn(actionDef.params || {}, ctx);
	} else {
		console.warn('Unknown action:', actionDef.action);
	}
}

const actionRegistry = {

	showMessage: (params, ctx) => {
		ctx.showMessage(params.message || '');
	},

	showCantDo: (params, ctx) => {
		ctx.showMessage(params.message || "I can't do that.");
	},

	takeItem: (params, ctx) => {
		if (ctx.item) ctx.collectItem(ctx.item);
	},

	removeItem: (params, ctx) => {
		const idx = inventory.findIndex(i => i.name === params.itemName);
		if (idx >= 0) removeFromInventory(idx);
	},

	swapItem: (params, ctx) => {
		const idx = inventory.findIndex(i => i.name === params.removeItem);
		if (idx >= 0) removeFromInventory(idx);
		ctx.showMessage(`You swap the ${params.removeItem}.`);
	},

	combineItems: (params, ctx) => {
		const has1 = inventory.some(i => i.name === params.item1);
		const has2 = inventory.some(i => i.name === params.item2);
		if (has1 && has2) {
			let idx = inventory.findIndex(i => i.name === params.item1);
			removeFromInventory(idx);
			idx = inventory.findIndex(i => i.name === params.item2);
			removeFromInventory(idx);
			ctx.showMessage(`You combine the ${params.item1} and the ${params.item2}.`);
		} else {
			ctx.showMessage("You don't have the right items.");
		}
	},

	requireItem: (params, ctx) => {
		const hasIt = inventory.some(i => i.name === params.itemName);
		if (hasIt) {
			executeAction(params.onSuccess, ctx);
		} else {
			executeAction(
				params.onFail || { action: 'showCantDo', params: { message: `You need the ${params.itemName}.` } },
				ctx
			);
		}
	},

	startDialog: (params, ctx) => {
		// Placeholder - dialog system to be built
		ctx.showMessage(`[Dialog: ${params.dialogId}]`);
	},

	changeScene: (params, ctx) => {
		changeScene(params.scene);
	},

	setFlag: (params, ctx) => {
		gameFlags[params.flag] = params.value !== undefined ? params.value : true;
	},

	checkFlag: (params, ctx) => {
		if (gameFlags[params.flag]) {
			executeAction(params.onTrue, ctx);
		} else {
			executeAction(params.onFalse, ctx);
		}
	},

	openObject: (params, ctx) => {
		const scene = sceneData[currentScene];
		if (!scene || !scene.items) return;
		const item = scene.items.find(i => i.name === params.itemName);
		if (item && params.newImage) {
			item.ingameImage = params.newImage;
			const img = new Image();
			img.src = `assets/items/ingame/${params.newImage}`;
			item.imageObj = img;
		}
	},

	closeObject: (params, ctx) => {
		const scene = sceneData[currentScene];
		if (!scene || !scene.items) return;
		const item = scene.items.find(i => i.name === params.itemName);
		if (item && params.newImage) {
			item.ingameImage = params.newImage;
			const img = new Image();
			img.src = `assets/items/ingame/${params.newImage}`;
			item.imageObj = img;
		}
	},

	hideItem: (params, ctx) => {
		if (ctx.item) {
			collectedItems.add(`${currentScene}:${ctx.item.name}`);
		}
	},

	replaceItem: (params, ctx) => {
		collectedItems.add(`${currentScene}:${params.oldItem}`);
		ctx.showMessage(`The ${params.oldItem} has changed.`);
	},

	chainActions: (params, ctx) => {
		if (Array.isArray(params.actions)) {
			params.actions.forEach(a => executeAction(a, ctx));
		}
	}
};
