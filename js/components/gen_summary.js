function generateSummaryHTML(taskCounts) {
  return `
<div class="row-top">
          <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="todone-div hoverable box-shadow">
            <img src="../assets/img/pencil.svg" class="imgs-todo">
            <div class="numbers-div">
              <span class="number">${taskCounts.toDo}</span><span class="text-todo">To-do</span>
            </div>
          </div>
          <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="todone-div hoverable box-shadow">
            <img src="../assets/img/done.svg" class="imgs-todo">
            <div class="numbers-div">
              <span class="number">${taskCounts.done}</span>
              <span class="text-todo">Done</span>
            </div>
          </div>
        </div>
        <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="row-middle hoverable box-shadow">
          <div class="todone-div">
            <img src="../assets/img/urgent.svg" class="img-urgent no-invert">
            <div class="numbers-div">
              <span class="number">${taskCounts.urgent}</span>
              <span class="text-urgent">Urgent</span>
            </div>
          </div>
          <div class="middle-sep"></div>
          <div class="date-div"><span class="text-date">October 16, 2026</span> <span class="text-urgent">Upcoming
              Deadline</div>
        </div>
        <div class="row-bottom">
          <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="numbers-div tasks hoverable">
            <div class="numbers-toDo">
              <span class="number">${taskCounts.total}</span>
              <span class="text-todo">Tasks in Board</span>
            </div>
          </div>
          <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="numbers-div tasks hoverable">
            <div class="numbers-toDo">
              <span class="number">${taskCounts.inProgress}</span>
              <span class="text-todo">Tasks in Progress</span>
            </div>
          </div>
          <div onclick="setActiveNavBoard(); loadPageContentPath('board')" class="numbers-div tasks hoverable">
            <div class="numbers-toDo">
              <span class="number">${taskCounts.awaitingFeedback}</span>
              <span class="text-todo">Awaiting Feedback</span>
            </div>
          </div>
        </div>
`;
}


function generateSummaryNoTasksHTML() {
  return `
  <div class="row-top">
    <div onclick="loadPageContentPath('board')" class="todone-div hoverable box-shadow">
      <img src="../assets/img/pencil.svg" class="imgs-todo">
      <div class="numbers-div">
        <span class="number">0</span><span class="text-todo">To-do</span>
      </div>
    </div>
    <div onclick="loadPageContentPath('board')" class="todone-div hoverable box-shadow">
      <img src="../assets/img/done.svg" class="imgs-todo">
      <div class="numbers-div">
        <span class="number">0</span>
        <span class="text-todo">Done</span>
      </div>
    </div>
  </div>
  <div onclick="loadPageContentPath('board')" class="row-middle hoverable box-shadow">
    <div class="todone-div">
      <img src="../assets/img/urgent.svg" class="img-urgent no-invert">
      <div class="numbers-div">
        <span class="number">0</span>
        <span class="text-urgent">Urgent</span>
      </div>
    </div>
    <div class="middle-sep"></div>
    <div class="date-div"><span class="text-date">October 16, 2026</span> <span class="text-urgent">Upcoming
        Deadline</div>
  </div>
  <div class="row-bottom">
    <div onclick="loadPageContentPath('board')" class="numbers-div tasks hoverable">
      <div class="numbers-toDo">
        <span class="number">0</span>
        <span class="text-todo">Tasks in Board</span>
      </div>
    </div>
    <div onclick="loadPageContentPath('board')" class="numbers-div tasks hoverable">
      <div class="numbers-toDo">
        <span class="number">0</span>
        <span class="text-todo">Tasks in Progress</span>
      </div>
    </div>
    <div onclick="loadPageContentPath('board')" class="numbers-div tasks hoverable">
      <div class="numbers-toDo">
        <span class="number">0</span>
        <span class="text-todo">Awaiting Feedback</span>
      </div>
    </div>
  </div>
  `;
}