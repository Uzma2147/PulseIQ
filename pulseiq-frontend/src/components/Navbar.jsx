import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container">

        <NavLink className="navbar-brand fw-bold" to="/">
          PulseIQ
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/predict">
                Predict Churn
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/explanation">
                Customer Explanation
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/customers">
                Risk Table
              </NavLink>
            </li>

          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;