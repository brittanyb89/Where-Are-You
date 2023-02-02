# Where-Are-You

![NPM](https://img.shields.io/npm/l/inquirer?style=plastic) ![badmath](https://img.shields.io/github/languages/top/lernantino/badmath) ![npm collaborators](https://img.shields.io/npm/collaborators/inquirer) ![Dependents (via libraries.io)](https://img.shields.io/librariesio/dependents/npm/inquirer) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

## Description

This project allows the user to create a team of employees through the command line. The user is prompted to enter the name, id, email, and role of the employee. Depending on the role, the user will be prompted to enter additional information. The user can add as many employees as they would like.

# User Story

AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business

# Acceptance Criteria

GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database

## Installation/Usage

To install, run the following command:

```bash
npm i
```

npm i inquirer@8.2.4

```
npm i mysql2
```

npm i console.table

````
To create the database, run the following command:

```bash
mysql -u root -p
````

(login with your password)

```
SOURCE db/schema.sql;
```

SOURCE db/insert.sql; // to insert data

```
SELECT database(); // to check if the database is created
```

SOURCE db/delete.sql; // to delete the database

```
SHOW DATABASES; // to show all the databases
```

SELECT \* // to show all the tables

```

## Mock-Up

Run `npm i` to get all the things installed.

`npm start` will watch the `app` directory for any changes using `nodemon`

## License

![NPM](https://img.shields.io/npm/l/inquirer?style=plastic)

MIT License

Copyright (c) 2022 Brittany Burton

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
