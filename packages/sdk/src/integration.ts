import { Base } from "./base";

interface Integration {
  id: string;
  identifier: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Integrations extends Base<Integration> {
  protected path = "/integrations";
}