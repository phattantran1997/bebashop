
import React, { useState } from "react";
import AdminProductDetails from "../AdminProductDetails/AdminProductDetails";
import ProductList from "../ProductList/AdminProductList";
import AdminOrderList from "../Orders/AdminOrderList";
import OrderDetails from "../Orders/OrderDetails";
import "./AdminContainer.scss";
import AdminSidebar from './AdminSidebar/AdminSidebar';
import AdminUser from '../Users/AdminUsers';
import MemberList from '../Member/MemberList';
import MemberProductList from '../Member-Product/MemberProductList';
const AdminContainer = (props) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProductList, setShowProductList] = useState(true);
  const [activeSection, setActiveSection] = useState('products');


  const handleProductDetails = (product) => {
    setSelectedProduct(product);
  };
  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
  };
  const onBackClickToProductList = () => {
    setSelectedProduct(null);
    setSelectedOrder(null);
    setShowProductList(true)
  }
  const onBackClickToOrderDetails = () => {
    setSelectedProduct(null);
    setSelectedOrder(null);
    setShowProductList(false)
  }

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === 'products') {
      setShowProductList(true);
      setSelectedProduct(null);
      setSelectedOrder(null);
    } else if (section === 'orders') {
      setShowProductList(false);
      setSelectedProduct(null);
      setSelectedOrder(null);
    }
    else if (section === 'user') {
      setShowProductList(false);
      setSelectedProduct(null);
      setSelectedOrder(null);
    }
    else if (section === 'members') {
      setShowProductList(false);
      setSelectedProduct(null);
      setSelectedOrder(null);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <AdminUser />;
      case 'products':
        return selectedProduct ? (
          <div className="details-container">
            <AdminProductDetails productId={selectedProduct.productId} onBackClick={onBackClickToProductList} />
          </div>
        ) : (
          <div className="product-list-container">
            <ProductList handleProductDetails={handleProductDetails} />
          </div>
        );
      case 'orders':
        return selectedOrder ? (
          <div className="details-container">
            <OrderDetails orderId={selectedOrder.orderId} onBackClick={onBackClickToOrderDetails} />
          </div>
        ) : (
          <div className="order-list-container">
            <AdminOrderList handleOrderDetails={handleOrderDetails} />
          </div>
        );
      case 'members':
        return <MemberList />;
      case 'member-products':
        return <MemberProductList />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminContainer;
