const { app } = require('@azure/functions');
const validator = require("validator");
const errors = require("./errorHandler.json");

app.http('person', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (req) => {

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
            let fullName = !bodyRequest.secondName ? bodyRequest.name.charAt(0).toUpperCase() + bodyRequest.name.slice(1).toLowerCase() : `${bodyRequest.name.charAt(0).toUpperCase() + bodyRequest.name.slice(1).toLowerCase()} ${bodyRequest.secondName.charAt(0).toUpperCase() + bodyRequest.secondName.slice(1).toLowerCase()}`;
            fullName += " " + bodyRequest.firstSurname.charAt(0).toUpperCase() + bodyRequest.firstSurname.slice(1).toLowerCase() + " " + bodyRequest.secondSurname.charAt(0).toUpperCase() + bodyRequest.secondSurname.slice(1).toLowerCase();
            return { status: 200, body: JSON.stringify({ fullName: fullName, age: age }), headers: { 'Content-Type': 'application/json' } }
        } catch (err) {
            return { status: err.status, body: JSON.stringify(err.body), headers: err.headers }
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

    if (Number(birthdate.slice(8, 10)) > Number(today.getDate()) || Number(birthdate.slice(5, 7)) > Number(today.getMonth() + 1)) age--;

    return age;
}