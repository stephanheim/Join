/**
 * Returns the HTML template string for the "Add Task" floating form.
 * This includes input fields for title, description, due date, priority, assignees, category, and subtasks.
 *
 * @returns {string} HTML string for the "Add Task" form.
 */
function addTaskTemplate() {
  return `
  <div class="floating-content">
    <div class="headline-add-task">
      <h1 class="h1-add-task">Add Task</h1>
      <div class="close-div" onclick="closeAddTaskFloating()">
        <img src="../assets/icons/close.svg" class="add-close-btn" alt="Close" />
      </div>
    </div>
    <form id="addTaskForm" class="add-task-form" onsubmit="createNewTask();return false;">
      <div class="input-section-floating">
        <div class="section-left">
          <div class="add-task-single">
            <label class="title-and-star" for="addTaskTitle">
              <h2>Title</h2>
              <span class="span-star">*</span>
            </label>
            <div>
              <input id="addTaskTitle" class="input_at" type="text" name="title" placeholder="Enter a title" />
              <span id="titleMessage" class="error-message"></span>
            </div>
          </div>
          <div class="add-task-single">
            <label for="addTaskDescription">
              <h2>Description</h2>
            </label>
            <textarea id="addTaskDescription" class="textarea-add-task" name="description"
              placeholder="Enter a Description"></textarea>
          </div>
          <div class="add-task-single">
            <label class="title-and-star" for="addTaskDate">
              <h2>Due date</h2>
              <span class="span-star">*</span>
            </label>
            <div>
              <div id="inputDate" class="input-date-outside">
                <input oninput="formatDate(this)" id="addTaskDate" class="input-date" name="date" type="text"
                  placeholder="dd/mm/yyyy" />
                <img src="../assets/icons/date_event.svg" onclick="openCalendar()" />
                <input type="date" id="hiddenDatePicker" class="hidden-date-picker" />
              </div>
              <span id="dateMessage" class="error-message"></span>
            </div>
          </div>
        </div>
        <div class="devider-ver"></div>
        <div class="section-right">
          <div class="add-task-single">
            <label for="btn1">
              <h2>Prio</h2>
            </label>
            <div class="button-section selected">
              <button id="btn1" type="button" color="rgba(255, 61, 0, 1);" class="button-prio"
                onclick="selectedPriority('Urgent', this)">
                Urgent <img src="../assets/icons/urgent-red.svg" />
              </button>
              <button id="btn2" type="button" color="rgba(255, 168, 0, 1)" class="button-prio isSelected"
                onclick="selectedPriority('Medium', this)">
                Medium <img src="../assets/icons/medium-orange.svg" />
              </button>
              <button id="btn3" type="button" color="rgba(122, 226, 41, 1)" class="button-prio"
                onclick="selectedPriority('Low', this)">
                Low <img src="../assets/icons/low-green.svg" />
              </button>
            </div>
          </div>
          <div class="add-task-single">
            <div class="title-and-star" for="">
              <h2>Assigned to</h2>
            </div>
            <div class="assigned-input-outside">
              <div class="input-container-assigned" id="assignedInputBorderColor" onclick="openDropdownAssigned()">
                <input id="addTaskAssigned" type="text" name="contacts" placeholder="Select contacts to assign" />
                <div class="container-arrow-img-dropdown">
                  <img id="arrowAssigned" class="arrow-drop-down" src="../assets/icons/drop_up_arrwow.svg" />
                </div>
              </div>
              <div id="dropDownMenuAssigned" class="main-drop-down drop-down-hide"></div>
            </div>
            <div id="selectedInitials" class="initial-container d-none"></div>
          </div>
          <div class="add-task-single">
            <div class="title-and-star">
              <h2>Category</h2>
              <span class="span-star">*</span>
            </div>
            <div id="addTaskCategory" class="input-container-category">
              <div class="category-container" onclick="openDropdownCategory()">
                <div id="categoryDropDown" class="drop-down-placeholder">
                  <div class="textfield">
                    <h2 id="selectedCategory">Select task category</h2>
                  </div>
                  <div class="container-arrow-img-dropdown">
                    <img id="arrowCategory" class="arrow-drop-down" src="../assets/icons/drop_up_arrwow.svg" />
                  </div>
                </div>
                <div id="dropDownMenuCategory" class="drop-down-field-category drop-down-hide"></div>
              </div>
              <span id="categoryMessage" class="error-message"></span>
            </div>
          </div>
          <div class="add-task-single">
            <label for="addTaskSubtasks">
              <h2>Subtasks</h2>
            </label>
            <div id="inputContainer" class="input-container-subtask" onclick="openSubtaskInput()">
              <input type="text" name="category" id="addTaskSubtasks" placeholder="Add new subtask"
                onkeydown="handleSubtaskEnter(event)" />
              <div class="container-arrow-img-dropdown" id="plusIcon">
                <img src="../assets/icons/add_plus.svg" />
              </div>
              <div class="input-other-icons d-none" id="otherIcons">
                <div class="container-icons" onclick="closeSubtaskInput(event)">
                  <img src="../assets/icons/close.svg" alt="close" />
                </div>
                <div class="hyphen"></div>
                <div class="container-icons" onclick="addSubtaksFromInput(event)">
                  <img src="../assets/icons/check-blue.svg" alt="check" />
                </div>
              </div>
            </div>
            <div class="subtask-content" id="addedSubtask"></div>
               <div id="requiredMobil" class="required-field-mobil">
              <span class="span-star">*</span>
              <p>This field is required</p>
            </div>
          </div>
        </div>
      </div>
      
        <div class="required-section-content">
          <div id="requiredDesktop" class="required-field-desctop">
            <span class="span-star">*</span>
            <p>This field is required</p>
          </div>
          <div class="bt-section">
            <button class="bt-clear" type="reset" onclick="clearAddTask()">
              Clear
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.2496 11.9998L17.4926 17.2428M7.00659 17.2428L12.2496 11.9998L7.00659 17.2428ZM17.4926 6.75684L12.2486 11.9998L17.4926
                6.75684ZM12.2486 11.9998L7.00659 6.75684L12.2486 11.9998Z" stroke="#2A3647" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
            <button class="bt-create-task" type="submit">Create Task<img src="../assets/icons/check.svg" /></button>
          </div>
      </div>
    </form>
  </div>
  `;
}

/**
 * Returns the HTML for a single contact item in the "Assigned to" dropdown menu.
 *
 * @param {string} name - Full name of the contact.
 * @param {string} color - Background color of the contact's circle.
 * @param {string} initials - Initials of the contact.
 * @param {number} i - Index of the contact in the list.
 * @param {boolean} isChecked - Whether the contact is currently selected.
 * @returns {string} HTML string for a contact dropdown item.
 */
function assignedToTemplate(name, color, initials, i, isChecked) {
  return `
  <div id="innerDropmenu-${i}" class="inner-dropmenu" onclick="toggleContactsSelection(event, ${i})">
    <div class="contacts-line">
      <div style="background-color:${color}" class="circle-color">
        <span>${initials}</span>
      </div>
      <div class="contact">
        <span>${name}</span>
      </div>
    </div>
    <div class="checkbox">
      <input id="checkbox-${i}" ${isChecked ? 'checked' : ''} type="checkbox" name="checkbox"
        onclick=" toggleContactsSelection(event, ${i})" />
    </div>
  </div>`;
}

/**
 * Returns the HTML template for the category selection dropdown.
 * Includes two static category options: "Technical Task" and "User Story".
 *
 * @returns {string} HTML string for the category dropdown menu.
 */
function categoryTemplate() {
  return `
  <div>
    <div onclick="selectCategory('Technical Task', event)" class="inner-task">
      <h2>Technical Task</h2>
    </div>
    <div onclick="selectCategory('User Story', event)" class="inner-task">
      <h2>User Story</h2>
    </div>
  </div>
  `;
}

/**
 * Returns the HTML string for a single subtask element with edit and delete icons.
 *
 * @param {number} i - Index of the subtask in the list.
 * @param {{ text: string }} subtask - Subtask object containing the text.
 * @returns {string} HTML string for a subtask item.
 */
function subtaskTemplate(i, subtask) {
  return `
  <div class="add-subtask" id="subtask-${i}">
    <ul>
      <li>${subtask.text}</li>
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

/**
 * Returns the HTML string for an editable subtask input field.
 * Includes save and delete icons for user interaction.
 *
 * @param {number} i - Index of the subtask in the list.
 * @param {{ text: string }} subtask - Subtask object containing the text to edit.
 * @returns {string} HTML string for the editable subtask input.
 */
function editSubtaskTemplate(i, subtask) {
  return `
  <div class="input-container-edit">
    <input type="text" name="category" id="editSubtask-${i}" value="${subtask.text}"
      onkeydown="handleSubtaskEnter(event)" />
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

/**
 * Returns the HTML for showing selected contact initials with a colored background.
 *
 * @param {string} initials - Initials of the contact.
 * @param {string} initialsColor - Background color for the initials circle.
 * @returns {string} HTML string for the initials circle.
 */
function initialsTemplate(initials, initialsColor) {
  return `
  <div class="circle-color-checked-assigned" style="background-color: ${initialsColor}">
    <span>${initials}</span>
  </div>`;
}

function moreContactsTemplate(dropDownMenuId, remaining) {
  return `
  <div class="more-contacts" onclick="event.stopPropagation(); showAllContacts('${dropDownMenuId}')">
    +${remaining} more
  </div>
  `;
}
