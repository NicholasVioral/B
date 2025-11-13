import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCalendar, FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import "./App.css";

function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("blogPosts");
    if (saved) {
      const posts = JSON.parse(saved);
      const found = posts.find((p) => p.id === Number(id));
      setPost(found);
    }
  }, [id]);

  if (!post) {
    return (
      <div className="blog-container">
        <button className="back-button" onClick={() => navigate("/blog")}>
          <FaArrowLeft /> Back to Blog
        </button>
        <p style={{ textAlign: "center", marginTop: "50px" }}>Post not found.</p>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <motion.header
        className="blog-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className="back-button" onClick={() => navigate("/blog")}>
          <FaArrowLeft /> Back to Blog
        </button>

        <div className="blog-hero">
          <h1>{post.title}</h1>
          <p className="post-meta">
            <FaCalendar /> {post.date} &nbsp; <FaClock /> {post.readTime}
          </p>
        </div>
      </motion.header>

      <motion.section
        className="blog-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
          {post.content || post.excerpt}
        </p>
      </motion.section>
    </div>
  );
}

export default BlogPost;
