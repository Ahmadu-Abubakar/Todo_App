
const addBtn = document.getElementById("addBtn"); 
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const timeField = document.getElementById("time");







const BASE_URL = "https://todo-app-backend-xcfq.onrender.com";

async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem("access");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 401 || res.status === 403) {
    token = await refreshAccessToken();

    if (!token) return res;

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`
      }
    });
  }

  return res;
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh")
  
  if(!refreshToken){
    window.location.href = "login.html"
    return null;
  }

  const res = await fetchWithAuth(`${BASE_URL}/api/token/refresh/`, {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
      refresh : refreshToken
    })
  })

  const data = await res.json()

  if(res.ok) {
    localStorage.setItem('access',  data.access)
    return data.access
  }else{
    localStorage.clear()
    window.location.href = "login.html"
    return null;
  }
}


async function getTasks() {
  let token = localStorage.getItem("access");

  if(!token){
     setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  }

  const res = await fetchWithAuth(`${BASE_URL}/api/tasks/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  return data;
}



async function addTask() {
    let token = localStorage.getItem("access");
    const title = taskInput.value.trim();

    if (!title) return;

    let res = await fetchWithAuth(`${BASE_URL}/api/tasks/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title })
    });

    if (res.status === 401 || res.status === 403) {
        token = await refreshAccessToken();

        if (!token) return;

        res = await fetchWithAuth(`${BASE_URL}/api/tasks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title })
        });
    }

    if (res.ok) {
        taskInput.value = "";
        await loadTasks();
    }
}

window.deleteTask = async function(id) {
  let token = localStorage.getItem("access");

  let res = await fetchWithAuth(`${BASE_URL}/api/tasks/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 401 || res.status === 403) {
    token = await refreshAccessToken();
    if (!token) return;

    res = await fetchWithAuth(`${BASE_URL}/api/tasks/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  if (res.ok) {
    loadTasks(); // refresh UI
  }
};




function renderTasks(tasks = []) {
    taskList.innerHTML = "";


    tasks.forEach(task => {

        const niceTime = new Date(task.time_created).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });


        // localStorage.clear()

        taskList.innerHTML += `
            <div style="margin:10px 0; padding:10px; border:1px solid #ccc;">
                <input 
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id}, ${task.completed})"
                >

                <span style="
                    text-decoration:${task.completed ? "line-through" : "none"};
                ">
                    ${task.title}
                </span>

                <button id="deleteBtn" onclick="deleteTask(${task.id})"> -</button>
            </div>

            <span> ${niceTime} </span>

            <span onclick="editTask(${task.id}, '${task.title}')">
              ${task.title}
            </span>
        `;
    });
}

async function loadTasks() {
  let token = localStorage.getItem("access");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  let res = await fetchWithAuth(`${BASE_URL}/api/tasks/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 401 || res.status === 403) {
    token = await refreshAccessToken();
    if (!token) return;

    res = await fetchWithAuth(`${BASE_URL}/api/tasks/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  const data = await res.json();
  renderTasks(data.results || []);
}

window.editTask = async function(id, oldTitle) {
  const newTitle = prompt("Edit task:", oldTitle);

  if (!newTitle || newTitle.trim() === "") return;

  let token = localStorage.getItem("access");

  let res = await fetch(`${BASE_URL}/api/tasks/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title: newTitle
    })
  });

  if (res.status === 401 || res.status === 403) {
    token = await refreshAccessToken();
    if (!token) return;

    res = await fetch(`${BASE_URL}/api/tasks/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: newTitle
      })
    });
  }

  if (res.ok) {
    loadTasks();
  }
};

window.toggleTask = async function(id, currentStatus) {
  let token = localStorage.getItem("access");

  let res = await fetch(`${BASE_URL}/api/tasks/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      completed: !currentStatus
    })
  });

  if (res.status === 401 || res.status === 403) {
    token = await refreshAccessToken();
    if (!token) return;

    res = await fetch(`${BASE_URL}/api/tasks/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        completed: !currentStatus
      })
    });
  }

  if (res.ok) {
    loadTasks();
  }
};


    

    
document.getElementById("addBtn").addEventListener("click", addTask);

loadTasks();
