import React from "react";
import "./AdminSidebar.scss";

const AdminSidebar = ({ activeSection, onSectionChange }) => {
  const handleSectionClick = (section) => {
    onSectionChange(section);
  };

  return (
    <div className="admin-sidebar">
      <nav>
        <ul>
          <li className={activeSection === "users" ? "active" : ""}>
            <button onClick={() => handleSectionClick("users")}>Users</button>
          </li>
          <li className={activeSection === "products" ? "active" : ""}>
            <button onClick={() => handleSectionClick("products")}>
              Products
            </button>
          </li>
          <li className={activeSection === "orders" ? "active" : ""}>
            <button onClick={() => handleSectionClick("orders")}>Orders</button>
          </li>
          <li className={activeSection === "members" ? "active" : ""}>
            <button onClick={() => handleSectionClick("members")}>
              Members
            </button>
          </li>
          <li className={activeSection === "member-products" ? "active" : ""}>
            <button onClick={() => handleSectionClick("member-products")}>
              Member-Products
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
