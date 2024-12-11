import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import "./MemberList.scss";

const MemberList = (props) => {
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [memberDesc, setMemberDesc] = useState("");
  const [memberPDiscount, setMemberPDiscount] = useState(0);
  const [memberCDiscount, setMemberCDiscount] = useState(0);

  const addmember = () => {
    let name = memberName;
    let description = memberDesc;
    let pdiscount = memberPDiscount;
    let cdiscount = memberCDiscount;
    
    if (name !== "" && description !== "" && pdiscount >= 0 && cdiscount >= 0) {
      axios
        .post(`${getBaseURL()}api/members/create`, { 
          name, 
          description, 
          pdiscount, 
          cdiscount 
        })
        .then((res) => {
          console.log("member added");
          fetchmembers();
        })
        .catch((err) => console.log("member added"));
    }
  };

  useEffect(() => {
    fetchmembers();
  }, []);

  const openmemberDetails = (member) => {
    props.handlememberDetails(member);
  };

  const deletemember = (memberId) => {
    axios
      .delete(`${getBaseURL()}api/members/${memberId}`)
      .then((res) => {
        console.log("Deletion successful");
        fetchmembers();
      })
      .catch((err) => console.log("Error"));
  };

  const fetchmembers = () => {
    axios
      .get(`${getBaseURL()}api/members`)
      .then((res) => {
        const data = res.data;
        setMembers(data);
      })
      .catch((err) => console.log("Couldn't receive list"));
  };

  return (
    <div className="member-list-container">
      <div className="add-member-section">
        <label htmlFor="memberName">Member Name:</label>
        <input
          type="text"
          id="memberName"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          placeholder="Member Name"
        />
        <label htmlFor="memberDesc">Description:</label>
        <input
          type="text"
          id="memberDesc"
          value={memberDesc}
          onChange={(e) => setMemberDesc(e.target.value)}
          placeholder="Description"
        />
        <label htmlFor="memberPDiscount">Product Discount (%):</label>
        <input
          type="number"
          id="memberPDiscount"
          value={memberPDiscount}
          onChange={(e) => setMemberPDiscount(e.target.value)}
          placeholder="Product Discount"
        />
        <label htmlFor="memberCDiscount">Category Discount (%):</label>
        <input
          type="number"
          id="memberCDiscount"
          value={memberCDiscount}
          onChange={(e) => setMemberCDiscount(e.target.value)}
          placeholder="Category Discount"
        />
        <button onClick={addmember}>Add Member</button>
      </div>
      <div className="member-list">
        <h1>Member List</h1>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Description</th>
              <th>Product Discount</th>
              <th>Category Discount</th>
              <th>Created Date</th>
              <th>Updated Date</th>
              <th>Details</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.memberId}>
                <td>{member.memberId}</td>
                <td>{member.name}</td>
                <td>{member.description}</td>
                <td>{member.pdiscount}%</td>
                <td>{member.cdiscount}%</td>
                <td>{member.create_at}</td>
                <td>{member.update_at}</td>
                <td>
                  <button onClick={() => openmemberDetails(member)}>
                    Details
                  </button>
                </td>
                <td>
                  <button onClick={() => deletemember(member.memberId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
