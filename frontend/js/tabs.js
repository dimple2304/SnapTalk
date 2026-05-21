function initializeTabs(
    tabControls,
    tabBtns,
    tabPanes,
    activeClasses,
    inactiveClasses,
    storageKey = "activeTabId"
) {

    let activeTabId =
        localStorage.getItem(storageKey) ||
        tabBtns[0].dataset.target;

    tabBtns.forEach(btn => {
        const pane = document.querySelector(btn.dataset.target);

        if (btn.dataset.target === activeTabId) {
            btn.classList.add(...activeClasses);
            btn.classList.remove(...inactiveClasses);

            pane?.classList.remove("hidden");
        } else {
            btn.classList.add(...inactiveClasses);
            btn.classList.remove(...activeClasses);

            pane?.classList.add("hidden");
        }
    });

    tabControls.addEventListener("click", function (e) {

        const clickedBtn = e.target.closest(".tab-btn");

        if (!clickedBtn) return;

        localStorage.setItem(storageKey, clickedBtn.dataset.target);

        if (clickedBtn) {
            location.reload();
            return;
        }

        tabBtns.forEach(btn => {
            btn.classList.remove(...activeClasses);
            btn.classList.add(...inactiveClasses);
        });

        clickedBtn.classList.add(...activeClasses);
        clickedBtn.classList.remove(...inactiveClasses);

        tabPanes.forEach(pane => {
            pane.classList.add("hidden");
        });

        const targetPane =
            document.querySelector(clickedBtn.dataset.target);

        if (targetPane) {
            targetPane.classList.remove("hidden");
        }
    });
}

