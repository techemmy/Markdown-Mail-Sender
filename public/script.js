const sendBtn = document.getElementById('send-btn');
const mailBodyContainer = document.getElementById("mail-body");
const username = document.getElementById('username')
const mailTo = document.getElementById('receiver-email')
const mailSubject = document.getElementById('mail-subject')
const maxNoOfMailText = document.getElementById('max-no-of-trials')
const MAX_NO_OF_EMAIL_SEND_TRIALS = 3
// const senderEmail = document.getElementById('sender-email')
// const senderPassword = document.getElementById('sender-password')


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

simplemde.codemirror.on("change", function () {
    const mailBody = simplemde.value().trim();

    if (mailBody.length > 1) {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
});

sendBtn.addEventListener('click', event => {
    event.preventDefault();

    const mailBody = simplemde.value().trim();
    if (mailBody.length < 1 || username.value.length < 1 || mailTo.value.length < 1 || mailSubject.value.length < 1) {
        alert("Make sure all fields are properly filled.")
        return
    }

    if (localStorage.getItem('emailsSent') > MAX_NO_OF_EMAIL_SEND_TRIALS) {
        alert("Maximum no of emails sent reached!");
        return
    }

    sendBtn.textContent = "Sending...";
    sendBtn.disabled = true;

    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            username: username.value,
            mailTo: mailTo.value.split(","),
            mailSubject: mailSubject.value,
            mailBody,
            // senderEmail: senderEmail.value,
            // senderPassword: senderPassword.value
        })
    }).then(async data => {

        const mailsSent = Number(localStorage.getItem('emailsSent'));
        if (!mailsSent) {
            localStorage.setItem('emailsSent', 1)
        } else {
            localStorage.setItem('emailsSent', mailsSent + 1)
        }

        const response = await data.json();
        console.log("Fetched", response);
        maxNoOfMailText.textContent = `${MAX_NO_OF_EMAIL_SEND_TRIALS - mailsSent}`;
        if (response.success) {
            console.log("success")
            sendBtn.textContent = "Sent...";
            setTimeout(() => {
                sendBtn.disabled = false;
                sendBtn.textContent = "Send";
            }, 1500);
        } else {
            console.log("failure")
            sendBtn.textContent = "Error sending mail";
            sendBtn.style.backgroundColor = "#FFCCCC";
            setTimeout(() => {
                sendBtn.style.backgroundColor = "#92E3A9";
                sendBtn.textContent = "Send";
                sendBtn.disabled = false;
            }, 2000);
        }

    }).catch(error => {
        alert("An error occured", error.response)
        sendBtn.disabled = false;
    })
});
