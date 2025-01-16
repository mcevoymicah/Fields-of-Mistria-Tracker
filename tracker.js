// map categories to JSON files
const categoryMap = {
    archeology: {
      title: "Archeology Tracker",
      dataFile: "./Assests/archeology-data.json",
    },
    fish: {
      title: "Fish Tracker",
      dataFile: "./Assests/fish-data.json",
    },
    flora: {
      title: "Flora Tracker",
      dataFile: "./Assests/flora-data.json",
    },
    insects: {
      title: "Insect Tracker",
      dataFile: "./Assests/insects-data.json",
    },
  };
  
  // get the category from the URL (e.g., ?category=archeology)
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  
  // update the page title
  document.getElementById("tracker-title").textContent = categoryMap[category].title;
  
  // fetch and render data
  async function fetchData(file) {
    const response = await fetch(file);
    return response.json();
  }
  
  function renderDonationContainer(setName, items) {
    const container = document.createElement("div");
    container.classList.add("donation-container");

    // add overlay
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const overlayImage = document.createElement("img");
    overlayImage.src = "./Assests/spr_ui_museum_foreground_plate.png";
    overlayImage.alt = "Overlay";
    overlayImage.classList.add("overlay-image");

    const title = document.createElement("h2");
    title.textContent = setName;
    title.classList.add("set-title");

    overlay.appendChild(overlayImage);
    overlay.appendChild(title);
    container.appendChild(overlay);

    // donation Items
    const itemsContainer = document.createElement("div");
    itemsContainer.classList.add("donation-items");

    items.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("donation-item");

        // item img
        const img = document.createElement("img");
        img.src = item.Image;
        img.alt = item.Name;
        img.classList.add("item-image");

        // item name
        const name = document.createElement("span");
        name.textContent = item.Name;
        name.classList.add("item-name");

        // donation toggle img
        const toggle = document.createElement("img");
        toggle.src = "./Assests/spr_ui_generic_icon_museum_off.png"; 
        toggle.alt = "Donation status";
        toggle.classList.add("donation-toggle");
        toggle.dataset.donated = "no"; // Track the donated state


        // toggle click event
        toggle.addEventListener("click", () => {
            if (toggle.dataset.donated === "no") {
                toggle.src = "./Assests/spr_ui_generic_icon_museum_on.png";
                toggle.dataset.donated = "yes";
            } else {
                toggle.src = "./Assests/spr_ui_generic_icon_museum_off.png"; 
                toggle.dataset.donated = "no";
            }
        });

        // append elements to item div
        itemDiv.appendChild(img);
        itemDiv.appendChild(name);
        itemDiv.appendChild(toggle);
        itemsContainer.appendChild(itemDiv);
    });

    container.appendChild(itemsContainer);
    return container;
}

  
async function main() {
    // fetch data from the appropriate JSON file
    const data = await fetchData(categoryMap[category].dataFile);

    // group the data by "Museum Set"
    const groupedData = {};
    data.forEach(item => {
        const setName = item["Museum Set"];
        if (!groupedData[setName]) {
            groupedData[setName] = []; // initialize a new group if it doesn't exist
        }
        groupedData[setName].push(item); // add the item to the correct group
    });

    // get the container where all donation containers will be added
    const trackerContainer = document.getElementById("tracker-container");

    // loop through each group and render a donation container
    for (const setName in groupedData) {
        const items = groupedData[setName];
        const container = renderDonationContainer(setName, items);
        trackerContainer.appendChild(container); // add the container to the page
    }
}

// run the main function
main();
