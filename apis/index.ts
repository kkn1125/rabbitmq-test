import http from "http";

type Handler = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  }
) => any;

type RouteHandler = {
  get: Record<string, Handler>;
  post: Record<string, Handler>;
  patch: Record<string, Handler>;
  put: Record<string, Handler>;
  delete: Record<string, Handler>;
};

class Router {
  req!: http.IncomingMessage;
  res!: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  };

  constructor() {}

  routeHandler: RouteHandler = {
    get: {},
    post: {},
    patch: {},
    put: {},
    delete: {},
  };

  get(route: string, handler: Handler) {
    return () => {
      this.req.method = "get";
      return handler(this.req, this.res);
    };
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

  run(method: string, url: string) {
    this.routeHandler[(method, url)];
  }
}

const router = new Router();

const server = http.createServer((req, res) => {
  router.setReq(req);
  router.setRes(res);
  router.run(req.method, req.url);
});

server.listen(8000, () => {
  console.log("server listening on http://localhost:8000");
});
