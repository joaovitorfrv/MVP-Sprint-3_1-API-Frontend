const KANYE_API_URL = 'https://api.kanye.rest';

async function loadRandomQuote() {
    try {
        const response = await fetch(KANYE_API_URL);
        if (!response.ok) throw new Error('Erro ao buscar frase');

        const data = await response.json();
        const quoteElement = document.getElementById('quote');
        quoteElement.textContent = `"${data.quote}"`;
    } catch (error) {
        console.error('Erro ao carregar frase:', error);
        document.getElementById('quote').textContent = '"Não foi possível carregar uma frase inspiradora."';
    }
}

// Configurar o botão de atualizar frase
document.getElementById('refresh-quote').addEventListener('click', loadRandomQuote);

loadRandomQuote();