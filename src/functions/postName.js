// TODO: Hacer una lectura de las bases de datos y agregar los datos cuando se manden por el frontend con sequalize

const { app } = require('@azure/functions');
const validator = require("validator");
const errors = require("./errorHandler.json");
const Person = require("../back/db");

app.http('person', {
    methods: ['POST', 'GET'],
    authLevel: 'anonymous',
    handler: async (req) => {

        if(req.method=='GET'){
            try {
                const allPeople=await Person.findAll();

                return {status:200,body:JSON.stringify(allPeople,null,2)};
            } catch (error) {
                return {status:500,msg:error};
            }
        }


        if (req.method == 'POST') {
            let bodyRequest;

            try {
                bodyRequest = await req.json();
            } catch (error) {
                return {
                    status: errors.error00.status,
                    body: JSON.stringify(errors.error00.body),
                    headers: errors.error00.headers
                };
            }

            if (!bodyRequest.name) {
                return { status: errors.error01.status, body: JSON.stringify(errors.error01.body), headers: errors.error01.headers }
            }
            if (!bodyRequest.firstSurname) {
                return { status: errors.error02.status, body: JSON.stringify(errors.error02.body), headers: errors.error02.headers }
            }
            if (!bodyRequest.secondSurname) {
                return { status: errors.error03.status, body: JSON.stringify(errors.error03.body), headers: errors.error03.headers }
            }
            if (!bodyRequest.area) {
                return {
                    status: 400, body: JSON.stringify({
                        "msg": "Invalid birthdate ",
                        "errorName": "ERR05"
                    }), headers: { "Content-Type": "application/json" }
                }
            }


            try {
                const age = birthdayValidation(bodyRequest.birthdate);

                let name = bodyRequest.name.charAt(0).toUpperCase() + bodyRequest.name.slice(1).toLowerCase();
                let secondName = bodyRequest.secondName.charAt(0).toUpperCase() + bodyRequest.secondName.slice(1).toLowerCase();
                let firstSurname = bodyRequest.firstSurname.charAt(0).toUpperCase() + bodyRequest.firstSurname.slice(1).toLowerCase();
                let secondSurname = bodyRequest.secondSurname.charAt(0).toUpperCase() + bodyRequest.secondSurname.slice(1).toLowerCase();

                let fullName = !bodyRequest.secondName ? name : `${name} ${secondName}`;
                fullName += " " + firstSurname + " " + secondSurname;

                await Person.create({ name: name, secondName: secondName, firstSurname: firstSurname, secondSurname: secondSurname, birthdate: bodyRequest.birthdate, area: bodyRequest.area });

                return { status: 200, body: JSON.stringify({ fullName: fullName, age: age }), headers: { 'Content-Type': 'application/json' } }
            } catch (err) {
                return { status: err.status, body: JSON.stringify(err.body), headers: err.headers }
            }
        }
    }
});


function birthdayValidation(birthdate) {
    const today = new Date();
    if (!birthdate || validator.isAfter(birthdate)) {
        throw errors.error05;
    } else if (!validator.isDate(birthdate, ["YYYY-MM-DD"])) {
        throw errors.error04;
    }

    let age = today.getFullYear() - birthdate.slice(0, 4);

    if (Number(birthdate.slice(8, 10)) > Number(today.getDate()) && Number(birthdate.slice(5, 7)) >= Number(today.getMonth() + 1)) age--;

    return age;
}