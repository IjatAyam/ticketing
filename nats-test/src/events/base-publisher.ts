import { Stan } from 'node-nats-streaming';

type Event = {
  subject: string;
  data: any;
};

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private readonly client;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), err => {
        if (err) {
          return reject(err);
        }

        console.log('Event published to subject', this.subject);
        resolve();
      });
    });
  }
}
