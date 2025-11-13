import { Routes, Route, Link } from "react-router-dom";
import Blog from "./Blog";
import BlogPost from "./BlogPost";

function Home() {
  return (
    <div style={{ padding: "100px 20px", textAlign: "center" }}>
      <h1>Welcome to My Portfolio</h1>
      <p>This is your home page placeholder.</p>
      <Link
        to="/blog"
        style={{
          display: "inline-block",
          marginTop: "20px",
          background: "#6b46c1",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Visit My Blog
      </Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} /> {/* new route */}
    </Routes>
  );
}

export default App;
