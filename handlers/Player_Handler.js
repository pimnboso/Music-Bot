const player = require("./player");
const ee = require("../settings/embed.json");
const emoji = require("../settings/emoji.json");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Client,
  ButtonInteraction,
} = require("discord.js");
const chalk = require("chalk");

let raw = new MessageActionRow().addComponents([
  new MessageButton()
    .setStyle("SECONDARY")
    .setCustomId("playp")
    .setLabel("Previous")
    .setEmoji(emoji.previous_track),
  new MessageButton()
    .setStyle("SECONDARY")
    .setCustomId("pause")
    .setLabel("Pause")
    .setEmoji(emoji.pause_resume),
  new MessageButton()
    .setStyle("SECONDARY")
    .setCustomId("skip")
    .setLabel("Skip")
    .setEmoji(emoji.skip_track),
  new MessageButton()
    .setStyle("SECONDARY")
    .setCustomId("loop")
    .setLabel("Off")
    .setEmoji(emoji.repeat_mode),
  new MessageButton()
    .setStyle("SECONDARY")
    .setCustomId("stop")
    .setLabel("Stop")
    .setEmoji(emoji.stop),
]);
let d_raw = new MessageActionRow().addComponents([
  new MessageButton()
    .setStyle("SECONDARY")
    .setCustomId("playp")
    .setLabel("Previous")
    .setEmoji(emoji.previous_track)
    .setDisabled(true),
  new MessageButton()
    .setStyle("SECONDARY")
    .setCustomId("pause")
    .setLabel("Pause")
    .setEmoji(emoji.pause_resume)
    .setDisabled(true),
  new MessageButton()
    .setStyle("SECONDARY")
    .setCustomId("skip")
    .setLabel("Skip")
    .setEmoji(emoji.skip_track)
    .setDisabled(true),
  new MessageButton()
    .setStyle("SECONDARY")
    .setCustomId("loop")
    .setLabel("Off")
    .setDisabled(true)
    .setEmoji(emoji.repeat_mode),
  new MessageButton()
    .setStyle("SECONDARY")
    .setCustomId("stop")
    .setLabel("Stop")
    .setDisabled(true)
    .setEmoji(emoji.stop),
]);
const status = (queue) =>
  `Volume: ${queue.volume}% • Filter: ${
    queue.filters.join(", ") || "Off"
  } • Status : ${queue.paused ? "Paused" : "Playing"} • Loop: ${
    queue.repeatMode ? (queue.repeatMode === 2 ? "Queue" : "Song") : "Off"
  } • Autoplay: ${queue.autoplay ? "On" : "Off"}`;

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  await player.setMaxListeners(25);
  try {
    // play song
    player.on("playSong", async (queue, song) => {
      if (!queue) return;

      queue.textChannel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setThumbnail(song.thumbnail)
              .setDescription(`>>> ** [\`${song.name}\`](${song.url}) **`)
              .addFields([
                {
                  name: `${emoji.song_by} Pedido por`,
                  value: `>>> ${song.user}`,
                  inline: true,
                },
                {
                  name: `${emoji.time} Duration`,
                  value: `>>> \`${song.formattedDuration}\``,
                  inline: true,
                },
              ])
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
          components: [raw],
        })
        .then((msg) => {
          client.temp2.set(queue.textChannel.guild.id, msg.id);
        });
    });

    // add song
    player.on("addSong", async (queue, song) => {
      if (!queue) return;

      queue.textChannel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setAuthor({
                name: `Adicionado a fila`,
                iconURL: song.user.displayAvatarURL({ dynamic: true }),
                url: song.url,
              })
              .setDescription(`>>> ** [\`${song.name}\`](${song.url}) **`)
              .addFields([
                {
                  name: `${emoji.song_by} Requested By`,
                  value: `>>> ${song.user}`,
                  inline: true,
                },
                {
                  name: `${emoji.time} Duration`,
                  value: `>>> \`${song.formattedDuration}\``,
                  inline: true,
                },
              ])
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => {});
          }, 5000);
        })
        .catch((e) => {});
    });

    // add list
    player.on("addList", async (queue, playlist) => {
      if (!queue) return;

      queue.textChannel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setAuthor({
                name: `Playlist adicionada a fila`,
                iconURL: playlist.user.displayAvatarURL({ dynamic: true }),
                url: playlist.url,
              })
              .setDescription(
                `>>> ** [\`${playlist.name}\`](${playlist.url}) **`
              )
              .addFields([
                {
                  name: `${emoji.song_by} Pedido por`,
                  value: `>>> ${playlist.user}`,
                  inline: true,
                },
                {
                  name: `${emoji.time} Duração`,
                  value: `>>> \`${playlist.formattedDuration}\``,
                  inline: true,
                },
                {
                  name: `${emoji.lyrics} Musicas`,
                  value: `>>> \`${playlist.songs.length} Songs\``,
                  inline: true,
                },
              ])
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => {});
          }, 5000);
        })
        .catch((e) => {});
    });
    // disconnect
    player.on("disconnect", async (queue) => {
      if (!queue) return;

      let ID = client.temp2.get(queue.textChannel.guild.id);
      let playembed = await queue.textChannel.messages.fetch(ID, {
        cache: true,
        force: true,
      });
      if (playembed) {
        playembed.edit({ components: [d_raw] }).catch((e) => {});
      }
      queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(
              `_ ${emoji.ERROR} Alguém de disconectou da call _`
            )
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    });
    // finish song
    player.on("finishSong", async (queue, song) => {
      if (!queue) return;

      let ID = client.temp2.get(queue.textChannel.guild.id);
      let playembed = await queue.textChannel.messages.fetch(ID, {
        cache: true,
        force: true,
      });
      if (playembed) {
        playembed.edit({ components: [d_raw] }).catch((e) => {});
      }
      queue.textChannel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setDescription(`_ [\`${song.name}\`](${song.url}) Ended Now  _`)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => {});
          }, 10000);
        })
        .catch((e) => {});
    });
    // error
    player.on("error", async (channel, error) => {
      let channel1 = client.music.get(channel.guild.id, "channel");
      if (channel.id === channel1) return;
      let ID = client.temp2.get(channel.guild.id);
      let playembed = await channel.messages
        .fetch(ID, {
          cache: true,
          force: true,
        })
        .catch((e) => {});
      if (playembed) {
        playembed.edit({ components: [d_raw] }).catch((e) => {});
      }
      channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setTitle(`Found a Error...`)
            .setDescription(chalk.red(String(error).substr(0, 3000)))
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    });
    // no related
    player.on("noRelated", async (queue) => {
      if (!queue) return;

      queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setTitle(`No Related Song Found for \`${queue.songs[0].name}\``)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    });
    // finish queue
    player.on("finish", async (queue) => {
      if (!queue) return;

      let ID = client.temp2.get(queue.textChannel.guild.id);
      let playembed = await queue.textChannel.messages.fetch(ID, {
        cache: true,
        force: true,
      });
      if (playembed) {
        playembed.edit({ components: [d_raw] }).catch((e) => {});
      }
      queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(
              ` A fila acabou.`
            )
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    });
    // init queue
    player.on("initQueue", async (queue) => {
      (queue.volume = 90), (queue.autoplay = false);
    });
  } catch (e) {
    console.log(chalk.red(e));
  }

  // interaction handling
  try {
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.guild || interaction.user.bot) return;
      if (interaction.isButton()) {
        await interaction.deferUpdate().catch((e) => {});
        const { customId, member, guild } = interaction;
        let voiceMember = interaction.guild.members.cache.get(member.id);
        let channel = voiceMember.voice.channel;
        let queue = await player.getQueue(interaction.guild.id);
        switch (customId) {
          case "playp":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue || !queue.previousSongs.length) {
                send(
                  interaction,
                  `** ${emoji.ERROR} No Previous Song Found **`
                );
              } else {
                await queue.previous().catch((e) => {});
                send(
                  interaction,
                  `** ${emoji.previous_track} Playing Previous Song.**.`
                );
              }
            }
            break;
          case "skip":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else if (queue.songs.length === 1) {
                queue.stop().catch((e) => {});
                send(interaction, `** ${emoji.skip_track} Song Skiped !!**.`);
              } else {
                await queue.skip().catch((e) => {});
                send(interaction, `** ${emoji.skip_track} Song Skiped !!**.`);
              }
            }
            break;
          case "stop":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else {
                await queue.stop().catch((e) => {});
                send(interaction, `** ${emoji.stop} Song Stoped !!**.`);
              }
            }
            break;
          case "pause":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else if (queue.paused) {
                await queue.resume();
                raw.components[1] = new MessageButton()
                  .setCustomId("pause")
                  .setStyle("SECONDARY")
                  .setLabel("Pause")
                  .setEmoji(emoji.pause);
                let ID =
                  client.temp2.get(queue.textChannel.guild.id) ||
                  client.temp.get(queue.textChannel.guild.id);
                let playembed = await queue.textChannel.messages
                  .fetch(ID, {
                    cache: true,
                    force: true,
                  })
                  .catch((e) => {});
                if (playembed) {
                  playembed.edit({ components: [raw] }).catch((e) => {});
                }
                send(interaction, `** ${emoji.resume} Song Resumed !! **`);
              } else if (!queue.paused) {
                await queue.pause();
                raw.components[1] = new MessageButton()
                  .setCustomId("pause")
                  .setStyle("SECONDARY")
                  .setLabel("Resume")
                  .setEmoji(emoji.resume);
                let ID =
                  client.temp2.get(queue.textChannel.guild.id) ||
                  client.temp.get(queue.textChannel.guild.id);
                let playembed = await queue.textChannel.messages
                  .fetch(ID, {
                    cache: true,
                    force: true,
                  })
                  .catch((e) => {});
                if (playembed) {
                  playembed.edit({ components: [raw] }).catch((e) => {});
                }
                send(interaction, `** ${emoji.pause} Song Paused !! **`);
              }
            }
            break;
          case "loop":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else if (queue.repeatMode === 0) {
                await queue.setRepeatMode(1);
                raw.components[3] = new MessageButton()
                  .setStyle("SECONDARY")
                  .setCustomId("loop")
                  .setLabel("Queue")
                  .setEmoji("🔁");
                let ID =
                  client.temp2.get(queue.textChannel.guild.id) ||
                  client.temp.get(queue.textChannel.guild.id);
                let playembed = await queue.textChannel.messages
                  .fetch(ID, {
                    cache: true,
                    force: true,
                  })
                  .catch((e) => {});
                if (playembed) {
                  playembed.edit({ components: [raw] }).catch((e) => {});
                }
                send(interaction, `** ${emoji.SUCCESS} Song Loop On !! **`);
              } else if (queue.repeatMode === 1) {
                await queue.setRepeatMode(2);
                raw.components[3] = new MessageButton()
                  .setStyle("SECONDARY")
                  .setCustomId("loop")
                  .setLabel("Off")
                  .setEmoji(emoji.repeat_mode);
                let ID =
                  client.temp2.get(queue.textChannel.guild.id) ||
                  client.temp.get(queue.textChannel.guild.id);
                let playembed = await queue.textChannel.messages
                  .fetch(ID, {
                    cache: true,
                    force: true,
                  })
                  .catch((e) => {});
                if (playembed) {
                  playembed.edit({ components: [raw] }).catch((e) => {});
                }
                send(interaction, `** ${emoji.SUCCESS} Queue Loop On !! **`);
              } else if (queue.repeatMode === 2) {
                await queue.setRepeatMode(0);
                raw.components[3] = new MessageButton()
                  .setStyle("SECONDARY")
                  .setCustomId("loop")
                  .setLabel("Song")
                  .setEmoji("🔂");
                let ID =
                  client.temp2.get(queue.textChannel.guild.id) ||
                  client.temp.get(queue.textChannel.guild.id);
                let playembed = await queue.textChannel.messages
                  .fetch(ID, {
                    cache: true,
                    force: true,
                  })
                  .catch((e) => {});
                if (playembed) {
                  playembed.edit({ components: [raw] }).catch((e) => {});
                }
                send(interaction, `** ${emoji.SUCCESS} Loop Off !! **`);
              }
            }
            break;
          default:
            break;
        }
      }
    });
  } catch (e) {
    console.log(chalk.red(e));
  }
};

/**
 *
 * @param {ButtonInteraction} interaction
 * @param {String} string
 */
async function send(interaction, string) {
  interaction
    .followUp({
      embeds: [
        new MessageEmbed()
          .setColor(ee.color)
          .setTitle(string)
          .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
      ],
    })
    .then((m) => {
      setTimeout(() => {
        m.delete().catch((e) => {});
      }, 4000);
    });
}
