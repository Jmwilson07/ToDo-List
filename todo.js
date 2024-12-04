let mainContainer = document.getElementById("todoItemsContainer");
let userinputid = document.getElementById("userid");
let addbutton = document.getElementById("addid");
let saveButton = document.getElementById("saveid");
let completedContainer = document.getElementById("completeditemsContainer");

addbutton.onclick = function() {
    let userinputtext = userinputid.value;
    if (userinputtext === "") {
        alert("Enter the valid text");
    } else {
        let todolength = todoItems.length;
        todolength += 1;
        let newtodo = {
            text: userinputtext,
            uniqueId: todolength,
            isChecked: false,
            isCompleted: false
        };
        appendtodolist(newtodo);
        todoItems.push(newtodo);
        userinputid.value = "";
    }
}

function getitemsfromLocalStorage() {
    let getitems = localStorage.getItem("todoList");
    return getitems ? JSON.parse(getitems) : [];
}

let todoItems = getitemsfromLocalStorage();

function linethrough(labelid, inputid, todoId, horinid) {
    let labelElementid = document.getElementById(labelid);
    let isLineThrough = labelElementid.classList.toggle("line");

    let completedtodo = document.getElementById(todoId);
    let horinline = document.getElementById(horinid);

    let todoIndex = todoItems.findIndex(i => "todo" + i.uniqueId === todoId);
    let todoObject = todoItems[todoIndex];

    if (isLineThrough) {
        completedContainer.appendChild(completedtodo);
        completedContainer.appendChild(horinline);
        todoObject.isCompleted = true;
    } else {
        mainContainer.appendChild(completedtodo);
        mainContainer.appendChild(horinline);
        todoObject.isCompleted = false;
    }

    todoObject.isChecked = !todoObject.isChecked; // Toggle checked state
}

function deletetodo(todoId, horinid) {
    let deletedlist = document.getElementById(todoId);
    let horizontalid = document.getElementById(horinid);

    if (mainContainer.contains(deletedlist)) {
        mainContainer.removeChild(deletedlist);
        mainContainer.removeChild(horizontalid);
    } else if (completedContainer.contains(deletedlist)) {
        completedContainer.removeChild(deletedlist);
        completedContainer.removeChild(horizontalid);
    }

    let index = todoItems.findIndex(i => "todo" + i.uniqueId === todoId);
    todoItems.splice(index, 1);
}

saveButton.onclick = function() {
    let jsonformat = JSON.stringify(todoItems);
    localStorage.setItem("todoList", jsonformat);
}

function appendtodolist(todo) {
    let todoId = "todo" + todo.uniqueId;
    let labelid = "label" + todo.uniqueId;
    let inputid = "input" + todo.uniqueId;
    let horizontalid = "horin" + todo.uniqueId;

    let listitem = document.createElement("li");
    listitem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    listitem.id = todoId;

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = inputid;
    inputElement.checked = todo.isChecked;
    inputElement.onclick = function() {
        linethrough(labelid, inputid, todoId, horizontalid);
    };
    inputElement.classList.add("form-check-input", "check-box-input");
    listitem.appendChild(inputElement);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", inputid);
    labelElement.classList.add("form-check-label", "checkbox-label");
    labelElement.id = labelid;
    labelElement.textContent = todo.text;
    if (todo.isCompleted) {
        labelElement.classList.add("line");
        completedContainer.appendChild(listitem);
    } else {
        mainContainer.appendChild(listitem);
    }
    listitem.appendChild(labelElement);

    let customCheckbox = document.createElement("div");
    customCheckbox.classList.add("custom-checkbox");
    customCheckbox.setAttribute("for", inputid);
    listitem.appendChild(customCheckbox);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon", "text-danger");
    deleteIcon.onclick = function() {
        deletetodo(todoId, horizontalid);
    };
    listitem.appendChild(deleteIcon);

    let horizonatalline = document.createElement("hr");
    horizonatalline.classList.add("bg-secondary");
    horizonatalline.id = horizontalid;

    if (todo.isCompleted) {
        completedContainer.appendChild(listitem);
        completedContainer.appendChild(horizonatalline);
    } else {
        mainContainer.appendChild(listitem);
        mainContainer.appendChild(horizonatalline);
    }
}

// Load existing todos
for (let todo of todoItems) {
    appendtodolist(todo);
}