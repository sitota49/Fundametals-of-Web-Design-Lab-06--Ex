// Define UI Variables 
const taskInput = document.querySelector('#task');
const form = document.querySelector('#task-form');
const filter = document.querySelector('#filter');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const reloadIcon = document.querySelector('.fa');
const asc = document.querySelector('.asc');
const desc = document.querySelector('.desc');

let DB;

document.addEventListener('DOMContentLoaded', () => {
    let TasksDB = indexedDB.open('tasks', 1);

    TasksDB.onerror = function () {
        console.log('There was an error');
    }
    TasksDB.onsuccess = function () {
        // console.log('Database Ready');
        DB = TasksDB.result;

        displayTaskList();
    }


    TasksDB.onupgradeneeded = function (e) {
        let db = e.target.result;

        let objectStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });

        objectStore.createIndex('taskname', 'taskname', { unique: false });

        console.log('Database ready and fields created!');
    }

    form.addEventListener('submit', addNewTask);

    function addNewTask(e) {
        e.preventDefault();

        if (taskInput.value === '') {
            taskInput.style.borderColor = "red";

            return;
        }

        let newTask = {
            taskname: taskInput.value,
        }

        let transaction = DB.transaction(['tasks'], 'readwrite');
        let objectStore = transaction.objectStore('tasks');

        let request = objectStore.add(newTask);

        request.onsuccess = () => {
            form.reset();
        }
        transaction.oncomplete = () => {
            console.log('New appointment added');

            displayTaskList();
        }
        transaction.onerror = () => {
            console.log('There was an error, try again!');
        }

    }

    function displayTaskList() {

        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }

        let objectStore = DB.transaction('tasks').objectStore('tasks');

        objectStore.openCursor().onsuccess = function (e) {

            let cursor = e.target.result;

            if (cursor) {

                const li = document.createElement('li');
                li.setAttribute('data-task-id', cursor.value.id);
                li.className = 'collection-item';
                li.appendChild(document.createTextNode(cursor.value.taskname));
                const link = document.createElement('a');
                link.className = 'delete-item secondary-content';
                link.innerHTML = `
                 <i class="fa fa-remove"></i>
                &nbsp;
                <a href="/Lesson 04 [Lab 06]/Finished/edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a>
                `;
                li.appendChild(link);
                taskList.appendChild(li);
                cursor.continue();
            }
        }
    }

    taskList.addEventListener('click', removeTask);

    function removeTask(e) {

        if (e.target.parentElement.classList.contains('delete-item')) {
            if (confirm('Are You Sure about that ?')) {
                let taskID = Number(e.target.parentElement.parentElement.getAttribute('data-task-id'));
                let transaction = DB.transaction(['tasks'], 'readwrite');
                let objectStore = transaction.objectStore('tasks');
                objectStore.delete(taskID);

                transaction.oncomplete = () => {
                    e.target.parentElement.parentElement.remove();
                }

            }

        }

    }

    clearBtn.addEventListener('click', clearAllTasks);

    function clearAllTasks() {
        let transaction = DB.transaction("tasks", "readwrite");
        let tasks = transaction.objectStore("tasks");
        tasks.clear();
        displayTaskList();
        console.log("Tasks Cleared !!!");
    }

    asc.addEventListener('click', sort);
    desc.addEventListener('click', sort);

    function sort() {

        const lis = document.querySelectorAll('.collection-item');
        if (lis) {
            taskList.removeChild(taskList.firstChild);
            var i = lis.length;
            while (i--) {
                taskList.appendChild(lis[i]);
            }


        }

        asc.classList.toggle("disabled");
        desc.classList.toggle("disabled");


    }

});