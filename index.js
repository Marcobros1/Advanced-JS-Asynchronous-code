// --- Soporte dual navegador / Node -------------------------------------------
// El ejercicio está pensado para el navegador (usa document), pero Node no tiene
// DOM. Si detectamos que corremos en Node (node index.js), ofrecemos un sustituto
// mínimo de document para que el archivo se ejecute entero. En el navegador este
// bloque no hace nada. fetch sí existe en Node 18+.
if (typeof document === "undefined") {
  const makeElement = () => ({
    append: () => {},
    addEventListener: () => {},
    innerHTML: "",
  });

  globalThis.document = {
    getElementById: () => makeElement(),
    createElement: () => makeElement(),
    addEventListener: (event, callback) => {
      if (event === "DOMContentLoaded") callback();
    },
  };
}
// ------------------------------------------------------------------------------

//1.- Declara una funcion getAllBreeds que devuelva un array de strings con todas las razas de perro.
// API: https://dog.ceo/dog-api/ -> GET https://dog.ceo/api/breeds/list/all

async function getAllBreeds() {
  try {
    const response = await fetch(
      "https://dog.ceo/api/breeds/list/all"
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    console.log("1. Perros:", data);
    return Object.keys(data.message);
  } catch (error) {
    console.error("No se pudo obtener la lista de razas:", error.message);
  }
}

getAllBreeds();

//2.- Declara una función getRandomDog que obtenga una imagen random de una raza.
// GET https://dog.ceo/api/breeds/image/random

async function getRandomDog() {
    try {
        const response = await fetch(
        "https://dog.ceo/api/breeds/image/random"
        );

        if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log("2. Perro:", data);

        return data.message;
    } catch (error) {
        console.error("No se pudo obtener una imagen de perro aleatoria:", error.message);
    }
}

getRandomDog()

//3.- Declara una función getAllImagesByBreed que obtenga todas las imágenes de la raza komondor.
// GET https://dog.ceo/api/breed/komondor/images

async function getAllImagesByBreed() {
    try {
        const response = await fetch(
            "https://dog.ceo/api/breed/komondor/images"
        );

        if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log("3. Perros:", data);

        return data.message;
    } catch (error) {
        console.error("No se pudieron obtener las imágenes de la raza komondor:", error.message);
    }
}

getAllImagesByBreed();

//4.- Declara una funcion getAllImagesByBreed2(breed) que devuelva las imágenes de la raza pasada por el argumento.
// GET https://dog.ceo/api/breed/{breed}/images

async function getAllImagesByBreed2(breed) {
        try {
        const response = await fetch(
            `https://dog.ceo/api/breed/${breed}/images`
        );

        if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log("4. Perros:", data);

        return data.message;
    } catch (error) {
        console.error("No se pudieron obtener las imágenes de la raza:", error.message);
    }
}


getAllImagesByBreed2("komondor");

//5.- Declarara una función getGitHubUserProfile(username) que obtenga el perfil de usuario de github a partir de su nombre de usuario.
// GET https://api.github.com/users/{username}

async function getGitHubUserProfile(username) {
        try {
        const response = await fetch(
            `https://api.github.com/users/${username}`
        );

        if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log("5. Usuario:", data);

        return data;
    } catch (error) {
        console.error("No se pudo obtener el perfil de GitHub:", error.message);
    }
}

getGitHubUserProfile("Marcobros1");

//6.- Declara una función printGithubUserProfile(username) que reciba como argumento el nombre de un usuario (username), retorne {img, name} y pinte la foto y el nombre en el DOM.

async function printGithubUserProfile(username) {
        try {
        const response = await fetch(
            `https://api.github.com/users/${username}`
        );

        if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log("6. Usuario imagen:", data.avatar_url);
        console.log("6. Usuario nombre:", data.name);
        
        //Pintar al DOM
        const img = data.avatar_url;
        const name = data.name;

        const container = document.getElementById("github-user-profile");

        const imageElement = document.createElement("img");
        imageElement.src = img;
        imageElement.alt = "Imagen de usuario";

        const nameElement = document.createElement("h1");
        nameElement.textContent = data.name;

        container.append(imageElement, nameElement);

        return { img, name };
    } catch (error) {
        console.error("No se pudo obtener el perfil de GitHub:", error.message);
    }
}

printGithubUserProfile("Marcobros1");

//7.- Crea una función getAndPrintGitHubUserProfile(username) que contenga una petición a la API para obtener información de ese usuario y devuelva un string que represente una tarjeta HTML como en el ejemplo, la estructura debe ser exactamente la misma:
/*
<section>
    <img src="url de imagen" alt="imagen de usuario">
    <h1>Nombre de usuario</h1>
    <p>Public repos: (número de repos)</p>
</section>
*/

async function getAndPrintGitHubUserProfile(username) {
        try {
        const response = await fetch(
            `https://api.github.com/users/${username}`
        );

        if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log("7. Usuario imagen:", data.avatar_url);
        console.log("7. Usuario nombre:", data.name);
        console.log("7. Usuario public repos:", data.public_repos);
        
        const img = data.avatar_url;
        const name = data.name;
        const publicRepos = data.public_repos;

        return(`<section>
            <img src="${img}" alt="${name}">
            <h1>${name}</h1>
            <p>Public repos: ${publicRepos}</p>
        </section>`)
    } catch (error) {
        console.error("No se pudo obtener la tarjeta del usuario:", error.message);
    }
}

getAndPrintGitHubUserProfile("Marcobros1");

//8.- Manipulación del DOM: Crea un input de tipo texto, y un botón buscar. El usuario escribirá en el input el nombre de usuario de GitHub que quiera buscar. Después llamaremos a la función getAndPrintGitHubUserProfile(username) que se ejecute cuando se pulse el botón buscar.(Esto no se testea).

document.addEventListener("DOMContentLoaded", () => {
    const search = document.getElementById("search");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Nombre de usuario de GitHub";

    const button = document.createElement("button");
    button.textContent = "Buscar";

    search.append(input, button);

    button.addEventListener("click", async () => {
        const username = input.value.trim();

        if(!username){
            console.log("Escribe un nombre de usuario.");
            return;
        }

        const card = await getAndPrintGitHubUserProfile(username);
        document.getElementById("profile").innerHTML = card;
    })
})

//9.- Dada una lista de usuarios de github guardada en un array, crea una funcion fetchGithubUsers(userNames) que utilice 'https://api.github.com/users/${name}' para obtener el nombre de cada usuario.

async function fetchGithubUsers(userNames) {
    
    const promises = userNames.map(async (username) => {
        const response = await fetch(`https://api.github.com/users/${username}`);
        
        if(!response.ok){
            throw new Error(`No se encontró el usuario ${username}`)
        }

        const user = await response.json();

        console.log("Nombre:", user.name);
        console.log("URL:", user.html_url);

        return {
            name: user.name,
            html_url: user.html_url
        };
    });
    
    return Promise.all(promises);
}

fetchGithubUsers(["octocat", "alenriquez96", "Marcobros1"])
  .then(users => console.log("Todos los usuarios:", users))
  .catch(error => console.error("Error:", error.message));
