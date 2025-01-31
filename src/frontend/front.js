const btnPost = document.getElementById("btnPost");
let response = document.getElementById("response");

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
            throw new Error(responseData.errorName+" "+responseData.msg)
        }

        document.getElementById("response").textContent = `Hola, soy ${responseData.fullName} y tengo ${responseData.age} años de edad.`;

    } catch (err) {
        document.getElementById("response").textContent = err;
    }

})

