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
      password :password
    })
  });
  
  const data = await res.json();
  
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);

  console.log(data)
  
  console.log("Logged in");
  console.log(password)
  console.log(username)
}


// async function getTasks() {
//   const token = localStorage.getItem("access");

//   const res = await fetch("https://your-backend-url/api/tasks/", {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });

//   const data = await res.json();
//   console.log(data);
// }

// button.addEventListener("click", () => {
//   login()
// })

