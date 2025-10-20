document.addEventListener("DOMContentLoaded", function () {
    const output = document.getElementById("output");
    const input = document.getElementById("input");
    function printToOutput(text) {
        let newParagraph = document.createElement("p");
        newParagraph.textContent = text;
        output.appendChild(newParagraph);
        
        // Autoscroll to the latest message
        output.scrollTop = output.scrollHeight;
    }
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            let command = input.value .trim();
            if (command) {
                printToOutput(">" + command); //show player command
                handleCommand(command); //process game logic
                input.value = ""; //clear input
            }
        }
    });

//     function handleCommand(command) {
//         let response = "";
//         switch (command.toLowerCase()) {
//             case "look" :
//                 response = "you are in a small stone chamber. exits are north and east.";
//                 break;
//             case "go north" :
//                 response = "A long hallway stretches ahead. you can go south.";
//                 break;
//             case "help" :
//                 response = "commands? uhhhh look, go[directon], help... i think";
//                 break;
//             default :
//                 response = "CUH?";
//         }
//         printToOutput(response);

//         }
//     printToOutput("Welcome to Hell. Type help to see commands.")
function handleCommand (command) {
    printToOutput("Welcome to Hell. Type help to see commands.")
    let words = command.toLowerCase().split(" ");
    let action = words[0];
    let target = words.slice(1).join(" ");
    if (action === "go") {
        move (target) ;
    } else if (action === "look") {
        describeRoom (currentRoom) ;
    } else if (action === "help") {
        printToOutput ("Available commands: look, go [direction], help");
    } else {
        printToOutput ("I don't understand that command.") ;
    }
}
let exits = Object.keys(room.exits).join(", ");
printToOutput("Exits: " + exits);
});


const rooms = {
    "start" : {
        name: "Starting Room",
        description: "you are in a small stone chamber. exits are north and east.",
        exits: {
            north: {room: "hallway"},
            east: {room: "storage"}
        }
    },
    "hallway" : {
        name: "Hallway",
        description: "A long hallway stretches ahead. you can go south.",
        exits: {
            south: {room: "start"}
        } 
    },
    "storage" : {
        name: "Storage Room",
        description: "Dusty crates line the walls. You can go west.",
        exits: {
            west : {room: "start"}
        }
    }
};

let currentRoom = "start"

function move(direction) {
    let room = rooms[currentRoom] ;
    let exit = room.exits[direction];
    if (exit) {
        currentRoom = exit.room;
        describeRoom(currentRoom);
    } else {
        printToOutput("You can't go that way.");
    }

}

function describeRoom(roomName) {
    let room = rooms [roomName] ;
    printToOutput (`${room.name}: ${room.description}`);
}

