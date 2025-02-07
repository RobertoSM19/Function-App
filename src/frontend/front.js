const btnPost = document.getElementById("btnPost");
const btnGet = document.getElementById("btnGet");
let response = document.getElementById("response");
let responseDiv = document.getElementById("responseDiv");

btnGet.addEventListener("click", async () => {
    try {
        responseDiv.innerHTML = '';

        const res = await fetch("http://localhost:7071/api/person");

        const responseData = await res.json();

        let resTable= `<table id="resTable">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Second Name</th>
                                <th>First Surname</th>
                                <th>Second Surname</th>
                                <th>Birthdate</th>
                                <th>Area</th>
                            </tr>`

        responseData.forEach(person => {
            resTable+=`<tr>
                            <td>${person.idPerson}</td>
                            <td>${person.name}</td>
                            <td>${person.secondName}</td>
                            <td>${person.firstSurname}</td>
                            <td>${person.secondSurname}</td>
                            <td>${person.birthdate}</td>
                            <td>${person.area}</td>
                        </tr>`;
        });

        resTable+="</table>"
        responseDiv.innerHTML=resTable;
    } catch (error) {
        responseDiv.innerHTML = `<p>${error}</p>`;
    }
});


btnPost.addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const secondName = document.getElementById("secondName").value.trim();
    const firstSurname = document.getElementById("firstSurname").value.trim();
    const secondSurname = document.getElementById("secondSurname").value.trim();
    const birthdate = document.getElementById("birthdate").value;

    const data = { "name": name, "secondName": secondName, "firstSurname": firstSurname, "secondSurname": secondSurname, "birthdate": birthdate }

    try {
        const res = await fetch("http://localhost:7071/api/person", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
        });

        const responseData = await res.json();
        if (!res.ok) {
            throw new Error(responseData.errorName + " " + responseData.msg)
        }

        document.getElementById("response").textContent = `Hola, soy ${responseData.fullName} y tengo ${responseData.age} años de edad y estudias ${area}.`;

    } catch (err) {
        document.getElementById("response").textContent = err;
    }

});

