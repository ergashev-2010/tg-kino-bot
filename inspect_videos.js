require('dotenv').config();
const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

const videoFileIds = [
  "BAACAgEAAxkBAAMtarv7pE5blM28YxWKiLohgHR06AsAApQAA6m9YEbfemgNFtco-T0E",
  "BAACAgQAAxkBAAMwarv7pMBsJZGhfN9cZuGLrXyTOjIAAmwSAAIJ-JhRqjW9h049eYE9BA",
  "BAACAgQAAxkBAAMvarv7pAyn_3Sxm_9K5rQlb7MNiaQAAnMOAALe95lRpNZjDJrQfh89BA",
  "BAACAgQAAxkBAAM8arv7pDX8A3WasL8JU2fAXbCcpv4AAksPAAJsd5BS7QX11rbNOK09BA",
  "BAACAgQAAxkBAAM5arv7pG_KfSk4HMMC3eZQSE-s7gwAAswPAAKSEvlRGih990CmnFU9BA"
];

async function inspect() {
  for (let i = 0; i < videoFileIds.length; i++) {
    try {
      const file = await bot.telegram.getFile(videoFileIds[i]);
      console.log(`Video #${i + 1}:`, file);
    } catch (e) {
      console.error(`Video #${i + 1} error:`, e.message);
    }
  }
}

inspect();
