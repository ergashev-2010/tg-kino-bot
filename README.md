# 🎬 Telegram Kino Bot (Node.js + Telegraf v4)

Ushbu loyiha Node.js va Telegraf frameworki yordamida yaratilgan to'liq funksional Telegram Kino Bot kodi.

## 🌟 Imkoniyatlar va Mantiq:

1. **Deep Linking (Parametrli start):**
   - Foydalanuvchi `https://t.me/bot_username?start=kino_104` linkiga bosganda bot avtomatik ravishda `/start kino_104` parametringizni o'qiydi.
2. **Majburiy obunani tekshirish (`getChatMember`):**
   - Bot foydalanuvchi majburiy kanalga obuna bo'lganligini avtomatik tekshiradi.
   - Agar obuna bo'lmagan bo'lsa: 2 ta inline tugma chiqaradi:
     - 📢 **Kanalga o'tish** (Kanal URL boti)
     - 🔄 **Obunani tekshirish** (callback query: `check_kino_104`)
3. **Obunani qayta tekshirish va Kinoni berish:**
   - Foydalanuvchi "🔄 Obunani tekshirish" tugmasini bossa bot qayta obunani tekshiradi.
   - **Obuna bo'lgan bo'lsa:** Toast pop-up ko'rsatib, obuna so'rov xabarini o'chiradi va `kino_104` kodli videoni yuboradi.
   - **Obuna bo'lmagan bo'lsa:** `answerCbQuery` orqali Alert oyna chiqarib `"❌ Siz hali kanalga obuna bo me'lingiz!"` deb ogohlantiradi.
4. **Video File ID Admin Helper:**
   - Botga video yuborsangiz, bot sizga videoning Telegram `file_id` kodini beradi. Shunda yangi kinolarni bazaga oson qo'shishingiz mumkin.

---

## 🛠 O'rnatish va Ishga tushirish

### 1. Kutubxonalarni o'rnatish:
```bash
npm install
```

### 2. Sozlamalarni kiritish:
`.env` faylini oching va ma'lumotlarni to'ldiring:
```env
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyZ
CHANNEL_ID=-1001234567890
CHANNEL_URL=https://t.me/sizning_kanalingiz
```

> ⚠️ **MUHIM ESLATMA:**
> Bot kanalda **ADMINISTRATOR** huquqiga ega bo'lishi shart! Aks holda `getChatMember` orqali obunani tekshira olmaydi.

### 3. Botni ishga tushirish:
```bash
npm start
```
yoki tezkor qayta yuklanuvchi rejimda:
```bash
npm run dev
```
