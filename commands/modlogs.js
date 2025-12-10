const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modlogs')
        .setDescription('Voir l\'historique de modération'),
    
    async execute(interaction) {
        try {
            const logsPath = path.join(__dirname, '../data/modlogs.json');
            const logs = JSON.parse(fs.readFileSync(logsPath, 'utf-8'));
            
            const embed = new EmbedBuilder()
                .setColor('#5B21B6')
                .setTitle('📊 Historique de Modération')
                .setDescription(logs.length > 0 ? logs.slice(-5).map((log, i) => `${i+1}. ${log.action} - ${log.user}`).join('\n') : 'Aucun log')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ Erreur');
        }
    }
};
