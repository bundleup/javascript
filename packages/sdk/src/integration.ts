import { Base } from "./base";

interface Integration {
  id: true,
  identifier: true,
  createdAt: true,
  updatedAt: true,
}

export class Integrations extends Base<Integration> {
  protected path = "/integrations";
}