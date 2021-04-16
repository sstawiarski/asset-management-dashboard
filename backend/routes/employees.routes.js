const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Employee = require('../models/employee.model');
const sampleEmployees = require('../sample_data/sampleEmployee.data')
const { cacheTime } = require('../cache');
const decrypt = require('../auth.utils').decrypt;

router.put('/load', async (req, res) => {
  try {
    sampleEmployees.forEach(async (item, idx) => {
      const employee = new Employee({
        ...item,
        birthDate: new Date(`07/${idx + 1}/${1975 + idx}`)
      });
      await employee.save();
    });

    await mongoose.clearCache({ collection: 'employees' }, true);

    res.status(200).json({ message: "success" })
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
    const employee = await Employee.findOne({ employeeId: id }).cache({ ttl: cacheTime });
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

router.patch('/:employeeId', async (req, res) => {
  const employeeId = parseInt(req.params.employeeId);
  const username = JSON.parse(decrypt(req.body.user));

  /* Make sure user editing and user to be edited are the same */
  if (username.employeeId !== employeeId) {
    res.status(401).json({ message: "Unauthorized to edit non-same employee", internalCode: "unauthorized_employee_edit" });
  }

  try {
    /* Update employee with ID by passing in whole object as update param */
    /* req.body MUST exactly match schema of employee, meaning if username is to be updated, req.body must have "username" property */
    const employee = await Employee.updateOne(
      {
        employeeId: employeeId
      },
      {
        ...req.body
      }
    );

    /* Check if a document was modified */
    if (!employee.nModified) {
      /* if the employee was found, but not edited */
      if (employee.n) {
        res.status(500).json({ message: "Could not update employee information", internalCode: "employee_update_error" });
      } else {
        /* if the employee was not found at all */
        res.status(404).json({ message: "Employee not found", internalCode: "employee_not_found" });
      }
    } else if (employee.nModified === 1) {
      /* Successfully updated employee information */
      await mongoose.clearCache({ collection: 'employees' }, true);
      res.status(200).json({ message: "Successfully updated employee information" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating employee information", internalCode: "employee_update_error" });
  }
});

module.exports = router;