document.addEventListener("DOMContentLoaded", function () {
    // add event listener listens for changes and makes stuff happen
    // attach event handler 
    const output = document.getElementById("output");
    // simplifies documant.getelement into the word output 
    const input = document.getElementById("input");

    function printToOutput(text) {
        let newParagraph = document.createElement("p");
        newParagraph.textContent = text;
        output.appendChild(newParagraph);

        // Autoscroll to the latest message
        output.scrollTop = output.scrollHeight;
    }

    input.addEventListener("keydown", function (event) {
        // a key is being pressed down
        if (event.key === "Enter") {
            // which key is being pressed down (enter)
            let command = input.value.trim();
            if (command) {
                printToOutput(">" + command); // Show player command
                handleCommand(command); // Process game logic
                input.value = ""; // Clear input
            }
        }
    });



let currentRoom = "hallway";

function move(direction) {
    let room = rooms[currentRoom];
    let exit = room.exits[direction];

    if (exit) {
        currentRoom = exit.room;
        describeRoom(currentRoom);
    } else {
        printToOutput("You can't go that way. ");
    }
}


let inventory = [];
// [] = array / list  of things. wedge multiple variables 
const rooms = {
    // { = object 
    "start": {
        name: "Starting Room",
        description: "You are in a small stone chamber. Exits are north and east.",
        exits: {
            north: {room: "hallway" },
            east: {room: "storage" }
        }
    },
    "hallway": {
         name: "Hallway",
         description: function () {
        if (checkFlag("torch_lit")) {
            return "The hallway is brightly lit by your torch. you notice a strange symbol on the floor.";
        } else {
            return "The hallway is dark. You can barely see anything."; 
        }
    },
          exits: {
        south: { room: "start" },
        east: { room: "armory" }
    }},
    "storage" : {
        name: "Storage Room",
        description: "Dusty crates line the walls. There's a key here.",
        exits: {
            west: { room: "start" }
        },
        item: {
            name: "key",
            description: "a small brass key with a worn handle"
        }
    },
    "armory": {
    name: "Armory",
    description: "Old weapons line the walls. A torch hangs near the door.",
    exits: {
        west: { room: "hallway" }
    },
    item: {
        name: "torch",
        description: "A sturdy torch that could light your path."
    }
},
    "secret" : {
        name: "Secret Room",
        description: "You step into a hidden treasure chamber." ,
        exits: {
            south: { room: "hallway" }
        }
    }
};

    printToOutput("welcome to the adventure! Type 'help' to see commands");

function pickUp(itemName) {
    let room = rooms[currentRoom];
    if (room.item && room.item.name === itemName && !inventory.find(obj => obj.name === itemName)) {
        inventory.push(room.item);
        delete room.item;
        printToOutput(`You picked up the ${itemName}.`);
    } else {
        printToOutput(`There is no ${itemName} here.`);
    }
}

function use(itemName) {
    if (!inventory.find(obj => obj.name === itemName)){
        printToOutput(`You dont have a ${itemName}.`);
    }

    let room = rooms[currentRoom];
    letunlocked = false;

    for (let direction in room.exists) {
        let exit = room.exits[direction];
        if (exit.locked && exit.key === itemName) {
            exit.locked = false;
            unlocked = true;
            printToOutput(`You unlocked the door to the ${direction} with the ${itemName}.`);
        }
    }

    if (!unlocked) {
        printToOutput(`You cant use the ${itemName} here.`);
    }
}

function move(direction) {
    let room = rooms[currentRoom];
    let exit = room.exits[direction];

    if (!exit) {
        printToOutput("you cant go that way.");
        return;
    }
    if (exit.locked) {
        printToOutput(`The door to the ${direction} is locked.`);
        return;
    }

    currentRoom = exit.room;
    describeRoom(currentRoom);
}

function handleCommand(command) {
   
    let words = command.toLowerCase().split(" ");
    let action = words[0];
    let target = words.slice(1).join(" ");

    if (action === "go") {
        move(target);
    } else if (action === "look") {
        
        describeRoom(currentRoom);
    } else if (action === "pickup") {
        pickUp(target);
    } else if (action === "use") {
        use(target);
    } else if (action === "inventory") {
        let names = inventory.map(obj => obj.name);
        printToOutput("you have: " + (names.length ? names.joint(", "): "nothing"));
    } else if (action === "help") {
        printToOutput("Available commands: look, go [direction], pickup [item], use [item], inventory, help");
    }else if (action === "light") {
    light(target);
     } else {
        printToOutput("I dont understand that command.");
    }
}

let flags = {};

function setFlag(flagName) {
    flags[flagName] = true;
}

function checkFlag(flagName) {
    return flags[flagName] === true;
}



function describeRoom(roomName) {
    let room = rooms[roomName];
    let desc = typeof room.description === "function" ?
room.description() : room.description;
     printToOutput(`${room.name}: ${desc}`);
console.log(room)
     if (room.item && !inventory.find(obj => obj.name === room.item.name)) {
        printToOutput(`There is a ${room.item.name} here.`);
     }
}



function light(itemName) {
    if (inventory.find(obj => obj.name === itemName)) {
        if (itemName === "torch") {
            setFlag("torch_lit");
            printToOutput("you light the torch. the hallway glows with warm light.");
        } else {
            printToOutput(`You cant light the ${itemName}.`);
        }
    } else {
        printToOutput(`You dont have a ${itemName}.`);
    }
}


});
// closes code



