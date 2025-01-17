// Map categories to JSON files
const categoryMap = {
  archeology: {
      title: "Archeology Tracker",
      dataFile: "./Assests/archeology-data.json",
      titleImage: "./Assests/spr_ui_museum_archaeology_wing_button_default.png",
      backgroundColour: "#d0c3be",
      overlayImage: "./Assests/museum_foreground_archeology.png",
      itemColour: "#b2a29f",
      itemOutline: "#877975",
  },
  fish: {
      title: "Fish Tracker",
      dataFile: "./Assests/fish-data.json",
      titleImage: "./Assests/spr_ui_museum_fish_wing_button_default.png",
      backgroundColour: "#bac8db",
      overlayImage: "./Assests/museum_foreground_fish.png",
      itemColour: "#a1a5b4",
      itemOutline: "#777d8a",
  },
  flora: {
      title: "Flora Tracker",
      dataFile: "./Assests/flora-data.json",
      titleImage: "./Assests/spr_ui_museum_flora_wing_button_default.png",
      backgroundColour: "#b6cdcf",
      overlayImage: "./Assests/museum_foreground_flora.png",
      itemColour: "#9fa9ab",
      itemOutline: "#748081",
  },
  insects: {
      title: "Insect Tracker",
      dataFile: "./Assests/insects-data.json",
      titleImage: "./Assests/spr_ui_museum_insects_wing_button_default.png",
      backgroundColour: "#d0bdd9",
      overlayImage: "./Assests/museum_foreground_insects.png",
      itemColour: "#b29eb2",
      itemOutline: "#887689",
  },
};

// global variable 
let groupedData = {};
let category = ""; 

// update the title, images, and background color based on the selected category
function updateTitleImages(selectedCategory) {
  const categoryData = categoryMap[selectedCategory];
  if (!categoryData) {
      console.error("Invalid category:", selectedCategory);
      return;
  }

  document.getElementById("tracker-title").textContent = categoryData.title;
  document.querySelector(".background").style.backgroundColor = categoryData.backgroundColour;

  // Dynamically set the body background color
  document.body.style.backgroundColor = categoryData.backgroundColour;

  const leftImage = document.getElementById("left-title-image");
  const rightImage = document.getElementById("right-title-image");

  if (leftImage && rightImage) {
      leftImage.src = categoryData.titleImage;
      rightImage.src = categoryData.titleImage;
  }
}


// fetch JSON data
async function fetchData(file) {
  try {
      console.log("Fetching data from:", file);
      const response = await fetch(file);
      if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      return data;
  } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
  }
}

// render donation containers with overlays and styles
function renderDonationContainer(setName, items) {
  const container = document.createElement("div");
  container.classList.add("donation-container");

  // overlay
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const categoryData = categoryMap[category];

  const overlayImage = document.createElement("img");
  overlayImage.src = categoryData.overlayImage;
  overlayImage.alt = "Overlay";
  overlayImage.classList.add("overlay-image");

  const title = document.createElement("h2");
  title.textContent = setName;
  title.classList.add("set-title");

  overlay.appendChild(overlayImage);
  overlay.appendChild(title);
  container.appendChild(overlay);

  // donation items
  const itemsContainer = document.createElement("div");
  itemsContainer.classList.add("donation-items");

  items.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("donation-item");

      itemDiv.style.backgroundColor = categoryData.itemColour;
      itemDiv.style.borderColor = categoryData.itemOutline;

      const img = document.createElement("img");
      img.src = item.Image;
      img.alt = item.Name;
      img.classList.add("item-image");

      const name = document.createElement("span");
      name.textContent = item.Name;
      name.classList.add("item-name");

      const toggle = document.createElement("img");
      toggle.src = "./Assests/spr_ui_generic_icon_museum_off.png";
      toggle.alt = "Donation status";
      toggle.classList.add("donation-toggle");
      toggle.dataset.donated = "no";

      toggle.addEventListener("click", () => {
          if (toggle.dataset.donated === "no") {
              toggle.src = "./Assests/spr_ui_generic_icon_museum_on.png";
              toggle.dataset.donated = "yes";
          } else {
              toggle.src = "./Assests/spr_ui_generic_icon_museum_off.png";
              toggle.dataset.donated = "no";
          }
      });

      itemDiv.appendChild(img);
      itemDiv.appendChild(name);
      itemDiv.appendChild(toggle);
      itemsContainer.appendChild(itemDiv);
  });

  container.appendChild(itemsContainer);
  return container;
}

// initialize search functionality
function initializeSearch() {
  document.getElementById("search-bar").addEventListener("input", (event) => {
      const query = event.target.value.toLowerCase();
      const trackerContainer = document.getElementById("tracker-container");
      trackerContainer.innerHTML = ""; // clear current displayed items

      let hasResults = false; // track if any matches are found

      for (const [setName, items] of Object.entries(groupedData)) {
          const filteredItems = items.filter((item) =>
              item.Name.toLowerCase().includes(query)
          );
          if (filteredItems.length > 0) {
              const container = renderDonationContainer(setName, filteredItems);
              trackerContainer.appendChild(container);
              hasResults = true;
          }
      }

      if (!hasResults) {
          const noResults = document.createElement("div");
          noResults.textContent = "No results found.";
          noResults.style.textAlign = "center";
          noResults.style.color = "#877975";
          trackerContainer.appendChild(noResults);
      }
  });
}

// main function to initialize the page
async function main() {
  const urlParams = new URLSearchParams(window.location.search);
  category = urlParams.get("category") || "archeology"; // Set category globally

  updateTitleImages(category);

  try {
      const data = await fetchData(categoryMap[category].dataFile);
      groupedData = data.reduce((acc, item) => {
          const setName = item["Museum Set"];
          if (!acc[setName]) acc[setName] = [];
          acc[setName].push(item);
          return acc;
      }, {});

      const trackerContainer = document.getElementById("tracker-container");
      for (const [setName, items] of Object.entries(groupedData)) {
          const container = renderDonationContainer(setName, items);
          trackerContainer.appendChild(container);
      }

      initializeSearch();
  } catch (error) {
      console.error("Error initializing main:", error);
      document.getElementById("tracker-container").textContent = "Error loading data. Please try again later.";
  }
}

// run the main function
main();
