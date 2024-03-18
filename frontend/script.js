const todoContainer = document.querySelector(".todo-container");
const inputTodo = document.getElementById("input-todo");
const inputDescrip = document.getElementById("input-descrip");
const inputFecha = document.getElementById("input-fecha");
const inputTiempoEstimado = document.getElementById("input-tiempo-estimado");

const addTodo = document.getElementById("add-todo");

const modalBG = document.querySelector(".modal-background");
const closeModal = document.querySelector("#close-modal");
const editTodoTitulo = document.getElementById("edit-todo-titulo");
const editTodoDescrip = document.getElementById("edit-todo-descrip");
const editTodoFecha = document.getElementById("edit-todo-fecha");
const editTodoCompleted = document.getElementById("edit-todo-completed");
const saveTodo = document.getElementById("save-todo");


const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

let todoArray = [];

const URL = "http://localhost:3005/todos";


async function get_Todos() {
  try {
    const resp = await fetch(URL);
    const data = await resp.json();
    return data;
  } catch (err) {
    return err;
  }
}

async function post_Todo() {
  try {
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: inputTodo.value,
        descripcion: inputDescrip.value,
        fecha: inputFecha.value,
        tiempoEstimado: parseInt(inputTiempoEstimado.value), 
        completed: false,
      }),
    };
    const resp = await fetch(URL, options);
    const data = await resp.json();
    return data;
  } catch (err) {
    return err;
  }
}

async function del_Todo(todoElem) {
    try {
      const del_url = URL + "/" + todoElem._id;
      let options = {
        method: "DELETE",
      };
      const resp = await fetch(del_url, options);
      const data = await resp.json();
      return data;
    } catch (err) {
      return err;
    }
}

async function edit_Todo(todoElem) {
  try {
      let edit_url = URL + "/" + todoElem._id; 
      let options = {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              titulo: editTodoTitulo.value,
              descripcion: editTodoDescrip.value,
              fecha: editTodoFecha.value,
              tiempoEstimado: parseInt(inputTiempoEstimado.value),
              completed: editTodoCompleted.checked,
          }),
      };
      const resp = await fetch(edit_url, options);
      const data = await resp.json();
      return data;
  } catch (err) {
      return err;
  }
}




function open_modal(todoElem) {
    editTodoTitulo.value= todoElem.titulo;
    editTodoDescrip.value=todoElem.descripcion;
    editTodoFecha.value = todoElem.fecha;
    editTodoCompleted.checked = todoElem.completed;
    modalBG.style.display = "block";
    closeModal.addEventListener("click", () => {
      modalBG.style.display = "none";
    });
    saveTodo.addEventListener("click", () => {
      modalBG.style.display = "none";
      edit_Todo(todoElem);
    });
    console.log(todoElem);
  }


  function display_Todos(todoArr) {
    todoArr.forEach((todoElem) => {
        // Parent
        let todo = document.createElement("div");
        todo.classList.add("todo");

        // Children
        let todoInfo = document.createElement("div");
        todoInfo.classList.add("todo-info");
        let todoBtn = document.createElement("form");
        todoBtn.classList.add("todo-btn");

        let todoName = document.createElement("p");
        todoName.classList.add("todo-titulo");
        todoName.innerHTML = todoElem.titulo;

        let todoDescripcion = document.createElement("p");
        todoDescripcion.classList.add("todo-descrip");
        todoDescripcion.innerHTML = todoElem.descripcion;

        let todoFecha = document.createElement("p");
        todoFecha.classList.add("todo-fecha");
        todoFecha.innerHTML = `Fecha: ${todoElem.fecha}`;

        let todoTiempoEstimado = document.createElement("p"); 
        todoTiempoEstimado.classList.add("todo-tiempo-estimado");
        todoTiempoEstimado.innerHTML = `Tiempo estimado: ${todoElem.tiempoEstimado} minutos`; 

        // Grand Children
        let todoCompleted = document.createElement("input");
        todoCompleted.classList.add("todo-completed");
        todoCompleted.setAttribute("type", "checkbox");
        todoCompleted.checked = todoElem.completed;

        let todoEdit = document.createElement("button");
        todoEdit.classList.add("todo-edit");
        todoEdit.innerHTML = "Editar";
        todoEdit.addEventListener("click", (e) => {
            e.preventDefault();
            open_modal(todoElem);
        });
        let todoDel = document.createElement("button");
        todoDel.classList.add("todo-delete");
        todoDel.innerHTML = "Eliminar";
        todoDel.addEventListener("click", () => {
            del_Todo(todoElem);
        });
        todoInfo.appendChild(todoCompleted);
        todoInfo.appendChild(todoName);
        todoInfo.appendChild(todoDescripcion);
        todoInfo.appendChild(todoFecha);
        todoInfo.appendChild(todoTiempoEstimado); 
        todoBtn.appendChild(todoEdit);
        todoBtn.appendChild(todoDel);

        todo.appendChild(todoInfo);
        todo.appendChild(todoBtn);

        todoContainer.appendChild(todo);
    });
}


// Función para filtrar las notas según la búsqueda
function filterTodos(searchTerm) {
    return todoArray.filter(todo => {
        const titleMatch = todo.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        const descriptionMatch = todo.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        const dateMatch = todo.fecha.toLowerCase().includes(searchTerm.toLowerCase());
        return titleMatch || descriptionMatch || dateMatch;
    });
}

// Event listener para el botón de búsqueda
searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
        const filteredTodos = filterTodos(searchTerm);
        todoContainer.innerHTML = ""; 
        display_Todos(filteredTodos);
    } else {
        todoContainer.innerHTML = ""; 
        display_Todos(todoArray); 
    }
});

// Event listener para la tecla Enter en el input de búsqueda
searchInput.addEventListener("keypress", event => {
    if (event.key === "Enter") {
        searchButton.click();
    }
});


get_Todos()
    .then(todoArr => {
        todoArray = todoArr;
        console.log(todoArray);
        display_Todos(todoArray);
    })
    .catch((err) => console.log(err));

    addTodo.addEventListener("click", async () => {
      if (inputTodo.value !== "" && inputDescrip.value !== "" && inputFecha.value !== "" && inputTiempoEstimado.value !== "") {
          await post_Todo(); 
          
          const updatedTodos = await get_Todos();
          todoArray = updatedTodos;
          todoContainer.innerHTML = ""; 
          display_Todos(todoArray); 
        
          inputTodo.value = "";
          inputDescrip.value = "";
          inputFecha.value = "";
          inputTiempoEstimado.value = ""; 
      }
  });
  
    
      