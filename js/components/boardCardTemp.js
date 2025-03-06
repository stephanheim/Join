function boardCardTemplate() {
  return `<div class="user-story-card">
        <div class="inner-card">
          <header class="headline-story-user">
            <div class="user-headline">
              <span class="span-headline">User Story</span>
            </div>
            <div class="img-close-div" onclick="closeBoardCard()">
              <img src="../assets/icons/close.svg" />
            </div>
          </header>
          <div>
            <h1>Kochwelt Page & Recipe Recommender</h1>
          </div>
          <div class="inner-text-build-start">
            <div>
              <span>Build start page with recipe recommendation.</span>
            </div>
            <div class="priority-content">
              <div>
                <p class="headline-boardcard">Due date:</p>
              </div>
              <div>
                <span>06/03/2025</span>
              </div>
            </div>
            <div>
              <div class="priority-content">
                <p class="headline-boardcard">Priority:</p>
                <div class="img-content">
                  <span>Medium </span>
                  <img src="../assets/icons/medium-orange.svg" />
                </div>
              </div>
            </div>
            <div>
              <p class="headline-boardcard">Assigned To:</p>
            </div>
            <div class="contact-container">
              <div class="contact-section">
                <div class="circle-content" style="background-color: rgba(31, 215, 193, 1)">
                  <p>EM</p>
                </div>
                <span>Emmanuel Mauer</span>
              </div>
              <div class="contact-section">
                <div class="circle-content" style="background-color: rgba(70, 47, 138, 1)">
                  <p>MB</p>
                </div>
                <span>Marcel Bauer</span>
              </div>
              <div class="contact-section">
                <div class="circle-content" style="background-color: rgba(0, 56, 255, 1)">
                  <p>AM</p>
                </div>
                <span>Anton Mayer</span>
              </div>
            </div>
            <div>
              <p class="headline-boardcard">Subtask</p>
            </div>
            <div>
              <div class="subtask">
                <div class="checkbox">
                  <input type="checkbox" />
                </div>
                <p>Implement Recipe Recommendation</p>
              </div>
              <div class="subtask">
                <div class="checkbox">
                  <input type="checkbox" />
                </div>
                  <p>Start Page Layout</p>
              </div>
            </div>

            <div class="delete-edit-section">
              <div class="edit">
                <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.68213 18.3967C3.13213 18.3967 2.6613 18.2009 2.26963 17.8092C1.87796 17.4176 1.68213 16.9467 1.68213 16.3967V3.39673C1.3988 3.39673 1.1613 3.3009 0.969629 3.10923C0.777962 2.91756 0.682129 2.68006 0.682129 2.39673C0.682129 2.1134 0.777962 1.8759 0.969629 1.68423C1.1613 1.49256 1.3988 1.39673 1.68213 1.39673H5.68213C5.68213 1.1134 5.77796 0.875895 5.96963 0.684229C6.1613 0.492562 6.3988 0.396729 6.68213 0.396729H10.6821C10.9655 0.396729 11.203 0.492562 11.3946 0.684229C11.5863 0.875895 11.6821 1.1134 11.6821 1.39673H15.6821C15.9655 1.39673 16.203 1.49256 16.3946 1.68423C16.5863 1.8759 16.6821 2.1134 16.6821 2.39673C16.6821 2.68006 16.5863 2.91756 16.3946 3.10923C16.203 3.3009 15.9655 3.39673 15.6821 3.39673V16.3967C15.6821 16.9467 15.4863 17.4176 15.0946 17.8092C14.703 18.2009 14.2321 18.3967 13.6821 18.3967H3.68213ZM3.68213 3.39673V16.3967H13.6821V3.39673H3.68213ZM5.68213 13.3967C5.68213 13.6801 5.77796 13.9176 5.96963 14.1092C6.1613 14.3009 6.3988 14.3967 6.68213 14.3967C6.96546 14.3967 7.20296 14.3009 7.39463 14.1092C7.5863 13.9176 7.68213 13.6801 7.68213 13.3967V6.39673C7.68213 6.1134 7.5863 5.8759 7.39463 5.68423C7.20296 5.49256 6.96546 5.39673 6.68213 5.39673C6.3988 5.39673 6.1613 5.49256 5.96963 5.68423C5.77796 5.8759 5.68213 6.1134 5.68213 6.39673V13.3967ZM9.68213 13.3967C9.68213 13.6801 9.77796 13.9176 9.96963 14.1092C10.1613 14.3009 10.3988 14.3967 10.6821 14.3967C10.9655 14.3967 11.203 14.3009 11.3946 14.1092C11.5863 13.9176 11.6821 13.6801 11.6821 13.3967V6.39673C11.6821 6.1134 11.5863 5.8759 11.3946 5.68423C11.203 5.49256 10.9655 5.39673 10.6821 5.39673C10.3988 5.39673 10.1613 5.49256 9.96963 5.68423C9.77796 5.8759 9.68213 6.1134 9.68213 6.39673V13.3967Z"
                  />
                </svg>
                <span>Delete</span>
              </div>
              <div class="hyphen"></div>
              <div class="edit">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.68213 16.3967H4.08213L12.7071 7.77173L11.3071 6.37173L2.68213 14.9967V16.3967ZM16.9821 6.32173L12.7321 2.12173L14.1321 0.721729C14.5155 0.338395 14.9863 0.146729 15.5446 0.146729C16.103 0.146729 16.5738 0.338395 16.9571 0.721729L18.3571 2.12173C18.7405 2.50506 18.9405 2.96756 18.9571 3.50923C18.9738 4.0509 18.7905 4.5134 18.4071 4.89673L16.9821 6.32173ZM15.5321 7.79673L4.93213 18.3967H0.682129V14.1467L11.2821 3.54673L15.5321 7.79673Z"
                  />
                </svg>
                <span>Edit</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
}
