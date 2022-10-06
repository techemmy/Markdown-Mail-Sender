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
        if (mailBody.length > 10) {
            fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    mailFrom: "TechEmmy",
                    mailTo: "ywwmrvzuo@emergentvillage.org",
                    mailSubject: "Testing mailer",
                    mailBody
                })
            }).then(async data => {
                console.log("Fetched", await data.json());
            }).catch(async error => {
                alert("An error occured, cound't fetch data")
            })
        }
    });
