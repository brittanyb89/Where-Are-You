INSERT INTO departments (id, name)
VALUES
(100, 'Accounting'),
(200, 'Marketing'),
(300, 'Sales'),
(400, 'IT'),
(500, 'HR');

INSERT INTO roles (id, title, salary, department_id)
VALUES
(123, 'Accountant', 10000, 100),
(345, 'Marketing Manager', 15000, 200),
(567, 'Sales Manager', 20000, 300),
(789, 'IT Manager', 25000, 400),
(901, 'HR Manager', 30000, 500);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(098, 'John', 'Smith', 123, 900),
(765, 'Mary', 'Johnson', 345, 903),
(432, 'Steve', 'Williams', 567, 989),
(109, 'Bill', 'Jones', 789, 502),
(876, 'Sarah', 'Brown', 012, 132);
