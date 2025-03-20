function addTaskTemplate() {
  return ` 
<div class="floating-content">
  <div class="headline-add-task">
    <h1 class="h1-add-task">Add Task</h1>
    <div class="close-div" onclick="closeAddFloatingTask()">
      <img src="../assets/icons/close.svg" class="add-close-btn" alt="Close" />
    </div>
  </div>

  <div class="input-section">
    <div class="section-left">
      <div class="add-task-single">
        <label class="title-and-star" for="taskTitle">
          <h2>Title</h2>
          <span class="span-star">*</span>
        </label>
        <input id="taskTitle" class="input_at" type="text" placeholder="Enter a title" />
      </div>

      <div class="add-task-single">
        <label for="taskDescription">
          <h2>Description</h2>
        </label>
        <textarea id="taskDescription" class="textarea-add-task" placeholder="Enter a Description"></textarea>
      </div>

      <div class="add-task-single">
        <label class="title-and-star" for="addTaskDate">
          <h2>Due date</h2>
          <span class="span-star">*</span>
        </label>
        <div class="input-date-outside">
          <input oninput="formatDate(this)" id="addTaskDate" class="input-date" type="text" placeholder="dd/mm/yyyy" />
          <img src="../assets/icons/date_event.svg" alt="Date Picker" />
        </div>
      </div>
    </div>

    <div class="devider-ver"></div>

    <div class="section-right">
      <div class="add-task-single">
        <h2>Prio</h2>
        <div class="prio-section">
          <button id="btn1" color="rgba(255, 61, 0, 1);" onclick="buttonsColorSwitch('btn1')" class="button-prio">
            Urgent <img src="../assets/icons/urgent-red.svg" alt="Urgent" />
          </button>
          <button id="btn2" color="rgba(255, 168, 0, 1)" onclick="buttonsColorSwitch('btn2')" class="button-prio isSelected">
            Medium <img src="../assets/icons/medium-orange.svg" alt="Medium" />
          </button>
          <button id="btn3" color="rgba(122, 226, 41, 1)" onclick="buttonsColorSwitch('btn3')" class="button-prio">
            Low <img src="../assets/icons/low-green.svg" alt="Low" />
          </button>
        </div>
      </div>

      <div class="add-task-single">
        <label class="title-and-star" for="addTaskAssigned">
          <h2>Assigned to</h2>
        </label>
        <div class="assigned-input-outside">
          <div class="input-container-assigned" onclick="openDropdownAssigned()">
            <input id="addTaskAssigned" type="text" placeholder="Select contacts to assign" />
            <div class="container-arrow-img-dropdown">
              <img id="arrowAssigned" class="arrow-drop-down" src="../assets/icons/drop_up_arrwow.svg" alt="Dropdown" />
            </div>
          </div>
          <div id="dropDownMenuAssigned" class="main-drop-down drop-down-hide d-none"></div>
        </div>
      </div>

      <div id="selectedInitials" class="initial-container"></div>

      <div class="add-task-single">
        <div class="title-and-star">
          <h2>Category</h2>
          <span class="span-star">*</span>
        </div>

          <div id="addTaskCategory" class="input-container-category">
                <div class="drop-down-placeholder" onclick="openDropdownCategory()">
                  <div class="textfield">
                    <h2 id="selectedCategory">Select task category</h2>
                  </div>
                  <div class="container-arrow-img-dropdown">
                    <img id="arrowCategory" class="arrow-drop-down" src="../assets/icons/drop_up_arrwow.svg" />
                  </div>
                </div>
                <div id="dropDownMenuCategory" class="drop-down-field-category drop-down-hide d-none"></div>
          </div>
        </div>

      <div class="add-task-single">
        <label for="addTaskSubtasks">
          <h2>Subtasks</h2>
        </label>
        <div id="inputContainer" class="input-container-subtask" onclick="openSubtaskInput()">
          <input type="text" id="addTaskSubtasks" placeholder="Add new subtask" />
          <div class="container-arrow-img-dropdown" id="plusIcon">
            <img src="../assets/icons/add_plus.svg" alt="Add" />
          </div>
          <div class="input-other-icons d-none" id="otherIcons">
            <div class="container-icons" onclick="closeSubtaskInput(event)">
              <img src="../assets/icons/close.svg" alt="Close" />
            </div>
            <div class="hyphen"></div>
            <div class="container-icons" onclick="addSubtaksFromInput(event)">
              <img src="../assets/icons/check-blue.svg" alt="Check" />
            </div>
          </div>
        </div>
        <div class="subtask-content" id="addedSubtaks"></div>
      </div>
    </div>
  </div>

  <div class="required-section-floating">
    <div class="required-field">
      <span class="span-star">*</span>
      <p>This field is required</p>
    </div>
    <div class="bt-section">
      <button class="bt-clear">Clear x</button>
      <button class="bt-add-float-task">Create Task <img src="../assets/icons/check.svg" alt="Check" /></button>
    </div>
  </div>
</div>
`;
}

function assignedToTemplate(name, color, initials, i, isChecked) {
  return `
  <label id="innerDropmenu-${i}" class="inner-dropmenu" onclick="toggleContactsSelection(event, ${i})">
    <div class="contacts-line">
      <div style="background-color:${color}" class="circle-color">
        <span>${initials}</span>
      </div>
      <div class="contact">
        <span>${name}</span>
      </div>
    </div>
    <div class="checkbox">
      <input id="checkbox-${i}" ${isChecked ? 'checked' : ''} type="checkbox" name="checkbox" />
    </div>
  </label>`;
}

function categoryTemplate() {
  return `
  <div>
    <div onclick="selectCategory('Technical Task')" class="inner-task">
      <h2>Technical Task</h2>
    </div>
    <div onclick="selectCategory('User Story')" class="inner-task">
      <h2>User Story</h2>
    </div>
  </div>
  `;
}

function subtaskTemplate(i) {
  return `
    <div class="add-subtask" id="subtask-${i}">
      <ul>
        <li>${addSubtask[i]}</li>
      </ul>
      <div class="input-other-icons">
          <div class="subtask-icons" onclick="editSubtask(${i})">
            <img src="../assets/icons/edit.svg" alt="edit-icon" />
          </div>
          <div class="hyphen-subtask"></div>
          <div class="subtask-icons" onclick="deleteSubtask(${i})">
            <img src="../assets/icons/delete.svg" alt="delete-icon" />
          </div>
        </div>
    </div>`;
}

function editSubtaskTemplate(i, subtask) {
  return `
    <div class="input-container-edit">
      <input type="text" name="category" id="editSubtask-${i}" value="${subtask}"/>
      <div class="input-other-icons">
        <div class="container-icons" onclick="deleteSubtask()">
          <img src="../assets/icons/delete.svg" alt="delete-icon" />
        </div>
        <div class="hyphen"></div>
        <div class="container-icons" onclick="saveEditedSubtask(${i})">
          <img src="../assets/icons/check-blue.svg" alt="check-icon" />
        </div>
      </div>
    </div>`;
}

function initialsTemplate(initials, initialsColor) {
  return `   
    <div class="circle-color-checked-assigned" style="background-color: ${initialsColor}">
      <span>${initials}</span>
    </div>`;
}
