document.addEventListener("DOMContentLoaded", () => {
    // TASK 1: FORM VALIDATION
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let isValid = true;
            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const message = document.getElementById("message");
            const alertBox = document.getElementById("form-alert");

            if (!name.value.trim()) {
                name.classList.add("is-invalid");
                isValid = false;
            } else {
                name.classList.remove("is-invalid");
                name.classList.add("is-valid");
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailPattern.test(email.value)) {
                email.classList.add("is-invalid");
                isValid = false;
            } else {
                email.classList.remove("is-invalid");
                email.classList.add("is-valid");
            }

            if (!message.value.trim() || message.value.trim().length < 5) {
                message.classList.add("is-invalid");
                isValid = false;
            } else {
                message.classList.remove("is-invalid");
                message.classList.add("is-valid");
            }

            if (isValid) {
                alertBox.classList.remove("d-none", "alert-danger");
                alertBox.classList.add("alert-success");
                alertBox.textContent = "Thank you! Your message has been sent successfully.";
                contactForm.reset();
                setTimeout(() => {
                    name.classList.remove("is-valid");
                    email.classList.remove("is-valid");
                    message.classList.remove("is-valid");
                    alertBox.classList.add("d-none");
                }, 4000);
            } else {
                alertBox.classList.remove("d-none", "alert-success");
                alertBox.classList.add("alert-danger");
                alertBox.textContent = "Please fill out all required fields correctly.";
            }
        });
    }

    // TASK 2: ACCORDION
    const accordions = document.querySelectorAll(".accordion-header-custom");
    accordions.forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            header.classList.toggle("active");
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // TASK 3: POPUP FORM
    const popupBtn = document.getElementById("open-popup-btn");
    const popupModal = document.getElementById("popup-modal");
    const closePopupBtn = document.getElementById("close-popup-btn");

    if (popupBtn && popupModal) {
        popupBtn.addEventListener("click", () => {
            popupModal.style.display = "flex";
        });

        closePopupBtn.addEventListener("click", () => {
            popupModal.style.display = "none";
        });

        window.addEventListener("click", (e) => {
            if (e.target === popupModal) {
                popupModal.style.display = "none";
            }
        });
    }

    // TASK 4: CHANGE BACKGROUND COLOR
    const colorBtn = document.getElementById("color-change-btn");
    if (colorBtn) {
        const colors = ["#0b0b0e", "#1a252f", "#2c3e50", "#1f1f2e", "#2d3436"];
        let colorIndex = 0;
        colorBtn.addEventListener("click", () => {
            colorIndex = (colorIndex + 1) % colors.length;
            document.body.style.setProperty("background-color", colors[colorIndex], "important");
        });
    }

    // TASK 5: DISPLAY CURRENT DATE AND TIME
    function updateClock() {
        const clockElement = document.getElementById("live-clock");
        if (clockElement) {
            const now = new Date();
            const options = {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            clockElement.textContent = now.toLocaleString('en-US', options);
        }
    }
    setInterval(updateClock, 1000);
    updateClock();
});