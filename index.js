let sources = [];

const descriptionEl = document.getElementById("description-el");
const inputBtn = document.querySelector(".input-button");
const descriptionList = document.querySelector(".source-description-container");
const listOfLink = document.querySelector(".source-link");

const deleteBtn = document.getElementById("deleteall-btn");

const sourcesFromLocalStorage = JSON.parse(localStorage.getItem("sources"));
if (sourcesFromLocalStorage) {
  sources = sourcesFromLocalStorage;
  render(sources);
}

//function to handle the event for the input button
function handleEvent() {
  if (descriptionEl.value) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTabUrl = tabs[0].url;

      const source = {
        description: descriptionEl.value,
        link: currentTabUrl,
      };

      sources.push(source);
      descriptionEl.value = "";
      localStorage.setItem("sources", JSON.stringify(sources));

      render(sources);
    });
  }
}

inputBtn.addEventListener("click", handleEvent);
descriptionEl.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    handleEvent();
  }
});

deleteBtn.addEventListener("dblclick", function () {
  localStorage.clear();
  sources = [];
  render(sources);
});

function render(sources) {
  const sourceDescriptions = sources
    .map(
      (source, index) => `
      <li class="source-item">
        <div class="source-content">
          <input class="source-description-text" type="text" value="${source.description}" readonly>
          
          <div class="edit-and-delete">

            <button class="edit-btn" data-index="${index}">Edit 
              <svg class="svg" viewBox="0 0 512 512">
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
            </button>

            <button class="delete-btn" id="tooltip" data-index="${index}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
                <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z" clip-rule="evenodd" fill-rule="evenodd"></path>
              </svg>
            </button>
          </div>

        </div>
        <a class="source-link" target='_blank' href='${source.link}'>${source.link}</a>
      </li>
      `
    )
    .join("");
  descriptionList.innerHTML = sourceDescriptions;

  // Adding event listeners for edit buttons
  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = button.getAttribute("data-index");
      toggleEditMode(index);
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = button.getAttribute("data-index");
      deleteItem(index);
    });
  });
}

function toggleEditMode(index) {
  const item = document.querySelector(
    `.source-item:nth-child(${parseInt(index) + 1})`
  );
  const input = item.querySelector(".source-description-text");
  const button = item.querySelector(".edit-btn");

  if (button.innerText.toLowerCase() === "edit") {
    button.innerText = "Save";
    input.removeAttribute("readonly");
    input.focus();
  } else {
    button.innerText = "Edit";
    input.setAttribute("readonly", "readonly");
    sources[index].description = input.value; // Updates the description in the sources array
    localStorage.setItem("sources", JSON.stringify(sources));
    render(sources);
  }
}

/* Delete function */
function deleteItem(index) {
  // Removes the item from the sources array
  sources.splice(index, 1);
  localStorage.setItem("sources", JSON.stringify(sources));
  render(sources);
}
