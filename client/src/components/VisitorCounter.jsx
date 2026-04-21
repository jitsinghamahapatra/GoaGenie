import { useEffect, useState } from 'react';
import { ref, onValue, set, runTransaction } from 'firebase/database';
import { db } from '../firebase';
import './VisitorCounter.css';

export default function VisitorCounter() {
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    const visitorRef = ref(db, 'stats/visitorCount');

    // Increment count on first load in this session
    if (!sessionStorage.getItem('visited')) {
      runTransaction(visitorRef, (currentCount) => {
        return (currentCount || 0) + 1;
      }).then(() => {
        sessionStorage.setItem('visited', 'true');
      });
    }

    // Listen for real-time updates
    const unsubscribe = onValue(visitorRef, (snapshot) => {
      const data = snapshot.val();
      setVisitors(data || 0);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="visitor-counter">
      <span className="visitor-icon">👥</span>
      <span className="visitor-text">Total Visitors: </span>
      <span className="visitor-count">{visitors.toLocaleString()}</span>
    </div>
  );
}
