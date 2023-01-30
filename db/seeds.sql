INSERT INTO 'department' ('name')
VALUES
('Accounting'),
('Marketing'),
('Sales'),
('IT'),
('HR');

INSERT INTO 'role' ('title', 'salary', 'department_id')
VALUES
('Accountant', 10000, 1),
('Marketing Manager', 15000, 2),
('Sales Manager', 20000, 3),
('IT Manager', 25000, 4),
('HR Manager', 30000, 5);

INSERT INTO 'employee' ('name', 'department_id', 'salary')
VALUES
('John', 1, 10000),
('Mary', 2, 15000),
('Steve', 3, 20000),
('Bill', 4, 25000);