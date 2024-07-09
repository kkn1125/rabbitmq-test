import amqp from "amqplib";

async function run() {
  const connection = await amqp.connect("amqp://localhost", {});
  const channel = await connection.createChannel();

  const exchangeFanout = "logs.fanout";
  const exchangeTopic = "logs.topic";
  // const queue = "hello";

  await channel.assertExchange(exchangeFanout, "fanout", {
    durable: true,
  });
  await channel.assertExchange(exchangeTopic, "topic", {
    durable: true,
  });

  const routingKey = "root.*.*";

  const q1 = await channel.assertQueue("", { exclusive: true });
  const q2 = await channel.assertQueue("", { exclusive: true });
  const q3 = await channel.assertQueue("", { exclusive: true });
  const q4 = await channel.assertQueue("", { exclusive: true });

  console.log(
    "1 [*] Waiting for messages in %s. To exit press CTRL+C",
    q1.queue
  );
  console.log(
    "2 [*] Waiting for messages in %s. To exit press CTRL+C",
    q2.queue
  );
  console.log(
    "3 [*] Waiting for messages in %s. To exit press CTRL+C",
    q3.queue
  );
  console.log(
    "4 [*] Waiting for messages in %s. To exit press CTRL+C",
    q4.queue
  );

  await channel.bindQueue(q1.queue, exchangeFanout, "");
  await channel.bindQueue(q2.queue, exchangeTopic, routingKey);
  await channel.bindQueue(q3.queue, exchangeTopic, "root.test2");
  await channel.bindQueue(q4.queue, exchangeTopic, "root.*.*.*");

  channel.consume(
    q1.queue,
    function (msg) {
      console.log("1 [x] Received %s", msg?.content.toString());
    },
    {
      noAck: true,
    }
  );
  channel.consume(
    q2.queue,
    function (msg) {
      console.log("2 [x] Received %s", msg?.content.toString());
    },
    {
      noAck: true,
    }
  );
  channel.consume(
    q3.queue,
    function (msg) {
      console.log("3 [x] Received %s", msg?.content.toString());
    },
    {
      noAck: true,
    }
  );
  channel.consume(
    q4.queue,
    function (msg) {
      console.log(
        "4 [x] Received %s",
        msg?.content.toString(),
        msg?.fields.routingKey
      );
    },
    {
      noAck: true,
    }
  );
}
run();
