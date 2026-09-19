const btnPlay = document.getElementById('btn-play')
const tempoMusica = document.getElementById('tempoMusica')
const tempoAtualMusica = document.getElementById('TempoAtualMusica')
const containerMusicas = document.querySelector('.MusicasContainer')
const audio = document.createElement('audio')
let tocando = false

async function criandoCards() {
    const resposta = await fetch("musicas.json")
    const musicas = await resposta.json()

    musicas.forEach((musica, index) => {
        containerMusicas.innerHTML += `
    <div class="musicaCard" data-index = "${index}">
         <div class="Capa">
            <img src="${musica.capa}" alt="Capa">
         </div>
         <div class="informacao">
            <h4>${musica.nome}</h4>
            <span>${musica.artista}</span>
         </div>
        </div> 
    
    `;
    });

    SelecionarMusica(musicas)
}

function SelecionarMusica(musicas) {
    const cards = document.querySelectorAll(".musicaCard")

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const index = card.dataset.index;
            const musicaSelecionada = musicas[index];
            tocando = false
            mostrarMusica(musicaSelecionada)
        });
    });

}

function mostrarMusica(musicaSelecionada) {
    const capaMusica = document.getElementById('CapaMusicaSelecionada')
    const nomeMusica = document.getElementById('nomeMusicaSelecionada')
    const nomeArtista = document.getElementById('NomeArtistaSelecionado')

    capaMusica.innerHTML = `
          <img src="${musicaSelecionada.capa}" alt="capaMusica">
          `
    nomeMusica.textContent = `${musicaSelecionada.nome}`
    nomeArtista.textContent = `${musicaSelecionada.artista}`
    audio.src = `${musicaSelecionada.musica}`
    
}

function execultandoAudio() {

        if (tocando == false) {
            audio.play()
            tocando = true
            btnPlay.innerHTML = `<img src="imagens/pauseIcon.png" alt="icon" style="width: 24px; height: auto;">`
        } else {
            audio.pause()
            tocando = false
            btnPlay.innerHTML = `<img src="imagens/playIcon.png" alt="icon" style="width: 24px; height: auto;">`
        }
    audio.addEventListener('timeupdate', () =>{
        formatarTempo(audio.currentTime.toFixed(0))
    })
    }
function formatarTempo(segundos) {
  
  const minutos = Math.floor( segundos / 60);
  const segundosrestos = segundos % 60;
  const minutosFormatados = String(minutos).padStart(2, '0');
  const segundosFormatados = String(segundosrestos).padStart(2, '0');
  
  tempoMusica.textContent = `${minutosFormatados}:${segundosFormatados}`
  tempoAtualMusica.value = audio.currentTime
  tempoAtualMusica.max = audio.duration

  tempoAtualMusica.addEventListener('input', ()=>{
    audio.currentTime = tempoAtualMusica.value
  })
}
criandoCards()