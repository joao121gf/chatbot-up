// leitor de qr code
const qrcode = require("qrcode-terminal");
const { Client, MessageMedia } = require("whatsapp-web.js");
const client = new Client();

// serviço de leitura do qr code
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// Após isso ele diz que foi tudo certo
client.on("ready", () => {
  console.log("Tudo certo! WhatsApp conectado.");
});

// E inicializa tudo
client.initialize();

const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Funil
client.on("message", async (msg) => {
  if (
    msg.body.match(/(Olá, gostaria de mais informações)/i) &&
    msg.from.endsWith("@c.us")
  ) {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const name = contact.pushname; // Pegando o nome do contato

    // Delay de 2 segundos antes de reagir
    await delay(3500);
    // Reagir com um emoji de coração"
    await msg.react("❤️");

    // Mensagem inicial
    await delay(3000); // delay de 3 segundos
    await chat.sendStateTyping(); // Simulando Digitação
    await delay(3000); // Delay de 3 segundos
    await client.sendMessage(
      msg.from,
      `Opa ${
        name.split(" ")[0]
      }, boa ${getCurrentGreeting()}! 😁 Seja bem-vindo! Fico feliz que você esteja aqui, meu nome é João e sou fundador da Bravalink.`
    );

    await delay(3000); // delay de 3 segundos
    await chat.sendStateTyping(); // Simulando Digitação
    await delay(3000); // Delay de 3 segundos

    // Enviar foto de apresentação
    const media = MessageMedia.fromFilePath("imagem/projects.png");
    await client.sendMessage(msg.from, media);

    await delay(2000); // esperar 2 segundos
    await chat.sendStateTyping(); // Simulando Digitação
    await delay(2000); // Delay de 2 segundos
    await client.sendMessage(
      msg.from,
      "Você está pensando em criar um site? Que tipo de serviço você oferece?"
    );
  }
});

// Função para determinar a saudação com base na hora do dia
function getCurrentGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "dia";
  if (hour < 18) return "tarde";
  return "noite";
}
