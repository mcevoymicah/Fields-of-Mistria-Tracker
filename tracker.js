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
 
  document.getElementById("tracker-title").textContent = categoryData.title;
  document.querySelector(".background").style.backgroundColor = categoryData.backgroundColour;

  // body background color
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
  toString
      const response = await fetch(file);
      const data = await response.json();
      return data;
  
}

// render donation containers with overlays and styles
function renderDonationContainer(setName, items) {

    // main container
  const container = document.createElement("div");
  container.classList.add("donation-container");

  // create overlay
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  // add overlay
  const categoryData = categoryMap[category];
  const overlayImage = document.createElement("img");
  overlayImage.src = categoryData.overlayImage; // fetched based on category
  overlayImage.classList.add("overlay-image");

  // adds the title for the set
  const title = document.createElement("h2");
  title.textContent = setName;
  title.classList.add("set-title");

  // append elements to container
  overlay.appendChild(overlayImage);
  overlay.appendChild(title);
  container.appendChild(overlay);

  // donation items
  const itemsContainer = document.createElement("div");
  itemsContainer.classList.add("donation-items");

  // render each donation item
  items.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("donation-item");
      
      // styles each based on category 
      itemDiv.style.backgroundColor = categoryData.itemColour;
      itemDiv.style.borderColor = categoryData.itemOutline;

      // adds item image
      const img = document.createElement("img");
      img.src = item.Image;;
      img.classList.add("item-image");

      // item name
      const name = document.createElement("span");
      name.textContent = item.Name;
      name.classList.add("item-name");

      // adds donation toggle
      const toggle = document.createElement("img");
      toggle.src = "./Assests/spr_ui_generic_icon_museum_off.png";
      toggle.alt = "Donation status";
      toggle.classList.add("donation-toggle");
      toggle.dataset.donated = "no";

      // switch on/off donated
      toggle.addEventListener("click", () => {
          if (toggle.dataset.donated === "no") {
              toggle.src = "./Assests/spr_ui_generic_icon_museum_on.png";
              toggle.dataset.donated = "yes";
          } else {
              toggle.src = "./Assests/spr_ui_generic_icon_museum_off.png";
              toggle.dataset.donated = "no";
          }
      });

      // appends items to container
      itemDiv.appendChild(img);
      itemDiv.appendChild(name);
      itemDiv.appendChild(toggle);
      itemsContainer.appendChild(itemDiv);
  });

  // appeds to main container
  container.appendChild(itemsContainer);
  return container;
}

// initialize search functionality
function initializeSearch() {

    // input triggers everytime user types
  document.getElementById("search-bar").addEventListener("input", (event) => {
     
    // gets current value and converts it to lowercase (to avoid case sensitivity
    const query = event.target.value.toLowerCase();

    // clears the container so previous items dont persist 
      const trackerContainer = document.getElementById("tracker-container");
      trackerContainer.innerHTML = ""; // clear current displayed items

      let hasResults = false; // track if any matches are found

      // loop throught the name of the set and items
      for (const [setName, items] of Object.entries(groupedData)) {

        // filters items in current group to find names that match
          const filteredItems = items.filter((item) =>
              item.Name.toLowerCase().includes(query)
          );

          // renders what matches
          if (filteredItems.length > 0) {
              const container = renderDonationContainer(setName, filteredItems);
              trackerContainer.appendChild(container);
              hasResults = true;
          }
      }

      // if no results are found
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
    // extracts category from url (eg ?category=archeology)
  const urlParams = new URLSearchParams(window.location.search);
  category = urlParams.get("category") || "archeology"; // if no category present, default to archeology

  // updates to reflect selected category
  updateTitleImages(category);


// fetches data for selected category
      const data = await fetchData(categoryMap[category].dataFile);

      // groups items by museum set by iterating through each item
      groupedData = data.reduce((acc, item) => {

        // extracting the name
          const setName = item["Museum Set"];

          // if a group doesnt exist it initializes it 
          if (!acc[setName]) acc[setName] = [];

          // adds it to the proper group
          acc[setName].push(item);
          return acc;
      }, {});

      // renders the sets 
      const trackerContainer = document.getElementById("tracker-container");

      // loops through each group 
      for (const [setName, items] of Object.entries(groupedData)) {

        // creates container for each set
          const container = renderDonationContainer(setName, items);
          trackerContainer.appendChild(container);
      }

      // search 
      initializeSearch();
}

// run the main function
main();
