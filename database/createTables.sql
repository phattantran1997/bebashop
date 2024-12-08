CREATE TABLE users (
	userId INT(5) AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(30) NOT NULL,
	lname VARCHAR(30) NOT NULL,
	email VARCHAR(50),
    password VARCHAR(200),
    isAdmin BOOL,
    address VARCHAR(500), -- New column for user's address
    phoneNumber VARCHAR(15), -- New column for user's phone number
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product (
	productId INT(5) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description TINYTEXT,
    price DECIMAL(10,2),
    inventoryQuantity INT, -- New column for inventory quantity
    unit VARCHAR(20), -- New column for unit (e.g., piece, kg, etc.)
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
    imageId INT(5) AUTO_INCREMENT PRIMARY KEY,
    productId INT(5),
    imageUrl VARCHAR(500), -- Column to store image URLs
    FOREIGN KEY (productId) REFERENCES product (productId) ON DELETE CASCADE
);

CREATE TABLE special_users (
    userId INT(5),
    productId INT(5),
    bestPrice DECIMAL(10,2), -- Special price for users
    PRIMARY KEY (userId, productId),
    FOREIGN KEY (userId) REFERENCES users (userId),
    FOREIGN KEY (productId) REFERENCES product (productId)
);

CREATE TABLE shopingCart (
	userId INT(5),
    productId INT(5),
    quantity INT,
    PRIMARY KEY (userId, productId),
    FOREIGN KEY (userId) REFERENCES users (userId),
    FOREIGN KEY (productId) REFERENCES product (productId)
);

CREATE TABLE orders (
	orderId INT(10) AUTO_INCREMENT PRIMARY KEY,
    userId INT(5),
    address VARCHAR(500),
    totalPrice DECIMAL(10,2),
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (userId)
);

CREATE TABLE productsInOrder (
	orderId INT(5),
    productId INT(5),
    quantity INT,
    totalPrice DECIMAL(10,2),
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES orders (orderId),
    FOREIGN KEY (productId) REFERENCES product (productId)
);
