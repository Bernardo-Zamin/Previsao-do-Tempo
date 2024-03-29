const container = document.querySelector('.container');
const search = document.querySelector('.box-de-pesquisa button');
const locationIcon = document.querySelector('.fa-location-crosshairs'); // Ícone de localização
const weatherBox = document.querySelector('.box-tempo');
const weatherDetails = document.querySelector('.detalhes-do-tempo');
const error404 = document.querySelector('.not-found');

// Função para atualizar a interface com as informações de tempo
function updateWeatherInfo(json) {
    if (json.cod === '404') {
        container.style.height = '400px';
        weatherBox.style.display = 'none';
        weatherDetails.style.display = 'none';
        error404.style.display = 'block';
        error404.classList.add('fadeIn');
        return;
    }

    error404.style.display = 'none';
    error404.classList.remove('fadeIn');

    const image = document.querySelector('.box-tempo img');
    const temperature = document.querySelector('.box-tempo .temperature');
    const description = document.querySelector('.box-tempo .description');
    const humidity = document.querySelector('.detalhes-do-tempo .umidade span');
    const wind = document.querySelector('.detalhes-do-tempo .vento span');

    switch (json.weather[0].main) {
        case 'Clear':
            image.src = 'images/sol.png';
            break;
        case 'Rain':
            image.src = 'images/chuva.png';
            break;
        case 'Snow':
            image.src = 'images/tempestade.png';
            break;
        case 'Clouds':
            image.src = 'images/nublado.png';
            break;
        case 'Haze':
        case 'Mist':
            image.src = 'images/ventando.png';
            break;
        default:
            image.src = '';
    }

    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
    description.innerHTML = `${json.weather[0].description}`;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

    weatherBox.style.display = '';
    weatherDetails.style.display = '';
    weatherBox.classList.add('fadeIn');
    weatherDetails.classList.add('fadeIn');
    container.style.height = '590px';
}

// Evento de clique no botão de pesquisa
search.addEventListener('click', () => {
    const APIKey = 'f3d6f1813a7f4aee7082b0e33744d587';
    const city = document.querySelector('.box-de-pesquisa input').value;

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}&lang=pt_br`)
        .then(response => response.json())
        .then(updateWeatherInfo);
});

// Função para atualizar o tempo baseado na localização atual
function updateWeatherWithCurrentLocation() {
    if (!navigator.geolocation) {
        alert('Geolocalização não é suportada pelo seu navegador');
        return;
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const APIKey = 'f3d6f1813a7f4aee7082b0e33744d587';

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}&lang=pt_br`)
            .then(response => response.json())
            .then(updateWeatherInfo)
            .catch(error => {
                console.error('Erro ao obter o tempo para a localização atual', error);
            });
    }

    function error() {
        alert('Não foi possível obter a sua localização');
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

// Adicionar ouvinte de evento ao ícone de localização
locationIcon.addEventListener('click', updateWeatherWithCurrentLocation);

// Função para atualizar o tempo baseado na localização atual
function updateWeatherWithCurrentLocation() {
    if (!navigator.geolocation) {
        alert('Geolocalização não é suportada pelo seu navegador');
        return;
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const APIKey = 'f3d6f1813a7f4aee7082b0e33744d587';

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}&lang=pt_br`)
            .then(response => response.json())
            .then(json => {
                updateWeatherInfo(json);

                // Utiliza setTimeout para esperar a animação das informações do tempo
                setTimeout(() => {
                    // Depois de um atraso, atualiza o nome da cidade na barra de pesquisa
                    updateCityNameBasedOnLocation(latitude, longitude);
                }, 1000); // Ajuste o tempo de atraso conforme necessário
            })
            .catch(error => {
                console.error('Erro ao obter o tempo para a localização atual', error);
            });
    }

    function error() {
        alert('Não foi possível obter a sua localização');
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

// Função JavaScript para atualizar a cidade na barra de pesquisa com efeito suave
function updateCityNameBasedOnLocation(latitude, longitude) {
    const inputLocalizacao = document.querySelector('.input-localizacao');

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            const cityName = data.address.city || "Cidade não encontrada";

            // Limpa o campo de entrada e inicia a transição
            // ... (dentro da função updateCityNameBasedOnLocation)
            inputLocalizacao.classList.add('fade-in');

            setTimeout(() => {
                inputLocalizacao.value = cityName;
                inputLocalizacao.classList.remove('fade-in');
            }, 20); // Um breve atraso antes de aplicar a mudança de valor e remover a classe de animação.
        })
        .catch(error => console.error('Erro ao obter o nome da cidade:', error));
}
