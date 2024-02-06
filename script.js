const container = document.querySelector('.container');
const search = document.querySelector('.box-de-pesquisa button');
const weatherBox = document.querySelector('.box-tempo');
const weatherDetails = document.querySelector('.detalhes-do-tempo');
const error404 = document.querySelector('.not-found');

search.addEventListener('click', () => {

    const APIKey = 'f3d6f1813a7f4aee7082b0e33744d587';
    const city = document.querySelector('.box-de-pesquisa input').value;

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}&lang=pt_br`)
        .then(response => response.json())
        .then(json => {

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


        });


});