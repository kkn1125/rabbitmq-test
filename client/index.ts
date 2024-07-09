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

  const q = await channel.assertQueue("toy2", { exclusive: true });

  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

  await channel.bindQueue(q.queue, exchangeFanout, "");
  await channel.bindQueue(q.queue, exchangeTopic, "toy2");

  await channel.consume(
    q.queue,
    function (msg) {
      console.log(" [x] Received %s", msg?.content.toString());
    },
    {
      noAck: true,
    }
  );
}
run();
