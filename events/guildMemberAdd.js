const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const embed = new EmbedBuilder()
            .setColor('#10B981')
            .setTitle('👋 Bienvenue!')
            .setDescription(`Bienvenue ${member.user.username} sur le serveur!`)
            .setTimestamp();
        
        const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
        if (channel) await channel.send({ embeds: [embed] });
    }
};
