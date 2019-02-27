const Sequelize = require('sequelize')
// conn is the model
const conn = new Sequelize('postgres://localhost/pillarDb',{
    logging: false
})
// set up model to table
// name, and favoriteNum is column
const Employee = conn.define('employee',{
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    favoriteNum: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: [7]
    },
    salary: {
        type: Sequelize.INTEGER,
        
    }
})

Employee.beforeCreate((employeeInstance, optionObject)=>{
    if(!employeeInstance.salary){
        employeeInstance.salary = 50000
    }
})

const Company = conn.define('company',{
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Bio: Sequelize.TEXT,
    Years: {
        type: Sequelize.INTEGER,
        validate: {
            min: 1,
            max: 100,
        }
    }
})

// define associations: ??? where to place these arguments?
Company.hasMany(Employee)
Employee.belongsTo(Company)

// create employees and companies
employees = [
    {name: 'moe', favoriteNum: [7,8,9], salary: 100000},
    {name: 'curly', favoriteNum: [10,11,12], salary: 105000},
    {name: 'larry', favoriteNum: [13,14,15], salary: 200000},
];


// syncAndSeed
const syncAndSeed = async() => {
    Company.hasMany(Employee);
    Employee.belongsTo(Company);
    await conn.sync({force: true})

    //? how to use map here
    const [moe, curly, larry] = await Promise.all([
        Employee.create(employees[0]),
        Employee.create(employees[1]),
        Employee.create(employees[2]),
    ])
    
    // how to do this with normal promise??? promise.resovle? 
    // await Promise.all([
    //     Company.create({name: 'Acme', Bio: 'Provide Web Study', Years: 5})
    // ])
    
    const company1 = await Promise.resolve(Company.create({name: 'Acme', Bio: 'Provide Web Study', Years: 5}))

        // .then(Employee.findAll())
        // .then((employees)=>{
        //     console.log(employees.length)
        // })
    //console.log(moe.get())
    //console.log(company1.get())
}

syncAndSeed()
    // .then(()=>{ return Employee.findAll()})
    // .then((employees)=>{
    //     console.log(employees)
    // }) ??????????? can't i do it here
    
    Employee.findAll({
    where: {
        name: 'moe',
    }
})
