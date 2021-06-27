import { EventEmitter } from 'stream';
import TuyaAPIDevice, { DataPointsPayload, DataPointValue } from 'tuyapi';
import { DeviceOptions } from '../types';

interface Events<T = unknown> {
  connected: [];
  disconnected: [];
  error: [unknown];
  change: [T];
}

export default abstract class Device<T> {
  private device: TuyaAPIDevice;
  private emitter = new EventEmitter();

  constructor(options: DeviceOptions) {
    this.device = new TuyaAPIDevice({
      id: options.id,
      ip: options.ip,
      key: options.key,
      version: '3.3',
    });
  }

  public addEventListener<K extends keyof Events>(event: K, cb: (...args: Events<T>[K]) => unknown): this {
    this.emitter.on(event, cb as (...args: unknown[]) => unknown);
    return this;
  }

  public removeEventListener<K extends keyof Events>(event: K, cb: (...args: Events<T>[K]) => unknown): this {
    this.emitter.off(event, cb as (...args: unknown[]) => unknown);
    return this;
  }

  protected emit<K extends keyof Events>(event: K, ...values: Events<T>[K]): boolean {
    return this.emitter.emit(event, ...values);
  }

  public async init() {
    this.device.on('connected', () => this.emit('connected'));
    this.device.on('disconnected', () => this.emit('disconnected'));
    this.device.on('error', (err) => this.emit('error', err));
    this.device.on('data', (data) => this.onData(data));
    this.device.on('dp-refresh', (data) => this.onData(data));
    await this.device.find();
    await this.device.connect();
  }

  protected abstract parseDataPoints(data: DataPointsPayload): T;

  protected send(datapoint: number, payload: DataPointValue) {
    return this.device.set({ dps: datapoint, set: payload });
  }

  public async fetchState() {
    return this.parseDataPoints(await this.device.get({ schema: true }));
  }

  private onData(data: DataPointsPayload) {
    const change = this.parseDataPoints(data);

    if (Object.keys(change).length !== 0) {
      this.emit('change', change);
    }
  }
}