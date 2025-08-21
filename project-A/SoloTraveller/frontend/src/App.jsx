import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Matches from './pages/Matches';

function App() {
  return (
    <div>
      <nav style={{ padding: '10px' }}>
        <Link to="/">Home</Link> | <Link to="/create-post">Create Post</Link> | <Link to="/matches">Matches</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/matches" element={<Matches />} />
      </Routes>
    </div>
  );
}

export default App;
