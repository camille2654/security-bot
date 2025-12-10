const fs = require('fs');
const path = require('path');

// ===== LOGGER UTILITY =====
const logger = {
    info: (message) => console.log(`ℹ️  [INFO] ${new Date().toLocaleTimeString()} - ${message}`),
    success: (message) => console.log(`✅ [SUCCESS] ${new Date().toLocaleTimeString()} - ${message}`),
    warning: (message) => console.log(`⚠️  [WARNING] ${new Date().toLocaleTimeString()} - ${message}`),
    error: (message) => console.log(`❌ [ERROR] ${new Date().toLocaleTimeString()} - ${message}`),
    mod: (message) => console.log(`🛡️  [MOD] ${new Date().toLocaleTimeString()} - ${message}`),
};

// ===== DATABASE UTILITY =====
const database = {
    readWarnings: () => {
        try {
            const data = fs.readFileSync(path.join(__dirname, '../data/warnings.json'), 'utf-8');
            return JSON.parse(data);
        } catch {
            return {};
        }
    },
    
    writeWarnings: (data) => {
        fs.writeFileSync(path.join(__dirname, '../data/warnings.json'), JSON.stringify(data, null, 2));
    },
    
    readModLogs: () => {
        try {
            const data = fs.readFileSync(path.join(__dirname, '../data/modlogs.json'), 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    },
    
    writeModLogs: (data) => {
        fs.writeFileSync(path.join(__dirname, '../data/modlogs.json'), JSON.stringify(data, null, 2));
    },
    
    addLog: (action, user, moderator, reason) => {
        const logs = database.readModLogs();
        logs.push({
            timestamp: new Date().toISOString(),
            action,
            user: user.username || 'Unknown',
            userId: user.id,
            moderator: moderator.username || 'Unknown',
            moderatorId: moderator.id,
            reason: reason || 'No reason provided'
        });
        database.writeModLogs(logs);
    }
};

// ===== PERMISSIONS UTILITY =====
const permissions = {
    canBan: (member) => member.permissions.has('BanMembers'),
    canKick: (member) => member.permissions.has('KickMembers'),
    canModerate: (member) => member.permissions.has('ModerateMembers'),
    canManageMessages: (member) => member.permissions.has('ManageMessages'),
    isMod: (member) => member.permissions.has('ModerateMembers') || member.permissions.has('Administrator'),
};

// ===== EMBEDS UTILITY WITH COMPONENTS V2 =====
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const embeds = {
    success: (title, description, color = '#10B981') => {
        return new EmbedBuilder()
            .setColor(color)
            .setTitle(`✅ ${title}`)
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: 'Security Bot' });
    },
    
    error: (title, description) => {
        return new EmbedBuilder()
            .setColor('#EF4444')
            .setTitle(`❌ ${title}`)
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: 'Security Bot' });
    },
    
    warning: (title, description) => {
        return new EmbedBuilder()
            .setColor('#F59E0B')
            .setTitle(`⚠️  ${title}`)
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: 'Security Bot' });
    },
    
    info: (title, description) => {
        return new EmbedBuilder()
            .setColor('#3B82F6')
            .setTitle(`ℹ️  ${title}`)
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: 'Security Bot' });
    },
    
    modAction: (action, user, reason, moderator) => {
        return new EmbedBuilder()
            .setColor('#5B21B6')
            .setTitle(`🛡️  ${action.toUpperCase()}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Utilisateur', value: `${user.username} (${user.id})`, inline: true },
                { name: '👮 Modérateur', value: `${moderator.username}`, inline: true },
                { name: '📝 Raison', value: reason || 'Aucune raison fournie', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Action de modération enregistrée' });
    },
    
    modLogs: (logs, page = 1) => {
        const logsPerPage = 5;
        const startIdx = (page - 1) * logsPerPage;
        const paginatedLogs = logs.slice(startIdx, startIdx + logsPerPage);
        
        let description = '';
        paginatedLogs.forEach((log, index) => {
            const date = new Date(log.timestamp).toLocaleString('fr-FR');
            description += `\n\`${index + 1}.\` **${log.action.toUpperCase()}** - ${date}\n`;
            description += `└ Cible: \`${log.user}\` | Modérateur: \`${log.moderator}\`\n`;
            description += `└ Raison: ${log.reason}\n`;
        });
        
        return new EmbedBuilder()
            .setColor('#5B21B6')
            .setTitle('📊 Historique de Modération')
            .setDescription(description || 'Aucun log disponible')
            .addFields(
                { name: '📄 Page', value: `${page}/${Math.ceil(logs.length / logsPerPage)}`, inline: true },
                { name: '📈 Total', value: `${logs.length} actions`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Logs de modération' });
    },
    
    warningsCard: (user, warnings) => {
        return new EmbedBuilder()
            .setColor(warnings > 0 ? '#F59E0B' : '#10B981')
            .setTitle(`⚠️  Avertissements de ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Utilisateur', value: `${user.username} (${user.id})`, inline: true },
                { name: '⚠️  Total', value: `${warnings}/5`, inline: true },
                { name: '📊 Statut', value: warnings >= 5 ? '🚫 À bannir' : '✅ En bon état', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Système d\'avertissements' });
    }
};

// ===== COMPONENTS V2 BUTTONS =====
const createActionRow = (buttons) => {
    return new ActionRowBuilder()
        .addComponents(buttons);
};

const buttons = {
    confirm: () => new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('✅ Confirmer')
        .setStyle(ButtonStyle.Success),
    
    cancel: () => new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('❌ Annuler')
        .setStyle(ButtonStyle.Danger),
    
    delete: () => new ButtonBuilder()
        .setCustomId('delete')
        .setLabel('🗑️ Supprimer')
        .setStyle(ButtonStyle.Danger),
    
    appeal: () => new ButtonBuilder()
        .setCustomId('appeal')
        .setLabel('📝 Faire appel')
        .setStyle(ButtonStyle.Primary),
};

module.exports = {
    logger,
    database,
    permissions,
    embeds,
    createActionRow,
    buttons
};
