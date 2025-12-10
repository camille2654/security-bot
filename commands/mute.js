const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Rendre muet un utilisateur')
        .addUserOption(option => option.setName('user').setDescription('Utilisateur').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('Durée (5m, 1h, 1d)').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Raison').setRequired(false)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'Aucune raison';
        
        try {
            const member = await interaction.guild.members.fetch(user.id);
            
            // Parser la durée (5m, 1h, 1d)
            const durationMs = parseDuration(duration);
            
            await member.timeout(durationMs, reason);
            
            const embed = new EmbedBuilder()
                .setColor('#5B21B6')
                .setTitle('🔇 Utilisateur rendu muet')
                .addFields(
                    { name: 'Utilisateur', value: user.username },
                    { name: 'Durée', value: duration },
                    { name: 'Raison', value: reason }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ Erreur');
        }
    }
};

function parseDuration(str) {
    const units = { m: 60000, h: 3600000, d: 86400000 };
    const match = str.match(/^(\d+)([mhd])$/);
    return match ? parseInt(match[1]) * units[match[2]] : 0;
}
