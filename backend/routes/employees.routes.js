const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.connection;
const Employee = require('../models/employee.model');
const sampleEmployees = require('../sample_data/sampleEmployee.data')

router.put('/load', async (req, res) => {
    try {
        sampleEmployees.forEach(async (item, idx) => {
            const employee = new Employee({
                ...item,
                birthDate: new Date(`07/${idx+1}/${1975+idx}`)
            });
            await employee.save();
        })
        res.status(200).json({message: "success"})
    }
    catch (err) {
        res.status(500).json({
            message: "Error loading sample data into database",
            internal_code: "database_load_error"
        })
    }
});

router.get('/:employeeId', async (req, res) => {
    try {
        const id = parseInt(req.params.employeeId);
        const employee = await Employee.findOne({ employeeId: id });
        if (employee) {
            const name = employee.firstName + " " + employee.lastName;
            const toSend = {
                employeeId: id,
                name: name
            };
            res.status(200).json(toSend);
        } else {
            res.status(404).json({ message: "Employee not found for ID", internalCode: "employee_not_found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error retreiving employee', internalCode: "employee_retreival_error" })
    }
});


router.patch('/:employeeId', async (req, res)=>{
    var employeeId = req.params.employeeId;
    const employee = await Employee.findOne({ employeeId: employeeId });
    var body = _.pick(req.body, ['username', 'email', 'password']);
  
    if(!ObjectID.isValid(employeeId)){
      res.status(404).send();
    }
  
    employee.findByIdAndUpdate(employeeId, {$set: body}, {new: true}).then(
      (employee)=>{
        if(!employee){
          res.status(404).send();
        }
        res.send(employee);
      },
      (error) =>{
        res.send(error);
      }
    ).catch((e)=>{
      res.status(404).send();
    });
  });

module.exports = router;