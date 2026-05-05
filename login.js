const button = document.getElementById("button")

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://todo-app-backend-xcfq.onrender.com/api/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      username : username, 
      password : password
    })
  });
  
  const data = await res.json();
  
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  return data;
}



if (button){

  button.addEventListener("click", async () => {
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");
  
    if (username === "" || password === "") {
      message.textContent = "username or password can't be Empty!!";
      message.style.color = "red";
      return;
    }
  
    const data = await login();
  
    if (data.access) {
      message.textContent = "Login successfully !";
      message.style.color = "green";
    } else {
      message.textContent = "Login failed !!";
      message.style.color = "red";
    }
    setTimeout(() => {
      window.location.href = "todo.html";
    }, 1000);
  
  });
}
