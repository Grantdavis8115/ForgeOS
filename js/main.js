(function () {
  const currentPage =
    document.body.dataset.page ||
    location.pathname.split("/").pop() ||
    "index.html";

  // Active nav link
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // Mobile menu
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  menuToggle?.addEventListener("click", () => {
    mainNav?.classList.toggle("open");
  });

  // Search
  const searchForm = document.querySelector(".search-form");
  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = searchForm.querySelector("input");
    const query = input?.value.trim();
    if (!query) return;

    const onDocs = currentPage === "documentation.html";
    if (onDocs) {
      filterDocumentation(query);
    } else {
      location.href = `documentation.html?q=${encodeURIComponent(query)}`;
    }
  });

  // Documentation search from URL param
  if (currentPage === "documentation.html") {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      const input = document.querySelector(".search-form input");
      if (input) input.value = q;
      filterDocumentation(q);
    }
  }

  function filterDocumentation(query) {
    const sections = document.querySelectorAll("[data-doc-section]");
    const lower = query.toLowerCase();
    let visible = 0;

    sections.forEach((section) => {
      const text = section.textContent.toLowerCase();
      const match = text.includes(lower);
      section.style.display = match ? "" : "none";
      if (match) visible += 1;
    });

    let notice = document.getElementById("search-notice");
    if (!notice) {
      notice = document.createElement("p");
      notice.id = "search-notice";
      notice.className = "no-results";
      document.querySelector(".doc-content")?.prepend(notice);
    }

    notice.hidden = visible > 0;
    notice.textContent =
      visible > 0
        ? `Showing ${visible} result${visible === 1 ? "" : "s"} for “${query}”.`
        : `No documentation results for “${query}”. Try different keywords.`;
    notice.style.display = visible > 0 && query ? "block" : visible === 0 ? "block" : "none";
  }

  // FAQ accordion
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      item?.classList.toggle("open");
    });
  });

  // Account forms (client-side demo)
  const signupForm = document.getElementById("signup-form");
  signupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(signupForm);
    const user = {
      name: data.get("fullName"),
      email: data.get("email"),
    };
    localStorage.setItem("forgeUser", JSON.stringify(user));
    showAccountMessage("Account created. You can now sign in to ForgeOS.");
    signupForm.reset();
  });

  const loginForm = document.getElementById("login-form");
  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    showAccountMessage("Signed in successfully.");
  });

  const resetForm = document.getElementById("reset-form");
  resetForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    showAccountMessage("Password reset link sent to your email.");
    resetForm.reset();
  });

  function showAccountMessage(text) {
    let box = document.getElementById("account-feedback");
    if (!box) {
      box = document.createElement("p");
      box.id = "account-feedback";
      box.className = "card";
      box.style.marginTop = "16px";
      document.querySelector(".account-grid")?.after(box);
    }
    box.textContent = text;
  }

  // Package install buttons
  document.querySelectorAll("[data-install]").forEach((button) => {
    button.addEventListener("click", () => {
      const pkg = button.dataset.install;
      button.textContent = "Running";
      button.disabled = true;
      button.classList.add("btn-primary");
      console.info(`Launch requested: ${pkg}`);
    });
  });

  // Copy checksum
  const copyBtn = document.getElementById("copy-checksum");
  copyBtn?.addEventListener("click", async () => {
    const value = document.getElementById("iso-checksum")?.textContent || "";
    try {
      await navigator.clipboard.writeText(value.trim());
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy SHA256";
      }, 1500);
    } catch {
      copyBtn.textContent = "Copy failed";
    }
  });
})();
