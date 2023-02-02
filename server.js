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
  // Call mainMenu function
  mainMenu();
});

// Main menu
function mainMenu() {
  inquirer
    .prompt({
      type: "list",
      name: "userMenu",
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
    // Switch statement to call functions based on user input
    .then((response) => {
      switch (response.userMenu) {
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
  const emplyQuery = "SELECT * FROM employee";
  connection.query("SELECT * FROM employee", (err, res) => {
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
        name: "id",
        message: "What is the new department ID?",
      },
      {
        type: "input",
        name: "name",
        message: "What is the new department name?",
      },
    ])

    .then((answer) => {
      connection.query(
        "INSERT INTO departments SET ?",
        {
          id: answer.id,
          name: answer.name,
        },
        (err) => {
          if (err) throw err;
          console.log("YOUR DEPARTMENT WAS SUCCESSFULLY ADDED!");
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
        name: "id",
        message: "What is the new role ID?",
      },
      {
        type: "input",
        name: "title",
        message: "What is the new title?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the new role salary?",
      },
      {
        type: "input",
        name: "department_id",
        message: "What is the department ID of new role?",
      },
    ])

    .then((answer) => {
      connection.query(
        "INSERT INTO roles SET ?",
        {
          id: answer.id,
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        (err) => {
          if (err) throw err;
          console.log("YOUR ROLE WAS CREATED SUCCESSFULLY!");
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
        name: "id",
        message: "What is the new employee ID?",
      },
      {
        type: "input",
        name: "first_name",
        message: "What is the new employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the new employee's last name?",
      },
      {
        type: "input",
        name: "role_id",
        message: "What is the new employee's role ID?",
      },
      {
        type: "input",
        name: "manager_id",
        message: "What is the new employee's manager ID?",
      },
    ])

    .then((answer) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          id: answer.id,
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id,
        },
        (err) => {
          if (err) throw err;
          console.log("YOU DID IT! YOUR EMPLOYEE WAS ADDED!");
          mainMenu();
        }
      );
    });
}

// FIX ERROR IN TERMINAL WHEN RUNNING THIS FUNCTION

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
          'SELECT employee, concat(first_name, " ", last_name) AS Employee FROM employee ORDER BY Employee ASC'
        ),
      ])
    )
    .then(([roles, employee]) => {
      // Push roles into roleList array
      roles.forEach((role) => {
        roleList.push(role.title);
      });
      // Push employees into employeeList array
      employee.forEach((employee) => {
        employeeList.push(employee.Employee);
      });
      return Promise.all([roles, employee]);
      // Prompt user to select employee and role
    })
    .then(([roles, employee]) => {
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

          employee.forEach((employee) => {
            if (employee.Employee === answer.employee) {
              employeeID = id;
            }
          });

          // Update the employee role
          connection.query(
            `UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`,
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
