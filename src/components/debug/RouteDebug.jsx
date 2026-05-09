import { useLocation } from 'react-router-dom';

const RouteDebug = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm max-w-sm">
      <h3 className="font-bold mb-2">Route Debug Info</h3>
      <p><strong>Pathname:</strong> {location.pathname}</p>
      <p><strong>Search:</strong> {location.search}</p>
      <p><strong>Hash:</strong> {location.hash}</p>
      <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
      <p><strong>Timestamp:</strong> {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

export default RouteDebug;
