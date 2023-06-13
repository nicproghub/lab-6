const Sequelize = require('sequelize');
const db = require('./connect_db');

// Here we model a 1:N or 1 to many relation.
// Each company has many employees.
// Each employee belongs to one company
// We can model this using the belongsTo method
const Companies = db.define('companies', {
  name: Sequelize.STRING,
  profit: Sequelize.FLOAT
});

const Employees = db.define('employees', {
  name: Sequelize.STRING,
  age: Sequelize.INTEGER
});

// This links up to the two relations so now there will be a foreign key attribute
// added to the employees table called companyId which can be used to retrieve the
// company that a customer belongs to.
Employees.belongsTo(Companies);
Companies.hasMany(Employees);

db.sync({ force: true }).then(() => {
  // Here we are creating the company and its employees together
  // Note we are using the then function. This ensures that the
  // company has already been created before the employee is created.
  const c1 = Companies.create({
      name: 'Apple',
      profit: 20202.1
  }).then(c => {
    const e1 = Employees.create({
        name: 'John Smith',
        age: 20,
        // Here is how we link the employee to the company.
        companyId: c.id
    });

    const e2 = Employees.create({
      name: 'Peter Senior',
      age: 10,
      companyId: c.id
    });

    return Promise.all([e1, e2]);
  });

  const c2 = Companies.create({
      name: 'Google',
      profit: 32.0
  }).then(c => {
    const e3 = Employees.create({
        name: 'Peter Rabbit',
        age: 3,
        companyId: c.id
    });

    return e3;
  });

  // Make a promise which waits for both companies (and their employees) to be
  // created. We need to do this so that we can close the database connection
  // only after everything is finished.
  return Promise.all([c1, c2]);
})
// Close the database connection.
.catch(console.error).then(() => db.close());
