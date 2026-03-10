CREATE DATABASE registration_db;

USE registration_db;

CREATE TABLE users(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
age INT,
email VARCHAR(100),
phone VARCHAR(15),
gender VARCHAR(10)
);