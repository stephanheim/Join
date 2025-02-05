function addTaskTemplate() {
  return ` 
      <div class="floating-content">
        <div class="headline-add-task">
          <h1 class="h1-add-task">Add Task</h1>
        </div>
        <section class="input-section">
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
                <h2>Assigned to</h2>
              </div>
              <div class="drop-down-menu">
                <div>
                  <h2>Select contacts to assign</h2>
                </div>
                <div>
                  <img class="assigned-arrow" src="../assets/icons/drop-down-arrow.svg" />
                </div>
              </div>
            </div>
          </div>
          <div class="devider-ver"></div>
          <div>
            <div class="section-right">
              <div class="add-task-single">
                <div class="title-and-star">
                  <h2>Due date</h2>
                  <span class="span-star">*</span>
                </div>
                <div>
                  <input class="input-date" type="date" />
                </div>
              </div>
              <div class="add-task-single">
                <div>
                  <h2>Prio</h2>
                </div>
                <div class="prio-section">
                  <button class="button-prio-urgent">Urgent <img src="../assets/icons/urgent.svg" /></button>
                  <button class="button-prio-medium">Medium <img src="../assets/icons/medium-orange.svg" /></button>
                  <button class="button-prio-low">Low <img src="../assets/icons/low.svg" /></button>
                </div>
              </div>
              <div class="add-task-single">
                <div class="title-and-star">
                  <h2>Category</h2>
                  <span class="span-star">*</span>
                </div>
                <div class="drop-down-menu">
                  <div>
                    <h2>Select task category</h2>
                  </div>
                  <div>
                    <img class="assigned-arrow" src="../assets/icons/drop-down-arrow.svg" />
                  </div>
                </div>
              </div>
              <div class="add-task-single">
                <div>
                  <h2>Subtasks</h2>
                </div>
                <div>
                  <input class="input_at" type="search" placeholder="Add new subtask" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="required-section">
          <div class="required-field">
            <span class="span-star">*</span>
            <p>This field is required</p>
          </div>
          <div class="bt-section">
            <button class="bt-clear" onclick="closeAddFloatingTask()">Clear x</button>
            <button class="bt-add-task">Create Task<img src="../assets/icons/check.svg" /></button>
          </div>
        </div>
      </div>`;
}
