import { useEffect, useRef } from 'react';

const RevenueChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const maxValue = Math.max(...data.map(d => d.value || 0)) || 1;
    const stepX = chartWidth / data.length;

    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(padding, padding, chartWidth, chartHeight);

    data.forEach((point, index) => {
      const value = point.value || 0;
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + stepX * index + stepX * 0.2;
      const y = padding + chartHeight - barHeight;
      const barWidth = stepX * 0.6;

      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#0ea5e9');
      gradient.addColorStop(1, '#0284c7');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(point.month, x + barWidth / 2, height - padding + 20);
    });

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      const value = maxValue - (maxValue / 5) * i;
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`$${(value / 1000).toFixed(0)}k`, padding - 10, y + 4);
    }

  }, [data]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p className="text-gray-500">No revenue data available.</p>;
  }

  return (
    <div className="chart-container">
      <h3>Monthly Revenue</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="revenue-chart"
      />
    </div>
  );
};

export default RevenueChart;
