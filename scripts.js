const emailInput = document.querySelector("input[type='email']");
const passwordInput = document.querySelector("input[type='password']");
const button = document.querySelector("button");
const message = document.getElementById("message");





button.addEventListener("click", () => {
    const email = emailInput.value
    const password = passwordInput.value
    
    if (email === " " || password === "") {
        message.textContent = "fill the all the fields";
        return
    }else{
        message.textContent = "Login successfully!!";
    }
})

