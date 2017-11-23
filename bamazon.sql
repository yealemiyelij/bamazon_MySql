DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

DROP TABLE IF EXISTS Products;

CREATE TABLE Products
(
    Item_ID integer NOT NULL,
    Product_Name varchar(30) NOT NULL,
    Department_Name varchar(30) NOT NULL,
    Price DECIMAL(5,2) NOT NULL,
    Stock_Quantity integer NOT NULL,
    PRIMARY KEY (Item_ID)
);

INSERT INTO Products
    (Item_ID, Product_Name, Department_Name, Price, Stock_Quantity)
VALUES
    (
        123456,
        'Ingera',
        'Food',
        10.59,
        23);

INSERT INTO Products
    (Item_ID, Product_Name, Department_Name, Price, Stock_Quantity)
VALUES
    (
        678901,
        'Tenefanef',
        'Mens Clothing',
        159.99,
        15);

INSERT INTO Products
    (Item_ID, Product_Name, Department_Name, Price, Stock_Quantity)
VALUES
    (
        234567,
        'Doro_Wot',
        'Food',
        35.99,
        11);

INSERT INTO Products
    (Item_ID, Product_Name, Department_Name, Price, Stock_Quantity)
VALUES
    (
        789123,
        'Ambasel_kignit',
        'Music',
        29.99,
        74);

INSERT INTO Products
    (Item_ID, Product_Name, Department_Name, Price, Stock_Quantity)
VALUES
    (
        345678,
        'Habesha_Kemis',
        'Womens Clothing',
        199.99,
        27);

INSERT INTO Products
    (Item_ID, Product_Name, Department_Name, Price, Stock_Quantity)
VALUES
    (
        891234,
        'Raya_Kemis',
        'Womens Clothing',
        139.99,
        17);

INSERT INTO Products
    (Item_ID, Product_Name, Department_Name, Price, Stock_Quantity)
VALUES
    (
        456789,
        'YeGuraghe_Kitfo and Kocho',
        'Food',
        39.99,
        11);

INSERT INTO Products
    (Item_ID, Product_Name, Department_Name, Price, Stock_Quantity)
VALUES
    (
        912345,
        'Biliko_Gabi',
        'Mens Clothing',
        109,
        81);

INSERT INTO Products
    (Item_ID, Product_Name, Department_Name, Price, Stock_Quantity)
VALUES
    (
        567890,
        'Ethiopian Nyala Ciggaratte',
        'Entertainment',
        10.99,
        250);

INSERT INTO Products
    (Item_ID, Product_Name, Department_Name, Price, Stock_Quantity)
VALUES
    (
        012345,
        'Ethiopian Bulla and Kocho',
        'Food',
        29.99,
        19);

USE bamazon_db;
DROP TABLE IF EXISTS Departments;
CREATE TABLE Departments
(
    Department_Id integer NOT NULL
    AUTO_INCREMENT,
    Department_Name varchar
    (30) NOT NULL,
    OverHead_Cost decimal
    (10, 2) NOT NULL,
    Total_Sales decimal
    (10, 2) NOT NULL,
    PRIMARY KEY
    (Department_Id)
);



    INSERT INTO Departments
        (Department_Name, OverHead_Cost, Total_Sales)
    VALUES
        (
            'Food',
            1500,
            0);

    INSERT INTO Departments
        (Department_Name, OverHead_Cost, Total_Sales)
    VALUES
        (
            'Mens Clothing',
            3700,
            0);

    INSERT INTO Departments
        (Department_Name, OverHead_Cost, Total_Sales)
    VALUES
        (
            'Entertainment',
            5400,
            0);

    INSERT INTO Departments
        (Department_Name, OverHead_Cost, Total_Sales)
    VALUES
        (
            'Womens Clothing',
            6500,
            0);

    INSERT INTO Departments
        (Department_Name, OverHead_Cost, Total_Sales)
    VALUES
        (
            'Music',
            13200,
            0);

    INSERT INTO Departments
        (Department_Name, OverHead_Cost, Total_Sales)
    VALUES
        (
            'Software',
            1000,
            0);



    -- //Creating an alias table for Total_Profits (used for supervisors) 

    SHOW TABLES;
    CREATE VIEW bamazon_db.Total_Profit
    AS
        SELECT Department_Id, Department_Name, OverHead_Cost, Total_Sales, Total_Sales-OverHead_Cost AS Total_Profit
        FROM Departments;