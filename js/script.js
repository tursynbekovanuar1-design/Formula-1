jQuery(document).ready(function ($) {
    console.log("F1 Portal: Engine started!");

    // --- 1. ЗВУКОВОЙ ЭФФЕКТ (Аудио клик) ---
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
            // Игнорируем блокировку автозвука до первого взаимодействия
        }
    }

    // --- 2. DAY / NIGHT THEME SWITCHER ---
    function applyTheme(theme) {
        if (theme === "light") {
            $("body").addClass("light-mode");
            $("#theme-toggle-btn").text("🌙 Night Mode");
        } else {
            $("body").removeClass("light-mode");
            $("#theme-toggle-btn").text("☀️ Day Mode");
        }
    }

    const savedTheme = localStorage.getItem("f1-theme") || "dark";
    applyTheme(savedTheme);

    $(document).on("click", "#theme-toggle-btn", function (e) {
        e.preventDefault();
        playSoundEffect();
        if ($("body").hasClass("light-mode")) {
            localStorage.setItem("f1-theme", "dark");
            applyTheme("dark");
            showToast("Theme Changed", "Switched to Night Mode");
        } else {
            localStorage.setItem("f1-theme", "light");
            applyTheme("light");
            showToast("Theme Changed", "Switched to Day Mode");
        }
    });

    // --- 3. DYNAMIC RACES LIST ---
    const races = [
        { name: "Monaco Grand Prix", circuit: "Circuit de Monaco", category: "Classic" },
        { name: "Silverstone Grand Prix", circuit: "Silverstone Circuit", category: "Classic" },
        { name: "Monza Grand Prix", circuit: "Autodromo Nazionale Monza", category: "High Speed" },
        { name: "Las Vegas Grand Prix", circuit: "Las Vegas Street Track", category: "Street Track" }
    ];

    function renderRaces(data) {
        const $container = $("#dynamic-races-list");
        if (!$container.length) return;
        $container.empty();
        data.forEach(r => {
            $container.append(`
                <li class="list-group-item mb-2 rounded d-flex justify-content-between align-items-center searchable-item highlightable">
                    <span><strong>${r.name}</strong> - <em>${r.circuit}</em></span>
                    <span class="badge bg-danger">${r.category}</span>
                </li>
            `);
        });
    }

    renderRaces(races);

    $(document).on("click", "#filter-classic", function (e) {
        e.preventDefault();
        playSoundEffect();
        renderRaces(races.filter(r => r.category === "Classic"));
    });

    $(document).on("click", "#reset-filter", function (e) {
        e.preventDefault();
        playSoundEffect();
        renderRaces(races);
    });

    // --- 4. DYNAMIC DRIVERS LIST ---
    const driverLegends = [
        { name: "Lewis Hamilton", text: "7 World Titles", status: "Multi-Champion" },
        { name: "Michael Schumacher", text: "7 World Titles", status: "Multi-Champion" },
        { name: "Max Verstappen", text: "3 World Titles", status: "Multi-Champion" },
        { name: "Charles Leclerc", text: "Contender", status: "Active Driver" }
    ];

    function renderLegends(data) {
        const $container = $("#dynamic-drivers-list");
        if (!$container.length) return;
        $container.empty();
        data.forEach(l => {
            $container.append(`
                <li class="list-group-item mb-2 rounded d-flex justify-content-between align-items-center searchable-item highlightable">
                    <span><strong>${l.name}</strong> - <em>${l.text}</em></span>
                    <span class="badge bg-danger">${l.status}</span>
                </li>
            `);
        });
    }

    renderLegends(driverLegends);

    $(document).on("click", "#filter-multi", function (e) {
        e.preventDefault();
        playSoundEffect();
        renderLegends(driverLegends.filter(l => l.status === "Multi-Champion"));
    });

    $(document).on("click", "#reset-drivers-filter", function (e) {
        e.preventDefault();
        playSoundEffect();
        renderLegends(driverLegends);
    });

    // --- 5. SEARCH, AUTOCOMPLETE & HIGHLIGHTING ---
    const searchData = [
        "Monaco Grand Prix", "Silverstone Grand Prix", "Monza Grand Prix", "Las Vegas Grand Prix",
        "Lewis Hamilton", "Michael Schumacher", "Max Verstappen", "Charles Leclerc",
        "Red Bull Racing", "Ferrari", "McLaren"
    ];

    $(document).on("keyup input", "#global-search-input", function () {
        let query = $(this).val().toLowerCase().trim();
        let $suggestions = $("#autocomplete-list");
        $suggestions.empty();

        $(".searchable-item").each(function () {
            let text = $(this).text().toLowerCase();
            if (text.includes(query) || query === "") {
                $(this).fadeIn(200);
            } else {
                $(this).fadeOut(200);
            }
        });

        if (query.length > 0) {
            let matches = searchData.filter(item => item.toLowerCase().includes(query));
            if (matches.length > 0) {
                matches.forEach(match => {
                    $suggestions.append(`<li class="dropdown-item search-suggest-item" style="cursor:pointer;">${match}</li>`);
                });
                $suggestions.show();
            } else {
                $suggestions.hide();
            }
        } else {
            $suggestions.hide();
        }

        highlightText(query);
    });

    $(document).on("click", ".search-suggest-item", function () {
        let val = $(this).text();
        $("#global-search-input").val(val).trigger("keyup");
        $("#autocomplete-list").hide();
    });

    function highlightText(keyword) {
        $(".highlightable").each(function () {
            let $el = $(this);
            if (!$el.data("original-html")) {
                $el.data("original-html", $el.html());
            }
            let original = $el.data("original-html");

            if (!keyword) {
                $el.html(original);
                return;
            }

            let regex = new RegExp("(" + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ")", "gi");
            let highlighted = original.replace(regex, '<mark class="highlight-search">$1</mark>');
            $el.html(highlighted);
        });
    }

    // --- 6. ACCORDION ---
    $(document).on("click", ".accordion-header-custom", function () {
        playSoundEffect();
        $(this).toggleClass("active");
        $(this).next(".accordion-content-custom").slideToggle(300);
    });

    // --- 7. RATING STARS (КРАСНАЯ ПОДСВЕТКА И ФИКСАЦИЯ) ---
    let currentRating = 0;

    $(document).on("mouseenter", "#rating-stars .star", function () {
        const hoverIndex = $(this).index();
        $("#rating-stars .star").each(function (index) {
            if (index <= hoverIndex) {
                $(this).addClass("hovered");
            } else {
                $(this).removeClass("hovered");
            }
        });
    });

    $(document).on("mouseleave", "#rating-stars", function () {
        $("#rating-stars .star").removeClass("hovered");
    });

    $(document).on("click", "#rating-stars .star", function () {
        playSoundEffect();
        currentRating = $(this).index() + 1;
        const ratingValue = $(this).attr("data-value");

        $("#rating-stars .star").each(function (index) {
            if (index < currentRating) {
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        });

        $("#rating-feedback").text(`Thank you for rating us ${ratingValue} out of 5 stars!`);
        showToast("Rating Received", `You rated us ${ratingValue}/5 stars!`);
    });

    // --- 8. POPUP MODAL ---
    $(document).on("click", "#open-popup-btn", function (e) {
        e.preventDefault();
        playSoundEffect();
        $("#popup-modal").css("display", "flex");
    });

    $(document).on("click", "#close-popup-btn", function () {
        $("#popup-modal").css("display", "none");
    });

    $(window).on("click", function (e) {
        if (e.target === $("#popup-modal")[0]) {
            $("#popup-modal").css("display", "none");
        }
    });

    // --- 9. TOAST NOTIFICATIONS ---
    function showToast(title, message) {
        let toastHtml = `
            <div class="toast align-items-center text-bg-danger border-0 show custom-toast" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <strong>${title}:</strong> ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>`;
        $("#toast-container").append(toastHtml);
        setTimeout(() => {
            $("#toast-container .toast").first().fadeOut(400, function () { $(this).remove(); });
        }, 3500);
    }

    // --- 10. CLIPBOARD COPY ---
    $(document).on("click", ".btn-copy", function (e) {
        e.preventDefault();
        playSoundEffect();
        let targetSelector = $(this).data("clipboard-target");
        let textToCopy = $(targetSelector).text().trim();
        let $btn = $(this);

        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                let originalText = $btn.html();
                $btn.html('✓ Copied!');
                showToast("Clipboard", `Copied "${textToCopy}" to clipboard!`);
                setTimeout(() => { $btn.html(originalText); }, 2500);
            });
        }
    });

    // --- 11. FORM SUBMIT SPINNER ---
    const contactForm = $("#contact-form");
    if (contactForm.length) {
        contactForm.on("submit", function (e) {
            e.preventDefault();
            let $btn = $(this).find('button[type="submit"]');
            let originalBtnText = $btn.html();

            let isValid = true;
            const name = $("#name");
            const email = $("#email");
            const message = $("#message");

            if (!name.val().trim()) { name.addClass("is-invalid"); isValid = false; }
            else { name.removeClass("is-invalid").addClass("is-valid"); }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.val().trim() || !emailPattern.test(email.val())) { email.addClass("is-invalid"); isValid = false; }
            else { email.removeClass("is-invalid").addClass("is-valid"); }

            if (!message.val().trim() || message.val().trim().length < 5) { message.addClass("is-invalid"); isValid = false; }
            else { message.removeClass("is-invalid").addClass("is-valid"); }

            if (isValid) {
                $btn.prop("disabled", true).html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Please wait...');

                setTimeout(() => {
                    playSoundEffect();
                    $btn.prop("disabled", false).html(originalBtnText);
                    contactForm[0].reset();
                    name.removeClass("is-valid");
                    email.removeClass("is-valid");
                    message.removeClass("is-valid");

                    showToast("Success", "Your message has been sent successfully!");
                }, 2000);
            } else {
                showToast("Error", "Please fill out all required fields correctly.");
            }
        });
    }

    // --- 12. ANIMATIONS, SCROLL & CLOCK ---
    $(window).on("scroll", function () {
        let winScroll = $(window).scrollTop();
        let height = $(document).height() - $(window).height();
        let scrolled = (height > 0) ? (winScroll / height) * 100 : 0;
        $("#scroll-progress").css("width", scrolled + "%");
    });

    if ($(".counter-value").length) {
        $(".counter-value").each(function () {
            let $this = $(this);
            let countTo = parseInt($this.attr("data-count"));
            $({ countNum: 0 }).animate(
                { countNum: countTo },
                {
                    duration: 2000,
                    easing: "swing",
                    step: function () { $this.text(Math.floor(this.countNum)); },
                    complete: function () { $this.text(this.countNum); }
                }
            );
        });
    }

    function updateClock() {
        const clockElement = $("#live-clock");
        if (clockElement.length) {
            const now = new Date();
            const options = {
                month: 'long', day: 'numeric', year: 'numeric',
                hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
            };
            clockElement.text(now.toLocaleString('en-US', options));
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 13. LAZY LOADING ---
    function lazyLoadImages() {
        $("img.lazy-load").each(function () {
            let $img = $(this);
            let realSrc = $img.data("src");
            if (realSrc && ($img.attr("src") !== realSrc)) {
                let imgTop = $img.offset().top;
                let winBottom = $(window).scrollTop() + $(window).height();

                if (imgTop < winBottom + 150) {
                    $img.attr("src", realSrc).removeClass("lazy-load");
                }
            }
        });
    }
    $(window).on("scroll resize", lazyLoadImages);
    lazyLoadImages();
});
