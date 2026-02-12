const container = document.querySelector(".container");
// Pegamos todas as cadeiras que NÃO estão ocupadas
const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");

populateUI(); // 1. Chama a função que carrega os dados salvos assim que a página abre

let ticketPrice = +movieSelect.value;

function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}

// Função para atualizar total e contagem
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  // Cria um "mapa" das cadeiras selecionadas
  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  // Salva essa lista no navegador
  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

  const selectedSeatsCount = selectedSeats.length;
  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;

  setMovieData(movieSelect.selectedIndex, movieSelect.value);
}

// Pega os dados do "Save Game" e pinta as cadeiras
function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

  // Se existir algo salvo, ele pinta as cadeiras de volta
  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
}

// Evento de troca de filme
movieSelect.addEventListener("change", (e) => {
  ticketPrice = +e.target.value;
  setMovieData(e.target.selectedIndex, e.target.value);
  updateSelectedCount();
});

// Evento de clique na cadeira
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    e.target.classList.toggle("selected");
    updateSelectedCount();
  }
});

const checkoutBtn = document.getElementById("checkout-btn");

checkoutBtn.addEventListener("click", () => {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  // 1. Validação: Se não tiver nada selecionado, avisa e para.
  if (selectedSeats.length === 0) {
    alert("Por favor, selecione pelo menos uma cadeira!");
    return; // O 'return' para a função aqui. Nada abaixo acontece.
  }

  // 2. Feedback visual (simulando envio para servidor)
  const totalPrice = total.innerText;
  alert(`Compra realizada com sucesso!\nValor Total: R$ ${totalPrice}`);

  // 3. Limpeza (Reset)
  selectedSeats.forEach((seat) => {
    seat.classList.remove("selected"); // Remove a cor verde
  });

  // 4. Limpa o LocalStorage para não carregar selecionado no F5
  localStorage.removeItem("selectedSeats");

  // Atualiza os textos para 0
  updateSelectedCount();
});
// Atualiza a contagem inicial ao carregar a página
updateSelectedCount();
