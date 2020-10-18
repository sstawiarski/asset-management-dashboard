const sampleEmployee = [
    {

        "employeeId": 92759802,
        "firstName": "John",
        "lastName": "Smith",
        "username": "jsmith",
        "email": "jsmith@company.com",
        "jobTitle": "honcho",
        "birthDate": {
            "$date": {
                "$numberLong": "503215200000"
            }
        },
        "gender": "m",
        "password": "password1"
    },
    {
        "employeeId": 92759805,
        "firstName": "Joanna",
        "lastName": "Smith",
        "username": "jsmith2",
        "email": "jsmith2@company.com",
        "jobTitle": "sub-honcho",
        "birthDate": {
            "$date": {
                "$numberLong": "503219200000"
            }
        },
        "gender": "f",
        "password": "password1"
    },
    {

        "employeeId":92119865,
        "firstName": "James",
        "lastName": "Buchanan",
        "username": "jbukky",
        "email": "jbukky@company.com",
        "jobTitle": "supreme honcho",
        "birthDate": {
            "$date": {
                "$numberLong": "503515200000"
            }
        },
        "gender": "m",
        "password": "password1"
    }
];

module.exports = sampleEmployee;