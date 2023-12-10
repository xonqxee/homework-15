        class Contact {
            constructor(name, number, id) {
                this.name = name;
                this.number = number;
                this.id = id;
            }
        }
        class UI {
            static displayContacts() {
                let list = $("#contact-list");
                list.html("");
                let contacts = Store.readContacts();

                contacts.forEach((contact) => {
                    UI.addContactToList(contact);
                });
            }

            static addContactToList(contact) {
                let list = $("#contact-list");

                list.append(`
                    <tr>
                        <td>${contact.name}</td>
                        <td>${contact.number}</td>
                        <td>${contact.id}</td>
                        <td><button class="btn btn-primary btn-sm delete">X</button></td>
                    </tr>
                `);
            }

            static clearFields() {
                $("#name-input").val("");
                $("#number-input").val("");
                $("#id-input").val("");
            }
        }
        class Store {
            static readContacts() {
                let contacts = [];
                let storage = localStorage.getItem("contacts");
                if (storage !== null) {
                    contacts = JSON.parse(storage);
                }
                return contacts;
            }

            static addContact(contact) {
                let contacts = Store.readContacts();
                let existingContact = contacts.find((c) => c.id === contact.id);

                if (!existingContact) {
                    contacts.push(contact);
                    localStorage.setItem("contacts", JSON.stringify(contacts));
                    return true; 
                } else {
                    return false; 
                }
            }

            static removeContact(id) {
                let contacts = Store.readContacts();
                contacts = contacts.filter((contact) => contact.id !== id);
                localStorage.setItem("contacts", JSON.stringify(contacts));
            }
        }
        $(document).ready(() => {
            UI.displayContacts();
        });

        $("#contact-form").submit(function (e) {
            e.preventDefault();

            let name = $("#name-input").val();
            let number = $("#number-input").val();
            let id = $("#id-input").val();

            if (name && number && id) {
                let contact = new Contact(name, number, id);
                if (Store.addContact(contact)) {
                    UI.addContactToList(contact);
                    UI.clearFields();
                } else {
                    alert("Contact with the same ID already exists!");
                }
            } else {
                alert("Please fill in all fields");
            }
        });

        $("#contact-list").on("click", ".delete", function () {
            let id = $(this).closest("tr").find("td:eq(2)").text(); 
            Store.removeContact(id);
            $(this).closest("tr").remove();
        });