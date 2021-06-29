# tuya-api
A strongly-typed, high-level API for Tuya devices
```ts
import { Color, LightDevice } from './src/devices';

const dev = new LightDevice({
  id: 'd93cadd64b9d52d6cddd38cd',
  key: '3f92c536b7467b2d41',
  ip: '192.168.178.42',
});

dev.addEventListener('change', ({ status, color, brightness }) => {
  if (status !== undefined) {
    console.log('Status changed to', status ? 'on' : 'off');
  }

  if (color !== undefined) {
    console.log('Color changed to', color.toColor().rgb().hex());
  }

  if (brightness !== undefined) {
    console.log(`Brightness changed to ${brightness}%`);
  }
});

await dev.init();
await dev.setColor(Color.fromRGB('#CA2D36'));
```

work in progress - just a small side project for now :)
