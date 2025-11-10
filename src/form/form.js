loadCSS("../assets/styles/styles.css");
loadCSS("./form.css");
import "../form/form.js";
import { openModal } from "../assets/javascripts/modal.js";

const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
const btnCancel = document.querySelector(".btn-secondary");
let errors = [];
let articleId;

function loadCSS(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
// Nous remplissons tous les champs de notre formulaire en créant des références
// et en utilisant les informations récupérées du serveur.
const fillForm = (article) => {
  const author = document.querySelector('input[name="author"]');
  const img = document.querySelector('input[name="img"]');
  const category = document.querySelector('input[name="category"]');
  const title = document.querySelector('input[name="title"]');
  const content = document.querySelector("textarea");
  author.value = article.author || "";
  img.value = article.img || "";
  category.value = article.category || "";
  title.value = article.title || "";
  content.value = article.content || "";
};

btnCancel.addEventListener("click", async () => {
  const result = await openModal(
    "Si vous quittez la page, vous allez perdre votre article"
  );
  if (result) {
    location.assign("/index.html");
  }
});

// Nous allons créer une fonction asynchrone que nous invoquons de suite.
// Nous parsons l’URL de la page et vérifions si nous avons un paramètre id.
// Si nous avons un id, nous récupérons l’article correspondant.

const initForm = async () => {
  const params = new URL(location.href);
  articleId = params.searchParams.get("id");
  if (articleId) {
    const response = await fetch(
      `https://restapi.fr/api/articlesBlog/${articleId}`
    );
    if (response.status < 300) {
      const article = await response.json();
      fillForm(article);
    }
  }
};

initForm();

// Lorsque nous éditons, nous ne créons pas de nouvelle ressource sur le serveur.
// Nous n’utilisons donc pas une requête POST mais une requête PATCH.
// Pas PUT car nous ne remplaçons pas la ressource distante (nous gardons
// la date de création et l’id).
form.addEventListener("submit", async (event) => {
  console.log("bouton ok");
  event.preventDefault();
  const formData = new FormData(form);
  const article = Object.fromEntries(formData.entries());
  if (formIsValid(article)) {
    try {
      const json = JSON.stringify(article);
      let response;
      if (articleId) {
        response = await fetch(
          `https://restapi.fr/api/articlesBlog/${articleId}`,
          {
            method: "PATCH",
            body: json,
            headers: {
              "Content-type": "application/json",
            },
          }
        );
      } else {
        response = await fetch("https://restapi.fr/api/articlesBlog", {
          method: "POST",
          body: json,
          headers: {
            "Content-type": "application/json",
          },
        });
      }

      if (response.status < 299) {
        location.assign("/index.html");
      }
    } catch (e) {
      console.error("e : ", e);
    }
  }
});

// gestion d'erreur_Form
const formIsValid = (article) => {
  let errors = [];
  if (
    !article.author ||
    !article.category ||
    !article.content ||
    !article.img ||
    !article.title
  ) {
    errors.push("Vous devez renseigner tous les champs");
  }
  if (article.content.length < 20) {
    errors.push("Le contenu de votre article est trop court !");
  }
  if (errors.length) {
    let errorHTML = "";
    errors.forEach((e) => {
      errorHTML += `<li>${e}</li>`;
    });
    errorElement.innerHTML = errorHTML;
    return false;
  } else {
    errorElement.innerHTML = "";
  }
  return true;
};
