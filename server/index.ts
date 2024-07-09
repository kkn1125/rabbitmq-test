import amqp from "amqplib";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const connection = await amqp.connect("amqp://localhost", {});
  const channel = await connection.createChannel();

  const exchangeFanout = "logs.fanout";
  const exchangeTopic = "logs.topic";
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
    await sleep(2000);
  }

  const sentResult = channel.publish(exchangeTopic, "toy2", Buffer.from(msg));
  console.log("✨ Last [x] Sent %s, Sent Result %s", msg, sentResult);
  channel.sendToQueue("toy2", Buffer.from("Test good"));
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}
run();
