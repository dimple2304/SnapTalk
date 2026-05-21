const tabControls = document.querySelector("#tab-control");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");

const activeClasses = ["font-bold", "text-indigo-600", "border-b-2", "border-indigo-600"];
const inactiveClasses = ["font-medium", "hover:underline", "hover:text-indigo-600"];

document.addEventListener("DOMContentLoaded", () => {

    initializeTabs(
        tabControls,
        tabBtns,
        tabPanes,
        activeClasses,
        inactiveClasses,
        "feedTabs"
    );
});