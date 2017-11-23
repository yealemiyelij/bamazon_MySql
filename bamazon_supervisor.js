var mysql = require('mysql');
var prompt = require('prompt');
var colors = require('colors/safe');
var Table = require('cli-table');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon_db'
});

connection.connect();

var supervisor_options = {
    properties: {
        sup_options: {
            description: colors.magenta.bold('select what you want to do on the options: 1) View products sales by department 2) Create new department')
        },
    },
};

// start the prompt 
prompt.start();

// this prompt above and below states what will be done based on what the number the user inputs
prompt.get(supervisor_options, function (err, res) {
    if (res.sup_options == 1) {
        view_productSales();
    } else if (res.sup_options == 2) {
        create_newDepartment();
    } else {
        console.log("You have picked an invalid choice")
        connection.end()
    }
});
// function for option 1 to view product sales
var view_productSales = function () {
    // creates a table for the data to be dispalyed in the node app
    var table = new Table({
        head: [colors.magenta.bold('Department_Id'), colors.magenta.bold('Department_Name'), colors.magenta.bold('OverHead_Cost'), colors.magenta.bold('Total_Sales'), colors.magenta.bold('Total_Profit')],
        style: {
            compact: false,
            colAligns: ['center']
        }
    });
    console.log('');
    console.log(colors.magenta.bold('View Product Sales by Department'))

    //connect to bamazon_db and returning the information
    connection.query('SELECT * FROM Total_Profit', function (error, result) {
        if (error) console.log("Error: " + error);

        // this loops through the data pulled out from Total_Profit and push to table displayed in the node app for view_productSales function
        for (i = 0; i < result.length; i++) {
            var res = result[i]
            table.push(
                [res.Department_Id, res.Department_Name, res.OverHead_Cost, res.Total_Sales, res.Total_Profit]
            )
        }
        console.log(' ');
        // To stringfy a table for results iterated by the above function and to display view_productSales table in the node app
        console.log(table.toString());
        connection.end();

    })

};

var create_newDepartment = function () {
    var new_dept = [];

    var new_department = {
        properties: {
            new_dept_name: {
                description: colors.magenta.bold('Please enter the name of new department you would like to add in the department table.')
            },
            newOver_head: {
                description: colors.magenta.bold('What are the overhead costs this department in the department table?')
            },
        }
    }

    prompt.start();
    // To get the information the user entered for those prompts listed above

    prompt.get(new_department, function (error, result) {
        var new_deptInfo = {
            deptName: result.new_deptName,
            prompted_overHead: result.newOver_head,
            autoTotalSales: 0,
        };
        // pushes users response to new_dept array
        new_dept.push(new_deptInfo);

        connection.query('INSERT INTO Departments (Department_Name, OverHead_Cost, Total_Sales) VALUES (?, ?, ?);', [new_dept[0].deptName, new_dept[0].prompted_overHead, new_dept[0].autoTotalSales], function (error, result) {
            if (error) {
                console.log('Error: ' + error);
                connection.end();
            } else {
                console.log('');
                console.log(colors.magenta.bold('New Department Successfully Created!'));
                console.log(' ');
                connection.end();
            }

        })
    })
};