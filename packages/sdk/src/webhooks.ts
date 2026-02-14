import { Base } from './base';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: Record<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
  lastTriggeredAt?: Date;
}

export class Webhooks extends Base<Webhook> {
  protected namespace = 'webhooks';
}
