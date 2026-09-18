import { useRef, useState, type ChangeEvent } from 'react';
import { useStudio } from './useStudio';
import { readDroppedFiles } from './droppedFiles';

function Icon({
  name,
  size = 18,
}: {
  name: 'play' | 'stop' | 'upload' | 'audio' | 'mic' | 'cube' | 'arrow' | 'plus';
  size?: number;
}) {
  const paths = {
    play: 'm9 5 11 7-11 7Z',
    stop: 'M6 6h12v12H6Z',
    upload: 'M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5',
    audio: 'M9 18V5l11-2v13M9 8l11-2M9 18c0 2-5 3-5 0s5-3 5 0m11-2c0 2-5 3-5 0s5-3 5 0',
    mic: 'M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0ZM5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8',
    cube: 'm12 3 9 5v9l-9 5-9-5V8Zm0 10 9-5M3 8l9 5v9M8 5l9 5',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    plus: 'M12 5v14M5 12h14',
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function App() {
  const studio = useStudio();
  const [modelUrl, setModelUrl] = useState('/models/kei_vowels_pro/kei_vowels_pro.model3.json');
  const [audioUrl, setAudioUrl] = useState('/demo.wav');
  const [audioFile, setAudioFile] = useState<File>();
  const [sourceTab, setSourceTab] = useState<'url' | 'local'>('url');
  const [motion, setMotion] = useState('0');
  const [expression, setExpression] = useState('');
  const [dragging, setDragging] = useState(false);
  const [readingDrop, setReadingDrop] = useState(false);
  const dragDepth = useRef(0);
  const zip = useRef<HTMLInputElement>(null),
    folder = useRef<HTMLInputElement>(null),
    audio = useRef<HTMLInputElement>(null);
  const ready = !!studio.instance;
  const loadModel = () =>
    studio.run(() =>
      studio.load(
        modelUrl,
        modelUrl.split('/').pop()?.replace('.model3.json', '') || 'Live2D 模型',
      ),
    );
  const localFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length)
      studio.run(() =>
        studio.load(
          {
            type: 'files',
            files: files.map((file) => ({ path: file.webkitRelativePath || file.name, file })),
          },
          files[0]!.webkitRelativePath.split('/')[0] || '本地模型',
        ),
      );
    event.target.value = '';
  };
  const motions = studio.instance?.model.motions ?? [];
  const expressions = studio.instance?.model.expressions ?? [];
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Live2D Studio 首页">
          <span className="brand-mark">
            L<span>2</span>
          </span>
          <span>
            Live2D <strong>Studio</strong>
          </span>
        </a>
        <div className="topbar-right">
          <span className="workspace-label">模型与声音的工作台</span>
          <span className="version">2.0 ALPHA</span>
        </div>
      </header>
      <main className="workspace">
        <section className="preview-panel" aria-label="模型预览">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">LIVE PREVIEW</span>
              <h1>让角色，开口说话。</h1>
            </div>
            <span className={'connection ' + (ready ? 'connected' : '')}>
              <i />
              {studio.busy ? '加载中' : ready ? '已连接' : '待连接'}
            </span>
          </div>
          <div className={'stage ' + (ready ? 'has-model' : '')}>
            <div className="stage-grid" />
            <div className="canvas-host" ref={studio.host} />
            {!ready && (
              <div className="empty-state">
                <div className={'model-symbol ' + (studio.busy ? 'loading' : '')}>
                  <Icon name="cube" size={38} />
                </div>
                <h2>{studio.busy ? '正在准备你的角色' : '从一个角色开始'}</h2>
                <p>
                  {studio.busy
                    ? '模型加载完成后，即可预览与交互。'
                    : '加载示例模型，或导入你自己的 Live2D 模型。'}
                </p>
                {!studio.busy && (
                  <button className="sample-button" onClick={loadModel}>
                    体验示例模型 <Icon name="arrow" size={16} />
                  </button>
                )}
              </div>
            )}
            <span className="stage-caption">LIVE2D CANVAS</span>
            {ready && (
              <div
                className={'sound-indicator ' + (studio.playing ? 'active' : '')}
                aria-label={studio.playing ? '音频播放中' : '音频待机'}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <i key={i} style={{ animationDelay: i * 0.12 + 's' }} />
                ))}
                <span>{studio.playing ? '正在播放' : '等待声音'}</span>
              </div>
            )}
          </div>
          <footer className="preview-footer">
            <div className="model-info">
              <span className="model-avatar">
                <Icon name="cube" size={17} />
              </span>
              <div>
                <strong>{studio.modelName}</strong>
                <span>{ready ? '可以点击模型，与角色互动' : '预览将在模型加载后显示'}</span>
              </div>
            </div>
            <button
              className="text-button"
              aria-label="卸载模型"
              disabled={!ready && !studio.busy}
              onClick={() => studio.run(studio.unload)}
            >
              卸载模型
            </button>
          </footer>
        </section>

        <aside className="control-panel" aria-label="控制面板">
          <div className="control-heading">
            <h2>控制台</h2>
            <span>PLAYGROUND</span>
          </div>
          <section className="control-section">
            <div className="section-title">
              <span className="section-number">01</span>
              <h3>模型</h3>
            </div>
            <div className="segmented">
              <button aria-pressed={sourceTab === 'url'} onClick={() => setSourceTab('url')}>
                模型链接
              </button>
              <button aria-pressed={sourceTab === 'local'} onClick={() => setSourceTab('local')}>
                本地导入
              </button>
            </div>
            {sourceTab === 'url' ? (
              <div className="source-content">
                <label htmlFor="model">模型地址</label>
                <input
                  id="model"
                  value={modelUrl}
                  onChange={(e) => setModelUrl(e.target.value)}
                  placeholder="https://…/avatar.model3.json"
                />
                <button
                  id="load"
                  className="primary full-width"
                  onClick={loadModel}
                  disabled={studio.busy || !modelUrl.trim()}
                >
                  {studio.busy ? '加载中…' : '加载模型'}
                  <Icon name="arrow" size={16} />
                </button>
              </div>
            ) : (
              <div className="source-content">
                <button
                  className={'upload-zone' + (dragging ? ' is-dragging' : '')}
                  aria-busy={readingDrop}
                  onClick={() => !readingDrop && zip.current?.click()}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    if (Array.from(e.dataTransfer.types).includes('Files')) {
                      dragDepth.current++;
                      setDragging(true);
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = readingDrop ? 'none' : 'copy';
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    dragDepth.current = Math.max(0, dragDepth.current - 1);
                    if (!dragDepth.current) setDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    dragDepth.current = 0;
                    setDragging(false);
                    if (readingDrop) return;
                    const filesPromise = readDroppedFiles(e.dataTransfer);
                    setReadingDrop(true);
                    studio.run(async () => {
                      try {
                        const files = await filesPromise;
                        if (!files.length) throw new Error('请拖入模型 ZIP 或完整模型文件夹');
                        const first = files[0]!;
                        if (files.length === 1 && /\.zip$/i.test(first.file.name)) {
                          await studio.load(
                            { type: 'zip', file: first.file },
                            first.file.name.replace(/\.zip$/i, ''),
                          );
                        } else {
                          await studio.load(
                            { type: 'files', files },
                            first.path.includes('/') ? first.path.split('/')[0]! : '本地模型',
                          );
                        }
                      } finally {
                        setReadingDrop(false);
                      }
                    });
                  }}
                >
                  <Icon name="upload" size={23} />
                  <strong>
                    {readingDrop
                      ? '正在导入模型…'
                      : dragging
                        ? '松开以导入模型'
                        : '选择模型 ZIP，或拖放到此处'}
                  </strong>
                  <span>支持 ZIP、文件夹和文件集合，保留原有目录</span>
                </button>
                <button
                  className="text-button folder-button"
                  onClick={() => folder.current?.click()}
                >
                  或选择模型文件夹 <Icon name="arrow" size={14} />
                </button>
              </div>
            )}
            <input
              id="zip"
              ref={zip}
              className="sr-only"
              type="file"
              accept=".zip"
              aria-label="导入模型 ZIP"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file)
                  studio.run(() =>
                    studio.load({ type: 'zip', file }, file.name.replace(/\.zip$/i, '')),
                  );
                e.target.value = '';
              }}
            />
            <input
              id="folder"
              ref={folder}
              className="sr-only"
              type="file"
              multiple
              {...{ webkitdirectory: '' }}
              aria-label="导入模型目录"
              onChange={localFiles}
            />
          </section>
          <section className="control-section">
            <div className="section-title">
              <span className="section-number">02</span>
              <h3>声音</h3>
              <span className="section-note">驱动口型同步</span>
            </div>
            <label htmlFor="audio">音频地址</label>
            <div className="input-action">
              <input
                id="audio"
                value={audioFile ? audioFile.name : audioUrl}
                readOnly={!!audioFile}
                onChange={(e) => setAudioUrl(e.target.value)}
              />
              <button
                aria-label={audioFile ? '移除本地音频' : '选择本地音频'}
                title={audioFile ? '移除本地音频' : '选择本地音频'}
                onClick={() => (audioFile ? setAudioFile(undefined) : audio.current?.click())}
              >
                {audioFile ? '×' : <Icon name="upload" size={16} />}
              </button>
            </div>
            <input
              ref={audio}
              type="file"
              className="sr-only"
              accept="audio/*"
              aria-label="本地音频文件"
              onChange={(e) => {
                setAudioFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <div className="playback-row">
              <button
                id="play"
                className="primary"
                aria-label="播放 / 打断"
                disabled={!ready}
                onClick={() => studio.run(() => studio.play(audioFile ?? audioUrl))}
              >
                <Icon name="play" size={16} />
                播放音频
              </button>
              <button
                id="enqueue"
                className="secondary"
                aria-label="加入队列"
                disabled={!ready}
                onClick={() => studio.run(() => studio.play(audioFile ?? audioUrl, true))}
              >
                <Icon name="plus" size={16} />
                排队
              </button>
              <button
                id="stop"
                className="icon-button"
                aria-label="停止"
                title="停止"
                disabled={!ready}
                onClick={studio.stop}
              >
                <Icon name="stop" size={16} />
              </button>
            </div>
            <div className="source-actions">
              <button
                id="mic"
                className={studio.micActive ? 'selected' : ''}
                aria-label="麦克风"
                aria-pressed={studio.micActive}
                disabled={!ready}
                onClick={() => studio.run(studio.mic)}
              >
                <Icon name="mic" size={16} />
                {studio.micActive ? '关闭麦克风' : '麦克风'}
              </button>
              <button
                id="pcm"
                aria-label="PCM 演示"
                disabled={!ready}
                onClick={() => studio.run(studio.pcm)}
              >
                <Icon name="audio" size={16} />
                PCM 演示
              </button>
            </div>
          </section>
          <section className="control-section interactions">
            <div className="section-title">
              <span className="section-number">03</span>
              <h3>互动</h3>
            </div>
            <div className="select-row">
              <label htmlFor="motions">动作</label>
              <select
                id="motions"
                value={motion}
                disabled={!motions.length}
                onChange={(e) => setMotion(e.target.value)}
              >
                {motions.length ? (
                  motions.map((m, i) => (
                    <option key={i} value={i}>
                      {m.group || '默认动作'} · {m.index + 1}
                    </option>
                  ))
                ) : (
                  <option value="0">暂无可用动作</option>
                )}
              </select>
              <button
                className="icon-button"
                aria-label="执行动作"
                disabled={!motions.length}
                onClick={() =>
                  studio.run(() =>
                    studio.instance?.model.playMotion(motions[Number(motion)] ?? motions[0]!),
                  )
                }
              >
                <Icon name="play" size={15} />
              </button>
            </div>
            <div className="select-row">
              <label htmlFor="expressions">表情</label>
              <select
                id="expressions"
                value={expressions.includes(expression) ? expression : (expressions[0] ?? '')}
                disabled={!expressions.length}
                onChange={(e) => setExpression(e.target.value)}
              >
                {expressions.length ? (
                  expressions.map((name) => <option key={name}>{name}</option>)
                ) : (
                  <option value="">暂无可用表情</option>
                )}
              </select>
              <button
                className="icon-button"
                aria-label="设置表情"
                disabled={!expressions.length}
                onClick={() =>
                  studio.run(() =>
                    studio.instance?.model.setExpression(
                      expressions.includes(expression) ? expression : expressions[0]!,
                    ),
                  )
                }
              >
                <Icon name="play" size={15} />
              </button>
            </div>
          </section>
          <div className={'status-bar ' + (studio.error ? 'is-error' : '')}>
            <span className="status-dot" />
            <output id="status" aria-live="polite">
              {studio.status}
            </output>
          </div>
        </aside>
      </main>
      <footer className="page-footer">
        <span>
          Live2D MotionSync <span className="footer-divider">/</span> 一处预览，自然表达。
        </span>
        <span>模型与音频均在浏览器本地处理</span>
      </footer>
    </div>
  );
}
