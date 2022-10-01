export class TotpGeneratedEvent {
  constructor(public readonly email: string, public readonly token: string) {}
}
