const LocationManager = {
    // Valores padrão
    defaultCity: 'São Paulo',
    defaultRegion: 'São Paulo',
    defaultCountry: 'Brasil',
    defaultTimezone: 'America/Sao_Paulo',
    
    // Obter localização atual (do localStorage ou padrão)
    getCurrentLocation() {
      try {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
          return JSON.parse(savedLocation);
        }
      } catch (error) {
        console.error('Erro ao ler localização do localStorage:', error);
        localStorage.removeItem('userLocation');
      }
      
      return {
        city: this.defaultCity,
        region: this.defaultRegion,
        country: this.defaultCountry,
        timezone: this.defaultTimezone
      };
    },
    
    // Salvar nova localização
    saveLocation(city, region, country, timezone) {
      const locationData = {
        city: city || this.defaultCity,
        region: region || this.defaultRegion,
        country: country || this.defaultCountry,
        timezone: timezone || this.defaultTimezone
      };
      
      try {
        localStorage.setItem('userLocation', JSON.stringify(locationData));
      } catch (error) {
        console.error('Erro ao salvar localização no localStorage:', error);
      }
      
      // Disparar evento para notificar outros módulos
      const event = new CustomEvent('locationChanged', { detail: locationData });
      document.dispatchEvent(event);
      
      return locationData;
    },
    
    // Formatar localização para exibição
    getFormattedLocation() {
      const location = this.getCurrentLocation();
      return `${location.city}, ${location.country}`;
    },
    
    // Obter apenas o nome da cidade para API de clima
    getCityName() {
      return this.getCurrentLocation().city;
    },
    
    // Obter o fuso horário
    getTimezone() {
      return this.getCurrentLocation().timezone;
    }
  };
  
  // Inicializar o gerenciador
  document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('userLocation')) {
      LocationManager.saveLocation(
        LocationManager.defaultCity,
        LocationManager.defaultRegion,
        LocationManager.defaultCountry,
        LocationManager.defaultTimezone
      );
    }
  });