declare module 'tuyapi' {
  export type DataPointValue = boolean | string | number;
  export interface DataPointsPayload {
    t: number;
    dps: {
      [k: number]: DataPointValue;
    };
  }

  interface Events {
    'connected': [];
    'disconnected': [];
    'error': [unknown];
    'data': [DataPointsPayload];
    'dp-refresh': [DataPointsPayload];
  }

  export default class Device {
    constructor(opts: {
      id: string;
      key: string;
      version?: '3.3';
      ip?: string;
    });

    public on<K extends keyof Events>(k: K, cb: (...args: Events[K]) => unknown): this;

    public find(): Promise<void>;

    public connect(): Promise<void>;

    public get(opts: {
      schema: boolean;
    }): Promise<DataPointsPayload>;

    public set(opts: {
      dps: number;
      set: DataPointValue;
    }): Promise<DataPointsPayload>;
  }
}
