import React, { useState } from 'react';

function CenteringExample() {
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Live2D 自动居中功能</h2>
      <p>Status: {isLoaded ? '✅ Ready' : '⏳ Loading...'}</p>

      <div style={{ marginBottom: '20px' }}>
        <h3>居中功能说明:</h3>
        <p>Live2D 渲染器提供了强大的自动居中功能，可以根据容器尺寸自动调整模型位置和大小。</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>主要功能:</h4>
        <ul>
          <li><strong>自动居中</strong>: 模型会根据容器尺寸自动居中并缩放</li>
          <li><strong>保持宽高比</strong>: 默认保持模型的原始宽高比</li>
          <li><strong>响应式居中</strong>: 当容器大小改变时自动重新居中</li>
          <li><strong>偏移调整</strong>: 支持水平和垂直偏移</li>
          <li><strong>边界保护</strong>: 确保模型不会超出容器边界</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>使用方法:</h4>
        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '5px',
          overflow: 'auto'
        }}>
          {`// 基本居中
renderer.centerModel({
  maintainAspectRatio: true,
  maxWidthRatio: 0.8,
  maxHeightRatio: 0.9
});

// 居中到指定尺寸
renderer.centerModelToSize(400, 600, {
  maintainAspectRatio: true,
  verticalOffset: 0
});

// 启用响应式居中
renderer.enableResponsiveCentering({
  maintainAspectRatio: true,
  maxWidthRatio: 0.8,
  maxHeightRatio: 0.9,
  verticalOffset: -50
});

// 禁用响应式居中
renderer.disableResponsiveCentering();`}
        </pre>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f4fd' }}>
        <h4>参数说明:</h4>
        <ul>
          <li><code>maintainAspectRatio</code>: 是否保持宽高比 (默认: true)</li>
          <li><code>maxWidthRatio</code>: 最大宽度比例 0-1 (默认: 0.8)</li>
          <li><code>maxHeightRatio</code>: 最大高度比例 0-1 (默认: 0.9)</li>
          <li><code>verticalOffset</code>: 垂直偏移像素 (默认: 0)</li>
          <li><code>horizontalOffset</code>: 水平偏移像素 (默认: 0)</li>
        </ul>
      </div>
    </div>
  );
}

export default CenteringExample;