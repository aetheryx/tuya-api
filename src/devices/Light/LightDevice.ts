import { DataPointsPayload } from 'tuyapi';
import Device from '../Device';
import { Color } from './Color';
import { DataPoint, Mode } from './Constants';

interface LightDeviceEvent {
  status?: boolean;
  color?: Color;
  mode?: Mode;
  brightness?: number;
  colorTemp?: number;
}

export class LightDevice extends Device<LightDeviceEvent> {
  protected parseDataPoints(data: DataPointsPayload) {
    const change: Partial<LightDeviceEvent> = {};

    if (DataPoint.STATUS in data.dps) {
      change.status = data.dps[DataPoint.STATUS] as boolean;
    }
    if (DataPoint.COLOR in data.dps) {
      change.color = Color.fromTuyaColor(data.dps[DataPoint.COLOR] as string);
    }
    if (DataPoint.MODE in data.dps) {
      change.mode = data.dps[DataPoint.MODE] as Mode;
    }
    if (DataPoint.BRIGHTNESS in data.dps) {
      change.brightness = data.dps[DataPoint.BRIGHTNESS] as number;
    }
    if (DataPoint.COLOR_TEMP in data.dps) {
      change.colorTemp = data.dps[DataPoint.COLOR_TEMP] as number;
    }

    return change;
  }

  public async setColor(color: Color) {
    return this.send(DataPoint.COLOR, color.toTuyaColor());
  }
}