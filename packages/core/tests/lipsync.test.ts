import { describe, expect, it } from 'vitest';
import { LipSyncDriver } from '../src/lipsync/driver';
import { parseSettings } from '../src/lipsync/native';
import { readFileSync } from 'node:fs';
const config = () =>
  JSON.parse(
    readFileSync(
      new URL(
        '../../../docs/public/models/kei_vowels_pro/kei_vowels_pro.motionsync3.json',
        import.meta.url,
      ),
      'utf8',
    ),
  );
const mouth = [{ id: 'ParamMouthOpenY', index: 0, min: 0, max: 1, defaultValue: 0 }];
describe('lip sync capability and model configuration', () => {
  it('distinguishes missing configuration from malformed configuration', () => {
    expect(new LipSyncDriver(mouth, undefined, {}, []).mode).toBe('amplitude');
    expect(new LipSyncDriver([], undefined, {}, []).mode).toBe('unavailable');
    expect(() => new LipSyncDriver(mouth, undefined, { mode: 'motionsync' }, [])).toThrow(
      'no MotionSync',
    );
    expect(() => new LipSyncDriver(mouth, { Settings: [] }, {}, [])).toThrow('Select a CRI');
  });
  it('honors explicit CRI setting selection and rejects invalid native mappings', () => {
    const json = config();
    const setting = parseSettings(json);
    expect(parseSettings(json, setting.Id)).toBe(setting);
    expect(() => parseSettings(json, 'missing')).toThrow();
    setting.Mappings[0]!.Targets = [];
    expect(() => parseSettings(json)).toThrow('Incomplete mapping');
  });
  it('bounds amplitude output and stops overriding animation after reset', () => {
    const driver = new LipSyncDriver(mouth, undefined, { smoothing: 0 }, []);
    driver.push(new Float32Array(2400).fill(0.5), 24000);
    const output: number[] = [];
    driver.apply((_index, value) => output.push(value));
    expect(output).toEqual([1]);
    driver.reset();
    driver.apply((_index, value) => output.push(value));
    expect(output).toEqual([1]);
    driver.destroy();
    driver.destroy();
  });
});
