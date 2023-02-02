-- Drops the employee_db database if it exists
DROP TABLE IF EXISTS employee_db;

-- Creates the employee_db database
CREATE DATABASE employee_db;

-- Use the employee_db database
USE employee_db;

-- Creates the departments table
CREATE TABLE departments (
  id INT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

-- Creates the roles table
CREATE TABLE roles (
  id INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT UNSIGNED NOT NULL REFERENCES departments(id),
  PRIMARY KEY (id)
);

-- Creates the employee table
CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL REFERENCES roles(id),
  manager_id INT UNSIGNED NOT NULL REFERENCES manager(id),
  PRIMARY KEY (id)
);