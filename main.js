let form = document.getElementById("form");
let edit = false;

let titel_Input = document.getElementById("titel_Input");
let beschreibung_Input = document.getElementById("beschreibung_Input");
let autor_Input = document.getElementById("autor_Input");
let kategorie_Input = document.getElementById("kategorie_Input");
let is_Wichtig = document.getElementById("is_Wichtig");
let is_Dringend = document.getElementById("is_Dringend");
let start_Input = document.getElementById("start_Input");
let end_Input = document.getElementById("end_Input");
let status_Input = document.getElementById("status_Input");

let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");


let formValidation = () => {
    msg.innerHTML = "";
    if (titel_Input.value === "") {
        console.log("failure");
        msg.innerHTML += "Task cannot be blank \n";
    }
    if (titel_Input.value.length > 255) {
        console.log("failure");
        msg.innerHTML += "Task cannot be longer than 255 characters \n";
    }
    if (beschreibung_Input.value === "") {
        console.log("failure");
        msg.innerHTML += "Description cannot be blank \n";
    }
    if (autor_Input.value === "") {
        console.log("failure");
        msg.innerHTML += "Autor cannot be blank \n";
    }
    if (autor_Input.value.length > 20) {
        console.log("failure");
        msg.innerHTML += "Autor cannot be longer than 20 characters \n";
    }
    if (kategorie_Input.value === "") {
        console.log("failure");
        msg.innerHTML += "Kategorie cannot be blank \n";
    }
    if (status_Input.value < 0 || status_Input.value > 100) {
        console.log("failure");
        msg.innerHTML += "Status must be between 0 and 100 \n";
    }
    if (msg.innerHTML == "") {
        console.log("success");
        acceptData();
        add.setAttribute("data-bs-dismiss", "modal");
        add.click();

        (() => {
            add.setAttribute("data-bs-dismiss", "");
        })();
    }
};
//danke an 3w schools für die suche
function myFunction() {
    var input, filter, ul, li, a, i, titel;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("tasks");
    li = ul.getElementsByClassName("task");
    console.log(li);
    for (i = 0; i < li.length; i++) {
        titel = li[i].getAttribute("meta");
        if (titel.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
let data = [{}];
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!edit) {
        formValidation();
    }
});
let acceptData = () => {
    data.push({
        titel: titel_Input.value,
        beschreibung: beschreibung_Input.value,
        autor: autor_Input.value,
        kategorie: kategorie_Input.value,
        isWichtig: is_Wichtig.checked,
        isDringend: is_Dringend.checked,
        start: start_Input.value,
        end: end_Input.value,
        status: status_Input.value,
    });

    localStorage.setItem("data", JSON.stringify(data));

    console.log(data);
    createTasks();
};
let createTasks = () => {
    tasks.innerHTML = "";
    data.map((x, y) => {
        return (tasks.innerHTML += `
    <div id=${y} class="task" meta="${x.titel}">
        <span class="hidden">${y}</span>
        <div class="box">
            <span class="fw-bold">${x.titel}</span>
            <div class="priority">
            </div>
        </div>
        <span class="small">Autor: ${x.autor}</span>
        <span class="small">Kategorie: ${x.kategorie}</span>
        <span class="small">Start:${x.start} Bis:  ${x.end}</span>
        <span class="small text-secondary">${x.beschreibung}</span>
        <br>
        
        
        <div class="myProgress">
            <div class="myBar">${x.status}%</div>
        </div>
        
        <br>
        <span class="options">
            <i onClick= "editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onClick ="deleteTask(this);createTasks()" class="fas fa-trash-alt"></i>
          </span>
    </div>
    `);
    });
    //for each element with the class mybar, set the width to the value of the status
    var bars = document.getElementsByClassName("myBar");
    for (var i = 0; i < bars.length; i++) {
        bars[i].style.width = data[i].status + "%";
    }
    var priority = document.getElementsByClassName("priority");
    for (var i = 0; i < priority.length; i++) {
        if (data[i].isWichtig && data[i].isDringend) {
            var priority = document.getElementsByClassName("priority");
            priority[i].innerHTML = "Sofort erledigen";
            priority[i].style.background = "red";
        } else if (data[i].isWichtig) {
            var priority = document.getElementsByClassName("priority");
            priority[i].innerHTML = "Einplanen und Wohlfühlen";
            priority[i].style.background = "orange";
        }
        else if (data[i].isDringend) {
            var priority = document.getElementsByClassName("priority");
            priority[i].innerHTML = "Gib es ab";
            priority[i].style.background = "yellow";
        }
        else {
            var priority = document.getElementsByClassName("priority");
            priority[i].innerHTML = "Weg damit";
            priority[i].style.background = "green";
        }

    }

    //apply the text to the priority


    resetForm();
};
let deleteTask = (e) => {
    console.log(e.parentElement.parentElement);
    e.parentElement.parentElement.remove();
    data.splice(e.parentElement.parentElement.id, 1);
    localStorage.setItem("data", JSON.stringify(data));
    console.log(data);
};
let editTask = (e) => {
    let selectedTaskID = e.parentElement.parentElement.id;
    var selectedTask = data[selectedTaskID];
    console.log(selectedTask+" "+selectedTaskID);
    

    titel_Input.value = selectedTask.titel;
    beschreibung_Input.value = selectedTask.beschreibung;
    autor_Input.value = selectedTask.autor;
    status_Input.value = selectedTask.status;
    kategorie_Input.value = selectedTask.kategorie;
    is_Wichtig.checked = selectedTask.isWichtig;
    is_Dringend.checked = selectedTask.isDringend;
    start_Input.value = selectedTask.start;
    end_Input.value = selectedTask.end;

    console.log(selectedTaskID);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        answer = e.submitter.id;
        console.log(answer);

        if (answer == "add") {
            
            $("div#" + selectedTaskID).remove();
            data.splice(selectedTaskID, 1);
            localStorage.setItem("data", JSON.stringify(data));
            console.log(data);
            formValidation();
            resetForm();
            location.reload();
        } else {
            resetForm();
        }

    });
};

let resetForm = () => {
    titel_Input.value = "";
    start_Input.value = "";
    beschreibung_Input.value = "";
    autor_Input.value = "";
    kategorie_Input.value = "";
    is_Wichtig.checked = false;
    is_Dringend.checked = false;
    start_Input.value = "";
    end_Input.value = "";
    status_Input.value = "";
};
(() => {
    data = JSON.parse(localStorage.getItem("data")) || [];
    console.log(data);
    createTasks();
})();
