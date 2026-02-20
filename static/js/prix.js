let nombreMystere;
let tentatives = [];
let numeroPartie = 1;

/**
 * Génère un nouveau nombre mystère entre 1 et 20
 * et réinitialise les tentatives.
 */
function genererNombre() {
    nombreMystere = Math.floor(Math.random() * 20) + 1;
    console.log("Nombre mystère :", nombreMystere);

    tentatives = [];

    const ul = document.getElementById("listeTentatives");
    if (ul) ul.innerHTML = "";
}

/**
 * Vérifie la proposition saisie par l'utilisateur.
 */
function verification() {
    const input = document.getElementById("proposition");
    if (!input) return;

    const proposition = input.valueAsNumber;
    console.log("verification appelée, valeur entrée :", proposition);

    if (isNaN(proposition) || proposition < 1 || proposition > 20) {
        alert("Veuillez choisir un nombre entre 1 et 20 !");
        input.value = "";
        return;
    }

    // Ajout dans les tentatives
    tentatives.push(proposition);

    const ul = document.getElementById("listeTentatives");
    if (ul) {
        const li = document.createElement("li");
        li.textContent = proposition;
        ul.appendChild(li);
    }

    if (proposition < nombreMystere) {
        alert("C'est plus !");
    } else if (proposition > nombreMystere) {
        alert("C'est moins !");
    } else {
        alert("Bravo ! Vous avez trouvé le juste prix !");

        const tbody = document.getElementById("historique");
        if (tbody) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${numeroPartie}</td><td>${tentatives.length}</td>`;
            tbody.appendChild(tr);
        }

        numeroPartie++;
        genererNombre();
    }

    input.value = "";
}

/* === Lancement du jeu après que le DOM est prêt === */
document.addEventListener("DOMContentLoaded", () => {
    // Génère le nombre mystère
    genererNombre();

    // Lie le bouton à la fonction verification
    const btn = document.getElementById("btnVerifier");
    if (btn) btn.addEventListener("click", verification);
});