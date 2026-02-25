let nombreMystere;
let tentatives = [];
let numeroPartie = 1;

function genererNombre() {
    nombreMystere = Math.floor(Math.random() * 20) + 1;
    tentatives = [];

    const ul = document.getElementById('listeTentatives');
    if (ul) {
        ul.innerHTML = '';
    }
}

function verification() {
    const input = document.getElementById('proposition');
    if (!input) {
        return;
    }

    const proposition = input.valueAsNumber;

    if (Number.isNaN(proposition) || proposition < 1 || proposition > 20) {
        alert('Veuillez choisir un nombre entre 1 et 20.');
        input.value = '';
        return;
    }

    tentatives.push(proposition);

    const ul = document.getElementById('listeTentatives');
    if (ul) {
        const li = document.createElement('li');
        li.textContent = String(proposition);
        ul.appendChild(li);
    }

    if (proposition < nombreMystere) {
        alert('C\'est plus !');
    } else if (proposition > nombreMystere) {
        alert('C\'est moins !');
    } else {
        alert('Bravo ! Vous avez trouvé le juste prix !');

        const tbody = document.getElementById('historique');
        if (tbody) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${numeroPartie}</td><td>${tentatives.length}</td>`;
            tbody.appendChild(tr);
        }

        numeroPartie += 1;
        genererNombre();
    }

    input.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    genererNombre();

    const btn = document.getElementById('btnVerifier');
    if (btn) {
        btn.addEventListener('click', verification);
    }
});
