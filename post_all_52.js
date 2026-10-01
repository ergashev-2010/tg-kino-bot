require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID || '-1004407426651';
const bot = new Telegraf(BOT_TOKEN);

// Sifatli va chiroyli poster rasmlari jamlanmasi
const posters = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
  'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&q=80'
];

async function publishAll52Movies() {
  console.log("🚀 Barcha 52 ta kino postlari kanalga chop etilmoqda...");

  for (let i = 1; i <= 52; i++) {
    try {
      const posterUrl = posters[(i - 1) % posters.length];
      
      const caption = 
`🎬 <b>Nomi:</b> Kino #${i} (Top Film)

📅 <b>Yili:</b> 2026
📺 <b>Sifati:</b> 1080p Full HD
⭐ <b>IMDb:</b> 8.5/10
🌍 <b>Davlati:</b> AQSH
🇺🇿 <b>Tili:</b> O'zbek tilida (Dublyaj)
🎭 <b>Janri:</b> #jangari #sarguzasht #fantastika

‼️ <b>DIQQAT! Kinoni tomosha qilish uchun botga kino kodi (${i})ni yozing yoki pastdagi "Yuklab olish" tugmasini bosing! 👉 @tvmovieuz_bot</b>`;

      const keyboard = Markup.inlineKeyboard([
        [Markup.button.url('🍿 Kinoni yuklab olish', `https://t.me/tvmovieuz_bot?start=${i}`)]
      ]);

      await bot.telegram.sendPhoto(CHANNEL_ID, posterUrl, {
        caption: caption,
        parse_mode: 'HTML',
        ...keyboard
      });

      console.log(`✅ Kino #${i} kanalga muvaffaqiyatli joylandi!`);

      // Telegram spam cheklovidan o'tish uchun har 3 postda 1.5 soniya kutamiz
      await new Promise(r => setTimeout(r, 1200));

    } catch (error) {
      console.error(`❌ Kino #${i} joylashda xatolik:`, error.message);
      
      const retryMatch = error.message.match(/retry after (\d+)/i);
      const waitTimeSec = retryMatch ? parseInt(retryMatch[1], 10) + 2 : 5;
      
      console.log(`⏳ Telegram chegarasi saqlanmoqda, ${waitTimeSec} soniya kutilmoqda...`);
      await new Promise(r => setTimeout(r, waitTimeSec * 1000));
      // Qayta harakat qilamiz
      i--;
    }
  }

  console.log("🎉 BARCHA 52 TA KINO KANALGA MUVAFFAQIYATLI CHOP ETILDI!");
}

publishAll52Movies();
