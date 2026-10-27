const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");

if (menuButton && navigation) {
  const setMenuOpen = (isOpen) => {
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    navigation.classList.toggle("is-open", isOpen);
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a") && window.matchMedia("(max-width: 1100px)").matches) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 1101px)").matches) {
      setMenuOpen(false);
    }
  });
}

const yearElement = document.querySelector("#current-year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

const enquiryForm = document.querySelector("#enquiry-form");
if (enquiryForm) {
  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    if (!enquiryForm.reportValidity()) {
      if (status) status.textContent = "Please complete the required fields and check the email address.";
      return;
    }
    if (status) status.textContent = "Your details have not been sent. This form is not connected to an enquiry service yet. Keep this page open if you need to retain your entries.";
  });
}

const consultationForm = document.querySelector("#consultation-form");
if (consultationForm) {
  const error = document.querySelector("#consultation-error");
  const help = document.querySelector("#consultation-help");
  const submitButton = document.querySelector("#consultation-submit");
  let isProcessing = false;

  consultationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isProcessing) return;

    const fields = {
      fullName: consultationForm.elements.fullName,
      company: consultationForm.elements.company,
      email: consultationForm.elements.email,
      phone: consultationForm.elements.phone,
      interest: consultationForm.elements.interest,
      needs: consultationForm.elements.needs
    };

    Object.values(fields).forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.setCustomValidity(field.required && !field.value.trim() ? "Please complete this required field." : "");
    });

    if (!consultationForm.checkValidity()) {
      const invalid = consultationForm.querySelector(":invalid");
      if (invalid) {
        invalid.setAttribute("aria-invalid", "true");
        invalid.reportValidity();
        invalid.focus();
      }
      if (error) error.textContent = "Please complete all required fields and enter a valid email address.";
      if (help) help.textContent = "Your entries are still here. Correct the highlighted field(s) and submit again.";
      return;
    }

    if (error) error.textContent = "";
    const value = (field) => field.value.trim();
    const message = [
      "Good day, Crestmark Consulting. I would like to book a consultation.",
      "",
      "Full Name: " + value(fields.fullName),
      "Business/Company: " + value(fields.company),
      "Email Address: " + value(fields.email),
      "Phone Number: " + (value(fields.phone) || "Not provided"),
      "Area of Interest: " + value(fields.interest),
      "",
      "Brief Description of Business Needs:",
      value(fields.needs)
    ].join("\n");
    const whatsappUrl = "https://wa.me/2348104750320?text=" + encodeURIComponent(message);

    isProcessing = true;
    submitButton.disabled = true;
    submitButton.setAttribute("aria-disabled", "true");
    if (help) help.textContent = "Opening WhatsApp with your draft. Review the details and send the message in WhatsApp to complete your enquiry.";

    let whatsappWindow = null;
    try {
      whatsappWindow = window.open(whatsappUrl, "_blank");
      if (whatsappWindow) whatsappWindow.opener = null;
    } catch (openError) {
      whatsappWindow = null;
    }

    if (!whatsappWindow) {
      if (help) {
        help.textContent = "Your message is ready, but your browser may have blocked the WhatsApp window. Use the link below to open it; your form entries remain on this page.";
        const fallback = document.createElement("a");
        fallback.href = whatsappUrl;
        fallback.target = "_blank";
        fallback.rel = "noopener noreferrer";
        fallback.className = "text-link consultation-whatsapp-fallback";
        fallback.textContent = "Open WhatsApp draft";
        help.appendChild(document.createElement("br"));
        help.appendChild(fallback);
      }
      isProcessing = false;
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-disabled");
    }
  });
}
