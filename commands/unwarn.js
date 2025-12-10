const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('Retirer un avertissement')
        .addUserOption(option => option.setName('user').setDescription('Utilisateur').setRequired(true)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        
        try {
            const warningsPath = path.join(__dirname, '../data/warnings.json');
            let warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf-8'));
            
            if (warnings[user.id] && warnings[user.id] > 0) {
                warnings[user.id]--;
            }
            
            fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));
            
            const embed = new EmbedBuilder()
                .setColor('#10B981')
                .setTitle('✅ Avertissement retiré')
                .addFields(
                    { name: 'Utilisateur', value: user.username },
                    { name: 'Avertissements', value: `${warnings[user.id] || 0}/5` }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ Erreur');
        }
    }
};
