const taskInput = document.querySelector('#task');
const form = document.querySelector('#task-form');
const filter = document.querySelector('#filter');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');

const reloadIcon = document.querySelector('.fa');

let DB;

document.addEventListener('DOMContentLoaded', () => {

    let TasksDB = indexedDB.open('tasks', 2);

    TasksDB.onerror = function () {
        console.log('There was an error');
    }

    TasksDB.onsuccess = function () {

        DB = TasksDB.result;
        displayTaskList();
    }

    TasksDB.onupgradeneeded = function (e) {

        if (!db.objectStoreNames.contains('tasks')) {
            tasks = DB.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('taskname', 'taskname', { unique: false });
            console.log('Database ready and fields created!');
        } else {
            tasks = TasksDB.transaction.objectStore('tasks');
            console.log('Database ready!');
        }

        if (!tasks.indexNames.contains('timestamp')) {
            tasks.createIndex('timestamp', 'timestamp');
        }
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
            date: Date.now()
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
                <a href="./assetes/js/edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a>
                `;
                // Append link to li
                li.appendChild(link);
                // Append to UL 
                taskList.appendChild(li);
                cursor.continue();
            }
        }
    }

    // Remove task event [event delegation]
    taskList.addEventListener('click', removeTask);

    function removeTask(e) {

        if (e.target.parentElement.classList.contains('delete-item')) {
            if (confirm('Are You Sure about that ?')) {
                // get the task id
                let taskID = Number(e.target.parentElement.parentElement.getAttribute('data-task-id'));
                // use a transaction
                let transaction = DB.transaction(['tasks'], 'readwrite');
                let objectStore = transaction.objectStore('tasks');
                objectStore.delete(taskID);

                transaction.oncomplete = () => {
                    e.target.parentElement.parentElement.remove();
                }

            }

        }

    }

    //clear button event listener   
    clearBtn.addEventListener('click', clearAllTasks);

    //clear tasks 
    function clearAllTasks() {
        let transaction = DB.transaction("tasks", "readwrite");
        let tasks = transaction.objectStore("tasks");
        // clear the table.
        tasks.clear();
        displayTaskList();
        console.log("Tasks Cleared !!!");
    }


});