function initSummary() {
  loadContactsFromFirebase();
}


function setActiveToBoard() {
  const toBoard = document.getElementById('sumToBoard');
  const removeSum = document.getElementById('removeActive');
  if (toBoard) {
    toBoard.classList.add('active');
    toBoard.style.pointerEvents = 'none';
  }
  if (removeSum) {
    removeSum.classList.remove('active');
    removeSum.style.pointerEvents = 'auto';
  }
}