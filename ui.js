window.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.querySelector(".mobile-menu-toggle");
    const infoBtn = document.querySelector(".mobile-info-toggle");
    const left = document.querySelector(".sidebar-left");
    const right = document.querySelector(".sidebar-right");
    const backdrop = document.querySelector(".backdrop");
  
    if (!menuBtn || !left || !right || !backdrop) return;
  
    const setExpanded = (btn, value) => {
      if (!btn) return;
      btn.setAttribute("aria-expanded", value ? "true" : "false");
    };
  
    const closeAll = () => {
      left.classList.remove("show");
      right.classList.remove("show");
      document.body.classList.remove("drawer-open");
      setExpanded(menuBtn, false);
      setExpanded(infoBtn, false);
      backdrop.hidden = true;
    };
  
    const openLeft = () => {
      right.classList.remove("show");
      left.classList.add("show");
      document.body.classList.add("drawer-open");
      setExpanded(menuBtn, true);
      setExpanded(infoBtn, false);
      backdrop.hidden = false;
    };
  
    const openRight = () => {
      left.classList.remove("show");
      right.classList.add("show");
      document.body.classList.add("drawer-open");
      setExpanded(menuBtn, false);
      setExpanded(infoBtn, true);
      backdrop.hidden = false;
    };
  
    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      left.classList.contains("show") ? closeAll() : openLeft();
    });
  
    infoBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      right.classList.contains("show") ? closeAll() : openRight();
    });
  
    backdrop.addEventListener("click", closeAll);
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });
  
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 1200px)").matches) closeAll();
    });
});
