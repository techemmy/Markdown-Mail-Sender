const sendBtn = document.getElementById('send-btn');
const mailBodyContainer = document.getElementById("mail-body");
const mailFrom = document.getElementById('username')
const mailTo = document.getElementById('receiver-email')
const mailSubject = document.getElementById('mail-subject')


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

simplemde.codemirror.on("change", function(){
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
        if (mailBody.length < 1 || mailFrom.value.length < 1 || mailTo.value.length < 1 || mailSubject.value.length < 1) {
            alert("Make sure all fields are properly filled.")
            return
        }

        sendBtn.style.display = "none";
        fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                mailFrom: mailFrom.value,
                mailTo: mailTo.value.split(","),
                mailSubject: mailSubject.value,
                mailBody
            })
        }).then(async data => {
            console.log("Fetched", await data.json());
            sendBtn.style.display = "block";
        }).catch(error => {
            alert("An error occured, cound't send data")
            sendBtn.style.display = "block";
        })
    });
