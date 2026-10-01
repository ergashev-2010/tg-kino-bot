const fs = require('fs');
const path = require('path');

const desktopPath = 'C:\\Users\\user\\Desktop';
const htmlFilePath = path.join(desktopPath, 'Kino_Bot_Qollanma.html');
const txtFilePath = path.join(desktopPath, 'Kino_Bot_Qollanma.txt');

const guideContentText = `=====================================================
🎬 TELEGRAM KINO BOTI — ADMIN QO'LLANMASI (@tvmovieuz_bot)
=====================================================

1. 📥 YANGI KINO QO'SHISH (VIDEO SAQLASH):
-----------------------------------------------------
1. Telegram'da @tvmovieuz_bot boti bilan chatni oching.
2. Kino video faylini botga yuboring.
3. Bot sizga avtomatik ravishda keyingi bo'sh kino raqamini aytadi:
   "💡 Keyingi bo'sh kino raqami: 1"
   "/addkino 1 Forsaj 10 (2023)"
4. Bot bergan /addkino 1 Kino Nomi matnini bosing va yuboring!
   -> Kino kodi (1) va nomi bazaga 100% avtomatik saqlanadi.


2. 📢 KANALGA POSTER RASM, EMOJILAR VA TUGMA BILAN POST JOYLASH:
-----------------------------------------------------
1. Botga galereyangizdan Kino Poster Rasmini (photo) yuborasiz.
2. Rasm ostiga (caption / izoh qismiga) xohlagan emojilaringiz bilan yozasiz:

   /post 1 🎬 Forsaj 10 (2023)
   🎭 Janri: Jangari, Sarguzasht 💥
   ⭐️ Reyting: 8.5 / 10 🔥
   🌐 Tili: O'zbek tilida (Dublyaj) 🇺🇿

3. Send (Yuborish) bosing!
   -> Bot kanalingizga (@tvmovie_uz) o'sha rasmni, emojilarni va ostida "🍿 Kinoni yuklab olish" (start=1) ko'k tugmasini 1 soniyada avtomatik joylaydi!


3. 📋 BAZADAGI KINOLAR SONI VA RO'YXATINI KO'RISH:
-----------------------------------------------------
- Botga shunchaki /list yoki /kinolar deb yozib yuboring.
- Bot bazangizda nechta kino borligini, ularning raqamlari hamda nomlarini ro'yxat qilib beradi.


4. 🧹 BARCHA KINOLARNI TOZALASH (0 DAN BOSHLASH):
-----------------------------------------------------
- Botga shunchaki /clearall deb yozing.
- Bot barcha eski kinolarni tozalaydi va siz noldan yangilarini qo'shishingiz mumkin bo'ladi.


5. 🛡 XAVFSIZLIK VA MA'LUMOT KOROMONLIGI:
-----------------------------------------------------
- Bot faqat Sizning Telegram akkauntingizdan kelgan admin buyruqlarini qabul qiladi.
- Oddiy obunachilar ushbu buyruqlardan foydalana olmaydi.
- Botdan kinolar yuklanganda Telegram'ning protect_content parametri sababli videolarni boshqalarga yuborish (Forward) va telefonga saqlab olish (Save to Gallery) taqiqlanadi.

=====================================================
`;

const guideContentHTML = `<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <title>Telegram Kino Bot Admin Qo'llanmasi</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background-color: #f4f7f9; color: #333; line-height: 1.6; }
        .container { max-width: 800px; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin: auto; }
        h1 { color: #0088cc; border-bottom: 2px solid #0088cc; padding-bottom: 10px; }
        h2 { color: #2c3e50; margin-top: 25px; font-size: 20px; }
        .code-box { background: #1e1e1e; color: #00ff66; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 14px; white-space: pre-wrap; }
        .badge { background: #0088cc; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .step { background: #eef7fc; border-left: 4px solid #0088cc; padding: 12px 15px; margin: 15px 0; }
        footer { margin-top: 30px; text-align: center; color: #777; font-size: 13px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 Telegram Kino Bot — Admin Qo'llanmasi</h1>
        <p><strong>Bot Username:</strong> @tvmovieuz_bot &nbsp;|&nbsp; <strong>Kanal:</strong> @tvmovie_uz</p>

        <div class="step">
            <h2>1. 📥 Yangi Kino Qo'shish (Video Saqlash)</h2>
            <ol>
                <li>Telegram'da <strong>@tvmovieuz_bot</strong> botiga video faylingizni yuborasiz.</li>
                <li>Bot sizga avtomatik bo'sh kino raqamini chiqarib beradi:
                    <br><code>💡 Keyingi bo'sh kino raqami: 1</code>
                </li>
                <li>Bot bergan <code>/addkino 1 Forsaj 10 (2023)</code> matnini yuborasiz.</li>
            </ol>
            <p>✅ Kino va kodi 100% avtomatik saqlanadi!</p>
        </div>

        <div class="step">
            <h2>2. 📢 Kanalga Poster Rasm va Emojilar Bilan Post Joylash</h2>
            <ol>
                <li>Botga galereyadan <strong>Kino Poster Rasmini (photo)</strong> yuborasiz.</li>
                <li>Rasm ostiga (caption qismiga) xohlagan emojilaringiz bilan yozasiz:</li>
            </ol>
            <div class="code-box">/post 1 🎬 Forsaj 10 (2023)
🎭 Janri: Jangari, Sarguzasht 💥
⭐️ Reyting: 8.5 / 10 🔥
🌐 Tili: O'zbek tilida (Dublyaj) 🇺🇿</div>
            <p>✅ Bot kanalingizga rasm, emojilar va ostida <strong>"🍿 Kinoni yuklab olish"</strong> ko'k tugmasi bilan 1 soniyada joylaydi!</p>
        </div>

        <div class="step">
            <h2>3. 📋 Bazadagi Kinolar Soni va Ro'yxatini Ko'rish</h2>
            <p>Botga shunchaki <code>/list</code> yoki <code>/kinolar</code> deb yozsangiz, barcha kinolaringiz raqami va nomlarini ko'rsatadi.</p>
        </div>

        <div class="step">
            <h2>4. 🧹 Bazani Butunlay Tozalash (0 dan boshlash)</h2>
            <p>Botga shunchaki <code>/clearall</code> deb yozsangiz, barcha kinolarni 1 soniyada tozalaydi.</p>
        </div>

        <div class="step">
            <h2>5. 🛡 Xavfsizlik va Muhofaza (Protect Content)</h2>
            <ul>
                <li>Faqat Sizning Telegram akkauntingiz Admin hisoblanadi.</li>
                <li>Foydalanuvchilar kinolarni boshqalarga yubora olmaydi (Forward taqiqlangan).</li>
                <li>Foydalanuvchilar kinolarni telefonga saqlay olmaydi (Save to Gallery taqiqlangan).</li>
            </ul>
        </div>

        <footer>
            <p>© 2026 Telegram Kino Bot. Barcha huquqlar himoyalangan.</p>
        </footer>
    </div>
</body>
</html>`;

try {
  fs.writeFileSync(txtFilePath, guideContentText, 'utf8');
  fs.writeFileSync(htmlFilePath, guideContentHTML, 'utf8');
  console.log("✅ Desktop'ga Qo'llanma fayllari muvaffaqiyatli saqlandi!");
} catch (e) {
  console.error("Xatolik:", e.message);
}
