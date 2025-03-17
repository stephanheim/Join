function addTaskTemplate() {
  return ` 
    <div class="floating-content">
      <div class="headline-add-task">
        <h1 class="h1-add-task">Add Task</h1>
        <div class="close-div" onclick="closeAddFloatingTask()">
          <img src="../assets/icons/close.svg" class="add-close-btn" />
        </div>
      </div>
      <div class="input-section">
        <div class="section-left">
          <div class="add-task-single">
            <div class="title-and-star">
              <h2>Title</h2>
              <span class="span-star">*</span>
            </div>
            <div>
              <input class="input_at" type="text" placeholder="Enter a title" />
            </div>
          </div>
          <div class="add-task-single">
            <div>
              <h2>Description</h2>
            </div>
            <div>
              <textarea class="textarea-add-task" name="" id="" placeholder="Enter a Description"></textarea>
            </div>
          </div>
                      <div class="add-task-single">
              <div class="title-and-star">
                <h2>Due date</h2>
                <span class="span-star">*</span>
              </div>
              <div>
                <input class="input-date" type="date" />
              </div>
            </div>
        </div>
        <div class="devider-ver"></div>
        <div>
          <div class="section-right">

            <div class="add-task-single">
              <div>
                <h2>Prio</h2>
              </div>
              <div class="prio-section">
                <button id="btn1" onclick="buttonsColorSwitch('btn1')" class="button-prio" color="rgba(255, 61, 0, 1);">
                  Urgent <img src="../assets/icons/urgent-red.svg" />
                </button>
                <button id="btn2" onclick="buttonsColorSwitch('btn2')" class="button-prio isSelected" color="rgba(255, 168, 0, 1)">
                  Medium <img src="../assets/icons/medium-orange.svg" />
                </button>
                <button id="btn3" onclick="buttonsColorSwitch('btn3')" class="button-prio" color="rgba(122, 226, 41, 1)">
                  Low <img src="../assets/icons/low-green.svg" />
                </button>
              </div>
            </div>
            <div class="add-task-single">
              <div class="title-and-star">
                <h2>Assigned to</h2>
              </div>
              <div id="dropDownMenuAssigned" class="main-drop-down d-none"></div>
                <div id="standardInput" class="input-container-assigned" onclick="openDropdownMenuAssigned()">
                    <input type="text" placeholder="Select contacts to assign" />
                  <div class="container-arrow-img-dropdown">
                    <img src="../assets/icons/drop-down-arrow.svg" />
              </div>
            </div>
          </div>
            <div class="add-task-single">
              <div class="title-and-star">
                <h2>Category</h2>
                <span class="span-star">*</span>
              </div>
              <div id="dropDownMenuCategory" onclick="closeDropdownMenuCategory()" class="drop-down-field-category d-none"></div>
              <div id="standardFieldCategory" onclick="openDropdownMenuCategory()" class="input-container-category">
                <div class="textfield">
                  <h2>Select task category</h2>
                </div>
                <div class="container-arrow-img-dropdown">
                  <img src="../assets/icons/drop-down-arrow.svg" />
                </div>
              </div>
            </div>
            <div class="add-task-single">
              <div>
                <h2>Subtasks</h2>
              </div>
              <div class="input-container-category">
                <input type="text" name="category" id="category" placeholder="Add new subtask" oninput="toggleIcons()" />
                <div class="container-arrow-img-dropdown" id="plusIcon">
                  <img src="../assets/icons/add_plus.svg" />
                </div>
                <div class="input-other-icons d-none" id="otherIcons">
                  <div class="container-icons" onclick="clearInput()">
                    <img src="../assets/icons/close.svg" alt="" />
                  </div>
                  <div class="hyphen"></div>
                  <div class="container-icons">
                    <img src="../assets/icons/check-blue.svg" alt="" />
                  </div>
                </div>
              </div>
              <div>
                <div class="add-subtask">
                  <ul>
                    <li>Contact Form</li>
                  </ul>
                  <div class="input-other-icons">
                    <div class="subtask-icons">
                      <img src="../assets/icons/edit.svg" alt="" />
                    </div>
                    <div class="hyphen-subtask"></div>
                    <div class="subtask-icons">
                      <img src="../assets/icons/delete.svg" alt="" />
                    </div>
                  </div>
                </div>
                <div class="add-subtask">
                  <ul>
                    <li>Write Legal Imprint</li>
                  </ul>
                  <div class="input-other-icons">
                    <div class="subtask-icons">
                      <img src="../assets/icons/edit.svg" alt="" />
                    </div>
                    <div class="hyphen-subtask"></div>
                    <div class="subtask-icons">
                      <img src="../assets/icons/delete.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          <button class="bt-add-float-task">Create Task<img src="../assets/icons/check.svg" /></button>
        </div>
      </div>
    </div>`;
}

function assignedToTemplate(name, color, initials) {
  return `    
      
        <label class="inner-dropmenu">
          <div class="contacts-line">
            <div style="background-color:${color}" class="circle-color">
              <span>${initials}</span>
            </div>
            <div class="contact">
              <span>${name}</span>
            </div>
          </div>
          <div class="checkbox">
            <input type="checkbox" name="checkbox" />
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
        <li>${subtaskNotes[i]}</li>
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

function editSubtaskTemplate(i, subtaskNotes) {
  return `
    <div class="input-container-edit">
      <input type="text" name="category" id="editSubtask-${i}" value="${subtaskNotes}"/>
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
