function logoutfunc(btn) {
    btn.addEventListener("click", async function () {
        try {
            const res = await fetch("/api/account/logout", {
                method: "POST"
            })
            const data = await res.json();
            if (data.success) {
                window.location.href = "/login";
            }
        } catch (err) {
            return err;
        }
    })
}