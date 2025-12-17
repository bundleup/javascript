import { Base } from "./base";

interface Connection {
  id: string;
  externalId?: string;
  expiresAt: Date;
  integrationId: string;
  isValid: boolean;
  refreshedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Connections extends Base<Connection> {
  protected namespace = "connections";
}
