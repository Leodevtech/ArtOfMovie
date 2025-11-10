// Nous créons les références pour notre menu et l’icône du menu :
const iconMobile = document.querySelector(".header-menu-icon");
const headerMenu = document.querySelector(".header-menu");
// Cette propriété permettra de savoir si le menu est ouvert :
let isMenuOpen = false;
// Cette propriété permettra de savoir si le menu mobile est créé :
let mobileMenuDOM;
// Pour fermer le menu il suffit d’enlever la classe open sur le menu :
const closeMenu = () => {
  mobileMenuDOM.classList.remove("open");
};
// Nous créons une div et nous ajoutons la classe mobile-menu.
// Nous empêchons la fermeture du menu sur un clic à l’intérieur.
// Nous y clonons ensuite les liens du menu normal.

const createMobileMenu = () => {
  mobileMenuDOM = document.createElement("div");
  mobileMenuDOM.classList.add("mobile-menu");
  mobileMenuDOM.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  mobileMenuDOM.append(headerMenu.querySelector("ul").cloneNode(true));
  headerMenu.append(mobileMenuDOM);
};

// Si le menu n’est pas créé nous le créons.
// Dans tous les cas nous l’ouvrons en ajoutant la classe open :
const openMenu = () => {
  if (mobileMenuDOM) {
  } else {
    createMobileMenu();
  }
  mobileMenuDOM.classList.add("open");
};

// Permet d’ouvrir ou de fermer le menu en fonction de son état :
const toggleMobileMenu = (event) => {
  if (isMenuOpen) {
    closeMenu();
  } else {
    openMenu();
  }
  isMenuOpen = !isMenuOpen;
};

// Un clic sur l’icône va ouvrir ou fermer le menu
// et empêcher la propagation de l’événement à window :
iconMobile.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleMobileMenu();
});

// Nous récupérons les clics sur window pour fermer le menu.
window.addEventListener("click", () => {
  if (isMenuOpen) {
    toggleMobileMenu();
  }
});

// Si la fenêtre est agrandie et qu’elle dépasse 480px de largeur
// Alors nous fermons le menu si il est ouvert :
window.addEventListener("resize", (event) => {
  // console.log(window.innerWidth);
  if (window.innerWidth > 480 && isMenuOpen) {
    toggleMobileMenu();
  }
});
