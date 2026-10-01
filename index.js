require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

// ==========================================
// 1. SOZLAMALAR VA KONFIGURATSIYA
// ==========================================
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID; // Masalan: -1001234567890 yoki @kanal_username
const CHANNEL_URL = process.env.CHANNEL_URL || 'https://t.me/telegram';

// Admin ID-larini .env faylidan olish (vergul bilan bir nechta ID yozish mumkin)
const rawAdminIds = process.env.ADMIN_ID || process.env.ADMIN_IDS || '5737560496,7724173791,8890705778';
const ADMIN_IDS = rawAdminIds.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));

function isAdmin(userId) {
  return ADMIN_IDS.includes(Number(userId));
}

if (!BOT_TOKEN || BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
  console.error("❌ XATOLIK: .env faylida BOT_TOKEN ko'rsatilmadi!");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// ==========================================
// 2. KINOLAR BAZASI (MOCK DATABASE)
// ==========================================
// User yuborgan barcha 52 ta videoning file_id lari ro'yxati
const videoFileIds = [
  "BAACAgEAAxkBAAMtarv7pE5blM28YxWKiLohgHR06AsAApQAA6m9YEbfemgNFtco-T0E",
  "BAACAgQAAxkBAAMwarv7pMBsJZGhfN9cZuGLrXyTOjIAAmwSAAIJ-JhRqjW9h049eYE9BA",
  "BAACAgQAAxkBAAMvarv7pAyn_3Sxm_9K5rQlb7MNiaQAAnMOAALe95lRpNZjDJrQfh89BA",
  "BAACAgQAAxkBAAM8arv7pDX8A3WasL8JU2fAXbCcpv4AAksPAAJsd5BS7QX11rbNOK09BA",
  "BAACAgQAAxkBAAM5arv7pG_KfSk4HMMC3eZQSE-s7gwAAswPAAKSEvlRGih990CmnFU9BA",
  "BAACAgIAAxkBAANUarv7pJ3fp35bZMS6pptYGfzdV1QAAjafAALT7_BLk16dB7FN-0M9BA",
  "BAACAgIAAxkBAANaarv7pGKstMdnPPpvast1n9SicEYAAtixAAL7DTBJmBZaFwaPQj49BA",
  "BAACAgQAAxkBAANDarv7pEUrCmfuqWRwki3dscyRVh0AAsoRAAIhG5BRB1GwC-4kYFc9BA",
  "BAACAgQAAxkBAAM4arv7pLT_JUCtCmfoxUG-pBCVqpsAAsUPAAKSEvlRxCGTywSrJrU9BA",
  "BAACAgQAAxkBAANYarv7pIb_WYBYcZ9TNQyK9T-u9K4AArURAAIkwkBR7DsghSX9GM49BA",
  "BAACAgQAAxkBAANXarv7pORMsIZ2Adj8KmXEnlE7u8UAAk4SAALye7lQ3-_peJ-Mu7g9BA",
  "BAACAgQAAxkBAANWarv7pHoE-deabBcmTmqyI14QEVoAAoESAAIkwkBRQBF6-0TMKIg9BA",
  "BAACAgQAAxkBAANVarv7pCCc4qO9qr_iyZl6KNw8yVYAAv4TAAKm4yFR_74nz-LfX3k9BA",
  "BAACAgIAAxkBAANTarv7pJFv2hZhMYXpWISeBwoBOTMAAmuoAAJIIYhIWb3SzV0bg_I9BA",
  "BAACAgQAAxkBAAM3arv7pHFrnuRJ1R4jS06m20ap4yYAApAQAAKSEvFR6ovpyqT1IXA9BA",
  "BAACAgQAAxkBAANKarv7pEVPmgxV1FJ0sVur7rm2sUIAAmcSAAJunwFSE0rhnZipTLU9BA",
  "BAACAgQAAxkBAAMzarv7pBbRJsNdZhJOC90r0q57vKIAArYRAAIhG5BRST5BFxFoSoE9BA",
  "BAACAgQAAxkBAAMxarv7pG_rjVqmI7zWeBP4KPTldpUAArARAAIhG5BRL3dbY3pCPGA9BA",
  "BAACAgQAAxkBAANSarv7pGEERUY_6eR_LH-EPTsKXiIAAvsGAALOBXhTe3pPTroYa8o9BA",
  "BAACAgQAAxkBAAMFaruIWutgDr5V0F3HOr2-eNE66c8AAj0YAAJ-SLhQ9LdLbAfVd149BA",
  "BAACAgQAAxkBAANQarv7pDnDHzSRedVEI52fyS3CQFgAAv4HAAKaZpFRyqT-9mjSenw9BA",
  "BAACAgQAAxkBAANParv7pJGf-qpPeO0YtNSxWhY0ucoAAv0HAAKaZpFRsiPD5h4bElY9BA",
  "BAACAgEAAxkBAANJarv7pKBmfo3elzpqaC4FeedKU4YAAkQDAAIX3qhEpHT2-7GJfcc9BA",
  "BAACAgQAAxkBAANRarv7pDTvTVIyovrLKFn8lTWY5bMAAj4HAALfNGFThnYRAreYsy89BA",
  "BAACAgEAAxkBAANNarv7pCoj8SHFWbcOGOldpq1pbVUAAjcEAALx4-hGNeC4heM-dMk9BA",
  "BAACAgQAAxkBAANearv7pPwFrtDHFcrqDdf3nz_AgbcAAr8SAAICRrBSO1XvXklkUHM9BA",
  "BAACAgQAAxkBAANdarv7pMtJZpOSAtt9xWaKbTMW2i8AAskSAAK65fhR3XLyiGHxN7k9BA",
  "BAACAgQAAxkBAANIarv7pJ7DQa0ROcCm6UEflfshliwAAqgIAAIUSVFSa73avc4GfnA9BA",
  "BAACAgQAAxkBAANGarv7pOR1kznDiJVEMn-2kLQmzCsAAlcVAAJUmahSuLWE09FBzwI9BA",
  "BAACAgEAAxkBAANOarv7pJze4mSiGeQ-TqVmE_hrplIAAlMCAAJz4nhHJ4RNElCKx4s9BA",
  "BAACAgQAAxkBAANLarv7pKBMzeZsj4RqwaORvis-xjwAAhMVAAIwY3lRt0cbgnlE7x49BA",
  "BAACAgQAAxkBAANcarv7pDYgQiNGKcyDjud1_qOw0W0AApoSAAK65fhRq1TPT4kttYM9BA",
  "BAACAgQAAxkBAANEarv7pG0y9xP8hp28bTv9qBDgGi0AAnASAAIJ-JhRb0xlXIxbxeQ9BA",
  "BAACAgEAAxkBAANHarv7pDGZYbK9JaguhhAeAAGZaWxLAAJ7AQAC_PPYR0_ukc7BLRSgPQQ",
  "BAACAgQAAxkBAAM2arv7pKBQBevB_-l6WXWmW67_MqMAAmkSAAIJ-JhR23O0mSCCGqo9BA",
  "BAACAgQAAxkBAANgarv7pKDUA9XXEVD-NNQHONRKmGEAAn4hAALMk7lQt0Mj3udpZfU9BA",
  "BAACAgQAAxkBAANMarv7pO0O6r6Syh4DAs6oZ29BKHwAAnELAALbdvBRfVT1aPC1Uzg9BA",
  "BAACAgQAAxkBAANCarv7pFTip1tO1gsDR7u8TjYsHwEAAj4PAAKC7slTXe_iy2_kgDU9BA",
  "BAACAgQAAxkBAANZarv7pEblYJaIb0bBG13nKddVHkIAAnsRAALCIyFRX596uksn_y09BA",
  "BAACAgQAAxkBAANAarv7pBtd_AOZUe5P4Puunbna10wAAn4bAAKBJsFSPE8fhz5L56s9BA",
  "BAACAgQAAxkBAAM_arv7pOPCJFB1J_ISsBNl9WkEH60AAq0OAAKDebhSg765I9uxIFU9BA",
  "BAACAgQAAxkBAANBarv7pBXUdVS1Ve5FS17MwgFdcvcAAogPAAIwvMFS6jiOfcFcr909BA",
  "BAACAgQAAxkBAAM9arv7pMH8ELtDWDqta-TI2-fYl6MAAuIOAAIhG4hRSOjMRVZnDpA9BA",
  "BAACAgQAAxkBAAM-arv7pDBiii9C1_gtIHrL0c4RnPQAAuYOAAIhG4hR3Yksri3iSfE9BA",
  "BAACAgQAAxkBAAM0arv7pGZV6Et2IbNX40u6dB5IhlcAArcRAAIhG5BRdzbYyWZMmqc9BA",
  "BAACAgQAAxkBAAM7arv7pH-9nbkR4ViBYV-QTC9bC-cAAhcQAAKPbDlSksPCU6R3wIw9BA",
  "BAACAgQAAxkBAANbarv7pAMasaLPnE_w1vlNokUtTgIAAm4bAAKg1QhThvYfO9BKzyQ9BA",
  "BAACAgQAAxkBAANfarv7pAABjkW5iPy1vhGxAZJ8MW3XAAKSFgACY7C5UH1DwnkFqBuOPQQ",
  "BAACAgQAAxkBAAM1arv7pGTW8rD7w6grgZ1z5ls3CJUAAroRAAIhG5BR-QABEUHYwWUQPQQ",
  "BAACAgQAAxkBAAMyarv7pORFBE8YoNc9ZUxteng7rQADZxIAAgn4mFFFt5oZLhROXj0E",
  "BAACAgQAAxkBAANFarv7pKXgYbBsvTyNCk8kw74zRvMAAo0NAAIJ-JBRIiZ60Zsh_rE9BA",
  "BAACAgQAAxkBAAM6arv7pE4pVSeT5g_6MWkQpwtevGUAAvkPAAKSEvlRMyZtJf1WO6Q9BA"
];

const fs = require('fs');
const path = require('path');

const MOVIES_FILE = path.join(__dirname, 'movies.json');
const USERS_FILE = path.join(__dirname, 'users.json');
const FAVORITES_FILE = path.join(__dirname, 'favorites.json');

// Foydalanuvchilar va statistikani saqlash
function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
    }
  } catch (e) {}
  return [];
}

function saveUser(userId) {
  if (!userId) return;
  const users = loadUsers();
  if (!users.includes(userId)) {
    users.push(userId);
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (e) {}
  }
}

// Sevimli kinolarni saqlash funksiyalari
function loadFavorites() {
  try {
    if (fs.existsSync(FAVORITES_FILE)) {
      return JSON.parse(fs.readFileSync(FAVORITES_FILE, 'utf8') || '{}');
    }
  } catch (e) {}
  return {};
}

function saveFavoritesToFile(favs) {
  try {
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favs, null, 2), 'utf8');
  } catch (e) {}
}

function isFavorite(userId, kinoId) {
  const favs = loadFavorites();
  const userFavs = favs[userId] || [];
  return userFavs.includes(kinoId);
}

function toggleFavorite(userId, kinoId) {
  const favs = loadFavorites();
  if (!favs[userId]) favs[userId] = [];
  const index = favs[userId].indexOf(kinoId);
  let added = false;
  if (index > -1) {
    favs[userId].splice(index, 1);
  } else {
    favs[userId].push(kinoId);
    added = true;
  }
  saveFavoritesToFile(favs);
  return added;
}

// Bazadagi fayldan kinolarni yuklash funksiyasi
function loadMoviesFromFile() {
  try {
    if (fs.existsSync(MOVIES_FILE)) {
      const data = fs.readFileSync(MOVIES_FILE, 'utf8');
      return JSON.parse(data || '{}');
    }
  } catch (err) {
    console.error("movies.json o'qishda xatolik:", err.message);
  }
  return {};
}

// Kinolarni movies.json fayliga avtomatik saqlash
function saveMoviesToFile(db) {
  try {
    fs.writeFileSync(MOVIES_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error("movies.json saqlashda xatolik:", err.message);
  }
}

// Baza obyektimiz
let moviesDb = loadMoviesFromFile();

// Animatsiyali Emojilar va Matn shakllantirish funksiyalari
const EMOJI_IDS = {};

function renderEmoji(emojiChar) {
  const customId = EMOJI_IDS[emojiChar];
  if (customId) {
    return `<tg-emoji emoji-id="${customId}">${emojiChar}</tg-emoji>`;
  }
  return emojiChar;
}

/**
 * Bazadan kinoni olish funksiyasi (xavfsiz barcha kodlarni topadi)
 * @param {string} kinoId 
 * @returns {Promise<Object|null>}
 */
async function getMovieById(kinoId) {
  if (!kinoId) return null;
  let rawStr = String(kinoId).toLowerCase().trim();
  let numOnly = rawStr.replace(/\D/g, '');
  let cleanKey1 = numOnly ? `${numOnly}` : rawStr;
  let cleanKey2 = numOnly ? `kino_${numOnly}` : `kino_${rawStr}`;

  // Bazada saqlangan kino bo'lsa uni qaytaramiz
  if (moviesDb[cleanKey1]) return moviesDb[cleanKey1];
  if (moviesDb[cleanKey2]) return moviesDb[cleanKey2];
  if (moviesDb[rawStr]) return moviesDb[rawStr];

  for (const k in moviesDb) {
    const m = moviesDb[k];
    if (m && (m.code === numOnly || m.code === rawStr || m.id === cleanKey2 || m.id === rawStr)) {
      return m;
    }
  }

  return null;
}

// ==========================================
// 3. YORDAMCHI FUNKSIYALAR (HELPERS)
// ==========================================

/**
 * Foydalanuvchining kanalga obuna bo'lganligini getChatMember orqali tekshirish
 * @param {Object} ctx - Telegraf context
 * @param {number} userId - Telegram foydalanuvchi ID-si
 * @returns {Promise<boolean>}
 */
async function checkSubscription(ctx, userId) {
  if (isAdmin(userId)) return true;
  try {
    const member = await ctx.telegram.getChatMember(CHANNEL_ID, userId);
    console.log(`User ${userId} statusi: "${member.status}"`);
    // creator, administrator, member statuslari obuna bo'lganligini bildiradi
    const validStatuses = ['creator', 'administrator', 'member'];
    return validStatuses.includes(member.status);
  } catch (error) {
    console.error(`[XATOLIK] Obunani tekshirishda xatolik (User: ${userId}, Channel: ${CHANNEL_ID}):`, error.message);
    if (error.message.includes('member list is inaccessible')) {
      console.error("🚨 DIQQAT: Bot kanalda ADMIN emas! Botni kanalingizga Administrator qilib qo'shing!");
    }
    return false;
  }
}

const { execSync } = require('child_process');
const CINEMA_PHOTO_PATH = path.join(__dirname, 'cinema.jpg');
const THUMB_PHOTO_PATH = path.join(__dirname, 'thumb.jpg');

function updateThumbnailFromBanner() {
  try {
    const psScript = path.join(__dirname, 'create_thumb.ps1');
    if (fs.existsSync(psScript)) {
      execSync(`powershell -ExecutionPolicy Bypass -File "${psScript}"`, { cwd: __dirname });
    }
  } catch (e) {
    console.error("Thumbnail update error:", e.message);
  }
}

// Foydalanuvchilar oxirgi so'ragan kino kodini eslab qolish
const userRequestedMovie = {};

/**
 * Obuna bo'lish haqidagi tugmalar va xabarni shakllantirish
 * @param {string} payload - Masalan: 'kino_104' yoki ''
 */
function getSubscriptionKeyboard(payload) {
  const callbackData = payload ? `check_${payload}` : 'check_general';
  
  return Markup.inlineKeyboard([
    [Markup.button.url('📢 Kinolarni olish uchun kanalimizga marhamat', CHANNEL_URL)],
    [Markup.button.callback('🔄 Obunani tekshirish & Kinoni olish 🍿', callbackData)]
  ]);
}

/**
 * Obuna bo'lgan foydalanuvchilar uchun kanalga o'tish va yo'riqnoma tugmasi
 */
function getUserStartKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.url('📢 @tvmovie_uz kanaliga o\'tish', CHANNEL_URL)]
  ]);
}

/**
 * Foydalanuvchiga Kino zali rasmi va matnli xush kelibsiz xabarini yuborish
 */
async function sendUserWelcomeWithBanner(ctx, keyboard) {
  const firstName = ctx.from.first_name || 'Foydalanuvchi';
  const lastName = ctx.from.last_name ? ' ' + ctx.from.last_name : '';
  const fullName = `${firstName}${lastName}`;

  const caption = 
`🥳 **Salom, ${fullName} !**

🍿 **Kino kodingizni yuboring yoki pastdagi tugma orqali:**

🍿 **Premyeralardan habardor bo'ling**
⭐ **O'zingizga yoqqan kinoni tanlang**`;

  try {
    if (fs.existsSync(CINEMA_PHOTO_PATH)) {
      return await ctx.replyWithPhoto({ source: CINEMA_PHOTO_PATH }, {
        caption: caption,
        parse_mode: 'Markdown',
        ...keyboard
      });
    } else {
      return await ctx.replyWithPhoto('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80', {
        caption: caption,
        parse_mode: 'Markdown',
        ...keyboard
      });
    }
  } catch (err) {
    console.error("Xush kelibsiz bannerini yuborishda xatolik:", err.message);
    return await ctx.reply(caption, {
      parse_mode: 'Markdown',
      ...keyboard
    });
  }
}

/**
 * Kinoni foydalanuvchiga yuborish mantiqi (protect_content: true bilan)
 * @param {Object} ctx - Telegraf context
 * @param {string} kinoId - Masalan: 'kino_104'
 */
async function sendMovieToUser(ctx, kinoId) {
  try {
    const userId = ctx.from.id;
    const movie = await getMovieById(kinoId);

    if (!movie) {
      return await ctx.reply(
        `⚠️ Kechirasiz, ${kinoId} kodi bo'yicha kino yoki serial topilmadi.`
      );
    }

    // Agar bu serial bo'lsa (Fasl va Qismlar menyusi)
    if (movie.isSerial && movie.seasons) {
      const seasonButtons = Object.keys(movie.seasons).map(s => [
        Markup.button.callback(`🎬 ${s}-Fasl`, `serial_${kinoId}_s_${s}`)
      ]);
      return await ctx.reply(
        `📺 <b>${movie.title}</b> seriali fasllarini tanlang:`,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard(seasonButtons)
        }
      );
    }

    const hasFav = isFavorite(userId, movie.id || kinoId);
    const favButtonText = hasFav ? "💔 Sevimlilardan o'chirish" : "❤️ Sevimlilarga saqlash";
    const favCallback = `fav_${kinoId}`;

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback(favButtonText, favCallback)],
      [Markup.button.url('📢 Kanalimizga obuna bo\'lish', CHANNEL_URL)]
    ]);

    let cleanCaption = movie.caption || buildFormattedPostCaption(movie.code || kinoId, movie.title);
    cleanCaption = cleanCaption
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>');

    const videoOptionsHTML = {
      caption: cleanCaption,
      parse_mode: 'HTML',
      protect_content: true,
      ...keyboard
    };

    const videoOptionsPlain = {
      caption: cleanCaption.replace(/<[^>]*>/g, ''),
      protect_content: true,
      ...keyboard
    };

    if (movie.file_type === 'document') {
      try {
        await ctx.replyWithDocument(movie.file_id, videoOptionsHTML);
      } catch (err1) {
        console.warn("replyWithDocument HTML failed, trying replyWithVideo HTML:", err1.message);
        try {
          await ctx.replyWithVideo(movie.file_id, videoOptionsHTML);
        } catch (err2) {
          console.warn("HTML options failed, retrying plain text:", err2.message);
          try {
            await ctx.replyWithVideo(movie.file_id, videoOptionsPlain);
          } catch (err3) {
            await ctx.replyWithDocument(movie.file_id, videoOptionsPlain);
          }
        }
      }
    } else {
      try {
        await ctx.replyWithVideo(movie.file_id, videoOptionsHTML);
      } catch (err1) {
        console.warn("replyWithVideo HTML failed, trying replyWithDocument HTML:", err1.message);
        try {
          await ctx.replyWithDocument(movie.file_id, videoOptionsHTML);
        } catch (err2) {
          console.warn("HTML options failed, retrying plain text:", err2.message);
          try {
            await ctx.replyWithVideo(movie.file_id, videoOptionsPlain);
          } catch (err3) {
            await ctx.replyWithDocument(movie.file_id, videoOptionsPlain);
          }
        }
      }
    }
  } catch (error) {
    console.error("Kinoni yuborishda xatolik:", error);
    await ctx.reply("❌ Kinoni yuborishda kutilmagan xatolik yuz berdi.");
  }
}

// ==========================================
// 4. DEEP LINKING VA /START BUYRUG'I
// ==========================================
/**
 * Admin interaktiv tugmalar menyusi
 */
function getAdminKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('📊 Bot Statistikasi', 'admin_stats'), Markup.button.callback('📋 Kinolar Ro\'yxati', 'admin_list')],
    [Markup.button.callback('📹 Video Qo\'shish', 'help_addkino')],
    [Markup.button.callback('📢 Reklama Yuborish', 'admin_broadcast'), Markup.button.callback('📝 Post Shablonini Olish', 'get_shablon')],
    [Markup.button.callback('🧹 Bazani Tozalash', 'admin_clear_confirm')]
  ]);
}

/**
 * Admin uchun post shablonini ko'rsatish funksiyasi
 */
function sendAdminPostTemplate(ctx) {
  const templateText = 
`📝 <b>KANALGA POST JOYLASH TAYYOR SHABLONI</b>

*(Quyidagi matnni nusxalab o'zingizga moslab rasm ostiga yozing):*

<code>/post 1 Nomi: Firibgarlar
Yili: 2026
Sifati: 1080p
IMDb: 8.2/10
Davlati: Qozog'iston
Tili: O'zbek tilida
Janri: Jangari, Kriminal</code>

💡 <b>PRO Imkoniyatlar va Maslahatlar:</b>
- <b>Auto-Format:</b> Har qanday matnni rasm ostiga yozsangiz bot Image 2 uslubida avtomatik formatlab beradi!
- <b>Tezkor format:</b> <code>/post 1 Firibgarlar | 2026 | 1080p | 8.2/10 | Qozog'iston | O'zbek tilida | Jangari, Kriminal</code>
- <b>Kanal tugmasi:</b> <b>"🍿 Kinoni yuklab olish"</b> tugmasi avtomatik qo'shiladi! 🚀`;

  return ctx.reply(templateText, { parse_mode: 'HTML' });
}

// Animatsiyali (Custom) Emojilar capture funksiyasi
function captureCustomEmojis(entities, text) {
  if (!entities || !text) return;
  for (const entity of entities) {
    if (entity.type === 'custom_emoji' && entity.custom_emoji_id) {
      const char = text.substring(entity.offset, entity.offset + entity.length);
      if (char) {
        EMOJI_IDS[char] = entity.custom_emoji_id;
        console.log(`✨ Animatsiyali Emoji saqlandi: ${char} -> ${entity.custom_emoji_id}`);
      }
    }
  }
}

/**
 * Admin kiritgan matnni avtomatik chiroyli formatga o'tkazuvchi funKSIYa
 */
function buildFormattedPostCaption(kinoId, rawText, botUsername = 'tvmovieuz_bot') {
  let header = "";
  let title = `Kino #${kinoId}`;
  let year = "2026";
  let quality = "1080p";
  let imdb = "8.2/10";
  let country = "AQSH";
  let language = "O'zbek tilida";
  let genre = "#jangari #kriminal";

  if (rawText) {
    if (rawText.includes('|')) {
      const parts = rawText.split('|').map(p => p.trim());
      if (parts[0]) title = parts[0];
      if (parts[1]) year = parts[1];
      if (parts[2]) quality = parts[2];
      if (parts[3]) imdb = parts[3];
      if (parts[4]) country = parts[4];
      if (parts[5]) language = parts[5];
      if (parts[6]) genre = parts[6];
      if (parts[7]) header = parts[7];
    } else {
      const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
      let customTitle = '';
      let customYear = '';
      let customQuality = '';
      let customImdb = '';
      let customCountry = '';
      let customLanguage = '';
      let customGenre = '';
      let customHeader = '';

      for (let line of lines) {
        const cleanLine = line.replace(/[\*\_`]/g, '');

        if (/^(header|sarlavha|premyera):/i.test(cleanLine)) {
          customHeader = cleanLine.replace(/^(header|sarlavha|premyera):/i, '').trim();
        } else if (/^(🎬\s*)?(nomi|title|kino|name):/i.test(cleanLine)) {
          customTitle = cleanLine.replace(/^(🎬\s*)?(nomi|title|kino|name):/i, '').trim();
        } else if (/^(📅\s*)?(yili|year):/i.test(cleanLine)) {
          customYear = cleanLine.replace(/^(📅\s*)?(yili|year):/i, '').trim();
        } else if (/^(📺\s*)?(sifati|quality):/i.test(cleanLine)) {
          customQuality = cleanLine.replace(/^(📺\s*)?(sifati|quality):/i, '').trim();
        } else if (/^(⭐\s*)?(imdb|reyting|rating):/i.test(cleanLine)) {
          customImdb = cleanLine.replace(/^(⭐\s*)?(imdb|reyting|rating):/i, '').trim();
        } else if (/^(🌍\s*)?(davlati|mamlakati|country):/i.test(cleanLine)) {
          customCountry = cleanLine.replace(/^(🌍\s*)?(davlati|mamlakati|country):/i, '').trim();
        } else if (/^(🇺🇿|🌐)?\s*(tili|language):/i.test(cleanLine)) {
          customLanguage = cleanLine.replace(/^(🇺🇿|🌐)?\s*(tili|language):/i, '').trim();
        } else if (/^(🎭\s*)?(janri|genre):/i.test(cleanLine)) {
          customGenre = cleanLine.replace(/^(🎭\s*)?(janri|genre):/i, '').trim();
        } else if (!customTitle && !line.startsWith('/')) {
          customTitle = cleanLine.replace(/^🎬\s*/, '');
        }
      }

      if (customHeader) header = customHeader;
      if (customTitle) title = customTitle;
      if (customYear) year = customYear;
      if (customQuality) quality = customQuality;
      if (customImdb) imdb = customImdb;
      if (customCountry) country = customCountry;
      if (customLanguage) language = customLanguage;
      if (customGenre) genre = customGenre;
    }
  }

  // Janrni hashtag ko'rinishiga o'tkazish
  if (genre && !genre.includes('#')) {
    genre = genre.split(/[,;\s]+/)
      .filter(g => g.trim().length > 0)
      .map(g => `#${g.trim().replace(/^#/, '')}`)
      .join(' ');
  }

  let result = '';
  if (header) {
    result += `<b>${header.toUpperCase()}</b>\n\n`;
  }
  result += `${renderEmoji('🎬')} <b>Nomi:</b> ${title}\n\n`;
  if (year) result += `${renderEmoji('📅')} <b>Yili:</b> ${year}\n`;
  if (quality) result += `${renderEmoji('📺')} <b>Sifati:</b> ${quality}\n`;
  if (imdb) result += `${renderEmoji('⭐')} <b>IMDb:</b> ${imdb}\n`;
  if (country) result += `${renderEmoji('🌍')} <b>Davlati:</b> ${country}\n`;
  if (language) result += `${renderEmoji('🇺🇿')} <b>Tili:</b> ${language}\n`;
  if (genre) result += `${renderEmoji('🎭')} <b>Janri:</b> ${genre}\n\n`;
  result += `‼️ <b>DIQQAT! Kinoni tomosha qilish uchun botga kino kodi (<code>${kinoId}</code>)ni yozing yoki pastdagi "Yuklab olish" tugmasini bosing! 👉 @${botUsername}</b>`;

  return result;
}

bot.start(async (ctx) => {
  try {
    const userId = ctx.from.id;
    saveUser(userId); // Foydalanuvchini avtomatik statistikaga saqlash

    const payload = ctx.startPayload ? ctx.startPayload.trim() : '';
    if (payload) {
      userRequestedMovie[userId] = payload;
    }
    console.log(`Foydalanuvchi /start bosdi. User ID: ${userId}, Payload: "${payload}"`);

    // 1. Obunani tekshiramiz
    const isSubscribed = await checkSubscription(ctx, userId);
    const targetKino = payload || userRequestedMovie[userId] || '';

    // 2. Agar obuna bo'lmagan bo'lsa -> Obuna so'rovini yuboramiz
    if (!isSubscribed) {
      return await sendUserWelcomeWithBanner(ctx, getSubscriptionKeyboard(targetKino));
    }

    // 3. Obuna bo'lgan va kino so'ralgan bo'lsa -> KINONI DARHOL YUBORAMIZ (Admin bo'lsa ham!)
    if (targetKino) {
      delete userRequestedMovie[userId];
      return await sendMovieToUser(ctx, targetKino);
    }

    // 4. Hech qanday kino kodi ko'rsatilmadi:
    // A) Agar Admin bo'lsa -> Admin boshqaruv paneli
    if (isAdmin(userId)) {
      return await ctx.reply(
        "👑 **Assalomu alaykum, Xurmatli Admin!**\n\nSizni ko'rib turganimdan juda mamnunman. Bot va kanalingiz to'liq tayyor holatda ishlamoqda. 🚀\n\n**Bugun qanday ish bajaramiz?** Quyidagi interaktiv menyudan kerakli bo'limni tanlang yoki to'g'ridan-to'g'ri video/poster yuboring:",
        {
          parse_mode: 'Markdown',
          ...getAdminKeyboard()
        }
      );
    }

    // B) Oddiy foydalanuvchi parametrsliz g'irsa -> Xush kelibsiz banneri
    await sendUserWelcomeWithBanner(ctx, getUserStartKeyboard());
  } catch (error) {
    console.error("/start buyrug'ida xatolik:", error);
    await ctx.reply("❌ Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
  }
});

// ==========================================
// PRO FUNKSIYALAR: /random va /search
// ==========================================

// 🎲 Tasodifiy kino tavsiya qilish (/random)
bot.command('random', async (ctx) => {
  const userId = ctx.from.id;
  saveUser(userId);

  const isSubscribed = await checkSubscription(ctx, userId);
  if (!isSubscribed) {
    return ctx.reply("🍿 Kino olish uchun avval kanalimizga obuna bo'ling!", getSubscriptionKeyboard(''));
  }

  const keys = Object.keys(moviesDb).filter(k => !k.startsWith('kino_'));
  if (keys.length === 0) {
    return ctx.reply("📭 Bazada hali birorta ham kino mavjud emas.");
  }

  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  await ctx.reply(`🎲 **Siz uchun tasodifiy kino tanlandi!** (Kodi: \`${randomKey}\`)`, { parse_mode: 'Markdown' });
  await sendMovieToUser(ctx, randomKey);
});

// PRO: /search yoki /qidiruv <nomi>
bot.command(['search', 'qidiruv', 'find'], async (ctx) => {
  const query = ctx.message.text.split(' ').slice(1).join(' ').trim().toLowerCase();
  if (!query) {
    return ctx.reply("🔍 **Kino qidirish uchun buyruqdan so'ng kino nomini yoki kodini yozing:**\n\nMasalan: `/search Forsaj` yoki `/qidiruv 1`", { parse_mode: 'Markdown' });
  }

  const keys = Object.keys(moviesDb).filter(k => !k.startsWith('kino_'));
  const matches = keys.filter(k => {
    const movie = moviesDb[k];
    return k.toLowerCase().includes(query) || (movie && movie.title && movie.title.toLowerCase().includes(query));
  });

  if (matches.length === 0) {
    return ctx.reply(`🔍 **"${query}"** nomi bo'yicha hech qanday kino topilmadi. Qaytadan boshqa nom bilan urinib ko'ring!`, { parse_mode: 'Markdown' });
  }

  let text = `🎬 **QIDIRUV NATIJALARI (Jami: ${matches.length} ta):**\n\n`;
  matches.forEach(k => {
    const movie = moviesDb[k];
    text += `📌 **Kino kodi:** \`${k}\` -> 🎬 **${movie.title}**\n`;
  });

  text += `\n💡 *Kinoni olish uchun shunchaki uning kodini (masalan \`${matches[0]}\`) botga yuboring!*`;
  await ctx.reply(text, { parse_mode: 'Markdown' });
});

// PRO: /top eng sara kinolar
bot.command(['top', 'premyera'], async (ctx) => {
  const keys = Object.keys(moviesDb).filter(k => !k.startsWith('kino_')).slice(0, 10);
  if (keys.length === 0) {
    return ctx.reply("🍿 Hozircha botda kinolar ro'yxati shakllanmoqda. Tez orada eng zo'r kinolar joylanadi!");
  }

  let text = `🔥 **TOP PREMYERA KINOLAR RO'YXATI:**\n\n`;
  keys.forEach((k, idx) => {
    const movie = moviesDb[k];
    text += `${idx + 1}. 🎬 **${movie.title}** (Kodi: \`${k}\`)\n`;
  });
  text += `\n🍿 *Kino ko'rish uchun uning kodini botga yuboring!*`;
  await ctx.reply(text, { parse_mode: 'Markdown' });
});

// Subscribed user quick actions
bot.action('btn_random', async (ctx) => {
  await ctx.answerCbQuery();
  const keys = Object.keys(moviesDb).filter(k => !k.startsWith('kino_'));
  if (keys.length === 0) return ctx.reply("📭 Bazada hali birorta ham kino mavjud emas.");
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  await sendMovieToUser(ctx, randomKey);
});

bot.action('btn_list', async (ctx) => {
  await ctx.answerCbQuery();
  const keys = Object.keys(moviesDb).filter(k => !k.startsWith('kino_'));
  if (keys.length === 0) return ctx.reply("📭 Bazada hali birorta ham kino mavjud emas.");
  let text = `📋 <b>BAZADAGI KINOLAR RO'YXATI (Jami: ${keys.length} ta):</b>\n\n`;
  keys.forEach((key) => {
    const movie = moviesDb[key];
    text += `📌 <b>Kino kodi:</b> <code>${key}</code> -> 🎬 <b>${movie.title}</b>\n`;
  });
  text += "\n🍿 <i>Kinoni tomosha qilish uchun uning kodini botga yuboring!</i>";
  await ctx.reply(text, { parse_mode: 'HTML' });
});

bot.action(/^getkino_(.+)$/, async (ctx) => {
  await ctx.answerCbQuery();
  const kId = ctx.match[1];
  await sendMovieToUser(ctx, kId);
});

// PRO: Telegram Inline Mode (@bot_username kino_kodi)
bot.on('inline_query', async (ctx) => {
  const query = ctx.inlineQuery.query.trim().toLowerCase();
  const results = [];

  const movieKeys = Object.keys(moviesDb).filter(k => !k.startsWith('kino_'));
  let matchedKeys = movieKeys;
  if (query) {
    matchedKeys = movieKeys.filter(k => {
      const m = moviesDb[k];
      return k.toLowerCase().includes(query) || (m && m.title && m.title.toLowerCase().includes(query));
    });
  }

  matchedKeys.slice(0, 10).forEach((key, index) => {
    const movie = moviesDb[key];
    const title = movie ? movie.title : `Kino #${key}`;
    results.push({
      type: 'article',
      id: String(index),
      title: `🎬 ${title} (Kodi: ${key})`,
      description: `Kinoni yuklab olish uchun bosing`,
      input_message_content: {
        message_text: `🍿 **${title}**\n\n📌 Kino kodi: \`${key}\`\n\n🍿 Kinoni ko'rish uchun botga o'ting: https://t.me/tvmovieuz_bot?start=${key}`,
        parse_mode: 'Markdown'
      }
    });
  });

  await ctx.answerInlineQuery(results);
});

// ==========================================
// 5. OBUNANI TEKSHIRISH (CALLBACK QUERY)
// ==========================================
// Action pattern: check_kino_104 yoki check_general
bot.action(/^check_(.+)$/, async (ctx) => {
  try {
    const userId = ctx.from.id;
    const rawPayload = ctx.match[1]; // Regex orqali ushlab olingan parametr
    let payload = (rawPayload === 'general' || !rawPayload) ? '' : rawPayload;

    if (!payload && userRequestedMovie[userId]) {
      payload = userRequestedMovie[userId];
    }

    // Obunani qayta tekshiramiz
    const isSubscribed = await checkSubscription(ctx, userId);

    if (isSubscribed) {
      // 1. Obuna tasdiqlandi pop-up (toast) ko'rsatamiz
      await ctx.answerCbQuery("Rahmat! Obunangiz tasdiqlandi 🎬", { show_alert: false });

      // 2. Obuna so'rov xabarini o'chiramiz
      try {
        await ctx.deleteMessage();
      } catch (deleteError) {
        console.warn("Xabarni o'chirishda xatolik:", deleteError.message);
      }

      // 3. Agar muayyan kino kodi tanlangan bo'lsa, kinoni yuboramiz. Aks holda yo'riqnoma ko'rsatamiz.
      if (payload) {
        await sendMovieToUser(ctx, payload);
      } else {
        await ctx.reply(
          `✅ <b>Obunangiz muvaffaqiyatli tasdiqlandi! Rahmat 😊</b>\n\n🍿 Marhamat, <b>@tvmovie_uz</b> kanalimizdan kinolarni <b>"Yuklab olish"</b> tugmasini bosib yuklab olishingiz mumkin yoki botga <b>kino kodini</b> yuborib kinoni ko'rishingiz mumkin!`,
          {
            parse_mode: 'HTML',
            ...getUserStartKeyboard()
          }
        );
      }
    } else {
      // Obuna hali ham bo'lmagan bo'lsa -> Alert oyna ko'rsatamiz
      await ctx.answerCbQuery("❌ Siz hali kanalga obuna bo'lmadingiz!", { show_alert: true });
    }
  } catch (error) {
    console.error("Callback query'da xatolik:", error);
    try {
      await ctx.answerCbQuery("❌ Xatolik yuz berdi.", { show_alert: true });
    } catch (e) {}
  }
});

// ==========================================
// 6. MATN ORQALI KINO KODINI QABUL QILISH (Masalan: 104 yoki kino_104)
// ==========================================
bot.on('text', async (ctx, next) => {
  const text = ctx.message.text.trim();
  
  // Buyruqlarga aralashmaymiz
  if (text.startsWith('/')) return next();

  let kinoId = text.toLowerCase();
  const userId = ctx.from.id;
  userRequestedMovie[userId] = kinoId;
  saveUser(userId);

  const isSubscribed = await checkSubscription(ctx, userId);

  if (!isSubscribed) {
    // Obuna bo'lmagan bo'lsa -> Rasm + Kanal tugmasi + Tekshirish tugmasi (so'ralgan kinoId bilan)
    return await sendUserWelcomeWithBanner(ctx, getSubscriptionKeyboard(kinoId));
  }

  // Obuna bo'lgan bo'lsa -> Kinoni yuboramiz
  await sendMovieToUser(ctx, kinoId);
});

// ==========================================
// 6. ADMIN PANEL: Rasm + Matn + Tugma orqali Kanalga Post joylash
// ==========================================

// 1. Admin shunchaki RASM yuborib, ostiga /post <kino_id> <tavsif> yozganda:
bot.on('photo', async (ctx, next) => {
  if (!isAdmin(ctx.from.id)) return next();
  const captionText = ctx.message.caption || '';

  // Banner rasmini o'zgartirish (/setbanner)
  if (captionText.startsWith('/setbanner')) {
    try {
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      const fileUrl = await ctx.telegram.getFileLink(fileId);
      const response = await fetch(fileUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(CINEMA_PHOTO_PATH, buffer);
      updateThumbnailFromBanner();
      return ctx.reply("✅ <b>Bot va barcha videolar muqovasi (thumbnail) rasmi muvaffaqiyatli o'zgartirildi!</b>", { parse_mode: 'HTML' });
    } catch (e) {
      return ctx.reply(`❌ Banner rasmini o'zgartirishda xatolik: ${e.message}`);
    }
  }

  if (!captionText.startsWith('/post')) return next();

  const args = captionText.split(' ').slice(1);
  if (args.length < 1) {
    return ctx.reply(
      "⚠️ **Noto'g'ri format!**\n\nPost joylash shablonini olish uchun `/shablon` buyrug'ini yuboring.",
      { parse_mode: 'Markdown' }
    );
  }

  const kinoId = args[0];
  const rawUserCaption = args.slice(1).join(' ');

  try {
    // Eng yuqori sifatli rasm file_id si
    const photoFileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const fullCaption = buildFormattedPostCaption(kinoId, rawUserCaption);

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url('🍿 Kinoni yuklab olish', `https://t.me/tvmovieuz_bot?start=${kinoId}`)]
    ]);

    // Premium Animatsiyali Emojilar va Formatlarni saqlash (caption_entities)
    await ctx.telegram.sendPhoto(CHANNEL_ID, photoFileId, {
      caption: fullCaption,
      parse_mode: 'HTML',
      ...keyboard
    });

    await ctx.reply(
      `✅ <b>Post</b> (Kino kodi: <code>${kinoId}</code>) muvaffaqiyatli kanalga chop etildi! 🚀`,
      { parse_mode: 'HTML' }
    );
  } catch (err) {
    console.error("Admin photo post xatosi:", err);
    await ctx.reply(`❌ Post joylashda xatolik yuz berdi: ${err.message}`);
  }
});

// 2. Admin faqat MATN ko'rinishida /post <kino_id> <kino_nomi> yozganda:
bot.command('post', async (ctx) => {
  if (!isAdmin(ctx.from.id)) {
    return ctx.reply("⚠️ Ushbu buyruq faqat bot admini uchun!");
  }

  const text = ctx.message.text.trim();
  const args = text.split(' ').slice(1);

  if (args.length < 1) {
    return ctx.reply(
      "⚠️ <b>Noto'g'ri format!</b>\n\nPost shablonini olish uchun <code>/shablon</code> buyrug'ini bosing.",
      { parse_mode: 'HTML' }
    );
  }

  const kinoId = args[0];
  const rawText = args.slice(1).join(' ');

  try {
    const caption = buildFormattedPostCaption(kinoId, rawText);

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url('🍿 Kinoni yuklab olish', `https://t.me/tvmovieuz_bot?start=${kinoId}`)]
    ]);

    const posterUrl = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80';

    await ctx.telegram.sendPhoto(CHANNEL_ID, posterUrl, {
      caption: caption,
      parse_mode: 'HTML',
      ...keyboard
    });

    await ctx.reply(
      `✅ Kino (Kino kodi: \`${kinoId}\`) muvaffaqiyatli kanalingizga chop etildi!`,
      { parse_mode: 'Markdown' }
    );
  } catch (err) {
    console.error("Admin post joylashda xatolik:", err);
    await ctx.reply(`❌ Post joylashda xatolik yuz berdi: ${err.message}`);
  }
});

// Admin Post Shablon buyrug'i (/shablon yoki /template)
bot.command(['shablon', 'template'], async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;
  await sendAdminPostTemplate(ctx);
});

// ==========================================
// 7. ADMIN PANEL: VIDEO YUKLASH (/addkino) VA BAZANI TOZALASH (/clearall)
// ==========================================

// ==========================================
// 7. ADMIN PANEL: VIDEO YUKLASH (/addkino), RO'YXAT (/list) VA TOZALASH (/clearall)
// ==========================================

// Oxirgi yuborilgan video/fayl file_id sini eslab qolish uchun o'zgaruvchi
let lastAdminVideoFileId = null;
let lastAdminVideoType = 'video';

/**
 * Kinoni bazaga saqlash va javob berish helper funksiyasi
 */
function saveMovieAndReply(ctx, rawId, title, fileId, fileType = 'video') {
  const cleanNum = rawId.replace(/\D/g, '') || rawId;
  const key1 = `${cleanNum}`;
  const key2 = `kino_${cleanNum}`;

  const movieObj = {
    id: key2,
    code: key1,
    title: title,
    file_id: fileId,
    file_type: fileType,
    caption: buildFormattedPostCaption(cleanNum, title)
  };

  moviesDb[key1] = movieObj;
  moviesDb[key2] = movieObj;
  if (rawId !== key1 && rawId !== key2) {
    moviesDb[rawId] = movieObj;
  }

  saveMoviesToFile(moviesDb);

  return ctx.reply(
    `🎉 <b>KINO BAZAGA MUVAFFAQIYATLI SAQLANDI!</b>\n\n📌 <b>Kino kodi:</b> <code>${cleanNum}</code>\n🎬 <b>Nomi:</b> ${title}\n📁 <b>Fayl turi:</b> ${fileType === 'document' ? '📄 Hujjat/Fayl' : '📹 Oddiy Video'}\n\n📢 <i>Endi botga poster rasm yuborib ostiga: <code>/post ${cleanNum} ${title}</code> deb yozsangiz kanalga joylaydi!</i>`,
    { parse_mode: 'HTML' }
  );
}

// 1. Admin Botga Video yoki Hujjat (fayl ko'rinishida) yuborganida
bot.on(['video', 'document'], async (ctx) => {
  const userId = ctx.from.id;
  const videoObj = ctx.message.video;
  const docObj = ctx.message.document;

  let fileId = null;
  let fileType = 'video';

  if (videoObj) {
    fileId = videoObj.file_id;
    fileType = 'video';
  } else if (docObj) {
    fileId = docObj.file_id;
    fileType = 'document';
  }

  if (!fileId) return;
  const captionText = ctx.message.caption || '';

  console.log(`📹 ${fileType === 'document' ? 'Fayl/Hujjat' : 'Video'} keldi! File ID: ${fileId}`);

  // Agar admin video/fayl yuborsa, uning file_id sini eslab qolamiz va AVTOMATIK SAQLAYMIZ
  if (isAdmin(userId)) {
    lastAdminVideoFileId = fileId;
    lastAdminVideoType = fileType;

    // A) Video/Fayl ostiga /addkino 105 Forsaj 10 yozilgan bo'lsa:
    if (captionText.startsWith('/addkino')) {
      const args = captionText.split(' ').slice(1);
      if (args.length >= 2) {
        const rawId = args[0];
        const title = args.slice(1).join(' ');
        return saveMovieAndReply(ctx, rawId, title, fileId, fileType);
      }
    }

    // B) Shunchaki video/fayl yuborilganda: DARSAL AVTOMATIK BAZAGA SAQLAYMIZ!
    const count = Object.keys(moviesDb).filter(k => k.startsWith('kino_')).length + 1;
    const rawId = `${count}`;
    const title = `Kino #${count}`;
    
    saveMovieAndReply(ctx, rawId, title, fileId, fileType);
    return;
  }

  // Boshqa foydalanuvchilar video/fayl yuborganda
  await ctx.reply(`📹 Video/Fayl qabul qilindi!`);
});

// 2. Admin Video/Fayl yuborgandan SO'NG yoki Reply qilib /addkino 1 Kino Nomi yozganda:
bot.command('addkino', async (ctx) => {
  if (!isAdmin(ctx.from.id)) {
    return ctx.reply("⚠️ Bu buyruq faqat bot admini uchun!");
  }

  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 2) {
    return ctx.reply("⚠️ **Noto'g'ri format!**\nFoydalanish:\n`/addkino 1 Forsaj 10 (2023)`", { parse_mode: 'Markdown' });
  }

  // A) Agar xabar videoga yoki hujjatga reply (javob) qilib yuborilgan bo'lsa:
  let targetFileId = null;
  let targetFileType = 'video';

  if (ctx.message.reply_to_message) {
    if (ctx.message.reply_to_message.video) {
      targetFileId = ctx.message.reply_to_message.video.file_id;
      targetFileType = 'video';
    } else if (ctx.message.reply_to_message.document) {
      targetFileId = ctx.message.reply_to_message.document.file_id;
      targetFileType = 'document';
    }
  }

  if (!targetFileId && lastAdminVideoFileId) {
    // B) Yoki oxirgi yuborilgan video/faylni olamiz:
    targetFileId = lastAdminVideoFileId;
    targetFileType = lastAdminVideoType || 'video';
  }

  if (!targetFileId) {
    return ctx.reply("⚠️ Avval botga video yoki fayl yuboring, keyin `/addkino 1 Kino Nomi` deb yozing!", { parse_mode: 'Markdown' });
  }

  const rawId = args[0];
  const title = args.slice(1).join(' ');
  return saveMovieAndReply(ctx, rawId, title, targetFileId, targetFileType);
});

// 3. Admin Bazadagi Barcha Kinolar Ro'yxatini Ko'rishi uchun (/list yoki /kinolar)
bot.command(['list', 'kinolar'], async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;

  const keys = Object.keys(moviesDb).filter(k => !k.startsWith('kino_'));
  if (keys.length === 0) {
    return ctx.reply("📭 Bazada hali birorta ham kino yo'q. Botga video yuborsangiz avtomatik saqlanadi!");
  }

  let text = `📋 **BAZADAGI KINOLAR RO'YXATI (Jami: ${keys.length} ta):**\n\n`;
  keys.forEach((key) => {
    const movie = moviesDb[key];
    text += `📌 **Kino kodi:** \`${key}\` -> 🎬 **${movie.title}**\n`;
  });

  text += "\n💡 *Kanalga joylash uchun poster rasm yuborib ostiga:* `/post <kodi> <nomi>` *deb yozing.*";

  await ctx.reply(text, { parse_mode: 'Markdown' });
});

// 4. Admin Menu (/admin)
bot.command('admin', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('📋 Kinolar ro\'yxati', 'admin_list')],
    [Markup.button.callback('🧹 Barcha kinolarni tozalash (0 ga)', 'admin_clear_confirm')]
  ]);

  await ctx.reply(
    "👑 **ADMINISTRATOR PANEL**\n\nQuyidagi tugmalar orqali botingizni boshqarishingiz mumkin:",
    keyboard
  );
});

// 5. Admin Bazani Butunlay Tozalashi uchun (/clearall yoki tugma)
bot.command('clearall', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('✅ HA, barchasini tozalash', 'confirm_clearall')],
    [Markup.button.callback('❌ BEKOR QILISH', 'cancel_clearall')]
  ]);

  await ctx.reply(
    "⚠️ **DIQQAT!** Barcha saqlangan kinolarni o'chirib, bazani 0 ga tozalashni tasdiqlaysizmi?",
    keyboard
  );
});

// Admin tugma harakatlari (Actions)
bot.action('admin_list', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
  await ctx.answerCbQuery();
  
  const keys = Object.keys(moviesDb).filter(k => !k.startsWith('kino_'));
  if (keys.length === 0) {
    return ctx.reply("📭 Bazada hali birorta ham kino yo'q. Botga video yuborsangiz avtomatik saqlanadi!");
  }

  let text = `📋 **BAZADAGI KINOLAR RO'YXATI (Jami: ${keys.length} ta):**\n\n`;
  keys.forEach((key) => {
    const movie = moviesDb[key];
    text += `📌 **Kino kodi:** \`${key}\` -> 🎬 **${movie.title}**\n`;
  });

  await ctx.reply(text, { parse_mode: 'Markdown' });
});

bot.action('admin_stats', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
  await ctx.answerCbQuery();

  const users = loadUsers();
  const movieKeys = Object.keys(moviesDb).filter(k => !k.startsWith('kino_'));

  const text = 
`📊 **BOT STATISTIKASI:**

👤 **Jami Foydalanuvchilar:** ${users.length} ta
🎬 **Jami Saqlangan Kinolar:** ${movieKeys.length} ta
📢 **Ulangan Majburiy Kanal:** ${CHANNEL_ID}`;

  await ctx.reply(text, { parse_mode: 'Markdown' });
});

bot.action('help_setbanner', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
  await ctx.answerCbQuery();

  await ctx.reply(
    "🖼 <b>VIDEOLAR USTIDAGI MUQOVA (THUMBNAIL) RASMINI O'ZGARTIRISH:</b>\n\n1. Galereyangizdan **istalgan yangi rasmingizni botga yuborasiz**.\n2. Rasm ostiga <code>/setbanner</code> deb yozasiz.\n\n✨ Bot darhol barcha videolar ustida ko'rinadigan muqova rasmini ushbu yangi rasmga almashtiradi!",
    { parse_mode: 'HTML' }
  );
});

bot.action('help_addkino', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
  await ctx.answerCbQuery();

  await ctx.reply(
    "📹 **YANGI KINO QO'SHISH TARTIBI:**\n\n1. Telegram'dan shunchaki **Video faylni yuborasiz**.\n2. Bot videoni ko'rishi bilan **avtomatik saqlaydi** va sizga bo'sh raqamini aytadi!\n\n💡 *Juda ham oson va tez!*",
    { parse_mode: 'Markdown' }
  );
});

bot.action('get_shablon', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
  await ctx.answerCbQuery();
  await sendAdminPostTemplate(ctx);
});

bot.action('help_post', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
  await ctx.answerCbQuery();

  await ctx.reply(
    "📢 **KANALGA POST JOYLASH TARTIBI:**\n\n1. Galereyangizdan **Kino Poster Rasmini** botga yuborasiz.\n2. Rasm ostiga yozasiz:\n`/post 1 🎬 Forsaj 10 (2023)`\n\n3. Bot 1 soniyada rasmi, emojilari va 'Yuklab olish' tugmasi bilan kanalga joylaydi!",
    { parse_mode: 'Markdown' }
  );
});

bot.action('admin_clear_confirm', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
  await ctx.answerCbQuery();

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('✅ HA, barchasini tozalash', 'confirm_clearall')],
    [Markup.button.callback('❌ BEKOR QILISH', 'cancel_clearall')]
  ]);

  await ctx.reply(
    "⚠️ <b>DIQQAT!</b> Barcha saqlangan kinolarni o'chirib, bazani 0 ga tozalashni tasdiqlaysizmi?",
    { parse_mode: 'HTML', ...keyboard }
  );
});

bot.action('confirm_clearall', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
  
  moviesDb = {};
  lastAdminVideoFileId = null;
  saveMoviesToFile({});

  await ctx.answerCbQuery("🧹 Baza tozalandi!");
  try { await ctx.deleteMessage(); } catch (e) {}

  await ctx.reply("🧹 <b>Barcha saqlangan kinolar bazadan 100% tozalandi va noldan boshlandi!</b>\n\nEndi botga yangi video yuborsangiz avtomatik 1-raqamdan boshlab saqlaydi!", { parse_mode: 'HTML' });
});

bot.action('cancel_clearall', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
  await ctx.answerCbQuery("Amal bekor qilindi");
  try { await ctx.deleteMessage(); } catch (e) {}
  await ctx.reply("❌ Tozalash bekor qilindi. Barcha kinolar o'z joyida saqlandi.", { parse_mode: 'HTML' });
});

// Bitta kinoni o'chirish buyrug'i (/del <id> yoki /delete <id>)
bot.command(['del', 'delete', 'delkino', 'ochirish'], async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 1) {
    return ctx.reply("⚠️ <b>Format:</b> <code>/del 1</code> yoki <code>/delete 104</code>", { parse_mode: 'HTML' });
  }

  const rawId = args[0].trim();
  const kinoId = /^\d+$/.test(rawId) ? `kino_${rawId}` : rawId;

  if (!moviesDb[rawId] && !moviesDb[kinoId]) {
    return ctx.reply(`⚠️ <code>${rawId}</code> kodli kino bazada topilmadi!`, { parse_mode: 'HTML' });
  }

  delete moviesDb[rawId];
  delete moviesDb[kinoId];
  saveMoviesToFile(moviesDb);

  await ctx.reply(`✅ <b>Kino #${rawId} bazadan muvaffaqiyatli o'chirildi!</b>`, { parse_mode: 'HTML' });
});

// 5. Admin Statistika buyrug'i (/stats yoki /statistika)
bot.command(['stats', 'statistika'], async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;

  const users = loadUsers();
  const movieKeys = Object.keys(moviesDb).filter(k => !k.startsWith('kino_'));

  const text = 
`📊 **BOT STATISTIKASI:**

👤 **Jami Foydalanuvchilar:** ${users.length} ta
🎬 **Jami Saqlangan Kinolar:** ${movieKeys.length} ta
📢 **Ulangan Majburiy Kanal:** ${CHANNEL_ID}`;

  await ctx.reply(text, { parse_mode: 'Markdown' });
});

// ==========================================
// SEVIMLILAR (FAVORITES) VA KATALOG HANDLERLARI
// ==========================================

// 1. Sevimlilar ro'yxatiga qo'shish / o'chirish (Callback Action)
bot.action(/^fav_(.+)$/, async (ctx) => {
  try {
    const userId = ctx.from.id;
    const kinoId = ctx.match[1];
    const isAdded = toggleFavorite(userId, kinoId);

    const newBtnText = isAdded ? "💔 Sevimlilardan o'chirish" : "❤️ Sevimlilarga saqlash";
    const alertMsg = isAdded ? "❤️ Kino sevimlilar ro'yxatiga qo'shildi!" : "💔 Kino sevimlilardan olib tashlandi.";

    await ctx.answerCbQuery(alertMsg, { show_alert: true });

    // Tugma matnini dinamik yangilash
    try {
      await ctx.editMessageReplyMarkup({
        inline_keyboard: [
          [Markup.button.callback(newBtnText, `fav_${kinoId}`)],
          [Markup.button.url('📢 Kanalimizga obuna bo\'lish', CHANNEL_URL)]
        ]
      });
    } catch (e) {}
  } catch (err) {
    console.error("Favorite action error:", err);
  }
});

// 2. Sevimlilar ro'yxatini ko'rish (/sevimlilar)
bot.command(['sevimlilar', 'favorites', 'favs'], async (ctx) => {
  const userId = ctx.from.id;
  const favs = loadFavorites();
  const userFavs = favs[userId] || [];

  if (userFavs.length === 0) {
    return ctx.reply("❤️ <b>Sizda hali saqlangan sevimli kinolar yo'q.</b>\n\nKinoni yuborganimizda '❤️ Sevimlilarga saqlash' tugmasini bosing!", { parse_mode: 'HTML' });
  }

  let text = `❤️ <b>SIZNING SEVIMLI KINOLARINGIZ (Jami: ${userFavs.length} ta):</b>\n\n`;
  userFavs.forEach((kId, idx) => {
    const movie = moviesDb[kId] || { title: `Kino #${kId}` };
    text += `${idx + 1}. 🎬 <b>${movie.title}</b> (Kodi: <code>${kId}</code>)\n`;
  });
  text += `\n🍿 <i>Kinoni olish uchun shunchaki uning kodini botga yuboring!</i>`;

  await ctx.reply(text, { parse_mode: 'HTML' });
});

// 3. Katalog & Janrlar bo'yicha qidiruv (/katalog, /janrlar)
const GENRES_LIST = [
  'Jangari', 'Fantastika', 'Komediya', 'Triller',
  'Melodrama', 'Multfilm', 'Dramatik', 'Kriminal', 'Sarguzasht'
];

bot.command(['katalog', 'janrlar', 'genres'], async (ctx) => {
  const buttons = [];
  for (let i = 0; i < GENRES_LIST.length; i += 2) {
    const row = [Markup.button.callback(`🎭 ${GENRES_LIST[i]}`, `genre_${GENRES_LIST[i].toLowerCase()}`)];
    if (GENRES_LIST[i + 1]) {
      row.push(Markup.button.callback(`🎭 ${GENRES_LIST[i + 1]}`, `genre_${GENRES_LIST[i + 1].toLowerCase()}`));
    }
    buttons.push(row);
  }

  await ctx.reply(
    "🎭 <b>KINO KATALOGI VA JANRLAR:</b>\n\nO'zingizga maqbul janrni tanlang:",
    { parse_mode: 'HTML', ...Markup.inlineKeyboard(buttons) }
  );
});

// Janr bosilganda kinolarni filtrlash callback
bot.action(/^genre_(.+)$/, async (ctx) => {
  try {
    const targetGenre = ctx.match[1].toLowerCase();
    await ctx.answerCbQuery();

    const keys = Object.keys(moviesDb).filter(k => !k.startsWith('kino_'));
    const matches = keys.filter(k => {
      const movie = moviesDb[k];
      return movie && movie.caption && movie.caption.toLowerCase().includes(targetGenre);
    });

    if (matches.length === 0) {
      return ctx.reply(`🎭 <b>#${targetGenre}</b> janri bo'yicha hozircha kinolar topilmadi.`, { parse_mode: 'HTML' });
    }

    let text = `🎭 <b>#${targetGenre.toUpperCase()} JANRIDAGI KINOLAR (Jami: ${matches.length} ta):</b>\n\n`;
    matches.forEach(k => {
      const movie = moviesDb[k];
      text += `📌 <b>Kino kodi:</b> <code>${k}</code> -> 🎬 <b>${movie.title}</b>\n`;
    });
    text += `\n🍿 <i>Kinoni tomosha qilish uchun uning kodini botga yuboring!</i>`;

    await ctx.reply(text, { parse_mode: 'HTML' });
  } catch (err) {
    console.error("Genre action error:", err);
  }
});

// ==========================================
// SERIALLAR VA FASLLAR HANDLERLARI
// ==========================================

// Admin serial qo'shish (/addserial <id> <nomi>)
bot.command('addserial', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 2) {
    return ctx.reply("⚠️ <b>Format:</b> <code>/addserial 200 Qashqirlar Makoni</code>", { parse_mode: 'HTML' });
  }

  const serialId = args[0];
  const title = args.slice(1).join(' ');

  moviesDb[serialId] = {
    id: serialId,
    title: title,
    isSerial: true,
    seasons: { '1': [] }
  };
  saveMoviesToFile(moviesDb);

  await ctx.reply(`🎉 <b>SERIAL BAZAGA SAQLANDI!</b>\n\n📌 Kodi: <code>${serialId}</code>\n🎬 Nomi: ${title}\n\n💡 <i>Endi videoga reply qilib <code>/addepisode ${serialId} 1 1</code> ko'rinishida qismlarni qo'shing!</i>`, { parse_mode: 'HTML' });
});

// Admin epizod qo'shish (/addepisode <serial_id> <fasl> <qism>)
bot.command('addepisode', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 3) {
    return ctx.reply("⚠️ <b>Format:</b> <code>/addepisode 200 1 1</code> (Videoga reply qiling)", { parse_mode: 'HTML' });
  }

  const [serialId, season, episode] = args;
  let fileId = null;
  if (ctx.message.reply_to_message) {
    if (ctx.message.reply_to_message.video) {
      fileId = ctx.message.reply_to_message.video.file_id;
    } else if (ctx.message.reply_to_message.document) {
      fileId = ctx.message.reply_to_message.document.file_id;
    }
  } else if (lastAdminVideoFileId) {
    fileId = lastAdminVideoFileId;
  }

  if (!fileId) {
    return ctx.reply("⚠️ Video yoki faylga reply qilib yozing!", { parse_mode: 'HTML' });
  }

  if (!moviesDb[serialId]) {
    return ctx.reply(`❌ <code>${serialId}</code> kodli serial topilmadi. Avval <code>/addserial ${serialId} Nomi</code> ni yarating!`, { parse_mode: 'HTML' });
  }

  if (!moviesDb[serialId].seasons) moviesDb[serialId].seasons = {};
  if (!moviesDb[serialId].seasons[season]) moviesDb[serialId].seasons[season] = [];

  moviesDb[serialId].seasons[season][parseInt(episode, 10) - 1] = fileId;
  saveMoviesToFile(moviesDb);

  await ctx.reply(`✅ <b>${moviesDb[serialId].title}</b> - ${season}-Fasl ${episode}-Qism saqlandi!`, { parse_mode: 'HTML' });
});

// Fasl tanlanganda epizodlar ro'yxati
bot.action(/^serial_(.+)_s_(.+)$/, async (ctx) => {
  const serialId = ctx.match[1];
  const season = ctx.match[2];
  await ctx.answerCbQuery();

  const movie = moviesDb[serialId];
  if (!movie || !movie.seasons || !movie.seasons[season]) {
    return ctx.reply("❌ Qismlar topilmadi.");
  }

  const epCount = movie.seasons[season].length;
  const buttons = [];
  for (let i = 1; i <= epCount; i++) {
    buttons.push(Markup.button.callback(`▶️ ${i}-Qism`, `serial_${serialId}_ep_${season}_${i}`));
  }

  // 4 taladan qatorga taxlaymiz
  const grid = [];
  while (buttons.length) grid.push(buttons.splice(0, 4));

  await ctx.reply(
    `🎬 <b>${movie.title}</b> (${season}-Fasl)\n\nKerakli qismni tanlang:`,
    { parse_mode: 'HTML', ...Markup.inlineKeyboard(grid) }
  );
});

// Epizod yuborish callback
bot.action(/^serial_(.+)_ep_(.+)_(.+)$/, async (ctx) => {
  const serialId = ctx.match[1];
  const season = ctx.match[2];
  const episode = parseInt(ctx.match[3], 10);
  await ctx.answerCbQuery();

  const movie = moviesDb[serialId];
  const fileId = movie?.seasons?.[season]?.[episode - 1];

  if (!fileId) {
    return ctx.reply("❌ Ushbu qism fayli topilmadi.");
  }

  const epOptions = {
    caption: `🎬 <b>${movie.title}</b>\n📺 <b>${season}-Fasl ${episode}-Qism</b>\n\n🍿 *Yoqimli tomosha tilaymiz!*`,
    parse_mode: 'HTML',
    protect_content: true
  };

  try {
    await ctx.replyWithVideo(fileId, epOptions);
  } catch (err) {
    await ctx.replyWithDocument(fileId, epOptions);
  }
});

// ==========================================
// KANALGA REJALASHTIRILGAN POST (/schedule)
// ==========================================
bot.command('schedule', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 2) {
    return ctx.reply("⚠️ <b>Format:</b> <code>/schedule 10m 1 Nomi: Firibgarlar...</code>\n(Masalan: 5m = 5 minut, 1h = 1 soat)", { parse_mode: 'HTML' });
  }

  const timeStr = args[0];
  const kinoId = args[1];
  const rawText = args.slice(2).join(' ');

  let delayMs = 60000; // default 1 minute
  if (timeStr.endsWith('m')) {
    delayMs = parseInt(timeStr, 10) * 60 * 1000;
  } else if (timeStr.endsWith('h')) {
    delayMs = parseInt(timeStr, 10) * 60 * 60 * 1000;
  } else if (timeStr.endsWith('s')) {
    delayMs = parseInt(timeStr, 10) * 1000;
  }

  const caption = buildFormattedPostCaption(kinoId, rawText);
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('🍿 Kinoni yuklab olish', `https://t.me/tvmovieuz_bot?start=${kinoId}`)]
  ]);
  const posterUrl = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80';

  await ctx.reply(`⏰ <b>Post ${timeStr} ga rejalashtirildi!</b> Belgilangan vaqtda kanalga joylanadi.`, { parse_mode: 'HTML' });

  setTimeout(async () => {
    try {
      await bot.telegram.sendPhoto(CHANNEL_ID, posterUrl, {
        caption: caption,
        parse_mode: 'HTML',
        ...keyboard
      });
      console.log(`⏰ Rejalashtirilgan post (${kinoId}) kanalga joylandi!`);
    } catch (err) {
      console.error("Rejalashtirilgan post xatosi:", err.message);
    }
  }, delayMs);
});

// Admin Broadcast tugmasi (Callback)
bot.action('admin_broadcast', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
  await ctx.answerCbQuery();

  await ctx.reply(
    "📢 <b>Barcha foydalanuvchilarga reklama yuborish:</b>\n\nIstalgan xabar (rasm, video yoki matn)ga <code>/send</code> deb reply qiling yoki:\n<code>/send Assalomu alaykum!</code> deb yozing.",
    { parse_mode: 'HTML' }
  );
});

// Enhanced /send yoki /sendall (Media + Text broadcast)
bot.command(['send', 'sendall'], async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;

  const users = loadUsers();
  if (users.length === 0) {
    return ctx.reply("❌ Hali botda birorta ham foydalanuvchi yo'q.");
  }

  const replyMsg = ctx.message.reply_to_message;
  const rawText = ctx.message.text.split(' ').slice(1).join(' ');

  if (!replyMsg && !rawText) {
    return ctx.reply("⚠️ <b>Foydalanish:</b> Reklama xabariga reply qilib <code>/send</code> deb yozing yoki <code>/send Matn...</code>", { parse_mode: 'HTML' });
  }

  await ctx.reply(`📢 <b>${users.length} ta foydalanuvchiga reklama tarqatish boshlandi...</b>`, { parse_mode: 'HTML' });

  let successCount = 0;
  let failCount = 0;

  for (const userId of users) {
    try {
      if (replyMsg) {
        await ctx.telegram.copyMessage(userId, ctx.chat.id, replyMsg.message_id);
      } else {
        await ctx.telegram.sendMessage(userId, rawText, { parse_mode: 'HTML' });
      }
      successCount++;
      await new Promise(r => setTimeout(r, 40));
    } catch (e) {
      failCount++;
    }
  }

  await ctx.reply(
    `✅ <b>REKLAMA YUBORISH YAKUNLANDI!</b>\n\n🟢 Muvaffaqiyatli: <b>${successCount}</b> ta\n🔴 Yetib bormadi (bloklangan): <b>${failCount}</b> ta`,
    { parse_mode: 'HTML' }
  );
});

// ==========================================
// 8. XATOLIKLARNI USHLASH VA BOTNI ISHGA TUSHIRISH (24/7 SAFEGUARD)
// ==========================================
// Bot kutilmagan xatoliklar sababli o'chib qolmasligi uchun muhofaza
process.on('uncaughtException', (err) => {
  console.error('⚠️ Ushtalanmagan xatolik (uncaughtException):', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Ushtalanmagan Promise Rejection (unhandledRejection):', reason);
});

bot.catch((err, ctx) => {
  console.error(`Telegram Bot Xatoligi [${ctx.updateType}]:`, err);
});

const http = require('http');
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Bot 24/7 rejimda muvaffaqiyatli ishlamoqda! 🚀');
});
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`🌐 HTTP Server: ${PORT}-port band, bot ishlashda davom etmoqda.`);
  } else {
    console.error('HTTP Server error:', err.message);
  }
});
server.listen(PORT, () => {
  console.log(`🌐 HTTP Server 24/7 ping uchun ${PORT}-portda ishlamoqda.`);
});

async function main() {
  console.log("⏳ Telegram serveriga ulanilmoqda...");
  
  // Bot Nomini va Profil ma'lumotlarini o'zgartirish
  try {
    await bot.telegram.setMyName('tvmovie_uz');
    await bot.telegram.setMyDescription("🍿 O'zbekistondagi №1 Kino Bot!\n\nKanaldagi eng sara va yangi kinolarni tez va qulay yuklab oling.");
    await bot.telegram.setMyShortDescription("🍿 Eng yangi va sara kinolarni yuklab olish boti!");
    console.log("✅ Bot nomi 'tvmovie_uz' va profil ma'lumotlari yangilandi!");
  } catch (err) {
    console.warn("Bot profilini sozlashda ogohlantirish:", err.message);
  }

  // Kanal va Adminlarni diagnostika qilish
  try {
    const chatInfo = await bot.telegram.getChat(CHANNEL_ID);
    console.log(`✅ Kanal topildi: "${chatInfo.title}" (ID: ${chatInfo.id})`);
    
    const admins = await bot.telegram.getChatAdministrators(CHANNEL_ID);
    const botAdmin = admins.find(a => a.user.username === 'tvmovieuz_bot');
    if (botAdmin) {
      console.log("🎉 BOT KANALDA ADMIN! Status:", botAdmin.status);
    } else {
      console.error("❌ DIQQAT: @tvmovieuz_bot KANALDA ADMIN EMAS!");
    }
  } catch (err) {
    console.error(`❌ Kanal ma'lumotlarini olishda xatolik (${CHANNEL_ID}):`, err.message);
  }

  await bot.launch();
  console.log("🚀 Kino Bot muvaffaqiyatli ishga tushdi va xabarlarni kutmoqda!");
  console.log("📍 Test qilish uchun link: https://t.me/tvmovieuz_bot?start=1");
}

main().catch((err) => {
  console.error("❌ Botni ishga tushirishda xatolik:", err);
});

// Windows/Linux signal holatlarida botni xavfsiz to'xtatish
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

