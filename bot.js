const { Client, GatewayIntentBits } = require('discord.js');

const TOKEN = 'token';  
const PREFIX = '!';  
const axios = require('axios');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent 
    ]
});

client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);

});

client.on('messageCreate', async (message) => {
   
    if (message.author.bot) return;

    
    if (!message.content.startsWith(PREFIX)) return;

   
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();



   
    if (command === 'precio') {
        if (args.length === 0) {
            return await message.reply('⚠️ Debes especificar el ID del token. Ejemplo: `!precio ronin`');
        }

        const tokenId = args[0].toLowerCase();

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
