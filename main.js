const storageKey = "contacts";
let contacts = loadContacts();
let editingContactId = null;

const form = document.querySelector("#contact-form");
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const phoneInput = document.querySelector("#phone");
const emailInput = document.querySelector("#email");
const contactList = document.querySelector("#contact-list");
const messageElement = document.querySelector("#contact-message");
const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-button");

function loadContacts() {
	try {
		const savedContacts = JSON.parse(localStorage.getItem(storageKey));
		return Array.isArray(savedContacts) ? savedContacts : [];
	} catch {
		return [];
	}
}

function saveContacts() {
	localStorage.setItem(storageKey, JSON.stringify(contacts));
}

function showMessage(message) {
	messageElement.textContent = message;
}

function renderContacts() {
	contactList.replaceChildren();

	if (contacts.length === 0) {
		const emptyState = document.createElement("li");
		emptyState.className = "empty-state";
		emptyState.textContent = "Тут поки немає контактів.";
		contactList.append(emptyState);
		return;
	}

	contacts.forEach((contact) => {
		const item = document.createElement("li");
		item.className = "contact-item";

		const info = document.createElement("div");
		info.className = "contact-info";

		const name = document.createElement("strong");
		name.textContent = `${contact.firstName} ${contact.lastName}`;

		const phone = document.createElement("a");
		phone.href = `tel:${contact.phone}`;
		phone.textContent = contact.phone;

		const email = document.createElement("a");
		email.href = `mailto:${contact.email}`;
		email.textContent = contact.email;
		info.append(name, phone, email);

		const actions = document.createElement("div");
		actions.className = "contact-actions";

		const editButton = createActionButton("Редагувати", "edit-button", contact.id);
		const deleteButton = createActionButton("Видалити", "delete-button", contact.id);
		actions.append(editButton, deleteButton);

		item.append(info, actions);
		contactList.append(item);
	});
}

function createActionButton(label, className, id) {
	const button = document.createElement("button");
	button.className = className;
	button.type = "button";
	button.dataset.id = id;
	button.textContent = label;
	return button;
}

function resetForm() {
	form.reset();
	editingContactId = null;
	submitButton.textContent = "Додати контакт";
	cancelButton.hidden = true;
}

function startEditing(id) {
	const contact = contacts.find((item) => item.id === id);
	if (!contact) return;

	firstNameInput.value = contact.firstName;
	lastNameInput.value = contact.lastName;
	phoneInput.value = contact.phone;
	emailInput.value = contact.email;
	editingContactId = id;
	submitButton.textContent = "Зберегти зміни";
	cancelButton.hidden = false;
	firstNameInput.focus();
}

form.addEventListener("submit", (event) => {
	event.preventDefault();

	const contactData = {
		firstName: firstNameInput.value.trim(),
		lastName: lastNameInput.value.trim(),
		phone: phoneInput.value.trim(),
		email: emailInput.value.trim(),
	};

	if (editingContactId !== null) {
		contacts = contacts.map((contact) => contact.id === editingContactId ? { ...contact, ...contactData } : contact);
		showMessage("Контакт оновлено.");
	} else {
		contacts.push({ id: Date.now(), ...contactData });
		showMessage("Контакт додано.");
	}

	saveContacts();
	renderContacts();
	resetForm();
});

contactList.addEventListener("click", (event) => {
	const button = event.target.closest("button");
	if (!button) return;

	const id = Number(button.dataset.id);
	if (button.classList.contains("delete-button")) {
		contacts = contacts.filter((contact) => contact.id !== id);
		saveContacts();
		renderContacts();
		showMessage("Контакт видалено.");
		return;
	}

	startEditing(id);
});

cancelButton.addEventListener("click", resetForm);
renderContacts();
