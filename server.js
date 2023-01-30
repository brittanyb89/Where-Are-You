// Import and require mysql2
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const promisemysql = require("promise-mysql");
const { connectionProps, connection } = require("./config/connection");

const PORT = process.env.PORT || 3001;

// Establish connection to database
connection.connect((err) => {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});

// Main menu
function mainMenu() {
  inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.menu) {
        case "View all departments":
          viewDepartments();
          break;

        case "View all roles":
          viewRoles();
          break;

        case "View all employees":
          viewEmployees();
          break;

        case "Add a department":
          addDepartment();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "Update an employee role":
          updateEmployeeRole();
          break;

        case "Exit":
          connection.end();
          break;

        default:
      }
    });
}

// Function to view all departments
function viewDepartments() {
  const deptQuery = "SELECT * FROM departments";
  connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}

// Function to view all roles
function viewRoles() {
  const rolesQuery = "SELECT * FROM roles";
  connection.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}

// Function to view all employees
function viewEmployees() {
  const emplyQuery = "SELECT * FROM employees";
  connection.query("SELECT * FROM employees", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_id",
        message: "What is the new department ID?",
      },
      {
        type: "input",
        name: "department_name",
        message: "What is the new department name?",
      },
    ])

    .then((answer) => {
      connection.query(
        "INSERT INTO departments SET ?",
        {
          dept_id: answer.department_id,
          dept_name: answer.department_name,
        },
        (err) => {
          if (err) throw err;
          console.log("Your department was created successfully!");
          mainMenu();
        }
      );
    });
}

// Function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role_id",
        message: "What is the new role ID?",
      },
      {
        type: "input",
        name: "role_title",
        message: "What is the new role title?",
      },
      {
        type: "input",
        name: "role_salary",
        message: "What is the new role salary?",
      },
      {
        type: "input",
        name: "role_department",
        message: "What is the department ID of new role?",
      },
    ])

    .then((answer) => {
      connection.query(
        "INSERT INTO roles SET ?",
        {
          role_id: answer.role_id,
          title: answer.role_title,
          salary: answer.role_salary,
          department_id: answer.role_department,
        },
        (err) => {
          if (err) throw err;
          console.log("Your role was created successfully!");
          mainMenu();
        }
      );
    });
}

// Function to add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employee_id",
        message: "What is the new employee ID?",
      },
      {
        type: "input",
        name: "employee_first_name",
        message: "What is the new employee's first name?",
      },
      {
        type: "input",
        name: "employee_last_name",
        message: "What is the new employee's last name?",
      },
      {
        type: "input",
        name: "employee_role",
        message: "What is the new employee's role ID?",
      },
      {
        type: "input",
        name: "employee_manager",
        message: "What is the new employee's manager ID?",
      },
    ])

    .then((answer) => {
      connection.query(
        "INSERT INTO employees SET ?",
        {
          id: answer.employee_id,
          first_name: answer.employee_first_name,
          last_name: answer.employee_last_name,
          role_id: answer.employee_role,
          manager_id: answer.employee_manager,
        },
        (err) => {
          if (err) throw err;
          console.log("Your employee was created successfully!");
          mainMenu();
        }
      );
    });
}

// Function to update an employee role
function updateEmployeeRole() {
  // Array for employee and role
  const employeeList = [];
  const roleList = [];

  // Create connection using promise-mysql
  promisemysql
    .createConnection(connectionProps)
    .then((conn) =>
      Promise.all([
        // Query to get all employees
        conn.query("SELECT id, title FROM roles ORDER BY title ASC"),
        conn.query(
          'SELECT employee_id, concat(first_name, " ", last_name) AS Employees FROM employees ORDER BY Employees ASC'
        ),
      ])
    )
    .then(([roles, employees]) => {
      // Push roles into roleList array
      roles.forEach((role) => {
        roleList.push(role.title);
      });
      // Push employees into employeeList array
      employees.forEach((employee) => {
        employeeList.push(employee.Employees);
      });
      return Promise.all([roles, employees]);
      // Prompt user to select employee and role
    })
    .then(([roles, employees]) => {
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: employeeList,
          },
          {
            type: "list",
            name: "role",
            message: "What is the new role?",
            choices: roleList,
          },
        ])
        .then((answer) => {
          // Get the role ID and employee ID
          let roleID;
          let employeeID;

          roles.forEach((role) => {
            if (role.title === answer.role) {
              roleID = role.id;
            }
          });

          employees.forEach((employee) => {
            if (employee.Employees === answer.employee) {
              employeeID = employee.employee_id;
            }
          });

          // Update the employee role
          connection.query(
            `UPDATE employees SET role_id = ${roleID} WHERE employee_id = ${employeeID}`,
            (err, res) => {
              if (err) throw err;

              // confirm update
              console.log(
                `${answer.employee}'s role has been updated to ${answer.role}.`
              );
              mainMenu();
            }
          );
        });
    });
}
