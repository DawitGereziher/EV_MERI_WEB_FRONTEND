const UsageChart = ({ data = [] }) => {
  const generateChartPath = (dataPoints) => {
    if (!dataPoints || dataPoints.length === 0) {
      return "M 40 180 L 360 180";
    }

    const maxValue = Math.max(...dataPoints.map(d => d.usage || 0));
    const minValue = Math.min(...dataPoints.map(d => d.usage || 0));
    const range = maxValue - minValue || 1;

    const chartWidth = 320;
    const chartHeight = 160;
    const startX = 40;
    const startY = 50;

    const stepX = chartWidth / Math.max(dataPoints.length - 1, 1);

    let path = "";
    dataPoints.forEach((point, index) => {
      const x = startX + (stepX * index);
      const normalizedValue = range > 0 ? (point.usage - minValue) / range : 0.5;
      const y = startY + chartHeight - (normalizedValue * chartHeight);

      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  };

  const generateDataPoints = (dataPoints) => {
    if (!dataPoints || dataPoints.length === 0) return [];

    const maxValue = Math.max(...dataPoints.map(d => d.usage || 0));
    const minValue = Math.min(...dataPoints.map(d => d.usage || 0));
    const range = maxValue - minValue || 1;

    const chartWidth = 320;
    const chartHeight = 160;
    const startX = 40;
    const startY = 50;

    const stepX = chartWidth / Math.max(dataPoints.length - 1, 1);

    return dataPoints.map((point, index) => {
      const x = startX + (stepX * index);
      const normalizedValue = range > 0 ? (point.usage - minValue) / range : 0.5;
      const y = startY + chartHeight - (normalizedValue * chartHeight);

      return { x, y, usage: point.usage, hour: point.hour };
    });
  };

  const chartPath = generateChartPath(data);
  const dataPoints = generateDataPoints(data);
  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.usage || 0)) : 100;

  return (
    <div className="usage-chart">
      <div className="chart-header">
        <h3>Hourly Usage (kWh)</h3>
      </div>

      <div className="chart-container">
        <svg viewBox="0 0 400 250" className="chart-svg">
          {/* Chart background */}
          <rect width="400" height="250" fill="#1a1a1a" rx="8"/>

          {/* Grid lines */}
          <g stroke="#333" strokeWidth="1" opacity="0.3">
            {/* Horizontal grid lines */}
            <line x1="40" y1="50" x2="360" y2="50"/>
            <line x1="40" y1="90" x2="360" y2="90"/>
            <line x1="40" y1="130" x2="360" y2="130"/>
            <line x1="40" y1="170" x2="360" y2="170"/>
            <line x1="40" y1="210" x2="360" y2="210"/>

            {/* Vertical grid lines */}
            {[80, 120, 160, 200, 240, 280, 320].map(x => (
              <line key={x} x1={x} y1="30" x2={x} y2="210"/>
            ))}
          </g>

          {/* Glow effect for the line */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Chart line */}
          <path
            d={chartPath}
            fill="none"
            stroke="#4ECDC4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          <g fill="#4ECDC4">
            {dataPoints.map((point, index) => (
              <circle key={index} cx={point.x} cy={point.y} r="4"/>
            ))}
          </g>

          {/* Y-axis labels */}
          <g fill="#888" fontSize="12" textAnchor="end">
            <text x="35" y="55">{Math.round(maxValue)}</text>
            <text x="35" y="95">{Math.round(maxValue * 0.8)}</text>
            <text x="35" y="135">{Math.round(maxValue * 0.6)}</text>
            <text x="35" y="175">{Math.round(maxValue * 0.4)}</text>
            <text x="35" y="215">{Math.round(maxValue * 0.2)}</text>
          </g>

          {/* X-axis labels */}
          <g fill="#888" fontSize="12" textAnchor="middle">
            {dataPoints.filter((_, index) => index % 3 === 0).map((point, index) => (
              <text key={index} x={point.x} y="235">
                {point.hour}:00
              </text>
            ))}
          </g>

          {/* Glow effect */}
          <path
            d={chartPath}
            fill="none"
            stroke="#4ECDC4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            opacity="0.7"
          />
        </svg>
      </div>
    </div>
  );
};

export default UsageChart;
