const sendBtn = document.getElementById('send-btn');

const mailBodyContainer = document.getElementById("mail-body");
var simplemde = new SimpleMDE({
    element: mailBodyContainer, autosave: {
        enabled: true,
        uniqueId: "MyUniqueID",
        delay: 1000,
    }
});

if (simplemde.value().trim().length > 1) {
       sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }

// I'm targetting the form element because the form textarea element is hidden by simplemde.js library
document.querySelector('form').addEventListener('keyup', () => {
    const mailBody = simplemde.value().trim();

    if (mailBody.length > 1) {
       sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
})

sendBtn.addEventListener('click', event => {
        event.preventDefault();

        const mailBody = simplemde.value().trim();
        if (mailBody.length > 10) {
            console.log(mailBody.length);
        }

        fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                mailTo: "ywwmrvzuo@emergentvillage.org",
                mailSubject: "Testing mailer",
                mailContent: mailBody
            })
        }).then(data => {
            console.log("Fetched", data);
        })
    });
