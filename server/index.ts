import amqp from "amqplib";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
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

  // channel.assertQueue(queue, {
  //   durable: false,
  // });
  const count = 5;
  console.log("%s times send", count);

  for (let i = 0; i < count; i++) {
    const sentResult = channel.publish(exchangeFanout, "", Buffer.from(msg));
    console.log(" [x] Sent %s, Sent Result %s", msg, sentResult);
    await sleep(100);
  }

  const sentResult = channel.publish(
    exchangeTopic,
    routingKey,
    Buffer.from(msg)
  );
  console.log("✨ Last [x] Sent %s, Sent Result %s", msg, sentResult);
  channel.sendToQueue("toy2", Buffer.from("Test good"));

  channel.publish(exchangeTopic, "root.*", Buffer.from("last one: root all"));
  channel.publish(
    exchangeTopic,
    "root.test2",
    Buffer.from("last one: root test2")
  );
  channel.publish(
    exchangeTopic,
    "root.test1",
    Buffer.from("last one: root test1")
  );
  channel.publish(
    exchangeTopic,
    "root.test2.test",
    Buffer.from("last one: root test2 test")
  );
  channel.publish(
    exchangeTopic,
    "root.*.*.qw",
    Buffer.from("last one: root test2 test broad")
  );

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}
run();
