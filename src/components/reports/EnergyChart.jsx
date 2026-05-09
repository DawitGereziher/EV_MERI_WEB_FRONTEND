import { useEffect, useRef } from 'react';

const EnergyChart = ({ data }) => {
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
    const minValue = Math.min(...data.map(d => d.value || 0)) || 0;
    const valueRange = maxValue - minValue || 1;
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      const value = maxValue - (valueRange / 5) * i;
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(0), padding - 10, y + 4);
    }
    
    const stepX = chartWidth / (data.length - 1);
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = padding + stepX * index;
      const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    data.forEach((point, index) => {
      const x = padding + stepX * index;
      const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
      
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(point.day, x, height - padding + 20);
    });
    
  }, [data]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Daily Energy Dispensed (kWh)</h3>
        <div className="empty-chart">
          <p>No energy data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Daily Energy Dispensed (kWh)</h3>
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="energy-chart"
      />
    </div>
  );
};

export default EnergyChart;
