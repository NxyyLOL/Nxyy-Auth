const Discord = require('discord.js');
const mysql = require('mysql');

const mysqlConfig = {
  host: 'mysqlhost',
  user: 'mysqlusername',
  password: 'mysqlpassword',
  database: 'auth' // leave db as is
};

const botToken = 'bot_token';
const guildId = 'guild_id'; 

const pool = mysql.createPool(mysqlConfig);


const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
  console.log('Bot is ready!');
  createSlashCommands();
  client.user.setActivity('Koopa Auth v2', { type: 'WATCHING' });
});


async function createSlashCommands() {
  try {
    const commands = [
      {
        name: 'reset',
        description: 'Reset HWID',
        options: [
          {
            name: 'key',
            description: 'The key to reset',
            type: 'STRING',
            required: true
          }
        ]
      },
      {
        name: 'create',
        description: 'Create a new key',
        options: [
          {
            name: 'type',
            description: 'Expiration time of the key',
            type: 'STRING',
            required: true,
            choices: [
              {
                name: 'Week',
                value: '1'
              },
              {
                name: 'Month',
                value: '2'
              },
              {
                name: 'Lifetime',
                value: '3'
              }
            ]
          },
          {
            name: 'key',
            description: 'The key to create',
            type: 'STRING',
            required: false
          }
        ]
      },
      {
        name: 'check',
        description: 'Check key information',
        options: [
          {
            name: 'key',
            description: 'The key to check',
            type: 'STRING',
            required: true
          }
        ]
      },
    ];

    await client.guilds.cache.get(guildId)?.commands.set(commands);
    console.log('Slash commands registered.');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
}


client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'reset' && isAuthorizedUser(interaction.user.id)) {
    const key = options.getString('key');

    try {
      const connection = await getConnection();
      const query = 'UPDATE auth SET hwid = NULL WHERE `key` = ?';
      await executeQuery(connection, query, [key]);
      connection.release();

      interaction.reply('HWID reset successfully.');
    } catch (err) {
      console.error('Error:', err);
      interaction.reply('An error occurred.');
    }
  } else if (commandName === 'create' && isAuthorizedUser(interaction.user.id)) {
    let key = options.getString('key');
    const type = options.getString('type');
    if (!key) {

      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      key = Array.from({ length: 25 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
      key = key.replace(/(.{5})/g, '$1-').slice(0, -1);
    }

    try {
      const connection = await getConnection();
      const query = 'INSERT INTO auth (`key`, `type`) VALUES (?, ?)';
      await executeQuery(connection, query, [key, type]);
      connection.release();

      const embed = new Discord.MessageEmbed()
        .setTitle('Key Created Successfully')
        .addField('Key', '```xl\n' + key + '\n```')
        .addField('Type', type);
      const button = new Discord.MessageButton()
        .setLabel('Download')
        .setStyle('LINK')
        .setURL('https://koopa.lol'); // replace koopa.lol with your download url

      interaction.reply({ embeds: [embed], components: [new Discord.MessageActionRow().addComponents(button)] });
    } catch (err) {
      console.error('Error:', err);
      interaction.reply('An error occurred.');
    }
  } else if (commandName === 'check' && isAuthorizedUser(interaction.user.id)) {
    const key = options.getString('key');

    try {
      const connection = await getConnection();
      const query = 'SELECT * FROM auth WHERE `key` = ?';
      const result = await executeQuery(connection, query, [key]);
      connection.release();

      if (result.length > 0) {
        const authData = result[0];
        const embed = new Discord.MessageEmbed()
          .setTitle('Key Information')
          .addField('Key', '```xl\n' + authData.key + '\n```')
          .addField('Type', authData.type)
          .addField('HWID', authData.hwid || 'Not set');

        interaction.reply({ embeds: [embed] });
      } else {
        interaction.reply('Key not found.');
      }
    } catch (err) {
      console.error('Error:', err);
      interaction.reply('An error occurred.');
    }
  } else if (commandName === 'claim' && isAuthorizedUser(interaction.user.id)) {
    const key = options.getString('key');

    try {
      const connection = await getConnection();
      const query = 'SELECT * FROM auth WHERE `key` = ?';
      const result = await executeQuery(connection, query, [key]);
      connection.release();

      if (result.length > 0) {
        const authData = result[0];
        const guildId = interaction.guild.id;
        const memberId = interaction.member.id;
        const guild = client.guilds.cache.get(guildId);
        const member = guild.members.cache.get(memberId);
        
        if (member.roles.cache.has(claimRoleId)) {
          interaction.reply('You have already claimed the role.');
        } else {
          member.roles.add(claimRoleId);
          interaction.reply('Role claimed successfully.');
        }
      } else {
        interaction.reply('Invalid key.');
      }
    } catch (err) {
      console.error('Error:', err);
      interaction.reply('An error occurred.');
    }
  } 
});


function isAuthorizedUser(userId) {
  return userId === 'User ID' 
  || userId === 'User ID';
}


function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(connection);
    });
  });
}


function executeQuery(connection, query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}


client.login(botToken);
