require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID || '-1004407426651';

const bot = new Telegraf(BOT_TOKEN);

async function postMoviePosterToChannel() {
  try {
    console.log("📢 Kanalga Kino Posteri joylanmoqda...");

    const caption = 
`🎬 <b>Nomi:</b> Matritsa / The Matrix

📅 <b>Yili:</b> 1999
📺 <b>Sifati:</b> 1080p Full HD
⭐ <b>IMDb:</b> 8.7/10
🌍 <b>Davlati:</b> AQSH
🇺🇿 <b>Tili:</b> O'zbek tilida (Dublyaj)
🎭 <b>Janri:</b> #fantastika #jangari #triller

‼️ <b>DIQQAT! Kinoni tomosha qilish uchun botga kino kodi (104)ni yozing yoki pastdagi "Yuklab olish" tugmasini bosing! 👉 @tvmovieuz_bot</b>`;

    // Inline Button yaratamiz
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url('🍿 Kinoni yuklab olish', 'https://t.me/tvmovieuz_bot?start=104')]
    ]);

    // Matrix kinosi poster rasmi (Wikipedia Ishemba poster)
    const photoUrl = 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg';

    await bot.telegram.sendPhoto(CHANNEL_ID, photoUrl, {
      caption: caption,
      parse_mode: 'HTML',
      ...keyboard
    });

    console.log("✅ Kanalga faqat Poster rasm va tugma muvaffaqiyatli chop etildi!");
  } catch (error) {
    console.error("❌ Kanalga post joylashda xatolik:", error.message);
  }
}

postMoviePosterToChannel();
