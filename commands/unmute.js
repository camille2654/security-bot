const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Retirer le mute d\'un utilisateur')
        .addUserOption(option => option.setName('user').setDescription('Utilisateur').setRequired(true)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        
        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.timeout(null);
            
            const embed = new EmbedBuilder()
                .setColor('#10B981')
                .setTitle('🔊 Mute retiré')
                .addFields({ name: 'Utilisateur', value: user.username })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ Erreur');
        }
    }
};
