import DynamicLink from 'fumadocs-core/dynamic-link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Live2D MotionSync 2.0</h1>
      <p className="text-fd-muted-foreground">
        模型渲染与口型同步，从这里开始：{' '}
        <DynamicLink href="/[lang]/docs" className="text-fd-foreground font-semibold underline">
          /docs
        </DynamicLink>{' '}
      </p>
    </main>
  );
}
