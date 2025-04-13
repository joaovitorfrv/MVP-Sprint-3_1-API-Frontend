// Função para atualizar o relógio
function updateClock() {
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date');
    const locationElement = document.getElementById('location');

    // Obter o fuso horário da cidade escolhida
    const timezone = LocationManager.getTimezone();
    
    // Obter a data e hora atual no fuso horário da cidade escolhida
    const now = new Date();
    
    // Formatar a hora no fuso horário escolhido
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        timeZone: timezone 
    };
    const timeString = new Intl.DateTimeFormat('pt-BR', timeOptions).format(now);
    
    // Formatar a data no fuso horário escolhido
    const dateOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        timeZone: timezone 
    };
    const dateString = new Intl.DateTimeFormat('pt-BR', dateOptions).format(now);

    clockElement.textContent = timeString;
    dateElement.textContent = dateString;
    locationElement.textContent = LocationManager.getFormattedLocation();
}

// Atualizar o relógio quando a localização mudar
document.addEventListener('locationChanged', updateClock);

// Atualizar o relógio
updateClock();
setInterval(updateClock, 1000);