productsCREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
	ItemID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(100),
    DepartmentName VARCHAR(100),
    Price DECIMAL (10, 2),
    StockQuantity INT
);

INSERT INTO products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ("DSLR Camera", "Electronics", 759.99, 2);

INSERT INTO products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ("Lakers Lanyard", "Accessories", 19.99, 65);

INSERT INTO products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ("Kobe Bryant Jersey", "Clothing", 124.99, 8);

INSERT INTO products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ("Mickey Mouse Shirt", "Clothing", 19.99, 145);

INSERT INTO products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ("Hershel Backpack", "Accessories", 99.99, 27);