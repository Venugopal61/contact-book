let contacts = [];
let editIndex = null;

const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const mobileInput = document.getElementById("mobile");
const emailInput = document.getElementById("email");
const contactsContainer = document.getElementById("contactsContainer");
const favouritesSection = document.getElementById("favouritesSection");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const contactCount = document.getElementById("contactCount");
const emptyState = document.getElementById("emptyState");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const mobile = mobileInput.value.trim();
  const email = emailInput.value.trim();

  if (!name) {
    alert("Name is required.");
    return;
  }

  if (!/^\d+$/.test(mobile)) {
    alert("Mobile must be numeric.");
    return;
  }

  const contact = {
    name,
    mobile,
    email,
    favourite: false
  };

  if (editIndex !== null) {
    contacts[editIndex] = contact;
    editIndex = null;
    form.querySelector("button").textContent = "Add Contact";
  } else {
    contacts.push(contact);
  }

  form.reset();
  renderContacts();
});

searchInput.addEventListener("input", renderContacts);
sortSelect.addEventListener("change", renderContacts);

function renderContacts() {
  contactsContainer.innerHTML = "";
  favouritesSection.innerHTML = "";

  let filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    c.mobile.includes(searchInput.value) ||
    c.email.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  filtered.sort((a, b) => {
    return sortSelect.value === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  contactCount.textContent = `Total Contacts: ${contacts.length}`;
  emptyState.style.display = contacts.length === 0 ? "block" : "none";

  const favourites = filtered.filter(c => c.favourite);
  const normal = filtered.filter(c => !c.favourite);

  if (favourites.length > 0) {
    const favTitle = document.createElement("div");
    favTitle.className = "group-letter";
    favTitle.textContent = "⭐ Favourites";
    favouritesSection.appendChild(favTitle);
    favourites.forEach((c, i) => {
      favouritesSection.appendChild(createCard(c, contacts.indexOf(c)));
    });
  }

  let grouped = {};

  normal.forEach(contact => {
    const letter = contact.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(contact);
  });

  Object.keys(grouped).forEach(letter => {
    const letterDiv = document.createElement("div");
    letterDiv.className = "group-letter";
    letterDiv.textContent = letter;
    contactsContainer.appendChild(letterDiv);

    grouped[letter].forEach(contact => {
      contactsContainer.appendChild(createCard(contact, contacts.indexOf(contact)));
    });
  });
}

function createCard(contact, index) {
  const card = document.createElement("div");
  card.className = "contact-card";

  const info = document.createElement("div");
  info.className = "contact-info";
  info.innerHTML = `
    <strong>${contact.name}</strong><br/>
    ${contact.mobile}<br/>
    ${contact.email || ""}
  `;

  const actions = document.createElement("div");
  actions.className = "contact-actions";

  const favBtn = document.createElement("button");
  favBtn.textContent = contact.favourite ? "★" : "☆";
  favBtn.onclick = () => {
    contacts[index].favourite = !contacts[index].favourite;
    renderContacts();
  };

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => {
    nameInput.value = contact.name;
    mobileInput.value = contact.mobile;
    emailInput.value = contact.email;
    editIndex = index;
    form.querySelector("button").textContent = "Update Contact";
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => {
    contacts.splice(index, 1);
    renderContacts();
  };

  actions.appendChild(favBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(info);
  card.appendChild(actions);

  return card;
}

renderContacts();
