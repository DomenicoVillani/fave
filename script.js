const prezzoFavaFresca = 5;
const prezzoFavaSecca = 4;

let pioggiaAttiva = false;
let pioggiaInterval = null;

const favaSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 64 64">
<path d="M54.8 9.2c-6.4-6.4-20.2 1.5-30.5 11.8S2.8 44.4 9.2 50.8c6.4 6.4 20.2-1.5 30.5-11.8S61.2 15.6 54.8 9.2z" fill="#4CAF50"/>
<path d="M54.8 9.2c-1.6-1.6-4.2-1.4-7.3-0.2-3.4 1.4-7.2 4.2-10.7 7.7-3.5 3.5-6.3 7.3-7.7 10.7-1.2 3.1-1.4 5.7 0.2 7.3s4.2 1.4 7.3 0.2c3.4-1.4 7.2-4.2 10.7-7.7 3.5-3.5 6.3-7.3 7.7-10.7 1.2-3.1 1.4-5.7-0.2-7.3z" fill="#81C784"/>
<circle cx="24" cy="40" r="4" fill="#A5D6A7"/>
<circle cx="32" cy="32" r="4" fill="#A5D6A7"/>
<circle cx="40" cy="24" r="4" fill="#A5D6A7"/>
</svg>
`;

const menuToggle = document.getElementById("menuToggle");
const sideMenu = document.getElementById("sideMenu");

menuToggle.addEventListener("click", () => {
    sideMenu.classList.toggle("show");
});


function calcolaFave() {
    const input = document.getElementById('stipendio');
    const risultato = document.getElementById('risultato');
    const stipendio = parseFloat(input.value);
    const tipoFava = document.getElementById('fava').value;

    if (isNaN(stipendio) || stipendio <= 0) {
        risultato.innerHTML = '💥 Inserisci un valore valido per lo stipendio!';
        stopPioggiaFave();
        return;
    }

    // Determina il prezzo in base al tipo di fava
    const prezzoFava = tipoFava === 'fresche' ? prezzoFavaFresca : prezzoFavaSecca;

    if(stipendio < prezzoFava){
        risultato.innerHTML = 'Poveraccio non te puoi permmette le fave';
        stopPioggiaFave();
        return;
    }

    const kgFave = Math.floor(stipendio / prezzoFava);
    const maxFave = 50;
    const faveMostrate = Math.min(kgFave, maxFave);

    let faveHTML = '';
    for (let i = 0; i < faveMostrate; i++) {
        faveHTML += favaSVG;
    }

    if (kgFave > maxFave) {
        faveHTML += `<span style="font-size:1.2rem;"> + ${kgFave - maxFave} kg</span>`;
    }

    risultato.innerHTML = `
        <div>
            Con uno stipendio di <strong>€${stipendio}</strong><br/>
            puoi comprare <strong>${kgFave} kg di fave ${tipoFava}</strong>!
            <img src="faveFresche.png" alt="Fava" height="170">
        </div>
    `;

    startPioggiaFave();
}

function creaFavaCadente() {
    const fava = document.createElement('div');
    fava.classList.add('falling-fava');
    fava.style.left = `${Math.random() * 100}vw`;
    fava.style.animationDuration = `${3 + Math.random() * 5}s`;
    const dimensione = 30 + Math.random() * 70;

    fava.innerHTML = `<img src="cursorFava.png" alt="" height="${dimensione.toFixed(0)}">`;
    document.body.appendChild(fava);
    setTimeout(() => fava.remove(), 10000);
}


function startPioggiaFave() {
    stopPioggiaFave();
    rimuoviFaveCadenti();

    pioggiaInterval = setInterval(() => {
        for (let i = 0; i < 3; i++) creaFavaCadente();
    }, 500);

    pioggiaAttiva = true;
}

function stopPioggiaFave() {
    if (pioggiaInterval) {
        clearInterval(pioggiaInterval);
        pioggiaInterval = null;
    }
    pioggiaAttiva = false;
}

function rimuoviFaveCadenti() {
    document.querySelectorAll('.falling-fava').forEach(el => el.remove());
}
