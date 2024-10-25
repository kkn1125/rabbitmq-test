import http from "http";
import amqp from "amqplib";
import ollama, { ChatRequest, Ollama } from "ollama";

type Handler = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  }
) => any;

type RouteHandler = {
  GET: Record<string, Handler>;
  POST: Record<string, Handler>;
  PATCH: Record<string, Handler>;
  PUT: Record<string, Handler>;
  DELETE: Record<string, Handler>;
};

class Router {
  req!: http.IncomingMessage;
  res!: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  };

  constructor() {}

  routeHandler: RouteHandler = {
    GET: {},
    POST: {},
    PATCH: {},
    PUT: {},
    DELETE: {},
  };

  addRoute(method: string, url: string, callback: Handler) {
    this.routeHandler[method.toUpperCase() as keyof RouteHandler][url] =
      callback;
  }

  get(route: string, handler: Handler) {
    this.addRoute("get", route, handler);
  }

  post(route: string, handler: Handler) {
    this.addRoute("post", route, handler);
  }

  patch(route: string, handler: Handler) {
    this.addRoute("patch", route, handler);
  }

  put(route: string, handler: Handler) {
    this.addRoute("put", route, handler);
  }

  delete(route: string, handler: Handler) {
    this.addRoute("delete", route, handler);
  }

  setReq(req: http.IncomingMessage): void {
    this.req = req;
  }

  setRes(
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ) {
    this.res = res;
  }

  async run(method: string, url: string) {
    const route = this.routeHandler[method as keyof RouteHandler]?.[url];
    if (route) {
      await route(this.req, this.res);
    } else {
      this.res.statusCode = 404;
      this.res.end("not found");
    }
  }
}

const router = new Router();

const client = new Ollama({ host: "http://localhost:11434" });
const messages: ChatRequest & { stream: true } = {
  model: "llama3.1",
  messages: [],
  stream: true,
};

router.get("/", async (req, res) => {
  const q = req.url?.split("?")[1];
  const [key, question] = q?.split("=") || [];
  if (key === "q") {
    messages.messages?.push({ role: "user", content: question });
    try {
      try {
        const response = await client.chat(messages);

        for await (const part of response) {
          res.write(part.message.content);
        }

        res.end();
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
    res.end("질문 해주세요.");
  }
});

router.post("/", async (req, res) => {
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

const server = http.createServer((req, res) => {
  router.setReq(req);
  router.setRes(res);
  console.log(req.method, req.url);
  router.run(req.method || "get", req.url || "/");
});

server.listen(8000, () => {
  console.log("server listening on http://localhost:8000");
});
