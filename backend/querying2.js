const Sequelize = require('sequelize');
const db = require('./connect_db');

const Companies = db.define('companies', {
  name: Sequelize.STRING,
  profit: Sequelize.FLOAT
});

const Employees = db.define('employees', {
  name: Sequelize.STRING,
  age: Sequelize.INTEGER
});

Employees.belongsTo(Companies);
Companies.hasMany(Employees);

// Q1: Finds one of the employees (any one) and prints out the company that
// he/she works for. Note the use of the include option to retrieve the company
// associated with each employee. This will result in a join.
Employees.findOne({ include: [Companies] }).then(employee => {
  console.log(employee.name + ' works at ' + employee.company.name);
})

// Q2: Creates a new company and makes the employee with id 1 its employee.
.then(() => Companies.create({
  name: 'Dell',
  profit: 10.0
}))
.then(c => {
  return Employees.findByPk(1).then(e => e.update({companyId: c.id}));
})
.then(() => {
  // Q3: Shows that the companyId attribute for employee with id 1 has been updated
  return Employees.findByPk(1).then(employee => {
    console.log(employee.dataValues);
  });
})

// Q4: Sorts all employees oldest-to-youngest and prints their details.
.then(() => Employees.findAll({ order: [['age', 'DESC']] }))
.then(employees => {
  employees.forEach(employee => {
    console.log(employee.dataValues);
  });
})

// Exercise 3
// *** TODO: Insert code here ***

.then(()=>Employees.findOne({
  where: {name:"Peter Rabbit"},
  include:{
    model: Companies
    //attributes: ["id", "name", "profit"]
  }
}))
.then(e=>{
  console.log(e.company.dataValues);
  console.log();
})



// Exercise 4
// *** TODO: Insert code here ***
// Method 1:

.then(()=>Companies.findOne({
  order: [["profit", "DESC"]], 
  include: {
    model: Employees
  }
}))
.then(HighP =>{
  HighP.employees.forEach(employee => {
    console.log(employee.dataValues);
  });
  //console.log(Array.isArray(HighP.employees));
  console.log();
})


// Method 2:

.then(()=>Companies.findOne({
  order: [["profit", "DESC"]]
}))
.then(HighP_C =>{
  console.log("High Profit", HighP_C.dataValues);
  console.log(HighP_C.id);
  return Employees.findAll({
    where: {companyId: HighP_C.id}
  })
})
.then(HighP_E =>{
  console.log("Employees from company with the highest Profit:");
  HighP_E.forEach(employee => {
    console.log(employee.dataValues);
  });
  //console.log(Array.isArray(HighP.employees));
  console.log();
})



// Exercise 5
// *** TODO: Insert code here ***  
// Creates a new employee and makes the employee in company id =1
//.then(()=> Employees.findByPk(4))
//.then(des_emp => des_emp.destroy())
//Or 
.then(()=>Employees.destroy(
  {where: {id: 5}}
))
.then(() => Employees.create({
  id: 11,
  name: 'Peter Junior',
  age: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
  companyId: 1
}))
.then(()=> Employees.findAll())
  // Shows that the employees table has been updated
.then(employees=> {
  employees.forEach(employee => {
    console.log(employee.dataValues);
  });
})


.catch(console.error).then(() => db.close());
