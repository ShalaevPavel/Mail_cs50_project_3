document.addEventListener('DOMContentLoaded', function () {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', () => compose_email('', '', ''));

    // By default, load the inbox
    load_mailbox('inbox');
});

function compose_email(default_subject = '', default_body = '', default_reciepant = '') {

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#distinct-email-view').style.display = 'none';

    // Clear out composition fields
    if (default_reciepant.length !== 0) {
        document.querySelector('#compose-recipients').value = default_reciepant;

    } else {
        document.querySelector('#compose-recipients').value = '';

    }
    console.log(default_subject.slice(0,2));
    console.log(default_subject.slice(0,2));
    console.log(default_subject.slice(0,2));
    if (default_subject.length !== 0 && default_subject.slice(0,2) === "Re") {
        document.querySelector('#compose-subject').value = default_subject;

    }
    else if (default_subject.length !== 0 && default_subject.slice(0,2) !== "Re"){
                document.querySelector('#compose-subject').value = 'Re:' + default_subject;

    }


    else {
        document.querySelector('#compose-subject').value = '';

    }
    if (default_body.length !== 0) {
        document.querySelector('#compose-body').value = default_body;

    } else {
        document.querySelector('#compose-body').value = '';

    }


    document.addEventListener('submit', function (event) {
        event.preventDefault();
        const recipients = document.querySelector('#compose-recipients').value;
        const subject = document.querySelector('#compose-subject').value;
        const body = document.querySelector('#compose-body').value;
        fetch('/emails', {
            method: 'POST',
            body: JSON.stringify({
                recipients: recipients,
                subject: subject,
                body: body
            })
        })
            .then(response => response.json())
            .then(result => {
                console.log(result);
            })
        load_mailbox('sent')


    })


}


function load_mailbox(mailbox) {

    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#distinct-email-view').style.display = 'none';
    document.querySelector('#distinct-email-view').innerHTML = "";

    fetch(`/emails/${mailbox}`).then(response => response.json()).then(emails => {
        let counter = 1;
        emails.forEach((email) => {

            const element = document.createElement('div');
            element.style.background = 'white'
            element.setAttribute('id', 'feature col');
            const body = email.body;
            const subj = email.subject;
            let h_1 = document.createElement('h4');
            let button_archive = document.createElement("button");
            let button_unarchive = document.createElement("button");
            button_archive.innerHTML = "Archive";
            button_unarchive.innerHTML = "Unarchive";
            button_archive.style.background = 'red';
            button_archive.style.color = 'white';
            button_unarchive.style.background = 'red';
            button_unarchive.style.color = 'white';
            h_1.innerHTML = `subject: ${subj}`;
            let h_2 = document.createElement('h6');
            let h_2_2 = document.createElement('h5');
            h_2_2.innerHTML = "";
            if (mailbox === "sent") {
                h_2_2.innerHTML = `to : ${email.recipients}`
            } else if (mailbox === "inbox") {
                h_2_2.innerHTML = `from : ${email.sender}`
            }
            h_2.innerHTML = `message: ${body}`;
            button_archive.addEventListener('click', () => {
                fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: true
                    })
                })
                load_mailbox('inbox');
            })//works

            button_unarchive.addEventListener('click', () => {
                fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: false
                    })

                })
                load_mailbox('inbox');
            })//works

            console.log(mailbox);
            element.append(h_1);
            element.append(h_2);
            element.append(h_2_2);
            let tmp_button = document.createElement("button");
            tmp_button.innerHTML = "View email";
            tmp_button.style.background = "blue";
            tmp_button.style.color = "white";
            element.append(tmp_button);

            if (mailbox === "inbox") {
                element.append(button_archive);
            }
            if (mailbox === "archive") {
                element.append(button_unarchive);
            }
            element.style.border = "thick solid #0066CC";
            element.style.borderRadius = "10px";
            if (email.read === true) {
                element.style.backgroundColor = "grey";
            }
            tmp_button.addEventListener('click', () => {
                fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        read: true
                    })
                })
                fetch(`/emails/${email.id}`).then(response => response.json()).then(this_email => {
                        tmp_div = document.createElement("div");
                        tmp_div.style.background = "linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)";
                        reply_button = document.createElement("button");
                        reply_button.innerHTML = "Reply";
                        reply_button.style.background = 'yellow';
                        let sender = document.createElement("h5");
                        let list_of_receivers = document.createElement("ul");
                        let subject = document.createElement("h2");
                        let body_ = document.createElement("h3");
                        subject.innerHTML = `Subject: ${this_email.subject}`;
                        sender.innerHTML = `From: ${this_email.sender}`;
                        tmp_div.append(sender);

                        tmp_div.append(`Sent to `);
                        this_email.recipients.forEach(recipient => {
                            list_of_receivers.append(`${recipient}`)


                        })
                        tmp_div.append(list_of_receivers);

                        tmp_div.append(subject);
                        body_.innerHTML = `Body: ${this_email.body} `
                        tmp_div.append(body_);
                        let timestamp = document.createElement("h6");
                        timestamp.innerHTML = `Was sent ${this_email.timestamp}`;
                        timestamp.style.textAlign = "right";
                        tmp_div.append(timestamp);
                        if (mailbox === 'inbox') {
                            tmp_div.append(reply_button);

                        }
                        console.log(this_email);
                        document.querySelector('#distinct-email-view').append(tmp_div);
                        document.querySelector('#emails-view').style.display = 'none';
                        document.querySelector('#compose-view').style.display = 'none';
                        document.querySelector('#distinct-email-view').style.display = 'inline';
                        reply_button.addEventListener("click", () => {
                            let body_1 = `On ${this_email.timestamp} ${this_email.sender} wrote: ${this_email.body} `
                            compose_email(this_email.subject, body_1, this_email.sender);
                        })
                    }
                )


            })


            document.querySelector("#emails-view").append(element);


        })

    })

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}