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

// 1.- Declara una función getAllBreeds que devuelva un array de strings con todas las razas de perro.
// API: https://dog.ceo/dog-api/ -> GET https://dog.ceo/api/breeds/list/all

async function getAllBreeds() {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/list/all");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    return Object.keys(data.message);
  } catch (error) {
    console.error("No se pudo obtener la lista de razas:", error.message);
  }
}

// 2.- Declara una función getRandomDog que obtenga una imagen random de una raza.
// GET https://dog.ceo/api/breeds/image/random

async function getRandomDog() {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data.message;
  } catch (error) {
    console.error("No se pudo obtener una imagen de perro aleatoria:", error.message);
  }
}

// 3.- Declara una función getAllImagesByBreed que obtenga todas las imágenes de la raza komondor.
// GET https://dog.ceo/api/breed/komondor/images

async function getAllImagesByBreed() {
  try {
    const response = await fetch("https://dog.ceo/api/breed/komondor/images");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data.message;
  } catch (error) {
    console.error("No se pudieron obtener las imágenes de la raza komondor:", error.message);
  }
}

// 4.- Declara una función getAllImagesByBreed2(breed) que devuelva las imágenes de la raza pasada por el argumento.
// GET https://dog.ceo/api/breed/{breed}/images

async function getAllImagesByBreed2(breed) {
  try {
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data.message;
  } catch (error) {
    console.error("No se pudieron obtener las imágenes de la raza:", error.message);
  }
}

// 5.- Declara una función getGitHubUserProfile(username) que obtenga el perfil de usuario de github a partir de su nombre de usuario.
// GET https://api.github.com/users/{username}

async function getGitHubUserProfile(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("No se pudo obtener el perfil de GitHub:", error.message);
  }
}

// 6.- Declara una función printGithubUserProfile(username) que reciba como argumento el nombre de un usuario (username), retorne {img, name} y pinte la foto y el nombre en el DOM.
async function printGithubUserProfile(username) {
  try {
    const data = await getGitHubUserProfile(username);

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

// 7.- Crea una función getAndPrintGitHubUserProfile(username) que devuelva un string que represente una tarjeta HTML.
async function getAndPrintGitHubUserProfile(username) {
  try {
    const data = await getGitHubUserProfile(username);

    const img = data.avatar_url;
    const name = data.name;
    const publicRepos = data.public_repos;

    return `<section>
        <img src="${img}" alt="${name}">
        <h1>${name}</h1>
        <p>Public repos: ${publicRepos}</p>
    </section>`;
  } catch (error) {
    console.error("No se pudo obtener la tarjeta del usuario:", error.message);
  }
}

// 8.- Manipulación del DOM: input de texto y botón buscar.
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

    if (!username) {
      console.log("Escribe un nombre de usuario.");
      return;
    }

    const card = await getAndPrintGitHubUserProfile(username);
    document.getElementById("profile").innerHTML = card || "Usuario no encontrado";
  });
});

// 9.- Dada una lista de usuarios de github, crea una función fetchGithubUsers(userNames) que utilice la API para obtener el nombre de cada usuario.
async function fetchGithubUsers(userNames) {
  const promises = userNames.map(async (username) => {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error(`No se encontró el usuario ${username}`);
    }

    const user = await response.json();

    return {
      name: user.name,
      html_url: user.html_url,
    };
  });

  return Promise.all(promises);
}
