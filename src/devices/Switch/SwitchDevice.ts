import { DataPointsPayload } from 'tuyapi';
import Device from '../Device';

interface SwitchDeviceEvent {
  switchChanges: Array<{
    id: number;
    state: boolean;
  }>;
}

export class SwitchDevice extends Device<SwitchDeviceEvent> {
  private amount = 1;

  public setAmount(amount: number) {
    this.amount = amount;
  }

  protected parseDataPoints(data: DataPointsPayload) {
    const change: SwitchDeviceEvent = {
      switchChanges: []
    };

    for (const keyString of Object.keys(data.dps)) {
      const key = Number(keyString);
      if (key <= this.amount) {
        change.switchChanges.push({
          id: key,
          state: data.dps[key] as boolean,
        })
      }
    }

    return change;
  }

  public async setState(id: number, state: boolean) {
    return this.send(id, state);
  }

  public async turnOn(id: number) {
    return this.setState(id, true);
  }

  public async turnOff(id: number) {
    return this.setState(id, false);
  }
}