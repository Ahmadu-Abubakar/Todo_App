const registerBtn = document.getElementById("registerBtn");
const message = document.getElementById("message")


async function register() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm_password").value.trim();



    if (!username || !password || !confirmPassword) {
        message.textContent = "All fields are required!"
        message.style.color = "red"
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "password do not matched!!"
        message.style.color = "red"
        return; 
    }

    const res = await fetch("https://todo-app-backend-xcfq.onrender.com/api/register/", {
        method : 'POST',
        headers : {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            username : username,
            password : password
        })
    });




    const data = await res.json();
    console.log(data)
    
    if (res.ok) { 
        message.textContent = "Register Successfully!!!"
        message.style.color = "green"

        setTimeout (() => {
            window.location.href = "login.html"
        }, 1000)
    }else { 
        message.textContent = "Register Failed!"
        message.style.color = "red"
    }
}

registerBtn.addEventListener("click", register);


