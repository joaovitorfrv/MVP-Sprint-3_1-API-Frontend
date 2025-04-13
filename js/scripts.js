// Configuração das APIs
const API_BASE_URL = 'http://localhost:5000/api';

const WEATHER_API_KEY = '8366b2c949224812ac635303250704';
const WEATHER_API_URL = 'http://api.weatherapi.com/v1';



// Função para carregar os dados do clima
async function loadWeather() {
    try {
        const location = LocationManager.getCityName();
        const response = await fetch(`${WEATHER_API_URL}/current.json?key=${WEATHER_API_KEY}&q=${location}`);
        if (!response.ok) throw new Error('Erro ao buscar dados do clima');

        const data = await response.json();
        const weatherIcon = document.getElementById('weather-icon');
        const temperatureElement = document.getElementById('temperature');

        // Adicionar "https:" antes do URL do ícone se ele começar com "//"
        const iconUrl = data.current.condition.icon;
        weatherIcon.src = iconUrl.startsWith('//') ? `https:${iconUrl}` : iconUrl;
        temperatureElement.textContent = `${data.current.temp_c}°C`;
        
        // Capturar o fuso horário e atualizar no LocationManager
        // Não disparamos o evento locationChanged aqui para evitar o ciclo
        const currentLocation = LocationManager.getCurrentLocation();
        localStorage.setItem('userLocation', JSON.stringify({
            ...currentLocation,
            timezone: data.location.tz_id
        }));
        
    } catch (error) {
        console.error('Erro ao carregar dados do clima:', error);
    }
}

// Recarregar o clima quando a localização mudar
document.addEventListener('locationChanged', loadWeather);

// Função para fechar todos os modais
function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript carregado com sucesso!');

    // Configurar o botão de fechar modal
    document.querySelectorAll('.cancel-button').forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Fechar modal ao clicar fora
    document.getElementById('modal-overlay').addEventListener('click', (event) => {
        if (event.target === document.getElementById('modal-overlay')) {
            closeModal();
        }
    });



    // Carregar dados iniciais
    loadWeather();


    // Configurar o botão de atualizar frase
    document.getElementById('refresh-quote').addEventListener('click', loadRandomQuote);
});
