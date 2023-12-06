const { MessageMedia } = require("whatsapp-web.js");
const { getOpenAIResponse } = require("./openaiHandler");

async function setupMessageListener(client, tiktokHandler, openaiApiKey) {
  client.on("message", async (msg) => {
    const phoneNumber = await msg.getContact();
    const timeStamp = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });

    const lowercaseBody = msg.body.toLowerCase();

    if (
      msg.type === "image" &&
      (lowercaseBody.startsWith("!sticker") ||
        lowercaseBody.startsWith("!stiker"))
    ) {
      const words = lowercaseBody.split(" ");
      words.shift(); // Remove the command (!sticker or !stiker)
      const stickerName = words.shift() || "JebibBot"; // Use provided name or default
      const stickerAuthor = words.join(" ") || "JebibSticker"; // Use provided author or default

      const media = await msg.downloadMedia();

      // Send the media as a sticker with metadata
      client.sendMessage(msg.from, media, {
        sendMediaAsSticker: true,
        stickerName,
        stickerAuthor,
      });

      console.log(
        `[${timeStamp}] ${phoneNumber.number} just created a new sticker with name "${stickerName}" and author "${stickerAuthor}"`
      );
    } else if (lowercaseBody === "sticker") {
      msg.reply("Gambarnya mana?");
    } else if (lowercaseBody.startsWith("!download")) {
      const words = lowercaseBody.split(" ");
      words.shift();
      const args = words.join(" ");
      console.log(args);
      tiktokHandler.handleDownload(args, msg);
    } else if (lowercaseBody.startsWith("!gpt")) {
      const words = lowercaseBody.split(" ");
      msg.reply("Mohon Tunggu...");
      words.shift();
      const userMessage = words.join(" ");

      try {
        const gptResponse = await getOpenAIResponse(userMessage, openaiApiKey);
        msg.reply(gptResponse);
        console.log(`[${timeStamp}] ${phoneNumber.number} Memakai Bot ChatGPT`);
      } catch (error) {
        console.error("Error generating response from GPT:", error);
        msg.reply("Maaf, terjadi kesalahan dalam memproses permintaan Anda.");
      }
    }
  });
}

module.exports = { setupMessageListener };
