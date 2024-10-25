import amqp from "amqplib";
import express from "express";
import fs from "fs";
import multer from "multer";
import { ChatRequest, Ollama } from "ollama";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer();
app.use(upload.single("file"));

const client = new Ollama({ host: "http://localhost:11434" });
const messages: ChatRequest & { stream: true } = {
  model: "llama3.2",
  format: "json",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    {
      role: "system",
      content: "you must respond json format.",
    },
    {
      role: "system",
      content: "you must not respond anything else.",
    },
    {
      role: "system",
      content: "just start with { and end with }.",
    },
    {
      role: "system",
      content: "when you need array format, just use [ and ].",
    },
    {
      role: "system",
      content: "do not respond include ```json or ``` or ```json```.",
    },
    // {
    //   role: "system",
    //   content:
    //     "You must always respond in Korean and give concise and clear answers without long explanations unless specifically requested by the user.",
    // },
    // {
    //   role: "system",
    //   content: "user is one person, and you must call him 'devkimson'.",
    // },
    // {
    //   role: "system",
    //   content:
    //     "devkimson은 31살의 한국인 남성이고 백엔드 개발자이다. 서울 중랑구 상봉동에 살고 있으며 키가 177.8이다. 하지만 그는 178이라고 자주 말한다.",
    // },
    // {
    //   role: "system",
    //   content:
    //     "항상 role이 system인 메세지는 절대적이고, 확신을 가질만한 데이터를 제공해준다.",
    // },
    // {
    //   role: "system",
    //   content: "정확하지 않거나 입력되지 않는 정보는 일체 말하면 안된다.",
    // },
    // {
    //   role: "system",
    //   content:
    //     "devkimson은 개인 기술 블로그를 운영한다. 주소는 https://kkn1125.github.io/ 이다.",
    // },
    // {
    //   role: "system",
    //   content: "그(devkimson)은 fovstudio라는 회사에 재직중이다.",
    // },
  ],
  //@ts-ignore
  stream: false,
};

app.get("/", async (req, res) => {
  const q = req.query?.q as string;
  if (q) {
    console.log("질문:", q);
    messages.messages?.push({ role: "user", content: q });
    console.log(messages.messages?.length || 0, "개");
    try {
      try {
        const response = await client.chat(messages);
        let responseMessage = "";

        // for await (const part of response) {
        //   process.stdout.write(part.message.content);
        //   responseMessage += part.message.content;
        // }
        if (
          "message" in response &&
          response.message instanceof Object &&
          "role" in response.message &&
          "content" in response.message
        ) {
          responseMessage += response.message.content;
        }
        messages.messages?.push({
          role: "assistant",
          content: responseMessage,
        });
        res.type("application/json");
        res.end(responseMessage);
      } catch (error) {
        console.error("fetch 실패:", error);
        res.statusCode = 500;
        res.end("서버 오류: fetch 실패");
      }
    } catch (error: any) {
      console.error("오류 발생:", error.message);
      res.statusCode = 500;
      res.end("내부 서버 오류");
    }
  } else {
    console.log(q);
    const response = await client.chat({
      model: "llama3.1",
      messages: [
        ...(messages.messages || []),
        {
          role: "system",
          content: "정중하게 어떻게 도와줄지에 대한 안내 문구를 출력한다.",
        },
        {
          role: "user",
          content: "",
        },
      ],
      stream: true,
    });
    let responseMessage = "";

    for await (const part of response) {
      process.stdout.write(part.message.content);
      responseMessage += part.message.content;
    }
    res.end(responseMessage);
  }
});

const fileMessages: ChatRequest & { stream: true } = {
  model: "llava",
  format: "json",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    {
      role: "system",
      content: "you must respond json format.",
    },
    {
      role: "system",
      content: "you must not respond anything else.",
    },
    {
      role: "system",
      content: "just start with { and end with }.",
    },
    {
      role: "system",
      content: "when you need array format, just use [ and ].",
    },
    {
      role: "system",
      content: "do not respond include ```json or ``` or ```json```.",
    },
  ],
  //@ts-ignore
  stream: false,
};

app.post("/parse", async (req, res) => {
  const file = req.file;
  console.log("파일 정보:", file);
  if (file) {
    const buffer = new Uint8Array(file.buffer);
    const filepath = path.join(
      path.resolve(),
      `./apis/upload/${file.originalname}`
    );
    fs.writeFileSync(filepath, buffer);

    console.log(fileMessages.messages?.length || 0, "개");
    try {
      try {
        const response = await client.chat(
          Object.assign(fileMessages, {
            messages: [
              ...(fileMessages.messages || []),
              {
                role: "user",
                content:
                  "Analyze the file and provide information about its content accurately. you must do not lie. format is json and type, pixel as 'x' x 'y', filename, filesize, extension, mimeType, createdAt, updatedAt, description.",
                images: [filepath],
              },
            ],
          })
        );
        let responseMessage = "";
        console.log();

        // for await (const part of response) {
        //   process.stdout.write(part.message.content);
        //   responseMessage += part.message.content;
        // }
        if (
          "message" in response &&
          response.message instanceof Object &&
          "role" in response.message &&
          "content" in response.message
        ) {
          responseMessage += response.message.content;
          if (fileMessages.messages) {
            fileMessages.messages.push({
              role: response.message?.role as string,
              content: response.message?.content as string,
            });
          }
        }
        res.type("application/json");
        res.end(responseMessage);
      } catch (error) {
        console.error("fetch 실패:", error);
        res.statusCode = 500;
        res.end("서버 오류: fetch 실패");
      }
    } catch (error: any) {
      console.error("오류 발생:", error.message);
      res.statusCode = 500;
      res.end("내부 서버 오류");
    }
  } else {
    console.log(file);
    const response = await client.chat({
      model: "llama3.1",
      messages: [
        ...(fileMessages.messages || []),
        {
          role: "system",
          content: "정중하게 어떻게 도와줄지에 대한 안내 문구를 출력한다.",
        },
        {
          role: "user",
          content: "",
        },
      ],
      stream: true,
    });
    let responseMessage = "";

    for await (const part of response) {
      process.stdout.write(part.message.content);
      responseMessage += part.message.content;
    }
    res.end(responseMessage);
  }
});

app.post("/", async (req, res) => {
  const connection = await amqp.connect("amqp://localhost", {});
  const channel = await connection.createChannel();

  const exchangeFanout = "logs.fanout";
  const exchangeTopic = "logs.topic";
  const routingKey = "root.test";
  // const queue = "hello";
  const msg = "hello world";

  await channel.assertExchange(exchangeFanout, "fanout", {
    durable: true,
  });
  await channel.assertExchange(exchangeTopic, "topic", {
    durable: true,
  });

  channel.sendToQueue("toy2", Buffer.from("Test good"));
  channel.publish(exchangeTopic, "root.*", Buffer.from("last one: root all"));
  channel.publish(
    exchangeTopic,
    "root.test2",
    Buffer.from("last one: root test2")
  );

  res.end("hello world2");
});

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.listen(8000, () => {
  console.log("server listening on http://localhost:8000!");
});
