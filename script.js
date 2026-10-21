const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a") && window.matchMedia("(max-width: 1100px)").matches) {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 1101px)").matches) {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    }
  });
}

const yearElement = document.querySelector("#current-year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

const enquiryForm=document.querySelector("#enquiry-form");
if(enquiryForm){enquiryForm.addEventListener("submit",event=>{event.preventDefault();const status=document.querySelector("#form-status");if(!enquiryForm.reportValidity()){if(status)status.textContent="Please complete the required fields and check the email address.";return;}if(status)status.textContent="Your details have not been sent. This form is not connected to an enquiry service yet. Keep this page open if you need to retain your entries.";});}
