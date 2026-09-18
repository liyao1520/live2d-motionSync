import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPlayer } from '@live2d-motionsync/core';
function App() {
  const host = useRef(null),
    player = useRef(null);
  const [status, setStatus] = useState('加载中'),
    [ready, setReady] = useState(false);
  useEffect(() => {
    const controller = new AbortController(),
      canvas = document.createElement('canvas');
    host.current.append(canvas);
    let instance;
    createPlayer({
      canvas,
      model: '/models/kei_vowels_pro/kei_vowels_pro.model3.json',
      signal: controller.signal,
    })
      .then(async (p) => {
        instance = p;
        if (controller.signal.aborted) {
          await p.destroy();
          return;
        }
        player.current = p;
        setReady(true);
        setStatus('就绪');
        p.on('error', (e) => setStatus(e.message));
      })
      .catch((e) => {
        if (!controller.signal.aborted) setStatus(e.message);
      });
    return () => {
      controller.abort();
      player.current = null;
      void instance?.destroy();
      canvas.remove();
    };
  }, []);
  async function play() {
    try {
      const p = player.current;
      if (!p) return;
      await p.unlockAudio();
      await p.play('/demo.wav').finished;
    } catch (e) {
      setStatus(e.message);
    }
  }
  return (
    <>
      <div ref={host} style={{ height: '70vh' }} />
      <button disabled={!ready} onClick={play}>
        播放
      </button>
      <button onClick={() => player.current?.stop()}>停止</button>
      <output>{status}</output>
    </>
  );
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
