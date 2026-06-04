function notifyMe(value) {
    if (Notification.permission === "granted") {
        new Notification("SnapTalk", {
            body: value,
            icon: "/images/logo2.png"
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification("SnapTalk", {
                    body: value,
                    icon: "/images/logo2.png"
                });
            }
        });
    }
}