var joueur1 = {"color": "red", "nickname": "Joueur 1"};
var joueur2 = {"color": "blue", "nickname": "Joueur 2"};
var joueurs = [joueur1, joueur2];
mode="classique"
function animationLocal() {
    for (let piece = 0; piece < 16; piece++) {
        document.querySelector(`#p${piece}`).addEventListener('click', function () {
            if ((!document.querySelector("header > .pion")) && (document.querySelector(`#pieces #p${piece}`))) {
                document.querySelector("header").append(this.parentElement);
                this.className += " cursor_default";
                document.querySelector("#action").innerHTML = "Place la pièce";
                if (document.querySelector("#nickname").innerHTML === joueur1["nickname"]) {
                    document.querySelector("#nickname").innerHTML = `${joueur2["nickname"]}`;
                    document.querySelector("#nickname").style.color = `${joueur2["couleur"]}`;
                } else {
                    document.querySelector("#nickname").innerHTML = `${joueur1["nickname"]}`;
                    document.querySelector("#nickname").style.color = `${joueur1["couleur"]}`;
                }
            }
        });
    }

    for (let locationPiece = 0; locationPiece < 16; locationPiece++) {
        document.querySelector(`#locP${locationPiece}`).addEventListener('click', function () {
            if (document.querySelector("header > .pion") && getProperties_piece(locationPiece) == false) {
                document.querySelector(`#locP${locationPiece}`).append(document.querySelector("header > .pion"));
                document.querySelector(`#locP${locationPiece}`).className += " cursor_default";
                document.querySelector("#action").innerHTML = "Choisis une pièce";
                if (isWin(locationPiece, mode)) {
                    endGameLocal("QUARTO!");
                } else if (isEquality()) {
                    endGameLocal("ÉGALITÉ!");
                }
            }
        });
    }
}

function endGameLocal(message){

    document.querySelector("#jeu").innerHTML+=`<div id="quarto" class="centre">${message}</div>`;
    lockJeu();
    document.querySelector("#action").innerHTML = `\
      <div id="retour_menu">retour menu</div> \
  `;
    document.querySelector(`#retour_menu`).addEventListener('click', function () {
        retourMenu();
    });
}

function defineNameJoueursLocal() {
    let nicknameJ1 = document.querySelector('#nicknameJ1').value;
    let nicknameJ2 = document.querySelector('#nicknameJ2').value;

    if (nicknameJ1 && nicknameJ1.trim()) {
        joueur1["nickname"] = nicknameJ1;
    }
    if (nicknameJ2 && nicknameJ2.trim()) {
        joueur2["nickname"] = nicknameJ2;
    }
}

function jouer() {
    creation_pieces();
    let first_player = joueurs[Math.floor(Math.random() * 2)];
    console.log(first_player)
    fill_header("classique", first_player);
    unlockJeu();
    animationLocal();
}

jouer()