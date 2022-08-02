require('../models/db')
const Employee = require("../models/employees");

setTimeout(()=> {
    const issueDB = [
        {
            id: 1,
            firstName: "demo",
            lastName: "demo",
            age: 22,
            dateOfJoining: new Date("2000-01-01"),
            title: "Manager",
            department: "IT",
            employeeType: "FullTime",
            currentStatus: 1,
          },
          {
            id: 2,
            firstName: "demo2",
            lastName: "demo2",
            age: 24,
            dateOfJoining: new Date("1998-01-01"),
            title: "Manager",
            department: "IT",
            employeeType: "FullTime",
            currentStatus: 1,
          }
    ]
    // Employee.insertMany(issueDB);

    Employee.find({})
        .then((issues)=>{
            console.log(issues)
        })


}, 1000)