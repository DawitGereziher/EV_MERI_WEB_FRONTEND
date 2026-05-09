import { useEffect, useRef } from 'react';

const SessionDistribution = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || typeof data !== 'object') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    ctx.clearRect(0, 0, width, height);

    const morning = data.morning || 0;
    const afternoon = data.afternoon || 0;
    const total = morning + afternoon;

    if (total === 0) {
      // Draw empty circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#f3f4f6';
      ctx.fill();
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No data', centerX, centerY);
      return;
    }

    const morningAngle = (morning / total) * 2 * Math.PI;
    const afternoonAngle = (afternoon / total) * 2 * Math.PI;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, morningAngle);
    ctx.closePath();
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, morningAngle, morningAngle + afternoonAngle);
    ctx.closePath();
    ctx.fillStyle = '#06b6d4';
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(morningAngle), centerY + radius * Math.sin(morningAngle));
    ctx.stroke();
    
    const morningLabelAngle = morningAngle / 2;
    const morningLabelX = centerX + (radius * 0.7) * Math.cos(morningLabelAngle);
    const morningLabelY = centerY + (radius * 0.7) * Math.sin(morningLabelAngle);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${morning}%`, morningLabelX, morningLabelY);

    const afternoonLabelAngle = morningAngle + afternoonAngle / 2;
    const afternoonLabelX = centerX + (radius * 0.7) * Math.cos(afternoonLabelAngle);
    const afternoonLabelY = centerY + (radius * 0.7) * Math.sin(afternoonLabelAngle);

    ctx.fillText(`${afternoon}%`, afternoonLabelX, afternoonLabelY);
    
  }, [data]);

  return (
    <div className="session-distribution">
      <h3>Session Distribution</h3>
      <canvas
        ref={canvasRef}
        width={250}
        height={200}
        className="distribution-chart"
      />
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Morning Sessions</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#06b6d4' }}></div>
          <span>Afternoon Sessions</span>
        </div>
      </div>
    </div>
  );
};

export default SessionDistribution;
