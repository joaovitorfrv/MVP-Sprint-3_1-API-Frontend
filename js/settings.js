// settings.js - Gerenciador de configurações

document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsModal = document.getElementById('settings-modal');
    const settingsForm = document.getElementById('settings-form');
    const cityInput = document.getElementById('settings-city');
    const modalOverlay = document.getElementById('modal-overlay');
    
    // Abrir modal de configurações
    settingsToggle.addEventListener('click', () => {
        // Preencher o formulário com os valores atuais
        const currentLocation = LocationManager.getCurrentLocation();
        cityInput.value = currentLocation.city;
        
        // Mostrar o modal
        modalOverlay.classList.remove('hidden');
        settingsModal.classList.remove('hidden');
    });
    
    settingsForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const city = cityInput.value.trim();
        if (!city) {
            alert('Por favor, informe uma cidade válida.');
            return;
        }
        
        try {
            // Verificar se a cidade existe na API de clima
            const response = await fetch(`${WEATHER_API_URL}/current.json?key=${WEATHER_API_KEY}&q=${city}`);
            if (!response.ok) {
                throw new Error('Cidade não encontrada');
            }
            
            const data = await response.json();
            
            // Salvar a localização com os dados da API, incluindo o fuso horário
            LocationManager.saveLocation(
                data.location.name,
                data.location.region,
                data.location.country,
                data.location.tz_id  // Salvar o fuso horário
            );
            
            // Fechar o modal
            closeModal();
            
        } catch (error) {
            alert('Não foi possível encontrar a cidade informada. Verifique o nome e tente novamente.');
            console.error('Erro ao verificar cidade:', error);
        }
    });
});