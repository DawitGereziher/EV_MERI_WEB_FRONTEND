import { useEffect, useRef } from 'react';

const FaultOccurrences = ({ data }) => {
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

    const maxValue = Math.max(...data.map(d => d.faults || 0)) || 1;
    const minValue = 0;
    const valueRange = maxValue - minValue || 1;
    
    ctx.strokeStyle = '#fee2e2';
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
    
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = padding + stepX * index;
      const y = padding + chartHeight - ((point.faults - minValue) / valueRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    data.forEach((point, index) => {
      const x = padding + stepX * index;
      const y = padding + chartHeight - ((point.faults - minValue) / valueRange) * chartHeight;
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(point.month, x, height - padding + 20);
    });
    
  }, [data]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="fault-occurrences">
        <h3>Monthly Fault Occurrences</h3>
        <div className="empty-chart">
          <p>No fault data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fault-occurrences">
      <h3>Monthly Fault Occurrences</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={250}
        className="fault-chart"
      />
    </div>
  );
};

export default FaultOccurrences;
