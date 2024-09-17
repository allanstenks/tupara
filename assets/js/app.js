var app = {
  init: function() {
    app.functionOne();
  },
  functionOne: function () {

    // Slick slider initialization
    $('.banner-slider').slick({
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: true
    });

    $('.depoimento-slider').slick({
      dots: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: true
    });

    $('.galeria-slider').slick({
      dots: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: true,
      variableWidth: true
    });

    // Event listeners for guest buttons
    document.getElementById('btn-minus').addEventListener('click', function() {
      app.decreaseGuests();
    });

    document.getElementById('btn-plus').addEventListener('click', function() {
      app.increaseGuests();
    });
  },
  decreaseGuests: function() {
    var input = document.getElementById('num-hospedes');
    var currentValue = parseInt(input.value);
    if (currentValue > 1) {
      input.value = currentValue - 1;
    }
  },
  increaseGuests: function() {
    var input = document.getElementById('num-hospedes');
    var currentValue = parseInt(input.value);
    input.value = currentValue + 1;
  }
};

// Initialize app when document is ready
$(document).ready(function () {
  app.init();
});

function initMap() {
  console.log('Initializing Map'); // Para depuração
  var location = { lat: -23.6508, lng: -47.2284 }; // Coordenadas do Tupará Glamping & Chill
  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: location
  });

  var marker = new google.maps.Marker({
      position: location,
      map: map,
      icon: 'assets/img/pin.png', // Substitua pela URL da imagem do pin personalizado
      title: 'Tupará Glamping & Chill'
  });
}

function calculateRoute() {
  var start = document.getElementById('start-location').value;
  if (!start) {
      alert('Por favor, insira um local de partida.');
      return;
  }

  console.log('Endereço de partida:', start);
  console.log('Endereço de destino:', end);

  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: { lat: -23.6508, lng: -47.2284 }
  });
  directionsRenderer.setMap(map);

  var end = 'Estrada Municipal da Cachoeira, Ibiúna, SP';
  var request = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
  };

  directionsService.route(request, function (result, status) {
      if (status == 'OK') {
          directionsRenderer.setDirections(result);
      } else {
          alert('Não foi possível encontrar uma rota para o endereço fornecido.');
      }
  });
}


// Função para mostrar lugares próximos
function mostrarLugaresProximos() {
  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: { lat: -23.6508, lng: -47.2284 } // Centro do mapa
  });

  var lugares = [
      {
          position: { lat: -23.6510, lng: -47.2278 }, // Coordenadas do mercado
          title: 'Mercado Local',
          icon: 'assets/img/pin.png' // URL do ícone personalizado do mercado
      },
      {
          position: { lat: -23.6520, lng: -47.2280 }, // Coordenadas do restaurante
          title: 'Restaurante Local',
          icon: 'assets/img/pin.png' // URL do ícone personalizado do restaurante
      },
      {
          position: { lat: -23.6505, lng: -47.2290 }, // Coordenadas do posto de gasolina
          title: 'Posto de Gasolina',
          icon: 'assets/img/pin.png' // URL do ícone personalizado do posto
      }
  ];

  // Adiciona um marcador para cada lugar próximo
  lugares.forEach(function(lugar) {
      new google.maps.Marker({
          position: lugar.position,
          map: map,
          icon: lugar.icon,
          title: lugar.title
      });
  });
}
document.querySelectorAll('[data-uk-lightbox]').forEach(function(element) {
  element.addEventListener('click', function(event) {
      setTimeout(function() {
          document.querySelectorAll('.uk-open').forEach(function(el) {
              el.style.display = 'block';
              el.style.opacity = '1';
          });
      }, 100);
  });
});