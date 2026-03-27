import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">⚡ AgilePro</h2>

        <nav>
          <Link
            to="/dashboard"
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            📊 Dashboard
          </Link>

          <Link
            to="/projects"
            className={location.pathname === "/projects" ? "active" : ""}
          >
            📁 Projects
          </Link>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {children}
      </div>

    </div>
  );
};

export default Layout;