// Defina initMap fora do objeto app
function initMap() {
  console.log('Initializing Map');
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

var app = {
  
  init: function() {
    app.initSlickSliders();
    app.initEventListeners();
    app.setupLightbox();
    app.setupSearch();
    app.setupUrlUpdateOnInputChange();
    app.checkAccommodationAvailability();
    app.setupReservationForm();
    initMap();
  },

  initSlickSliders: function() {
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
      arrows: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });

    var $galeria = $('.galeria-slider');
    var $counter = $('#lightbox-counter');

    $galeria.slick({
      dots: false,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      autoplay: false,
      arrows: true,
      variableWidth: true, 
      responsive: [
        {
          breakpoint: 768,
          settings: {
            variableWidth: false, 
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });

    function updateCounter(slick, currentSlide) {
      var totalSlides = slick.slideCount;
      var currentIndex = currentSlide + 1; // O índice começa em 0, então adicionamos 1
      $counter.text(currentIndex + '/' + totalSlides);
    }

    $galeria.on('afterChange', function(event, slick, currentSlide) {
      updateCounter(slick, currentSlide);
    });

    updateCounter($galeria.slick('getSlick'), 0);

    if ($(window).width() < 768) {
      $('.estrutura-slider').slick({
        dots: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
      });
    }

    $('.linha-slider').slick({
      dots: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: false,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  },

  initEventListeners: function() {

    // Reserva interactions
    var abrirReservaButton = document.querySelector('.abrir-reserva');
    if (abrirReservaButton) {
      abrirReservaButton.addEventListener('click', function() {
        var resumoDiv = document.querySelector('.resumo');
        if (resumoDiv) {
          resumoDiv.classList.remove('fechado');
        }
      });
    }

    var voltarIcon = document.querySelector('.voltar');
    if (voltarIcon) {
      voltarIcon.addEventListener('click', function() {
        var resumoDiv = document.querySelector('.resumo');
        if (resumoDiv) {
          resumoDiv.classList.add('fechado');
        }
      });
    }

    // Lightbox interactions
    var verMaisFotos = document.getElementById('ver-mais-fotos');
    if (verMaisFotos) {
      verMaisFotos.addEventListener('click', function() {
        var firstImage = document.querySelector('.galeria-slider .item-galeria');
        if (firstImage) {
          firstImage.click();
        }
      });
    }
  },

  calculateRoute: function() {
    var start = document.getElementById('start-location').value;
    if (!start) {
      alert('Por favor, insira um local de partida.');
      return;
    }

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

    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
      } else {
        alert('Não foi possível encontrar uma rota para o endereço fornecido.');
      }
    });
  },

  mostrarLugaresProximos: function() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: { lat: -23.6508, lng: -47.2284 }
    });

    var lugares = [
      {
        position: { lat: -23.6510, lng: -47.2278 },
        title: 'Mercado Local',
        icon: 'assets/img/pin.png'
      },
      {
        position: { lat: -23.6520, lng: -47.2280 },
        title: 'Restaurante Local',
        icon: 'assets/img/pin.png'
      },
      {
        position: { lat: -23.6505, lng: -47.2290 },
        title: 'Posto de Gasolina',
        icon: 'assets/img/pin.png'
      }
    ];

    lugares.forEach(function(lugar) {
      new google.maps.Marker({
        position: lugar.position,
        map: map,
        icon: lugar.icon,
        title: lugar.title
      });
    });
  },

  setupLightbox: function() {
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
  },

  setupSearch: function() {
    console.log("iniciando")
    // Evento de clique para o botão "Ver Disponibilidade"
    var searchButton = document.querySelector('.btn-search');
    searchButton.addEventListener('click', function() {
      var checkin = document.getElementById('checkin').value;
      var checkout = document.getElementById('checkout').value;
      var guests = document.getElementById('num-hospedes').value || 1; // Default para 1

      // Validação simples para garantir que os campos de data estão preenchidos
      if (!checkin || !checkout) {
        alert('Por favor, preencha as datas de Check-in e Check-out.');
        return;
      }

      // Simular a chamada da API e redirecionar
      app.simulateApiCall({
        checkin: checkin,
        checkout: checkout,
        guests: guests
      }, true); // Passando true para indicar que devemos redirecionar
    });
  },

  checkAccommodationAvailability: function() {
    // Recuperar os parâmetros da URL


    // Verificar se estamos na página de resultados ou de acomodação
    if (window.location.pathname.includes('resultado.html')) {
        var urlParams = new URLSearchParams(window.location.search);
        var checkin = urlParams.get('checkin');
        var checkout = urlParams.get('checkout');
        var guests = urlParams.get('guests') || 1;

        // Simular chamada à API com os parâmetros
        app.simulateApiCall({
            checkin: checkin,
            checkout: checkout,
            guests: guests
        }, false); // Não queremos redirecionar aqui

        if (checkin) document.getElementById('checkin').value = checkin;
        if (checkout) document.getElementById('checkout').value = checkout;
        if (guests) document.getElementById('num-hospedes').value = guests;

        // Atualizar os links de acomodações para incluir os parâmetros
        app.updateAccommodationLinks(checkin, checkout, guests);
    } else if (window.location.pathname.includes('acomodacoes.html')) {

        var urlParams = new URLSearchParams(window.location.search);
        var checkin = urlParams.get('checkin');
        var checkout = urlParams.get('checkout');
        var guests = urlParams.get('guests') || 1;

        if (checkin) document.getElementById('checkin').value = checkin;
        if (checkout) document.getElementById('checkout').value = checkout;
        if (guests) document.getElementById('num-hospedes').value = guests;
        if (checkin) document.getElementById('checkinReserva-lateral').value = checkin;
        if (checkout) document.getElementById('checkoutReserva-lateral').value = checkout;
        if (guests) document.getElementById('num-hospedesReserva-lateral').value = guests;

        setTimeout(function() {
          // Preencher os dois conjuntos de campos
          if (checkin) document.getElementById('checkin').value = checkin;
          if (checkout) document.getElementById('checkout').value = checkout;
          if (guests) document.getElementById('num-hospedes').value = guests;
          if (checkin) document.getElementById('checkinReserva-lateral').value = checkin;
          if (checkout) document.getElementById('checkoutReserva-lateral').value = checkout;
          if (guests) document.getElementById('num-hospedesReserva-lateral').value = guests;
      
          // Sincronizar campos entre os dois formulários
          var checkin1 = document.getElementById('checkin');
          var checkout1 = document.getElementById('checkout');
          var guests1 = document.getElementById('num-hospedes');
      
          var checkin2 = document.getElementById('checkinReserva-lateral');
          var checkout2 = document.getElementById('checkoutReserva-lateral');
          var guests2 = document.getElementById('num-hospedesReserva-lateral');
      
          // Sincronizar mudanças de checkin
          checkin1.addEventListener('input', function() {
              checkin2.value = checkin1.value;
          });
          checkin2.addEventListener('input', function() {
              checkin1.value = checkin2.value;
          });
      
          // Sincronizar mudanças de checkout
          checkout1.addEventListener('input', function() {
              checkout2.value = checkout1.value;
          });
          checkout2.addEventListener('input', function() {
              checkout1.value = checkout2.value;
          });
      
          // Sincronizar mudanças de hóspedes
          guests1.addEventListener('input', function() {
              guests2.value = guests1.value;
          });
          guests2.addEventListener('input', function() {
              guests1.value = guests2.value;
          });
      
      }, 100);
      
    }
  },

  updateAccommodationLinks: function(checkin, checkout, guests) {
    // Selecionar todos os links de acomodação
    var accommodationLinks = document.querySelectorAll('.item-acomodacoes');

    // Atualizar os links para incluir os parâmetros
    accommodationLinks.forEach(function(link) {
      var currentHref = link.getAttribute('href');
      var newHref = `${currentHref}?checkin=${encodeURIComponent(checkin)}&checkout=${encodeURIComponent(checkout)}&guests=${encodeURIComponent(guests)}`;
      link.setAttribute('href', newHref);
    });
  },

  simulateApiCall: function(searchDetails, shouldRedirect) {
    // Simular um tempo de resposta
    setTimeout(function() {
      // Simulando a resposta da API
      var apiResponse = {
        data: {
          checkin: searchDetails.checkin,
          checkout: searchDetails.checkout,
          guests: searchDetails.guests,
          accommodations: [
            {
              type: 'Camping',
              available: true
            },
            {
              type: 'Chale',
              available: true
            },
            {
              type: 'Baia',
              available: true
            }
          ]
        }
      };

      // Atualizar a exibição das acomodações com base na resposta
      app.updateAccommodations(apiResponse.data.accommodations);
      
      // Exibir a resposta da API simulada no console
      console.log('Resposta da API simulada:', JSON.stringify(apiResponse, null, 2));

      // Redirecionar para a página de resultados se for necessário
      if (shouldRedirect) {
        var url = `resultado.html?checkin=${encodeURIComponent(searchDetails.checkin)}&checkout=${encodeURIComponent(searchDetails.checkout)}&guests=${encodeURIComponent(searchDetails.guests)}`;
        window.location.href = url;
      }
      console.log('Resposta da API simulada:', JSON.stringify(apiResponse, null, 2));
    }, 1000); // Simula um tempo de resposta de 1 segundo
  },

  updateAccommodations: function(accommodations) {
    // Iterar sobre as acomodações e exibir/ocultar com base na disponibilidade
    accommodations.forEach(function(accommodation) {
      var elementId = 'acomodacao-' + accommodation.type.toLowerCase();
      var element = document.getElementById(elementId);
      if (element) {
        if (accommodation.available) {
          element.style.display = 'block'; // Mostra a acomodação
        } else {
          element.style.display = 'none';  // Oculta a acomodação
        }
      }
    });
  },

  setupReservationForm: function() {
    // Evento de clique para o botão "Reserve agora"
    var reserveButton = document.querySelector('.btn-reserva');
    reserveButton.addEventListener('click', function() {
      app.makeReservation();
    });
  },

  makeReservation: function() {
    var checkin = document.getElementById('checkin').value;
    var checkout = document.getElementById('checkout').value;
    var guests = document.getElementById('num-hospedes').value || 1; // Default para 1

    // Validação simples para garantir que os campos de data estão preenchidos
    if (!checkin || !checkout) {
      alert('Por favor, preencha as datas de Check-in e Check-out.');
      return;
    }

    // Simular a chamada para a API de reserva
    app.simulateReserveApiCall({
      checkin: checkin,
      checkout: checkout,
      guests: guests
    });
  },

  simulateReserveApiCall: function(reservationDetails) {
    // Simular um tempo de resposta
    setTimeout(function() {
      // Simulando a resposta da API de reserva
      var apiResponse = {
        status: 'success',
        message: 'Reserva realizada com sucesso!',
        reservationDetails: {
          checkin: reservationDetails.checkin,
          checkout: reservationDetails.checkout,
          guests: reservationDetails.guests
        }
      };

      // Exibir a resposta da API simulada no console
      console.log('Resposta da API de reserva simulada:', JSON.stringify(apiResponse, null, 2));
      alert(apiResponse.message);
    }, 1000); // Simula um tempo de resposta de 1 segundo
  },

  setupUrlUpdateOnInputChange: function() {
    console.log("Função setupUrlUpdateOnInputChange foi chamada");
    // Selecionar os campos
    var checkinInput = document.getElementById('checkin');
    var checkoutInput = document.getElementById('checkout');
    var guestsInput = document.getElementById('num-hospedes');

    var checkinReservaInput = document.getElementById('checkinReserva-lateral');
    var checkoutReservaInput = document.getElementById('checkoutReserva-lateral');
    var guestsReservaInput = document.getElementById('num-hospedesReserva-lateral');

    // Função para atualizar a URL
    function updateUrlParams() {
      var checkin = checkinInput ? checkinInput.value : null;
      var checkout = checkoutInput ? checkoutInput.value : null;
      var guests = guestsInput ? guestsInput.value : 1;

      var url = new URL(window.location.href);
      if (checkin) url.searchParams.set('checkin', checkin);
      if (checkout) url.searchParams.set('checkout', checkout);
      url.searchParams.set('guests', guests);

      // Atualizar a URL sem recarregar a página
      window.history.pushState({}, '', url);
    }

    // Adicionar event listeners aos campos principais
    if (checkinInput) checkinInput.addEventListener('input', updateUrlParams);
    if (checkoutInput) checkoutInput.addEventListener('input', updateUrlParams);
    if (guestsInput) guestsInput.addEventListener('input', updateUrlParams);

    // Adicionar event listeners aos campos de reserva
    if (checkinReservaInput) checkinReservaInput.addEventListener('input', function() {
      checkinInput.value = checkinReservaInput.value; // Sincronizar com o campo principal
      updateUrlParams(); // Atualizar a URL
    });

    if (checkoutReservaInput) checkoutReservaInput.addEventListener('input', function() {
      checkoutInput.value = checkoutReservaInput.value; // Sincronizar com o campo principal
      updateUrlParams(); // Atualizar a URL
    });

    if (guestsReservaInput) guestsReservaInput.addEventListener('input', function() {
      guestsInput.value = guestsReservaInput.value; // Sincronizar com o campo principal
      updateUrlParams(); // Atualizar a URL
    });
  },

  increaseGuestsModal: function() {
    var input = document.getElementById('num-hospedesReserva-modal');
    if (input) {
      var currentValue = parseInt(input.value);
      input.value = currentValue + 1;
    } else {
      console.error("Elemento 'num-hospedesReserva-modal' não encontrado.");
    }
  },
  decreaseGuestsModal: function() {
    var input = document.getElementById('num-hospedesReserva-modal');
    if (input) {
      var currentValue = parseInt(input.value);
      if (currentValue > 1) {
        input.value = currentValue - 1;
      }
    } else {
      console.error("Elemento 'num-hospedesReserva-modal' não encontrado.");
    }
  },

  increaseGuestsLateral: function() {
    var input = document.getElementById('num-hospedesReserva-lateral');
    if (input) {
      var currentValue = parseInt(input.value);
      input.value = currentValue + 1;
    } else {
      console.error("Elemento 'num-hospedesReserva-lateral' não encontrado.");
    }
  },
  decreaseGuestsLateral: function() {
    var input = document.getElementById('num-hospedesReserva-lateral');
    if (input) {
      var currentValue = parseInt(input.value);
      if (currentValue > 1) {
        input.value = currentValue - 1;
      }
    } else {
      console.error("Elemento 'num-hospedesReserva-lateral' não encontrado.");
    }
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
  },
};

// Initialize app when document is ready
$(document).ready(function() {
  app.init();
});
