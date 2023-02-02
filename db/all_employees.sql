-- inner join query to get all departments, roles, and employees
-- SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name
-- FROM employee
-- INNER JOIN department ON employee.department_id = department.id;
-- INNER JOIN role ON employee.role_id = role.id;


SELECT department.name AS department, role.title, role.salary AS role, employee.first_name, employee.last_name
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
ORDER BY department.name;

-- Path: db\all_employees.sql
-- Compare this snippet from db\seeds.sql
