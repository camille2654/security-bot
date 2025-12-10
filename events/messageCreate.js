module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;
        
        // Ajouter ta logique ici
        if (message.content === 'ping') {
            await message.reply('pong!');
        }
    }
};
