import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import "./MemberProductList.scss";

const MemberProductList = (props) => {
  const [members, setMembers] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [products, setProducts] = useState([]);
  const [productFilter, setProductFilter] = useState("");
  const [memberProductFilter, setMemberProductFilter] = useState("");

  useEffect(() => {
    fetchMembersList();
    fetchProducts();
  }, []);

  const fetchmembers = (memberId = '') => {
    const url = memberId 
      ? `${getBaseURL()}api/member-products/${memberId}`
      : `${getBaseURL()}api/member-products`;
    
    axios
      .get(url)
      .then((res) => {
        const data = res.data;
        setMembers(data);
      })
      .catch((err) => console.log("Couldn't receive list"));
  };

  const fetchMembersList = () => {
    axios
      .get(`${getBaseURL()}api/members`)
      .then((res) => {
        setMembersList(res.data);
      })
      .catch((err) => console.log("Couldn't receive members list"));
  };

  const fetchProducts = () => {
    axios
      .get(`${getBaseURL()}api/products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log("Couldn't receive products list"));
  };

  const addProductToMember = (product) => {
    if (!selectedMemberId) {
      alert("Please select a member first");
      return;
    }

    axios
      .post(`${getBaseURL()}api/member-products/create`, {
        memberId: selectedMemberId,
        productId: product.productId
      })
      .then((res) => {
        console.log("Product added to member");
        fetchmembers(selectedMemberId);
      })
      .catch((err) => console.log("Error adding product to member"));
  };

  const handleMemberChange = (e) => {
    const memberId = e.target.value;
    setSelectedMemberId(memberId);
    const member = membersList.find(
      (m) => m.memberId === parseInt(memberId)
    );
    setSelectedMember(member || null);
    fetchmembers(memberId);
  };

  const deletemember = (memberId, productId) => {
    axios
      .delete(`${getBaseURL()}api/member-products/${memberId}/${productId}`)
      .then((res) => {
        console.log("Deletion successful");
        fetchmembers();
      })
      .catch((err) => console.log("Error"));
  };

  return (
    <div className="member-product-list-container">
      <div className="member-product-list">
        <h1>Member Product List</h1>
        <div className="member-filter">
          <label htmlFor="memberSelect">Filter by Member: </label>
          <select
            id="memberSelect"
            value={selectedMemberId}
            onChange={handleMemberChange}
          >
            <option value="">All Members</option>
            {membersList.map((member) => (
              <option key={member.memberId} value={member.memberId}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        {selectedMember && (
          <div className="member-details-form">
            <h2>Member Details</h2>
            <div className="member-info">
              <div className="info-group">
                <label>Member ID:</label>
                <span>{selectedMember.memberId}</span>
              </div>
              <div className="info-group">
                <label>Name:</label>
                <span>{selectedMember.name}</span>
              </div>
              <div className="info-group">
                <label>Description:</label>
                <span>{selectedMember.description}</span>
              </div>
              <div className="info-group">
                <label>Percent Discount:</label>
                <span>{selectedMember.pdiscount}%</span>
              </div>
              <div className="info-group">
                <label>Cash Discount:</label>
                <span>{selectedMember.cdiscount}$</span>
              </div>
              <div className="info-group">
                <label>Created Date:</label>
                <span>{selectedMember.create_at}</span>
              </div>
              <div className="info-group">
                <label>Updated Date:</label>
                <span>{selectedMember.update_at}</span>
              </div>
            </div>
          </div>
        )}
        <div className="tables-container" style={{ display: 'flex', gap: '20px' }}>
          <div className="products-table" style={{ flex: 1 }}>
            <h2>Available Products</h2>
            <input
              type="text"
              placeholder="Filter products..."
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
            />
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((product) =>
                    product.name.toLowerCase().includes(productFilter.toLowerCase())
                  )
                  .map((product) => {
                    const isAdded = members.some(
                      (member) => member.productId === product.productId
                    );
                    return (
                      <tr key={product.productId}>
                        <td>{product.productId}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>
                          {isAdded ? (
                            <center><span>Đã thêm</span></center>
                          ) : (
                            <button 
                              onClick={() => addProductToMember(product)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: '4px'
                              }}
                            >
                              Add
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="member-products-table" style={{ flex: 1 }}>
            <h2>Member Products</h2>
            <input
              type="text"
              placeholder="Filter member products..."
              value={memberProductFilter}
              onChange={(e) => setMemberProductFilter(e.target.value)}
            />
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Original Price</th>
                  <th>Final Price</th>
                  <th>Discount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {members
                  .filter((member) =>
                    member.productName.toLowerCase().includes(memberProductFilter.toLowerCase())
                  )
                  .map((member) => (
                    <tr key={`${member.memberId}-${member.productId}`}>
                      <td>{member.productId}</td>
                      <td>{member.productName}</td>
                      <td>{member.originalPrice}</td>
                      <td>{(member.originalPrice * (100 - selectedMember?.pdiscount || 0) / 100).toFixed(2)}</td>
                      <td>-{member.originalPrice-(member.originalPrice * (100 - selectedMember?.pdiscount || 0) / 100).toFixed(2)}</td>
                      <td>
                        <button
                         style={{
                          padding: '4px 8px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '4px'
                        }}
                         onClick={() => deletemember(member.memberId, member.productId)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default MemberProductList;
