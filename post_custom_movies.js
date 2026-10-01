require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID || '-1004407426651';
const bot = new Telegraf(BOT_TOKEN);

// Kinolar ro'yxati (Nomlar kiritilishi bilan darhol kanalga rasmi, ma'lumotlari va tugmasi bilan joylanadi)
const moviesList = [
  {
    code: '1',
    title: 'Forsaj 10 (Fast X)',
    genre: 'Jangari, Sarguzasht',
    poster: 'https://upload.wikimedia.org/wikipedia/en/2/29/Fast_X_poster.jpg',
  },
  {
    code: '2',
    title: 'Avatar: Suv Yo\'li (Avatar 2)',
    genre: 'Fantastika, Sarguzasht',
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg',
  },
  {
    code: '3',
    title: 'Jon Uik 4 (John Wick: Chapter 4)',
    genre: 'Jangari, Triller',
    poster: 'https://upload.wikimedia.org/wikipedia/en/d/d0/John_Wick_-_Chapter_4_promotional_poster.jpg',
  }
];

async function publishMoviesToChannel() {
  for (const movie of moviesList) {
    try {
      console.log(`📢 ${movie.title} kanalga joylanmoqda...`);

      const genreHashtags = movie.genre.split(/[,;\s]+/)
        .filter(g => g.trim().length > 0)
        .map(g => `#${g.trim().replace(/^#/, '')}`)
        .join(' ');

      const caption = 
`🎬 <b>Nomi:</b> ${movie.title}

📅 <b>Yili:</b> 2026
📺 <b>Sifati:</b> 1080p
⭐ <b>IMDb:</b> 8.5/10
🌍 <b>Davlati:</b> AQSH
🇺🇿 <b>Tili:</b> O'zbek tilida
🎭 <b>Janri:</b> ${genreHashtags}

‼️ <b>DIQQAT! Kinoni tomosha qilish uchun botga kino kodi (${movie.code})ni yozing yoki pastdagi "Yuklab olish" tugmasini bosing! 👉 @tvmovieuz_bot</b>`;

      const keyboard = Markup.inlineKeyboard([
        [Markup.button.url('🍿 Kinoni yuklab olish', `https://t.me/tvmovieuz_bot?start=${movie.code}`)]
      ]);

      await bot.telegram.sendPhoto(CHANNEL_ID, movie.poster, {
        caption: caption,
        parse_mode: 'HTML',
        ...keyboard
      });

      console.log(`✅ ${movie.title} kanalga joylandi!`);
      // 1 soniya kutamiz (Telegram spam bermasligi uchun)
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`❌ ${movie.title} joylashda xatolik:`, err.message);
    }
  }
}

publishMoviesToChannel();
