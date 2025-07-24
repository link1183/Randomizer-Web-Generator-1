(function () {
  function createTooltip(text, rect) {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = text;

    const margin = 8;
    let left = rect.right + margin;
    let top = rect.top + window.scrollY;

    const tooltipWidth = 250;
    const viewportWidth = window.innerWidth;
    if (left + tooltipWidth > viewportWidth) {
      left = rect.left - tooltipWidth - margin;
    }

    tooltip.style.position = "absolute";
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    document.body.appendChild(tooltip);
  }

  function removeTooltips() {
    document.querySelectorAll(".tooltip").forEach((el) => el.remove());
  }

  function setupSelect(select) {
    const selected = select.querySelector(".selected");
    const optionsContainer = select.querySelector(".options");
    const options = select.querySelectorAll(".option");

    selected.addEventListener("click", () => {
      optionsContainer.style.display =
        optionsContainer.style.display === "block" ? "none" : "block";
    });

    options.forEach((option) => {
      if (option.dataset.disabled === "true") {
        option.classList.add("disabled");
      }

      option.addEventListener("click", () => {
        if (option.dataset.disabled === "true") return;

        selected.textContent = option.textContent;
        selected.dataset.value = option.dataset.value;

        optionsContainer.style.display = "none";

        // The 'bubbles' option allows the event to propagate upward from the child to its ancestors.
        // This means a parent element can listen for events fired on its children.
        const event = new Event("change", { bubbles: true });
        select.dispatchEvent(event);
      });

      option.addEventListener("mouseover", () => {
        if (option.dataset.tooltipText) {
          const rect = option.getBoundingClientRect();
          createTooltip(option.dataset.tooltipText, rect);
        }
      });

      option.addEventListener("mouseout", removeTooltips);
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!select.contains(e.target)) {
        optionsContainer.style.display = "none";
        removeTooltips();
      }
    });

    Object.defineProperties(select, {
      value: {
        get() {
          return selected.dataset.value;
        },
        set(v) {
          const opt = select.querySelector(
            `.option[data-value="${v}"]:not(.disabled)`,
          );
          if (opt) {
            selected.textContent = opt.textContent;
            selected.dataset.value = v;

            const event = new Event("change", { bubbles: true });
            select.dispatchEvent(event);
          }
        },
      },
      selectedIndex: {
        get() {
          const val = selected.dataset.value;
          const opts = Array.from(select.querySelectorAll(".option"));
          return opts.findIndex(
            (o) => o.dataset.value === val && !o.classList.contains("disabled"),
          );
        },
      },
    });
  }

  document.querySelectorAll(".select").forEach((el) => setupSelect(el));
})();

function test() {
  // Get the dropdown you want
  const el = document.getElementById("select-test");
  // Get the selected value (usage identical to current code)
  console.log(el.value, typeof el.value);
  // Get the text content of the option (not used right now but might be in the future)
  // The text has to be trimmed and I haven't found a way around that for now
  console.log(el.querySelector(".selected").textContent.trim());
}

document.getElementById("update").addEventListener("click", () => {
  const el = document.getElementById("select-test");
  el.value = "2";
});

const el = document.getElementById("select-test");
el.addEventListener("change", test);
