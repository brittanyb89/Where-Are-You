const { connectionProps, connection } = require("./config/connection");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const promisemysql = require("promise-mysql");

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
        "Update an employee manager",
        "Delete an employee",
        "Delete a role",
        "Delete a department",
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

        case "Update an employee manager":
          updateManager();
          break;

        case "Delete an employee":
          deleteEmployee();
          break;

        case "Delete a role":
          deleteRole();
          break;

        case "Delete a department":
          deleteDepartment();
          break;

        case "Exit":
          connection.end();
          console.log("Thank you for using Employee Tracker!");
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

// Function to update an employee role
function updateEmployeeRole() {
  // Create employee and role arrays
  let employeeArray = [];
  let roleArray = [];

  // Create connection using promise-sql
  promisemysql
    .createConnection(connectionProps)
    .then((connection) => {
      return Promise.all([
        // Query to get all employees
        connection.query("SELECT id, title FROM roles ORDER BY title ASC"),
        connection.query(
          "SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC"
        ),
      ]);
    })
    .then(([roles, employees]) => {
      // Place roles into array
      for (i = 0; i < roles.length; i++) {
        roleArray.push(roles[i].title);
      }

      // Place employee into array
      for (i = 0; i < employees.length; i++) {
        employeeArray.push(employees[i].Employee);
      }

      return Promise.all([roles, employees]);
    })
    .then(([roles, employees]) => {
      // Prompt user to select employee and role
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: employeeArray,
          },
          {
            type: "list",
            name: "role",
            message: "What is the employee's new role?",
            choices: roleArray,
          },
        ])
        .then((answer) => {
          let roleID;
          let employeeID;

          // Get role ID
          for (i = 0; i < roles.length; i++) {
            if (answer.role === roles[i].title) {
              roleID = roles[i].id;
            }
          }

          // Get employee ID
          for (i = 0; i < employees.length; i++) {
            if (answer.employee === employees[i].Employee) {
              employeeID = employees[i].id;
            }
          }

          // update employee with new role
          connection.query(
            `UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`,
            (err, res) => {
              if (err) throw err;
              console.log(
                `\n ${answer.employee}'s role was updated to ${answer.role}!.....\n`
              );
              mainMenu();
            }
          );
        });
    });
}

// Function to update an employee manager
function updateManager() {
  // Create global array for employee
  let employeeArray = [];

  // Query to get all employees
  connection.query(
    "SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC",
    (err, employees) => {
      // Place employee into array
      for (i = 0; i < employees.length; i++) {
        employeeArray.push(employees[i].Employee);
      }

      // Prompt user to select employee and manager
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: employeeArray,
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the employee's new manager?",
            choices: employeeArray,
          },
        ])
        .then((answer) => {
          let employeeID;
          let managerID;

          // Get manager ID
          for (i = 0; i < employees.length; i++) {
            if (answer.manager === employees[i].Employee) {
              managerID = employees[i].id;
            }
          }

          // Get employee ID
          for (i = 0; i < employees.length; i++) {
            if (answer.employee === employees[i].Employee) {
              employeeID = employees[i].id;
            }
          }

          // update employee with new manager ID
          connection.query(
            `UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`,
            (err, res) => {
              if (err) throw err;
              console.log(
                `\n ${answer.employee}'s manager was updated to ${answer.manager}!.....\n`
              );
              mainMenu();
            }
          );
        });
    }
  );
}

// Function to delete an employee
function deleteEmployee() {
  // Create global array for employee
  let employeeArray = [];

  // Query to get all employees
  connection.query(
    "SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC",
    (err, employees) => {
      // Place employee into array
      for (i = 0; i < employees.length; i++) {
        employeeArray.push(employees[i].Employee);
      }

      // Prompt user to select employee
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to delete?",
            choices: employeeArray,
          },
          {
            type: "list",
            name: "yesNo",
            message: "Are you sure you want to delete this employee?",
            choices: ["Yes", "No"],
          },
        ])
        .then((answer) => {
          if (answer.yesNo === "Yes") {
            let employeeID;

            // Get employee ID
            for (i = 0; i < employees.length; i++) {
              if (answer.employee === employees[i].Employee) {
                employeeID = employees[i].id;
              }
            }

            // Delete employee
            connection.query(
              `DELETE FROM employee WHERE id = ${employeeID}`,
              (err, res) => {
                if (err) throw err;
                console.log(
                  `\n ${answer.employee} was sucessfully deleted!.....\n`
                );
                mainMenu();
              }
            );
          } else if (answer.yesNo === "No") {
            mainMenu();
          }
        });
    }
  );
}

// Function to delete a role
function deleteRole() {
  // Create global array for role
  let roleArray = [];

  // Query to get all roles
  connection.query("SELECT * FROM roles", (err, roles) => {
    // Place roles into array
    for (i = 0; i < roles.length; i++) {
      roleArray.push(roles[i].title);
    }

    // Prompt user to select role
    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "Which role would you like to delete?",
          choices: roleArray,
        },
        {
          type: "list",
          name: "yesNo",
          message: "Are you sure you want to delete this role?",
          choices: ["Yes", "No"],
        },
      ])
      .then((answer) => {
        if (answer.yesNo === "Yes") {
          let roleID;

          // Get role ID
          for (i = 0; i < roles.length; i++) {
            if (answer.role === roles[i].title) {
              roleID = roles[i].id;
            }
          }

          // Delete role
          connection.query(
            `DELETE FROM roles WHERE id = ${roleID}`,
            (err, res) => {
              if (err) throw err;
              console.log(`\n ${answer.role} was sucessfully deleted!.....\n`);
              mainMenu();
            }
          );
        } else if (answer.yesNo === "No") {
          mainMenu();
        }
      });
  });
}

// Function to delete a department
function deleteDepartment() {
  // Create global array for department
  let departmentArray = [];

  // Query to get all departments
  connection.query("SELECT * FROM departments", (err, departments) => {
    // Place departments into array
    for (i = 0; i < departments.length; i++) {
      departmentArray.push(departments[i].name);
    }

    // Prompt user to select department
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Which department would you like to delete?",
          choices: departmentArray,
        },
        {
          type: "list",
          name: "yesNo",
          message: "Are you sure you want to delete this department?",
          choices: ["Yes", "No"],
        },
      ])
      .then((answer) => {
        if (answer.yesNo === "Yes") {
          let departmentID;

          // Get department ID
          for (i = 0; i < departments.length; i++) {
            if (answer.department === departments[i].name) {
              departmentID = departments[i].id;
            }
          }

          // Delete department
          connection.query(
            `DELETE FROM departments WHERE id = ${departmentID}`,
            (err, res) => {
              if (err) throw err;
              console.log(
                `\n ${answer.department} was sucessfully deleted!.....\n`
              );
              mainMenu();
            }
          );
        } else if (answer.yesNo === "No") {
          mainMenu();
        }
      });
  });
}
