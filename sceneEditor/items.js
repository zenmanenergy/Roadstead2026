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

    if (!ingameImage)
} 
