function getPostTime(dateString) {

    const postDate = new Date(dateString);
    const nowDate = new Date();
    const diff = Math.floor(nowDate - postDate) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    if (diff < 604800) return Math.floor(diff / 86400) + "d ago";

    return postDate.toLocaleDateString();
}

document.querySelectorAll(".post-time").forEach(element => {
    const rawDate = element.dataset.time;
    element.innerHTML = getPostTime(rawDate);

});