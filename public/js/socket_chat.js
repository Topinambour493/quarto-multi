var socket = io();

console.log("j'arrive")

socket.emit('deplace room', window.location.pathname.substring(1), localStorage.getItem('nickname'))

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var message = document.getElementById('message');
var room = window.location.pathname.substring(1)
var nextRoom ;

function rejouer(){
    socket.emit("revenge",room, mode, (response) => {
        window.location.pathname = response.nextRoom;
    })
}



function initGame(){
    socket.emit("init game", room, (response) => {
        console.log(response, response.status)
        if (response.status === "second") {
            socket.emit("start game", room);
        }
    });
}

socket.on("choose piece", function (room, piece_id, players) {
    lockPieces()
    piece = document.getElementById(piece_id)
    piece.className += " cursor_default";
    document.querySelector("#action").innerHTML = "Place la pièce";
    document.querySelector("#piece-to-place").append(piece.parentElement);
    nickname = document.querySelector("#nickname")
    if (nickname.innerHTML === players[0]["nickname"]) {
        nickname.innerHTML = `${players[1]["nickname"]}`;
        nickname.style.color = `${players[1]["color"]}`;
    } else {
        nickname.innerHTML = `${players[0]["nickname"]}`;
        nickname.style.color = `${players[0]["color"]}`;
    }
    if (nickname.innerHTML === localStorage.getItem('nickname')) {
        unlockPlateau();
    }

    socket.on('place piece', function (room, locationPiece, piece_id, players) {
        //TODO: comprendre pourquoi la requete est effectué plusieurs foix.
        // Si c'est la 3eme piece alors il y aura 3 apels, PK?
        if (document.querySelector("#piece-to-place > .pion")) {
            locationPiece_element = document.getElementById(piece_id)
            locationPiece_element.append(document.querySelector("#piece-to-place > .pion"));
            locationPiece_element.className += " cursor_default";
            document.querySelector("#action").innerHTML = "Choisis une pièce";
            if (isWin(locationPiece, mode)) {
                socket.emit('end game', room, "QUARTO!")
            } else if (isEquality()) {
                socket.emit('end game', room, "ÉGALITÉ!")
            }
            if (nickname.innerHTML === localStorage.getItem('nickname')) {
                unlockPieces();
                lockPlateau();
            }
        }

    })


});

socket.on('start game', function (room, first_player) {
    document.getElementById("loader").style.display = "none";
    mode = room["mode"]
    players = [
        {
            "color": "red",
            "nickname": room["users"][0][1]
        },
        {
            "color": "blue",
            "nickname": room["users"][1][1]
        }
    ]
    creation_pieces();
    fill_header(first_player);
    nickname = localStorage.getItem('nickname')
    console.log(socket, "doubuy", first_player["nickname"]);
    animationMulti(room, players);
    if (nickname === first_player["nickname"]) {
        unlockPieces();
    }
});


socket.on("end game", function (room, message) {
    lockPlateau();
    document.querySelector("#jeu").innerHTML+=`<div id="quarto" class="centre"><div>${message}</div><button class="button-19" id="revenge" onclick="rejouer()">revanche</button></div>`;
    document.querySelector("#action").innerHTML = `\
      <a href="/" class="text-decoration-none"><button class="button-19" id="retour_menu">retour menu</button></a> \
    `;
});

socket.on("revenge game", function (){
    console.log("reinit");
    //supression des pièces déja créees
    for (let i = 0; i < 16; i++) {
        document.querySelector(`#p${i}`).parentElement.remove();
    }
    if (document.querySelector("#quarto")) {
        document.querySelector("#quarto").remove();
    }
    initGame()
})

function animationMulti(room, players){
    for (let locationPiece=0;locationPiece<16;locationPiece++){
        document.querySelector(`#locP${locationPiece}`).addEventListener('click',function(){
            if (document.querySelector("#piece-to-place > .pion") && getProperties_piece(locationPiece)==false){
                socket.emit("place piece", room, locationPiece, this.id, players);
            }
        });
    }

    for (let piece=0;piece<16;piece++){
        document.querySelector(`#p${piece}`).addEventListener('click',function(){
            if ( ( !document.querySelector("#piece-to-place > .pion") ) && ( document.querySelector(`#pieces #p${piece}`) ) ){
                socket.emit("choose piece", room,  this.id, players);
            }
        });
    }
}

initGame();