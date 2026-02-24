// Images Tab Module

let currentBackgroundImage = null;
let currentImagePath = null;

const backgroundImages = [
	'background_start.png',
	'CITY-absnormal.png',
	'room_bedroom.png',
	'room_city.png',
	'room_lab.png',
	'room_office.png',
	'room_pharmacy.png',
	'start_button.png',
	'title_screen.png'
];

function initializeImageSelect() {
	const imageSelect = document.getElementById('backgroundImageSelect');
	
	backgroundImages.forEach(img => {
		const option = document.createElement('option');
		option.value = img;
		option.textContent = img;
		imageSelect.appendChild(option);
	});
}

function changeBackgroundImage(imagePath) {
	console.log (imagePath)
	if (imagePath) { 
		
		const img = new Image();
		img.src = `../absnormal/assets/backgrounds/${imagePath}`;
		img.onload = () => {
			currentBackgroundImage = img;
			currentImagePath = imagePath;
			redraw();
			updateOutput();
		};
		img.onerror = () => {
			alert('Could not load image: ' + imagePath);
		};
	}
}

function clearBackgroundImage() {
	currentBackgroundImage = null;
	currentImagePath = null;
	document.getElementById('backgroundImageSelect').value = '';
}

function getImageForOutput() {
	return currentImagePath ? `assets/backgrounds/${currentImagePath}` : null;
}
