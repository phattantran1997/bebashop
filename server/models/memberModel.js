const pool = require("../database/connection");

// Constructor
const Member = function(member) {
    this.memberId = member.memberId;
    this.name = member.name;
    this.description = member.description;
    this.pdiscount = member.pdiscount;
    this.cdiscount = member.cdiscount;
};

Member.create = (newMember, result) => {
    pool.query("INSERT INTO member SET ?", newMember, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created member: ", { ...newMember });
        result(null, { ...newMember });
    });
};

Member.findById = (memberId, result) => {
    pool.query(`SELECT * FROM member WHERE memberId = ?`, memberId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};

Member.getAll = result => {
    pool.query("SELECT * FROM member", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Member.updateById = (memberId, member, result) => {
    pool.query(
        "UPDATE member SET name = ?, description = ?, pdiscount = ?, cdiscount = ? WHERE memberId = ?",
        [member.name, member.description, member.pdiscount, member.cdiscount, memberId],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, { memberId: memberId, ...member });
        }
    );
};

Member.remove = (memberId, productId, result) => {
    pool.query("DELETE FROM member WHERE memberId = ? AND productId = ?", [memberId, productId], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res);
    });
};

module.exports = Member; 