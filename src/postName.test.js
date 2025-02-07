const {handler, birthdayValidation} = require("./functions/postName.js");
const errors = require("./functions/errorHandler.json");

jest.mock("./back/db.js", () => ({
    findAll: jest.fn().mockResolvedValue([
        {
            idPerson: 1,
            name: "John",
            secondName: "Doe",
            firstSurname: "Smith",
            secondSurname: "Johnson",
            birthdate: "1990-01-01",
            area: "IT"
        }
    ]),
    create: jest.fn().mockResolvedValue({})
}));

test('2024-01-20 should return 1', () => {
    expect(birthdayValidation("2024-01-20")).toBe(1);
});

test('2025-01-20 should return 0', () => {
    expect(birthdayValidation("2025-01-20")).toBe(0);
});

test('Invalid date format should throw error04', () => {
    expect(() => birthdayValidation("20-01-2025")).toThrow(JSON.stringify(errors.error04.body));
});

test('Future date should throw error05', () => {
    expect(() => birthdayValidation("2030-01-20")).toThrow(JSON.stringify(errors.error05.body));
});

describe('GET /person', ()=>{
    it('should return all people', async ()=>{
        const req={method:'GET'};
        const res= await handler(req);
        expect(res.status).toBe(200);

        console.log(res.body);
        expect(res.body).toEqual(JSON.stringify([{"idPerson":1,"name":"John","secondName":"Doe","firstSurname":"Smith","secondSurname":"Johnson","birthdate":"1990-01-01","area":"IT"}]));
    });

//     it('Should return error 500 for no DB', async ()=>{  //Comentar la línea 4 de src/functions/postName.js para que funcione el test
//         const req={method:'GET'};
//         const res= await handler(req);
//         expect(res.status).toBe(500);
//     });
});


describe('POST /person', ()=>{
    it('Return error 400 for no body',async()=>{
        const req={method:'POST',headers: { "Content-Type": "application/json" }};
        const res= await handler(req);

        expect(res.status).toBe(errors.error00.status);
        expect(JSON.parse(res.body).msg).toBe(errors.error00.body.msg);
    });

    it('Return error 400 for no name',async()=>{
        const req={method:'POST',headers:{"Content-Type":"application/json"},body: JSON.stringify({name:'    ',firstSurname:'Smith',secondSurname:'Johnson',area:'IT'})};
        const res=await handler(req);

        console.log(res);

        expect(res.status).toBe(errors.error01.status);
        expect(JSON.parse(res.body).msg).toBe(errors.error01.body.msg);
    });

    it('Return error 400 for no enough length for name',async()=>{
        const req={method:'POST',headers:{"Content-Type":"application/json"},body: JSON.stringify({name:'XD',firstSurname:'Smith',secondSurname:'Johnson',area:'IT'})};
        const res=await handler(req);

        expect(res.status).toBe(errors.error07.status);
        expect(JSON.parse(res.body).msg).toBe(errors.error07.body.msg);
    });
});

