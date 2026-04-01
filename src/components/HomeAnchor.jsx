import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const HomeAnchor = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user navigates directly to a sub-page or reloads on one,
    // we redirect them back to the Home page to keep the marketplace flow centric.
    // We only do this if they are NOT intentionally on the Admin path.
    if (location.pathname !== '/' && !location.pathname.startsWith('/admin')) {
      navigate('/', { replace: true });
    }
  }, []); // Only run on mount (which happens on refresh/direct entry)

  return children;
};

export default HomeAnchor;
