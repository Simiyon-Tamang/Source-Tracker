// Cache DOM references
const descriptionEl = document.getElementById("description-el");
const inputBtn = document.getElementById("input-btn");
const descriptionList = document.querySelector(".source-description");
const listOfLink = document.querySelector(".source-link");
const deleteBtn = document.getElementById("delete-btn");

let sources = JSON.parse(localStorage.getItem("sources")) || [];

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Update storage with debounce
const updateStorage = debounce(() => {
  try {
    localStorage.setItem("sources", JSON.stringify(sources));
  } catch (error) {
    console.error("Error updating storage:", error);
  }
}, 300);

// Render function optimized for individual updates
const renderItem = (source, index) => {
  const descriptionItem = document.createElement("li");
  descriptionItem.className = "source-item";
  descriptionItem.innerHTML = `
    ${source.description}
    <button class="edit-btn" data-index="${index}">Edit</button>
  `;
  descriptionList.appendChild(descriptionItem);

  const linkItem = document.createElement("li");
  linkItem.className = "source-item";
  linkItem.innerHTML = `
    <a class="source-link" target='_blank' href='${source.link}'>${source.link}</a>
  `;
  listOfLink.appendChild(linkItem);
};

const render = () => {
  descriptionList.innerHTML = "";
  listOfLink.innerHTML = "";
  sources.forEach(renderItem);
};

// Handle input
const handleInput = async () => {
  if (descriptionEl.value) {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const currentTabUrl = tabs[0].url;

      const source = {
        description: descriptionEl.value,
        link: currentTabUrl,
      };

      sources.push(source);
      descriptionEl.value = "";
      renderItem(source, sources.length - 1);
      updateStorage();
    } catch (error) {
      console.error("Error handling input:", error);
    }
  }
};

// Event listeners
inputBtn.addEventListener("click", handleInput);
descriptionEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleInput();
});

// Event delegation for edit buttons
descriptionList.addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-btn")) {
    const index = parseInt(event.target.dataset.index);
    // Implement edit functionality here
    console.log("Edit item at index:", index);
  }
});

deleteBtn.addEventListener("dblclick", () => {
  localStorage.clear();
  sources = [];
  render();
});

// Initial render
render();
