document.addEventListener("DOMContentLoaded", () => {
    // Web Audio API Sound Function
    function playSoundEffect() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const audioCtx = new AudioContext();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            console.log("Audio play blocked by browser policy");
        }
    }

    // --- TASK 1: FORM VALIDATION (Contact Page) ---
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
                playSoundEffect();
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

    // --- TASK 2: ACCORDION (Teams Page) ---
    const accordions = document.querySelectorAll(".accordion-header-custom");
    accordions.forEach(header => {
        header.addEventListener("click", () => {
            playSoundEffect();
            const content = header.nextElementSibling;
            header.classList.toggle("active");
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // --- TASK 3: POPUP FORM (All Pages) ---
    const popupBtn = document.getElementById("open-popup-btn");
    const popupModal = document.getElementById("popup-modal");
    const closePopupBtn = document.getElementById("close-popup-btn");

    if (popupBtn && popupModal) {
        popupBtn.addEventListener("click", () => {
            playSoundEffect();
            popupModal.style.display = "flex";
        });

        if (closePopupBtn) {
            closePopupBtn.addEventListener("click", () => {
                popupModal.style.display = "none";
            });
        }

        window.addEventListener("click", (e) => {
            if (e.target === popupModal) {
                popupModal.style.display = "none";
            }
        });
    }

    // --- TASK 4: CHANGE BACKGROUND COLOR (Home Page) ---
    const colorBtn = document.getElementById("color-change-btn");
    if (colorBtn) {
        const colors = ["#0b0b0e", "#1a252f", "#2c3e50", "#1f1f2e", "#2d3436"];
        let colorIndex = 0;
        colorBtn.addEventListener("click", () => {
            playSoundEffect();
            colorIndex = (colorIndex + 1) % colors.length;
            document.body.style.setProperty("background-color", colors[colorIndex], "important");
        });
    }

    // --- TASK 5: DISPLAY CURRENT DATE AND TIME (All Pages) ---
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

    // --- RATING STARS SYSTEM (Home & Teams Pages) ---
    const stars = document.querySelectorAll("#rating-stars .star");
    const feedback = document.getElementById("rating-feedback");

    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            playSoundEffect();
            const ratingValue = star.getAttribute("data-value");
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.style.color = "#ff1801";
                } else {
                    s.style.color = "#6c757d";
                }
            });
            if (feedback) {
                feedback.textContent = `Thank you for rating us ${ratingValue} out of 5 stars!`;
            }
        });
    });

    // --- HOME PAGE: Динмический список гонок ---
    const races = [
        { name: "Monaco Grand Prix", circuit: "Circuit de Monaco", category: "Classic" },
        { name: "Silverstone Grand Prix", circuit: "Silverstone Circuit", category: "Classic" },
        { name: "Monza Grand Prix", circuit: "Autodromo Nazionale Monza", category: "High Speed" },
        { name: "Las Vegas Grand Prix", circuit: "Las Vegas Street Track", category: "Street Track" }
    ];
    const racesListContainer = document.getElementById("dynamic-races-list");
    if (racesListContainer) {
        function renderRaces(data) {
            racesListContainer.innerHTML = "";
            data.forEach(r => {
                const li = document.createElement("li");
                li.className = "list-group-item bg-dark text-light border-secondary mb-2 rounded d-flex justify-content-between align-items-center";
                li.innerHTML = `<span><strong>${r.name}</strong> - <em>${r.circuit}</em></span> <span class="badge bg-danger">${r.category}</span>`;
                racesListContainer.appendChild(li);
            });
        }
        renderRaces(races);

        document.getElementById("filter-classic")?.addEventListener("click", () => {
            playSoundEffect();
            renderRaces(races.filter(r => r.category === "Classic"));
        });
        document.getElementById("reset-filter")?.addEventListener("click", () => {
            playSoundEffect();
            renderRaces(races);
        });
    }

    // --- DRIVERS PAGE: Ваш точный список чемпионов со скриншота ---
    const driverLegends = [
        { name: "Lewis Hamilton", text: "7 World Titles", status: "Multi-Champion" },
        { name: "Michael Schumacher", text: "7 World Titles", status: "Multi-Champion" },
        { name: "Max Verstappen", text: "3 World Titles", status: "Multi-Champion" },
        { name: "Charles Leclerc", text: "Contender", status: "Active Driver" }
    ];
    const driversListContainer = document.getElementById("dynamic-drivers-list");
    if (driversListContainer) {
        function renderLegends(data) {
            driversListContainer.innerHTML = "";
            data.forEach(l => {
                const li = document.createElement("li");
                li.className = "list-group-item bg-dark text-light border-secondary mb-2 rounded d-flex justify-content-between align-items-center";
                li.innerHTML = `<span><strong>${l.name}</strong> - ${l.text}</span> <span class="badge bg-danger">${l.status}</span>`;
                driversListContainer.appendChild(li);
            });
        }
        renderLegends(driverLegends);

        document.getElementById("filter-multi")?.addEventListener("click", () => {
            playSoundEffect();
            renderLegends(driverLegends.filter(l => l.status === "Multi-Champion"));
        });
        document.getElementById("reset-drivers-filter")?.addEventListener("click", () => {
            playSoundEffect();
            renderLegends(driverLegends);
        });
    }
});
