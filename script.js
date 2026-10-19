"use strict";

/* =========================================================
   DIVINELEGACY — AION 2 PROGRESSION GUIDE
   Elyos · Kochi EU
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initProgressionTabs();
  initGlossary();
  initCurrentYear();
  initMobileNavigation();
});

/* =========================================================
   1. PROGRESIÓN: EARLY / MID / LATE / ENDGAME
   ========================================================= */

function initProgressionTabs() {
  const tabs = document.querySelectorAll("#phaseTabs .tab-btn");
  const panels = document.querySelectorAll(
    ".phase-content-container .phase-pane"
  );

  if (!tabs.length || !panels.length) {
    console.error(
      "DivineLegacy: no se encuentran las pestañas o los paneles de progresión."
    );
    return;
  }

  function activateTab(tab) {
    const targetId = tab.dataset.target;
    const targetPanel = document.getElementById(targetId);

    // Comprueba que el botón apunta a un panel existente.
    if (!targetPanel || !targetPanel.classList.contains("phase-pane")) {
      console.error(
        `DivineLegacy: no existe el panel "${targetId}".`
      );
      return;
    }

    // Actualiza los botones.
    tabs.forEach((button) => {
      const isActive = button === tab;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
      button.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    // Muestra exclusivamente el panel seleccionado.
    panels.forEach((panel) => {
      const isActive = panel === targetPanel;

      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  }

  // Eventos de clic.
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(tab);
    });

    // Navegación accesible con el teclado.
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;

      switch (event.key) {
        case "ArrowRight":
          nextIndex = (index + 1) % tabs.length;
          break;

        case "ArrowLeft":
          nextIndex = (index - 1 + tabs.length) % tabs.length;
          break;

        case "Home":
          nextIndex = 0;
          break;

        case "End":
          nextIndex = tabs.length - 1;
          break;

        default:
          return;
      }

      event.preventDefault();
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    });
  });

  // Respeta la pestaña activa inicial o selecciona la primera.
  const initialTab =
    [...tabs].find((tab) => tab.classList.contains("active")) || tabs[0];

  activateTab(initialTab);
}

/* =========================================================
   2. GLOSARIO: BÚSQUEDA Y FILTRADO
   ========================================================= */

function initGlossary() {
  const searchInput = document.getElementById("gloSearch");
  const glossaryGrid = document.getElementById("gloGrid");

  if (!searchInput || !glossaryGrid) return;

  const glossary = [
    {
      term: "Abyss",
      category: "Contenido",
      description:
        "Zona de PvPvE donde se pueden conseguir recompensas y puntos de Abyss.",
    },
    {
      term: "Arcana",
      category: "Progresión",
      description:
        "Sistema de progresión asociado a recompensas de contenido avanzado.",
    },
    {
      term: "Ascension Trial",
      category: "Mazmorras",
      description:
        "Contenido de desafío avanzado que se desbloquea durante la progresión.",
    },
    {
      term: "Daevanion",
      category: "Progresión",
      description:
        "Sistema de progresión del personaje que aporta bonificaciones.",
    },
    {
      term: "Dungeon / Expedición",
      category: "Mazmorras",
      description:
        "Contenido instanciado para conseguir equipo y materiales.",
    },
    {
      term: "Gear Score / Item Level",
      category: "Equipo",
      description:
        "Valor del equipo que puede utilizarse como requisito de acceso a ciertas actividades.",
    },
    {
      term: "Kina",
      category: "Moneda",
      description:
        "Moneda del juego utilizada en compras y otros sistemas económicos.",
    },
    {
      term: "Legión",
      category: "Social",
      description:
        "Grupo de jugadores que se organiza para progresar y jugar en conjunto.",
    },
    {
      term: "Manastone",
      category: "Equipo",
      description:
        "Objeto que permite añadir estadísticas al equipo, según sus ranuras y reglas.",
    },
    {
      term: "Monolito",
      category: "Progresión",
      description:
        "Sistema de progresión que conviene revisar al avanzar en la historia.",
    },
    {
      term: "Nightmare",
      category: "Contenido",
      description:
        "Actividad avanzada con sus propios desafíos, intentos y recompensas.",
    },
    {
      term: "Odyle",
      category: "Recursos",
      description:
        "Recurso utilizado para reclamar determinadas recompensas de contenido.",
    },
    {
      term: "Sealed Dungeon",
      category: "Mazmorras",
      description:
        "Mazmorra sellada que puede proporcionar recompensas y materiales durante la progresión.",
    },
    {
      term: "Stigma",
      category: "Habilidades",
      description:
        "Sistema relacionado con las habilidades y la configuración del personaje.",
    },
    {
      term: "Stronghold",
      category: "Contenido",
      description:
        "Actividad relacionada con fortalezas y sus recompensas.",
    },
    {
      term: "Transcendence",
      category: "Contenido",
      description:
        "Actividad avanzada que puede proporcionar recompensas relevantes para progresar.",
    },
    {
      term: "Weekly Reset",
      category: "Rutina",
      description:
        "Reinicio semanal de determinadas entradas, misiones o recompensas. Comprueba el contador del juego.",
    },
  ];

  function normalizeText(value) {
    return value
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function createGlossaryCard(entry) {
    const card = document.createElement("article");
    card.className = "glossary-card";

    const category = document.createElement("span");
    category.className = "glossary-category";
    category.textContent = entry.category;

    const title = document.createElement("h3");
    title.textContent = entry.term;

    const description = document.createElement("p");
    description.textContent = entry.description;

    card.append(category, title, description);

    return card;
  }

  function renderGlossary(query = "") {
    const normalizedQuery = normalizeText(query);

    const filteredEntries = glossary.filter((entry) => {
      const searchableText = normalizeText(
        `${entry.term} ${entry.category} ${entry.description}`
      );

      return searchableText.includes(normalizedQuery);
    });

    glossaryGrid.replaceChildren();

    if (filteredEntries.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "glossary-empty";
      emptyMessage.textContent =
        "No se han encontrado términos. Prueba con otra palabra.";

      glossaryGrid.appendChild(emptyMessage);
      return;
    }

    const fragment = document.createDocumentFragment();

    filteredEntries.forEach((entry) => {
      fragment.appendChild(createGlossaryCard(entry));
    });

    glossaryGrid.appendChild(fragment);
  }

  searchInput.addEventListener("input", () => {
    renderGlossary(searchInput.value);
  });

  renderGlossary();
}

/* =========================================================
   3. AÑO AUTOMÁTICO EN EL FOOTER
   ========================================================= */

function initCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

/* =========================================================
   4. NAVEGACIÓN MÓVIL OPCIONAL
   ========================================================= */

function initMobileNavigation() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-menu]");

  if (!toggle || !navigation) return;

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!isExpanded));
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    });
  });
}