const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  navigation.classList.toggle("open", !isOpen);
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation",
  );
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-wrap")) closeMenu();
});
window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));
  document.documentElement.classList.add("js");
}
const quotes = [
  {
    text: "They took a half-formed idea and gave it a voice, a personality, and a home Every detail felt like us—only better",
    name: "Jamie Lee",
    role: "Founder, Morrow · fictional client",
    initials: "JL",
  },
  {
    text: "From our first conversation to the final handover, the process felt clear and collaborative They made a complex idea feel beautifully simple",
    name: "Sam Rivera",
    role: "Co-founder, Orbit · fictional client",
    initials: "SR",
  },
  {
    text: "A thoughtful team with a sharp eye for the little things The result had the character and care we had been looking for",
    name: "Alex Chen",
    role: "Creative lead · fictional client",
    initials: "AC",
  },
];
let currentQuote = 0;
function showQuote(step) {
  currentQuote = (currentQuote + step + quotes.length) % quotes.length;
  const quote = quotes[currentQuote];
  document.querySelector("#quote-text").textContent = quote.text;
  document.querySelector("#quote-name").textContent = quote.name;
  document.querySelector("#quote-role").textContent = quote.role;
  document.querySelector("#quote-avatar").textContent = quote.initials;
  document.querySelector("#quote-count").textContent =
    `0${currentQuote + 1} / 03`;
  document.querySelectorAll("[data-quote]").forEach((button) => {
    const selected = Number(button.dataset.quote) === currentQuote;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  const quoteArea = document.querySelector(".quote-area");
  quoteArea.classList.remove("changing");
  void quoteArea.offsetWidth;
  quoteArea.classList.add("changing");
}
document
  .querySelector("#previous-quote")
  .addEventListener("click", () => showQuote(-1));
document
  .querySelector("#next-quote")
  .addEventListener("click", () => showQuote(1));
const projects = {
  morrow: {
    title: "Morrow Studio — Brand concept",
    description:
      "A visual direction for a fictional creative studio using natural materials, calm colours and simple typography, with stock photography to illustrate the concept",
    approach:
      "Start with a clear identity, choose a consistent colour palette and carry that direction through the website, typography and project cards",
  },
  orbit: {
    title: "Orbit Workspace — Website concept",
    description:
      "A website concept for a fictional workspace brand, with matching photography, clear service information and responsive layouts",
    approach:
      "Use a simple content hierarchy, readable type, and a consistent set of buttons Keep project details accessible through a keyboard-friendly dialog and make the layout adapt to smaller screens",
  },
};
const dialog = document.querySelector("#project-dialog");
document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projects[button.dataset.project];
    document.querySelector("#project-title").textContent = project.title;
    document.querySelector("#project-description").textContent =
      project.description;
    document.querySelector("#project-approach").textContent = project.approach;
    dialog.showModal();
    document.body.classList.add("modal-open");
  });
});
dialog
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () =>
  document.body.classList.remove("modal-open"),
);
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    dialog.close();
});
document
  .querySelector("#project-contact")
  .addEventListener("click", () => dialog.close());
document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = data.get("name").trim();
  const message = data.get("message").trim();
  const status = document.querySelector("#form-status");
  if (!name || message.length < 10) {
    status.textContent =
      "Please add your name and at least 10 characters about your idea";
    return;
  }
  const brief = `FORMA — PROJECT BRIEF\n\nName: ${name}\nEmail: ${data.get("email")}\nService: ${data.get("service")}\n\nThe idea:\n${message}\n\nCreated locally in the FORMA internship demo No message was sent`;
  const url = URL.createObjectURL(
    new Blob([brief], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "forma-project-brief.txt";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent =
    "Your brief is ready Check your downloads Nothing has been sent or stored online";
  const confirmation = document.querySelector(".brief-success");
  confirmation.hidden = false;
  confirmation.querySelector("button").focus();
});
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    let visibleCount = 0;
    projectCards.forEach((card) => {
      const matches =
        button.dataset.filter === "all" ||
        button.dataset.filter === card.dataset.category;
      card.hidden = !matches;
      card.classList.remove("show-project");
      if (matches) {
        visibleCount++;
        void card.offsetWidth;
        card.classList.add("show-project");
      }
    });
    document.querySelector("#project-count").textContent =
      `Showing ${visibleCount} project${visibleCount === 1 ? "" : "s"}`;
  });
});
document.querySelectorAll(".service-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    document.getElementById(button.getAttribute("aria-controls")).hidden =
      isOpen;
  });
});
let toastTimer;
function showToast(message) {
  const toast = document.querySelector(".toast");
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}
document.querySelectorAll(".choose-service").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".brief-success").hidden = true;
    document.querySelector("#form-status").textContent = "";
    document.querySelector("#service").value = button.dataset.service;
    document.querySelector("#contact").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    document.querySelector("#name").focus({ preventScroll: true });
    showToast("Service selected Tell us a little about your idea");
  });
});
const studioCard = document.querySelector(".studio-card");
studioCard.addEventListener("click", () => {
  const flipped = studioCard.classList.toggle("flipped");
  studioCard.setAttribute("aria-pressed", String(flipped));
  studioCard.setAttribute(
    "aria-label",
    flipped
      ? "Flip studio card back to the front"
      : "Flip studio card to see our approach",
  );
  studioCard
    .querySelector(".studio-card-front")
    .setAttribute("aria-hidden", String(flipped));
  studioCard
    .querySelector(".studio-card-back")
    .setAttribute("aria-hidden", String(!flipped));
});
document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("click", (event) => {
    const wave = document.createElement("span");
    wave.className = "click-wave";
    wave.setAttribute("aria-hidden", "true");
    const bounds = button.getBoundingClientRect();
    wave.style.left =
      (event.detail === 0 ? bounds.width / 2 : event.clientX - bounds.left) +
      "px";
    wave.style.top =
      (event.detail === 0 ? bounds.height / 2 : event.clientY - bounds.top) +
      "px";
    button.append(wave);
    setTimeout(() => wave.remove(), 700);
  });
});
document.querySelectorAll("[data-quote]").forEach((button) => {
  button.addEventListener("click", () =>
    showQuote(Number(button.dataset.quote) - currentQuote),
  );
});
const sections = document.querySelectorAll("main > section[id]");
const navLinks = document.querySelectorAll("#navigation a");
function updateScrollState() {
  document
    .querySelector(".header")
    .classList.toggle("scrolled", window.scrollY > 20);
  document
    .querySelector(".back-to-top")
    .classList.toggle("show", window.scrollY > 500);
  let currentSection = "";
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 160) currentSection = section.id;
  });
  navLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === "#" + currentSection;
    link.classList.toggle("current", isCurrent);
    if (isCurrent) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();
document.querySelector(".brief-again").addEventListener("click", () => {
  document.querySelector(".brief-success").hidden = true;
  document.querySelector("#contact-form").reset();
  document.querySelector("#form-status").textContent = "";
  document.querySelector("#name").focus();
});
