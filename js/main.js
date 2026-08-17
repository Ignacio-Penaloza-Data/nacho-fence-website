document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // SCROLL REVEAL
    // ========================================

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("active");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });



    // ========================================
    // MOBILE MENU
    // ========================================

    const menuButton = document.getElementById("menuButton");
    const mobileNav = document.getElementById("mobileNav");

    if (menuButton && mobileNav) {

        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("open");
        });

        const mobileLinks = mobileNav.querySelectorAll("a");

        mobileLinks.forEach(function (link) {

            link.addEventListener("click", function () {
                mobileNav.classList.remove("open");
            });

        });

    }



    // ========================================
    // QUOTE FORM
    // ========================================

    const quoteForm = document.getElementById("quoteForm");
    const formMessage = document.getElementById("formMessage");

    if (quoteForm) {

        quoteForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            formMessage.textContent = "Sending...";

            const formData = new FormData(quoteForm);
            const payload = Object.fromEntries(formData.entries());

            try {

                const response = await fetch(
                    "https://nacho-fence-ai-api.vercel.app/api/quote",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    }
                );

                if (!response.ok) {
                    throw new Error("Request failed");
                }

                formMessage.textContent =
                    "Thank you! Your request has been received.";

                quoteForm.reset();

            } catch (error) {

                formMessage.textContent =
                    "Something went wrong. Please call 470-605-9958 instead.";

            }

        });

    }



    // ========================================
    // HERO SLIDESHOW
    // ========================================

    const slides = document.querySelectorAll(".hero-slide");

    const dots = document.querySelectorAll(".slider-dot");

    const nextButton = document.getElementById("nextSlide");

    const previousButton = document.getElementById("prevSlide");


    let currentSlide = 0;

    let slideTimer;



    function showSlide(index) {

        if (slides.length === 0) {
            return;
        }


        slides.forEach(function (slide) {
            slide.classList.remove("active");
        });


        dots.forEach(function (dot) {
            dot.classList.remove("active");
        });


        slides[index].classList.add("active");


        if (dots[index]) {
            dots[index].classList.add("active");
        }


        currentSlide = index;
    }



    function nextSlide() {

        let nextIndex = currentSlide + 1;


        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }


        showSlide(nextIndex);
    }



    function previousSlide() {

        let previousIndex = currentSlide - 1;


        if (previousIndex < 0) {
            previousIndex = slides.length - 1;
        }


        showSlide(previousIndex);
    }



    function startSlideShow() {

        clearInterval(slideTimer);


        slideTimer = setInterval(function () {

            nextSlide();

        }, 5000);

    }



    if (nextButton) {

        nextButton.addEventListener("click", function () {

            nextSlide();

            startSlideShow();

        });

    }



    if (previousButton) {

        previousButton.addEventListener("click", function () {

            previousSlide();

            startSlideShow();

        });

    }



    dots.forEach(function (dot) {

        dot.addEventListener("click", function () {

            const slideNumber = Number(
                dot.getAttribute("data-slide")
            );


            showSlide(slideNumber);

            startSlideShow();

        });

    });



    if (slides.length > 0) {

        showSlide(0);

        startSlideShow();

    }

});