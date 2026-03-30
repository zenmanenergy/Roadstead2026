//Dott-style menu system
let currentVerb = 'give';
let inventory = [];
let inventoryPage = 0;
const maxInventorySlots = 6;

//Initialize menu
document.addEventListener('DOMContentLoaded', () => {
    const verbButtons = document.querySelectorAll('.verb-btn');
    verbButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            setVerb(e.target.dataset.verb);
        });
    });

    document.getElementById('invUp').addEventListener('click', scrollInventoryUp);
    document.getElementById('invDown').addEventListener('click', scrollInventoryDown);


    const slots = document.querySelectorAll('.inv-slot');
    slots.forEach(slot => {
        slot.addEventListener('click', (e) => {
            handleInventorySlotClick(e.target.dataset.slot);
        });
    });

    setVerb('give');
})

function setVerb(verb) {
    currentVerb = verb;

    const verbButtons = document.querySelectorAll('.verb-btn');
    verbButtons.forEach(btn => {
        if (btn.dataset.verb === verb) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function getCurrentVerb() {
    return currentVerb;
}
function addToInventory(item) {
    if (inventory.length < maxInventorySlots) {
        inventory.push(item);
        updateInventoryDisplay();
        return true;
    }
    return false;
}

function removeFromInventory(index) {
    if (index >= 0 && index < inventory.length) {
        inventory.splice(index, 1);
        updateInventoryDisplay();
        return true;
    }
    return false;
}

function scrollInventoryUp() {
    if (inventoryPage > 0) {
        inventoryPage--;
        updateInventoryDisplay();
    }
}

function scrollInventoryDown() {
    if (inventoryPage < Math.max(0, Math.ceil(inventory.length / maxInventorySlots) - 1)) {
        inventoryPage++;
        updateInventoryDisplay();
    }
}

function updateInventoryDisplay() {
    const slots = document.querySelectorAll('.inv-slot');
    const startIndex = inventoryPage * maxInventorySlots;

    slots.forEach((slot, index) => {
        const itemIndex = startIndex + index;
        const item = inventory [itemIndex];

        if (item) {
            const imagePath = typeof item === 'string' ? `assets/items/${item.toLowerCase()}.png` : item.imagePath;
            slot.style.backgroundImage = `url('${imagePath}')`;
            slot.classList.add('filled');
        } else {
            slot.style.backgroundImage = 'none';
            slot.classList.remove('filled');
        }
    });
}

function handleInventorySlotClick(slot) {
    const itemIndex = (inventoryPage * maxInventorySlots) + parseInt(slot);
    const item = getInventoryItem(itemIndex);

    if (item) {
        console.log(`Selected item: ${item} with verb: ${currentVerb}`);
    }
}