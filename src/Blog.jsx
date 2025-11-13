import { motion } from "framer-motion";
import "./App.css";
import {
  FaCalendar,
  FaClock,
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaSearch,
  FaSort,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Blog() {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    date: "",
    readTime: "",
    category: "",
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date"); // "date", "title", "category", "readTime"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc", "desc"
  const [hasLoaded, setHasLoaded] = useState(false);

  // ✅ Load posts only once on component mount
  useEffect(() => {
    const saved = localStorage.getItem("blogPosts");
    if (saved) {
      try {
        const parsedPosts = JSON.parse(saved);
        setBlogPosts(parsedPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
        localStorage.removeItem("blogPosts");
      }
    }
    setHasLoaded(true);
  }, []);

  // ✅ Save posts whenever they change, but only after initial load
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
    }
  }, [blogPosts, hasLoaded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.excerpt) return;

    const post = {
      id: Date.now(),
      ...newPost,
      date: newPost.date || new Date().toISOString().split("T")[0],
      readTime: newPost.readTime || "5 min read",
    };

    setBlogPosts((prev) => [post, ...prev]);
    setNewPost({
      title: "",
      excerpt: "",
      content: "",
      date: "",
      readTime: "",
      category: "",
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSortChange = (criteria) => {
    if (sortBy === criteria) {
      // Toggle order if same criteria
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // New criteria, default to descending for date, ascending for others
      setSortBy(criteria);
      setSortOrder(criteria === "date" ? "desc" : "asc");
    }
  };

  const getSortButtonText = () => {
    const criteriaText = {
      date: "Date",
      title: "Title", 
      category: "Category",
      readTime: "Read Time"
    };
    
    const orderText = sortOrder === "desc" ? "↓" : "↑";
    
    return `${criteriaText[sortBy]} ${orderText}`;
  };

  const filteredPosts = blogPosts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        (post.category && post.category.toLowerCase().includes(search.toLowerCase())) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle empty values
      if (!aValue) aValue = "";
      if (!bValue) bValue = "";
      
      // Special handling for different sort types
      switch (sortBy) {
        case "date":
          // Convert to dates for proper date comparison
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
          
        case "readTime":
          // Extract numbers from "5 min read" format
          const numA = parseInt(aValue) || 0;
          const numB = parseInt(bValue) || 0;
          return sortOrder === "desc" ? numB - numA : numA - numB;
          
        case "title":
        case "category":
        default:
          // String comparison
          if (sortOrder === "desc") {
            return bValue.localeCompare(aValue);
          } else {
            return aValue.localeCompare(bValue);
          }
      }
    });

  return (
    <div className="blog-container">
      <motion.header
        className="blog-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button className="back-button" onClick={() => navigate("/")}>
          <FaArrowLeft />
          Back to Portfolio
        </button>

        <div className="blog-hero">
          <h1>My Blog</h1>
          <p>Thoughts on programming, projects, and technology</p>
        </div>

        <div className="blog-controls">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="sort-controls">
            <div className="sort-buttons">
              <button 
                className={`sort-btn ${sortBy === "date" ? "active" : ""}`}
                onClick={() => handleSortChange("date")}
              >
                Date {sortBy === "date" && (sortOrder === "desc" ? "↓" : "↑")}
              </button>
              <button 
                className={`sort-btn ${sortBy === "title" ? "active" : ""}`}
                onClick={() => handleSortChange("title")}
              >
                Title {sortBy === "title" && (sortOrder === "desc" ? "↓" : "↑")}
              </button>
              <button 
                className={`sort-btn ${sortBy === "category" ? "active" : ""}`}
                onClick={() => handleSortChange("category")}
              >
                Category {sortBy === "category" && (sortOrder === "desc" ? "↓" : "↑")}
              </button>
              <button 
                className={`sort-btn ${sortBy === "readTime" ? "active" : ""}`}
                onClick={() => handleSortChange("readTime")}
              >
                Read Time {sortBy === "readTime" && (sortOrder === "desc" ? "↓" : "↑")}
              </button>
            </div>
          </div>
          
          <button className="new-post-btn" onClick={() => setShowForm(!showForm)}>
            <FaPlus /> New Post
          </button>
        </div>
      </motion.header>

      {showForm && (
        <motion.form
          className="new-post-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newPost.category}
            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
          />
          <textarea
            placeholder="Write a short excerpt..."
            value={newPost.excerpt}
            onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
            required
          />
          <textarea
            placeholder="Full content (optional)"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <input
            type="date"
            value={newPost.date}
            onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Read Time (e.g., 5 min read)"
            value={newPost.readTime}
            onChange={(e) => setNewPost({ ...newPost, readTime: e.target.value })}
          />
          <button type="submit">Add Post</button>
        </motion.form>
      )}

      <section className="blog-posts-section">
        <div className="posts-grid">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="blog-post-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="post-category">{post.category}</div>
              <h2>{post.title}</h2>
              <p className="post-excerpt">{post.excerpt}</p>
              <div className="post-meta">
                <span>
                  <FaCalendar /> {post.date}
                </span>
                <span>
                  <FaClock /> {post.readTime}
                </span>
              </div>
              <div className="post-actions">
                <button
                  className="read-more-btn"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  Read More
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(post.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <motion.div
            className="empty-blog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2>No posts found</h2>
            <p>Try adding one or searching for another keyword.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}

export default Blog;