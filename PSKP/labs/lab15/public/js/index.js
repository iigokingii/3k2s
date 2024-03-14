const addButton = document.getElementById('addButton');

if (addButton) {
    addButton.addEventListener('click', () => {
        window.location.href = '/adduser';
    });
}

const links = document.querySelectorAll('.link-with-columns');
if(links)
    links.forEach(link => {
        link.addEventListener('click', () => {
            window.location.href = `/updateuser?id=${link.id}`;
        });
    });
const sendButton = document.getElementById("sendButton");

if(sendButton)
    sendButton.addEventListener('click',async()=>{
        let fio = document.getElementById("fio").value;
        let phone = document.getElementById("phone").value;
        if(fio.trim()!=='' && phone.trim()!=='' && phoneValidation(phone)){
            const response = await fetch('/adduser', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                },
                body:JSON.stringify({
                    fio:fio,
                    phone:phone
                })
            })
            if(response.ok){
                alert('Data has been saved');
                window.location.href = "/";
            }
        }
        else{
            alert('Некорректные данные');
        }
    })

document.getElementById("declineButton").addEventListener('click',()=>{
    window.location.href = "/";
})

document.getElementById("changeButton").addEventListener('click',async()=>{
    let fio = document.getElementById("fio").value;
    let phone = document.getElementById("phone").value;
    let id = document.getElementById("updateid").value;
    if(fio.trim()!=='' && phone.trim()!==''&&phoneValidation(phone)){
        const response = await fetch('/updateuser', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body:JSON.stringify({
                id:id,
                fio:fio,
                phone:phone
            })
        })
        if(response.ok){
            alert('Data has been saved');
            window.location.href = "/";
        }
    }
    else{
        alert('Некорректные данные');
    }
})
const deleteButton = document.getElementById("deleteButton");
document.getElementById("fio").addEventListener('input',()=>{
    deleteButton.disabled = true;
})
document.getElementById("phone").addEventListener('input',()=>{
    deleteButton.disabled = true;
})
deleteButton.addEventListener('click',async()=>{
    let id = document.getElementById("updateid").value;
    const response = await fetch('/deleteuser', {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body:JSON.stringify({
            id:id
        })
    })
    if(response.ok){
        alert('Data has been deleted');
        window.location.href = "/";
    }
})

function phoneValidation(inputText){
    const regex = /^\+375\(\d{2}\)\d{3}-\d{2}-\d{2}$/;
    return regex.test(inputText);
}