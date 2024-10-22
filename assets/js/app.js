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
    app.validateAvailabilityOnLoad();
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

    // Eventos para abrir e fechar a reserva
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

    // Event listeners para check-in, check-out e número de hóspedes
    var checkinInput = document.getElementById('checkinReserva-lateral');
    var checkoutInput = document.getElementById('checkoutReserva-lateral');
    var guestsInput = document.getElementById('num-hospedesReserva-lateral');

    // Função para validar a disponibilidade com base nos inputs
    function validate() {
        app.validateAvailability({
            checkin: checkinInput.value,
            checkout: checkoutInput.value,
            guests: guestsInput.value
        });
    }

    // Adiciona listeners se os elementos existem
    if (checkinInput && checkoutInput && guestsInput) {
        // Validação ao mudar o campo de check-in
        checkinInput.addEventListener('change', validate);

        // Validação ao mudar o campo de check-out
        checkoutInput.addEventListener('change', validate);

        // Validação ao mudar o campo de número de hóspedes (usando 'input' para capturar qualquer mudança)
        guestsInput.addEventListener('input', validate); // Usa 'input' para capturar mudanças via botões ou digitação
    } else {
        console.error('Algum dos elementos checkin, checkout ou guests não foi encontrado.');
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
    console.log("iniciando setupSearch");

    // Evento de clique para todos os botões "Ver Disponibilidade"
    var searchButtons = document.querySelectorAll('.btn-search');

    searchButtons.forEach(function(searchButton) {
        searchButton.addEventListener('click', function(event) {
            // Definir o formId com fallback para 'main' se não houver um data-form-id
            var formId = event.target.getAttribute('data-form-id') || 'main';  // Pega o identificador do formulário ou usa 'main' como padrão
            console.log("Form ID encontrado: ", formId);

            // Define as variáveis de ID de acordo com o formulário/modal
            var checkinField, checkoutField, guestsField;

            if (formId === 'modal') {  // IDs usados no modal
                checkinField = document.getElementById('checkinReserva-modal');
                checkoutField = document.getElementById('checkoutReserva-modal');
                guestsField = document.getElementById('num-hospedesReserva-modal');
            } else if (formId === 'main') {  // IDs usados fora do modal (na página principal)
                checkinField = document.getElementById('checkin');
                checkoutField = document.getElementById('checkout');
                guestsField = document.getElementById('num-hospedes');
            } else {
                console.error('Formulário desconhecido: ', formId);
                return;
            }

            // Verificar se os campos existem antes de tentar acessar seus valores
            if (!checkinField || !checkoutField || !guestsField) {
                console.error('Algum campo está faltando no formulário: checkin, checkout ou num-hospedes');
                return;
            }

            var checkin = checkinField.value;
            var checkout = checkoutField.value;
            var guests = guestsField.value || 1; // Default para 1

            // Validação simples para garantir que os campos de data estão preenchidos
            if (!checkin || !checkout) {
                alert('Por favor, preencha as datas de Check-in e Check-out.');
                return;
            }

            // Simular a chamada da API e redirecionar
            app.realApiCall ({
                checkin: checkin,
                checkout: checkout,
                guests: guests
            }, true); // Passando true para indicar que devemos redirecionar
        });
    });
  },

  checkAccommodationAvailability: function() {
    // Recuperar os parâmetros da URL
    var urlParams = new URLSearchParams(window.location.search);
    var checkin = urlParams.get('checkin');
    var checkout = urlParams.get('checkout');
    var guests = urlParams.get('guests') || 1; // Valor padrão para hóspedes

    // Verificar se estamos na página de resultados ou de acomodação
    if (window.location.pathname.includes('resultado.html')) {
        // Preencher os campos na página de resultados
        if (checkin) document.getElementById('checkin').value = checkin;
        if (checkout) document.getElementById('checkout').value = checkout;
        if (guests) document.getElementById('num-hospedes').value = guests;

        // Simular chamada à API com os parâmetros para obter disponibilidade
        app.realApiCall({
            checkin: checkin,
            checkout: checkout,
            guests: guests
        }, false); // Não redirecionar aqui

        // Atualizar os links de acomodações para incluir os parâmetros
        app.updateAccommodationLinks(checkin, checkout, guests);

    } else if (window.location.pathname.includes('camping.html') || window.location.pathname.includes('baia.html')) {
        // Atualizar os campos principais e laterais na página de acomodações
        if (checkin) document.getElementById('checkin').value = checkin;
        if (checkout) document.getElementById('checkout').value = checkout;
        if (guests) document.getElementById('num-hospedes').value = guests;
        
        // Atualizar campos laterais, se existirem
        var checkinLateral = document.getElementById('checkinReserva-lateral');
        var checkoutLateral = document.getElementById('checkoutReserva-lateral');
        var guestsLateral = document.getElementById('num-hospedesReserva-lateral');

        if (checkinLateral) checkinLateral.value = checkin;
        if (checkoutLateral) checkoutLateral.value = checkout;
        if (guestsLateral) guestsLateral.value = guests;

        // Sincronizar os campos principais e laterais
        setTimeout(function() {
            app.synchronizeFields();
        }, 100);
    }
  },

  synchronizeFields: function() {
    // Sincronizar os campos principais e laterais
    var checkin1 = document.getElementById('checkin');
    var checkout1 = document.getElementById('checkout');
    var guests1 = document.getElementById('num-hospedes');

    var checkin2 = document.getElementById('checkinReserva-lateral');
    var checkout2 = document.getElementById('checkoutReserva-lateral');
    var guests2 = document.getElementById('num-hospedesReserva-lateral');

    // Verificar se os campos laterais existem antes de adicionar os eventos
    if (checkin1 && checkin2) {
        checkin1.addEventListener('input', function() {
            checkin2.value = checkin1.value;
        });
        checkin2.addEventListener('input', function() {
            checkin1.value = checkin2.value;
        });
    }

    if (checkout1 && checkout2) {
        checkout1.addEventListener('input', function() {
            checkout2.value = checkout1.value;
        });
        checkout2.addEventListener('input', function() {
            checkout1.value = checkout2.value;
        });
    }

    if (guests1 && guests2) {
        guests1.addEventListener('input', function() {
            guests2.value = guests1.value;
        });
        guests2.addEventListener('input', function() {
            guests1.value = guests2.value;
        });
    }
  },

  updateAccommodationLinks: function(checkin, checkout, guests) {
    // Selecionar todos os links de acomodação
    var accommodationLinks = document.querySelectorAll('.item-acomodacoes:not(.em-breve)');

    // Atualizar os links para incluir os parâmetros
    accommodationLinks.forEach(function(link) {
      var currentHref = link.getAttribute('href');
      var newHref = `${currentHref}?checkin=${encodeURIComponent(checkin)}&checkout=${encodeURIComponent(checkout)}&guests=${encodeURIComponent(guests)}`;
      link.setAttribute('href', newHref);
    });
  },

  realApiCall: function(searchDetails, shouldRedirect) {
    console.log('Fazendo chamada real para a API...');

    var url = `https://api.tupara.com.br/api/calendario?checkin=${encodeURIComponent(searchDetails.checkin)}&checkout=${encodeURIComponent(searchDetails.checkout)}&guests=${encodeURIComponent(searchDetails.guests)}`;
    
    console.log('URL de requisição:', url);

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'lTWKIRSsLXW67P69i8We'
        }
    })
    .then(response => {
        return response.text().then(text => {
            console.log('Resposta bruta da API:', text);  
            return text ? JSON.parse(text) : {};  
        });
    })
    .then(data => {
        console.log('Resposta da API convertida em JSON:', data);

        app.updateAccommodations(data.accomodations);

        if (shouldRedirect) {
            var url = `resultado.html?checkin=${encodeURIComponent(searchDetails.checkin)}&checkout=${encodeURIComponent(searchDetails.checkout)}&guests=${encodeURIComponent(searchDetails.guests)}`;
            window.location.href = url;
        }
    })
    .catch(error => {
        console.error('Erro ao buscar disponibilidade:', error);
        alert('Ocorreu um erro ao verificar a disponibilidade. Tente novamente.');
    });
  },

  updateAccommodations: function(accommodations) {
    // Iterar sobre as acomodações e exibir/ocultar com base na disponibilidade
    accommodations.forEach(function(accommodation) {
        var elementId = 'acomodacao-' + accommodation.type.toLowerCase(); // Cria o ID correspondente
        var element = document.getElementById(elementId); // Busca o elemento no DOM
        if (element) {
            if (accommodation.available) {
                element.style.display = 'block'; // Mostra a acomodação
            } else {
                element.style.display = 'none';  // Oculta a acomodação
            }
        } else {
            console.warn(`Elemento com ID ${elementId} não encontrado no DOM.`);
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

  getLocalFromUrl: function() {
    // Pega o caminho da URL atual
    var path = window.location.pathname;

    // Remove a extensão .html, se existir
    var local = path.replace('.html', '').split('/').pop(); // Pega a última parte do caminho da URL

    // Retorna o "local" em minúsculas
    return local ? local.toLowerCase() : null;
  },

  makeReservation: function() {
    // Obter os valores do check-in, check-out e número de hóspedes
    var checkin = document.getElementById('checkin').value;
    var checkout = document.getElementById('checkout').value;
    var participantes = document.getElementById('num-hospedes').value || 1; // Definir como 'participantes'
    var local = app.getLocalFromUrl(); // Pegar o local a partir da URL

    // Validação simples
    if (!checkin || !checkout) {
        alert('Por favor, preencha as datas de Check-in e Check-out.');
        return;
    }

    // Verificar a disponibilidade antes de abrir o modal
    app.validateAvailability({
        checkin: checkin,
        checkout: checkout,
        guests: participantes
    }).then(function(isAvailable) {
        if (isAvailable) {
            // Se a acomodação estiver disponível, exibir o modal
            var modal = new bootstrap.Modal(document.getElementById('reservationModal'));
            modal.show();

            // Quando o usuário confirmar os dados no modal, prosseguir com a reserva
            document.getElementById('confirmReservation').addEventListener('click', function() {
                var userName = document.getElementById('userName').value;
                var userEmail = document.getElementById('userEmail').value;

                // Validação simples
                if (!userName || !userEmail) {
                    alert('Por favor, preencha todos os campos obrigatórios.');
                    return;
                }

                // Converter as datas para o formato DD/MM/YYYY
                checkin = app.convertToBrazilianDateFormat(checkin);
                checkout = app.convertToBrazilianDateFormat(checkout);

                var titulo = `Reserva para ${userName}`;
                var descricao = `${local.charAt(0).toUpperCase() + local.slice(1)} reservada para ${userName} entre os dias ${checkin} a ${checkout}`;

                // Fazer a chamada real para a API de reserva
                app.makeRealReserveApiCall({
                    local: local,
                    titulo: titulo,
                    descricao: descricao,
                    dtini: checkin,
                    dtfim: checkout,
                    status: 1, // Suponho que '1' significa uma reserva ativa
                    participantes: participantes,
                    userName: userName,
                    userEmail: userEmail
                });

                // Fechar o modal após a confirmação
                modal.hide();
            });
        } else {
            // Exibir uma mensagem de alerta se a acomodação não estiver disponível
            alert('Desculpe, a acomodação não está disponível para as datas selecionadas.');
        }
    }).catch(function(error) {
        console.error('Erro ao verificar disponibilidade antes de fazer a reserva:', error);
        alert('Ocorreu um erro ao verificar a disponibilidade. Tente novamente.');
    });
  },


  convertToBrazilianDateFormat: function(dateStr) {
    // Supõe que a data esteja no formato YYYY-MM-DD
    var parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // Retorna DD-MM-YYYY
  },

  makeRealReserveApiCall: function(reservationDetails) {

    fetch('https://api.tupara.com.br/api/calendario', {
      method: 'POST',
      headers: {
        'Authorization': 'lTWKIRSsLXW67P69i8We',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        local: reservationDetails.local,
        titulo: reservationDetails.titulo,
        descricao: reservationDetails.descricao,
        dtini: reservationDetails.dtini,
        dtfim: reservationDetails.dtfim,
        status: reservationDetails.status,
        participantes: reservationDetails.participantes
      })
    })
    .then(response => {
      console.log("response:", response);
      if (!response.ok) {
        throw new Error('Erro na resposta da API: ' + response.statusText);
      }
      // Tratar a resposta como texto, já que o código da reserva está em uma string simples
      return response.text();
    })
    .then(data => {
      console.log("Resposta da API:", data);
  
      // Insere o código da reserva no modal
      const reservationCode = data || "código não encontrado";
      const modalBody = document.querySelector("#agradecimentoModal .modal-body p");
      modalBody.innerHTML = `Reserva realizada com sucesso! <br> Código da reserva: <strong>${reservationCode}</strong>`;
  
      // Exibe o modal de agradecimento
      $('#agradecimentoModal').modal('show');
    })
    .catch(error => {
      console.error('Erro ao realizar a reserva:', error);
      alert('Ocorreu um erro ao realizar a reserva. Tente novamente.');
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

        // Chama a validação após o incremento
        app.validateAvailability({
            checkin: document.getElementById('checkinReserva-lateral').value,
            checkout: document.getElementById('checkoutReserva-lateral').value,
            guests: input.value
        });
    }
  },

  decreaseGuestsLateral: function() {
      var input = document.getElementById('num-hospedesReserva-lateral');
      if (input) {
          var currentValue = parseInt(input.value);
          if (currentValue > 1) {
              input.value = currentValue - 1;

              // Chama a validação após o decremento
              app.validateAvailability({
                  checkin: document.getElementById('checkinReserva-lateral').value,
                  checkout: document.getElementById('checkoutReserva-lateral').value,
                  guests: input.value
              });
          }
      }
  },

  increaseGuests: function() {
    var input = document.getElementById('num-hospedes');
    if (input) {
        var currentValue = parseInt(input.value) || 1; // Garantir que o valor seja um número
        input.value = currentValue + 1;
        this.updateUrlGuests(input.value); // Atualizar a URL
    } else {
        console.error('Campo de hóspedes principal não encontrado.');
    }
  },

  decreaseGuests: function() {
      var input = document.getElementById('num-hospedes');
      if (input) {
          var currentValue = parseInt(input.value) || 1; // Garantir que o valor seja um número
          if (currentValue > 1) {
              input.value = currentValue - 1;
              this.updateUrlGuests(input.value); // Atualizar a URL
          }
      } else {
          console.error('Campo de hóspedes principal não encontrado.');
      }
  },

  updateUrlGuests: function(guests) {
      var url = new URL(window.location.href);
      url.searchParams.set('guests', guests);
      window.history.pushState({}, '', url); // Atualizar a URL sem recarregar a página
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

    // Sincronizar campos principais -> campos laterais
    if (checkinInput) {
        checkinInput.addEventListener('input', function() {
            checkinReservaInput.value = checkinInput.value; // Sincronizar com o campo lateral
            updateUrlParams(); // Atualizar a URL
        });
    }

    if (checkoutInput) {
        checkoutInput.addEventListener('input', function() {
            checkoutReservaInput.value = checkoutInput.value; // Sincronizar com o campo lateral
            updateUrlParams(); // Atualizar a URL
        });
    }

    // Sincronizar campos laterais -> campos principais
    if (checkinReservaInput) {
        checkinReservaInput.addEventListener('input', function() {
            checkinInput.value = checkinReservaInput.value; // Sincronizar com o campo principal
            updateUrlParams(); // Atualizar a URL
        });
    }

    if (checkoutReservaInput) {
        checkoutReservaInput.addEventListener('input', function() {
            checkoutInput.value = checkoutReservaInput.value; // Sincronizar com o campo principal
            updateUrlParams(); // Atualizar a URL
        });
    }

    // Sincronizar hóspedes lateral -> principal
    if (guestsReservaInput) {
        guestsReservaInput.addEventListener('input', function() {
            guestsInput.value = guestsReservaInput.value; // Sincronizar com o campo principal
            updateUrlParams(); // Atualizar a URL
        });
    }

    // Sincronizar hóspedes principal -> lateral
    if (guestsInput) {
        guestsInput.addEventListener('input', function() {
            guestsReservaInput.value = guestsInput.value; // Sincronizar com o campo lateral
            updateUrlParams(); // Atualizar a URL
        });
    }
  },

  validateAvailabilityOnLoad: function() {
    var checkin = document.getElementById('checkin').value;
    var checkout = document.getElementById('checkout').value;
    var participantes = document.getElementById('num-hospedes').value || 1; // Definir como 'participantes'

    // Verificar se os campos de checkin e checkout estão preenchidos
    if (checkin && checkout) {
        app.validateAvailability({
            checkin: checkin,
            checkout: checkout,
            guests: participantes
        }).then(function(isAvailable) {
            if (isAvailable) {
                console.log('Acomodação disponível ao carregar a página.');
            } else {
                console.log('Acomodação não disponível ao carregar a página.');
            }
        }).catch(function(error) {
            console.error('Erro ao verificar disponibilidade ao carregar a página:', error);
        });
    } else {
        // Caso os campos estejam vazios, desabilitar o botão até que as datas sejam preenchidas
        document.querySelector('.btn-reserva').disabled = true;
        document.querySelector('.btn-reserva').innerText = 'Preencha as datas';
    }
  },

  validateAvailability: function(searchDetails) { 
    return new Promise(function(resolve, reject) {
        console.log('Fazendo chamada real para a API...');

        var url = `https://api.tupara.com.br/api/calendario?checkin=${encodeURIComponent(searchDetails.checkin)}&checkout=${encodeURIComponent(searchDetails.checkout)}&guests=${encodeURIComponent(searchDetails.guests)}`;
        
        console.log('URL de requisição:', url);

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'lTWKIRSsLXW67P69i8We'
            }
        })
        .then(response => response.text())
        .then(text => {
            console.log('Resposta bruta da API:', text);  
            var response = text ? JSON.parse(text) : {};  

            // Pegar o nome da página atual a partir da URL
            var currentPage = window.location.pathname.split('/').pop().replace('.html', '').toLowerCase();
            console.log('Página atual:', currentPage);

            // Verificar se há acomodações retornadas e se estão disponíveis
            var found = false;
            response.accomodations.forEach(function(accommodation) {
                if (accommodation.type === currentPage && accommodation.available) {
                    found = true;
                    console.log(`${accommodation.type} está disponível.`);
                }
            });

            if (found) {
                // Habilitar o botão de reserva se disponível
                document.querySelector('.btn-reserva').disabled = false;
                document.querySelector('.btn-reserva').innerText = 'Reserve agora';
                resolve(true); // Acomodação disponível
            } else {
                // Desabilitar o botão de reserva se indisponível
                document.querySelector('.btn-reserva').disabled = true;
                document.querySelector('.btn-reserva').innerText = 'Indisponível';
                resolve(false); // Acomodação não disponível
            }
        })
        .catch(error => {
            console.error('Erro ao verificar disponibilidade:', error);
            reject(error); // Rejeitar a promessa em caso de erro
        });
    });
  },
};

// Initialize app when document is ready
$(document).ready(function() {
  app.init();
});

var modal = document.getElementById('reservaModal');

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (modal.style.display === "block") {
      console.log("Modal foi aberto");
      app.setupSearch(); // Chama a função quando o modal é exibido
    }
  });
});

observer.observe(modal, { attributes: true, attributeFilter: ['style'] });