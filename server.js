const express = require("express");
const { ApolloServer, UserInputError } = require('apollo-server-express');
const fs = require('fs');
require('./models/db')
const Employee = require('./models/employees');
require('dotenv').config();
const dateScalar = require('./GraphQL/GraphQLType')
const Counter = require('./models/counter');

let port = process.env.PORT || '4000';

const resolvers = {
  Date: dateScalar,
  Query: {
    employeeList,
    searchEmployee
  },
  Mutation: {
    employeeAdd,
    employeeUpdate,
    employeeDelete
  },
};

async function employeeList(parent, args, context, info) {
  async function setSearch() {
    if (args.employeeType === "All" || args.employeeType === "UpcomingRetirement") {
      return {};
    } else {
      return { employeeType: args.employeeType };
    }
  }
  const type = await setSearch();
  const employees = await Employee.find(type).then((employees) => {
    async function filterEmployees() {
      employees = await employees.filter((employee) => {
        return employee.age == 64;
      });
      return employees;
    }
    if (args.employeeType == "UpcomingRetirement") {
      return filterEmployees();
    }
    return employees;
  }).catch(error => {
    res.json(error)
  });
  return employees;
}



function searchEmployee(parent, args, context, info) {
  return Employee.findOne(args).then((employee) => {
    return employee;
  }).catch(error => {
    res.json(error)
  });
}

function validateEmployee(employee) {
  const nameRex = new RegExp("/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/");
  const errors = [];
  if (employee.firstName.length < 3) {
    errors.push('Field "First Name" must be at least 3 characters long.');
  } else {
    if (nameRex.test(employee.firstName)) {
      errors.push('Field "First Name" is not valid');
    }
  }

  if (employee.lastName.length < 3) {
    errors.push('Field "Last Name" must be at least 3 characters long.');
  } else {
    if (nameRex.test(employee.lastName)) {
      errors.push('Field "Last Name" is not valid.');
    }
  }

  if (employee.age == "") {
    errors.push('Field "Age" is required');
    console.log(employee.age);
  }
  if (employee.age < 20 || employee.age > 70) {
    errors.push("Age must be 20-70 only");
    console.log(employee.age);
  }

  console.log(errors.length);
  if (errors.length > 0) {
    throw new UserInputError("Invalid input(s)", { errors });
  }
}



async function getNextIDSequence(name) {
  const result = await Counter.findOneAndUpdate(
    { name: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  console.log(result)
  return result.current;
}

async function employeeAdd(_, { employee }) {
  await validateEmployee(employee);
  console.log(employee);
  employee = { id: await getNextIDSequence('id_count'), ...employee };
  console.log("employee add");
  console.log(employee);
  const newEmployee = new Employee(employee);
  newEmployee.save().then(doc => {
    console.log("added document : " + doc);
  }).catch(err => {
    console.log(err);
  });

  return employee;
}

async function employeeUpdate(_, { id, employeeUpdates }) {
  console.log(id + JSON.stringify(employeeUpdates));
  const doc = await Employee.findOneAndUpdate({ id: id }, { ...employeeUpdates }, { new: true }).then(doc => {
    // console.log("hahahahha");
    // console.log(doc);
    return doc;
  }).catch(err => {
    alert("spmething went wrong");
  });
  return doc;
}

async function employeeDelete(_, { id, employeeStatus }) {
  if (employeeStatus == 1) {
    return "CAN’T DELETE EMPLOYEE – STATUS ACTIVE";
  } else {
    const isDeleted = await Employee.findOneAndDelete({ id: id }).then(_doc => {
      return "success";
    }).catch(err => {
      console.log(err);
      return "fail";
    });
    return isDeleted;
  }

}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('GraphQL/Schema', 'utf8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});


const app = express();
server.start().then(() => {
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: true,
  });
});


app.listen(port, function () {
  console.log("API Server listening on Port # " + port);
})