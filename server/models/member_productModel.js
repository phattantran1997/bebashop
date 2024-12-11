const pool = require("../database/connection");

exports.getAllMemberProducts = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
               mp.*, m.name as memberName,p.name as productName, p.description,
                p.price as originalPrice, mp.price as memberPrice,
                mp.discount as memberDiscount
            FROM 
                member_product mp
            INNER JOIN 
                member m ON mp.memberId = m.memberId
            INNER JOIN 
                product p ON mp.productId = p.productId
        `;
        pool.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.getMemberProductsByMemberId = (memberId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                mp.*, m.name as memberName,p.name as productName, p.description,
                p.price as originalPrice, mp.price as memberPrice,
                mp.discount as memberDiscount
            FROM 
                member_product mp
            INNER JOIN 
                product p ON mp.productId = p.productId
            INNER JOIN 
                member m ON mp.memberId = m.memberId
            WHERE 
                mp.memberId = ?
        `;
        pool.query(query, [memberId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.getMemberProductsByProductId = (productId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                mp.*, m.name as memberName, m.description as memberDescription,
                mp.price as memberPrice, mp.discount as memberDiscount
            FROM 
                member_product mp
            INNER JOIN 
                member m ON mp.memberId = m.memberId
            WHERE 
                mp.productId = ?
        `;
        pool.query(query, [productId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.createMemberProduct = (memberId, productId, price, discount) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "INSERT INTO member_product (memberId, productId, price, discount) VALUES (?, ?, ?, ?);",
            [memberId, productId, price, discount],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

exports.updateMemberProduct = (memberId, productId, price, discount) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "UPDATE member_product SET price = ?, discount = ? WHERE memberId = ? AND productId = ?",
            [price, discount, memberId, productId],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

exports.deleteMemberProduct = (memberId, productId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "DELETE FROM member_product WHERE memberId = ? AND productId = ?",
            [memberId, productId],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};