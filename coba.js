const { Client } = require("whatsapp-web.js");
const fs = require("fs");

// Inisialisasi client
const client = new Client();

// Event saat QR code muncul
client.on("qr", (qr) => {
  console.log("QR Code muncul, silakan scan!");
});

// Event saat sesi terhubung
client.on("ready", () => {
  console.log("Client siap!");
});

// Event saat pesan diterima
client.on("message", async (message) => {
  if (message.body === "!sendvideo") {
    try {
      // Ganti 'path/to/your/video.mp4' dengan path video yang ingin Anda kirim
      const videoPath = "path/to/your/video.mp4";

      // Baca file video
      const videoBuffer = fs.readFileSync(videoPath);

      // Kirim video
      await message.reply(videoBuffer, {
        caption: "Ini adalah video!",
      });

      console.log("Video berhasil dikirim!");
    } catch (error) {
      console.error("Error saat mengirim video:", error);
    }
  }
});

// Jalankan client
client.initialize();
