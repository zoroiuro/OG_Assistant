const { Client, GatewayIntentBits } = require('discord.js');

const TOKEN = 'token';  // Reemplaza con el token de tu bot
const PREFIX = '!';  // Prefijo para los comandos
const axios = require('axios');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Este intent es el que causa el error si no está activado en el portal
    ]
});

client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);

});

client.on('messageCreate', async (message) => {
    // Evitar que el bot responda a sí mismo o a otros bots
    if (message.author.bot) return;

    // Verificar si el mensaje comienza con el prefijo
    if (!message.content.startsWith(PREFIX)) return;

    // Obtener el comando sin el prefijo
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Comando !ping
    if (command === 'ping') {
        await message.reply('🏓 Pong!');
    }

    // Comando !precio (aún sin funcionalidad, lo agregaremos después)
    if (command === 'precio') {
        if (args.length === 0) {
            return await message.reply('⚠️ Debes especificar el ID del token. Ejemplo: `!precio ronin`');
        }

        const tokenId = args[0].toLowerCase(); // Convertimos el ID a minúsculas para evitar errores

        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
            
            if (!response.data[tokenId]) {
                return await message.reply(`❌ No se encontró información para el token **${tokenId}**.`);
            }

            const price = response.data[tokenId].usd;
            await message.reply(`💰 El precio actual de **${tokenId.toUpperCase()}** es **$${price} USD**`);
        } catch (error) {
            console.error('Error obteniendo el precio:', error);
            await message.reply('⚠️ Hubo un error al obtener el precio del token.');
        }
    }
});

client.login(TOKEN);
