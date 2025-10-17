// const playButton = document.getElementById("playButton");
// const audioPlayer = document.getElementById("audioPlayer");
// // Toggle play/pause when clicking the image
// playButton.addEventListener("click", function() {
//     if (audioPlayer.paused) {
//         audioPlayer.play();
//     } 
//     else {
//         audioPlayer.pause();
//     }
// });
document.addEventListener("DOMContentLoaded", function () {
    const output = document.getElementById("output");
    const input = document.getElementById("input");
    //setting the inventory's value to (when starting) nothing
    let inventory = [];
    let flags = {};

    //this funtion is getting the text in the output setup
    function printToOutput(text) {
        let newParagraph = document.createElement("p");
        newParagraph.textContent = text;
        output.appendChild(newParagraph);

        output.scrollTop = output.scrollHeight;
    }

    // function speakToOutput(filename) {
    //     Audio.source.src = filename;
    //     Audio.play();
    // }


    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            let command = input.value.trim();
            if (command) {
                printToOutput("> " + command); //show player command
                handleCommand(command); //process game logic
                input.value = ""; //clear input
            }
        }
    });

    function setFlag(flagName) {
        flags[flagName] = true;
    }

    function checkFlag(flagName) {
        return flags[flagName] === true;
    }

    function light(itemName) {
        if (inventory.find(obj => obj.name === itemName)) {
            if (itemName === "torch") {
                setFlag("torch_lit");
                printToOutput("You light the torch.  The halway glows with warm light.");
            }
            else {
                printToOutput(`You can't light the ${itemName}.`);
            }
        }
        else {
            printToOutput(`You don't have a ${itemName}`);
        }
    }

    function move(direction) {
        let room = rooms[currentRoom];  //rooms[currentRoom] is referencing the list of rooms.  This selects the right room from the many rooms, so the variable changes with the players movement
        let exit = room.exits[direction];  //selecting proper exit(s) and their directions

        if (!exit) {
            printToOutput("You can't go that way")
            return;
        }

        if (typeof exit === "function") {
            exit = exit();
            if (!exit) {
                printToOutput("You can't go that way.");
                return;
            }
        }
        if (exit.locked) {
            printToOutput("You can't go that way");
            return;
        }

        currentRoom = exit.room;
        describeRoom(currentRoom);
    }

    function pickup(itemName) {
        let room = rooms[currentRoom];
        if (room.item && room.item.name === itemName && !inventory.find(obj => obj.name === itemName)) {  //this is saying if the room has the item you're trying to pickup and your inventory dosen't have it then
            inventory.push(room.item); //give you the item
            delete room.item; //delete it from the room so you can't get multiple
            printToOutput(`You picked up the ${itemName}.`);
        }
        else {
            printToOutput(`There is no ${itemName} here.`);
        }
    }
    function grab(item1Name) {
        let room = rooms[currentRoom];
        if (room.item1 && room.item1.name === item1Name && !inventory.find(obj => obj.name === item1Name)) {  //this is saying if the room has the item you're trying to pickup and your inventory dosen't have it then
            inventory.push(room.item1); //give you the item
            delete room.item1; //delete it from the room so you can't get multiple
            printToOutput(`You picked up the ${item1Name}.`);
        }
        else {
            printToOutput(`There is no ${item1Name} here.`);
        }
    }

    function use(itemName) {
        if (!inventory.find(obj => obj.name === itemName)) { //if you don't have the item
            printToOutput(`You don't have a ${itemName}`);
            return;
        }

        let room = rooms[currentRoom];
        let unlocked = false;

        if (currentRoom === "gallery" && itemName === "statue" && !checkFlag("pedestal_activated")) {
            setFlag("pedestal_activated");
            printToOutput("You place the statue on the pedest6al.  A hidden passage opens to the north.");
            return;
        }

        for (let direction in room.exits) {
            let exit = room.exits[direction];
            if (exit.locked && exit.key === itemName) { //if the exit is locked and the exit key is the item your using
                exit.locked = false;  //unlock
                unlocked = true;
                printToOutput(`You unlocked the door to the ${direction} with the ${itemName}`);
            }
        }
        if (!unlocked) {
            printToOutput(`You can't use the ${itemName}`);
        }
    }
    
    function apply(item1Name) {
        if (!inventory.find(obj => obj.name === item1Name)) { //if you don't have the item
            printToOutput(`You don't have a ${item1Name}`);
            return;
        }

        let room = rooms[currentRoom];
        let unlocked = false;

        if (currentRoom === "gallery" && item1Name === "statue" && !checkFlag("pedestal_activated")) {
            setFlag("pedestal_activated");
            printToOutput("You place the statue on the pedest6al.  A hidden passage opens to the north.");
            return;
        }

        for (let direction in room.exits) {
            let exit = room.exits[direction];
            if (exit.locked && exit.key === item1Name) { //if the exit is locked and the exit key is the item your using
                exit.locked = false;  //unlock
                unlocked = true;
                printToOutput(`You unlocked the door to the ${direction} with the ${item1Name}`);
            }
        }
        if (!unlocked) {
            printToOutput(`You can't use the ${item1Name}`);
        }
    }

    function handleCommand(command) {
        let words = command.toLowerCase().split(" ");
        let action = words[0]
        let target = words.slice(1).join(" ");

        if (action === "go") {
            move(target);  //referencing the move funtion
        }
        else if  (action === "look") {
            describeRoom(currentRoom);
        }
        else if (action === "pickup") {
            pickup(target);
        }
        else if (action === "grab") {
            grab(target);
        }
        else if (action === "use") {
            use(target);
        }
        else if (action === "apply")
            apply(target);
        else if (action === "inventory") {
            let names = inventory.map(obj => obj.name);
            printToOutput("You have: " + (names.length ? names.join(", ") : "nothing"));  //: "nothing" is fancy syntax that's basically just an else statement
        }
        else if (action === "help") {
            printToOutput("Available Commands: look, go [direction], pickup [item], use [item], light [item], inventory, help");
        }
        else if (action === "light") {
            light(target);
        }
        else {
            printToOutput("I don't understand that command");
        }
    }
    printToOutput("Welcome to the adventure! Type 'help' to see commands.");

    const rooms = {
        "start": {  //the identifier for the room
        name: "Starting Room",  //the name the user sees
        description: "You are in a small stone chamber.  Exits are north and east.",  //refrenceable description
        exits: {  //setting the exits and their directions
            north: { room: "hallway" },
            east: { room: "storage"}
            }
        },
        "gallery": {
            name: "Gallery",
            description: function () {
                if (checkFlag("pedestal_activated")) {
                    return "A wall panel has slid open to the north.";
                }
                else {
                    return "Ancient paintings cover the walla.  A pedestal stands in the center.";
                }
            },
            exits: {
                south: { room: "storage" },
                north: function () {
                    return checkFlag("pedestal_activated") ? { room: "hidden_room" } : null;

                    if (checkFlag(pedestal_activated)) {
                        return {room: "hidden_room" }
                    }
                    else {
                        return null;
                    }
                }
            }
        },
        "hidden_room": {
            name: "Hidden Room",
            description: "You enter a secret chamber filled with treasures.",
            exits: {
                south: { room: "gallery" }
            }
        },
        "hallway": {
            name: "Hallway",
            description: function () {
                if (checkFlag("torch_lit")) {
                    return "The hallway is brightly lit by your torch.  You notice a strange symbol on the floor.";
                }
                else {
                    return "The hallway is dark.  You can barely see anything"
                }
            },
            exits: {
                south: { room: "start"},
                east: { room: "armory"},
                north: { room: "secret", locked: true, key: "key"}
            }
        },
        "storage": {
            name: "Storage Room",
            description: "Dusty crates line the walls.  You can go west.",
            exits: {
                west: { room: "start"},
                north: { room: "gallery"},
            },
            item: {
                name: "key", 
                description: "A small brass key witha  worn handle."
            }
        },
        "armory": {
            name: "Armory",
            description: "Old weapons line the wall.",
            exits: {
                west: { room: "hallway" }
            },
            item: {
                name: "torch",
                description: "A sturdy torch that could light your path.",
            },
            item1: {
                name: "statue",
                description: "A small statue of a mythical creature.",
            }
        },
        "secret": {
            name: "Secret Room",
            description: "You step into a hidden treasure chamber.",
            exits: {south: { room: "hallway" }
            }
        }
    };

    let currentRoom = "start"; //outside of any function, setting the room to start, the code's identifier for that room

    
    function describeRoom(roomName) {
       let room = rooms[roomName];  //selecting the proper room from the list of names
       let desc = typeof room.description === "function" ? room.description() : room.description;
       printToOutput(`${room.name}: ${desc}`);  //printing refrenceable outputs.
       
       if (room.item && !inventory.find(obj => obj.name === room.item.name)) {
            printToOutput(`There is a ${room.item.name} here.`);
       }
       if (room.item1 && !inventory.find(obj => obj.name === room.item1.name)) {
            printToOutput(`There is a ${room.item1.name} here.`);
       }
    }
});