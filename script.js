const socket = io();
const allButton = document.getElementById("All-Ticket-btn");
const openButton = document.getElementById("Open-Ticket-btn");
const loadingElement = document.getElementById("loading");

function openChatRoom(ticket) {
    // You can customize this function to open a chat room UI and populate it with the ticket details
    // For example, you could create a new section in your HTML for the chat room and populate it with the ticket's information.
    const chatRoom = document.getElementById("chat-room");
    chatRoom.innerHTML = `
        <!-- ... existing code ... -->
        <div id="chat-messages"></div>
        <form id="chat-form">
            <input id="message-input" autocomplete="off" />
            <input id="file-input" type="file" autocomplete="off" />
            <button>Send</button>
        </form>
    `;
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const fileInput = document.getElementById('file-input');
    const chatMessages = document.getElementById('chat-messages');

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;
        const file = fileInput.files[0]; // Get the selected file object
        if (!message && !file) {
            return;
        }

        // Create a FormData object to send both message and file
        const formData = new FormData();
        formData.append('message', message);
        formData.append('file', file);

        // Emit the chat message along with the file to the server
        socket.emit('chat message', formData);
        messageInput.value = '';
        fileInput.value = ''; // Clear the file input
    });

    // Receive and display chat messages
    // Receive and display chat messages
    socket.on('chat message', (msg) => {
        console.log(`Received: ${JSON.stringify(msg)}`);
        const messageElement = document.createElement('p');
        messageElement.textContent = msg.message; // Display the message
        chatMessages.appendChild(messageElement);

        if (msg.file) {
            const fileLink = document.createElement('a');
            fileLink.textContent = 'Download File';
            fileLink.href = msg.file; // Set the URL of the file
            fileLink.target = '_blank'; // Open the link in a new tab
            chatMessages.appendChild(fileLink);
        }
    });
    

}


openButton.addEventListener("click", () => {
    loadingElement.style.display = "block";
    fetch("/open_tickets")
        .then((response) => {
            loadingElement.style.display = "none";
            if (response.status === 200) {
                return response.json();
            } else {
                alert("something weird happened");
            }
        })
        .then((data) => {
            const ticketListContainer = document.getElementById("Ticketslist");
            ticketListContainer.innerHTML = '';
            if (data.length === 0) {
                const noDataMessage = document.createElement("p");
                noDataMessage.textContent = "No ticket data available.";
                ticketListContainer.appendChild(noDataMessage);
            } else {
                ticketListContainer.innerHTML = '<tr class="head"><td>ID</td><td>Status</td><td>Title</td><td>Product Id</td><td>Category</td><td>Date</td></tr>';
                data.forEach((ticket) => {
                    const ticketItem = document.createElement("tr");
                    ticketItem.className = "ticket-list";
                    const statusSpan = document.createElement("span");
                    if (ticket.status === 'open') {
                        statusSpan.style.backgroundColor = 'green';
                        statusSpan.style.padding = '5px';
                    } else {
                        statusSpan.style.backgroundColor = 'grey';
                        statusSpan.style.padding = '5px';
                    }
                    statusSpan.textContent = ticket.status;

                    ticketItem.innerHTML = `
                        <td>${ticket._id}</td>
                        <td>${statusSpan.outerHTML}</td>
                        <td>${ticket.title}</td>
                        <td>${ticket.productId}</td>
                        <td>${ticket.category}</td>
                        <td>${ticket.date}</td>
                        <td><button class="chat-button" data-ticket='${JSON.stringify(ticket)}'>Chat</button></td>
                  
                        <!-- Add more ticket details here as needed -->
                    `;

                    ticketListContainer.appendChild(ticketItem);
                });
                const chatButtons = document.querySelectorAll(".chat-button");
                chatButtons.forEach(button => {
                    button.addEventListener("click", () => {
                        const ticketData = JSON.parse(button.getAttribute("data-ticket"));
                        openChatRoom(ticketData);
                        // window.location.href = `/chat/${ticketData._id}`;
                    });
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching ticket data:", error);
        });
});



allButton.addEventListener("click", () => {

    loadingElement.style.display = "block";
    fetch("/tickets")
        .then((response) => {
            loadingElement.style.display = "none";
            if (response.status === 200) {
                return response.json();
            } else {
                alert("something weird happened");
            }
        })
        .then((data) => {
            const ticketListContainer = document.getElementById("Ticketslist");
            ticketListContainer.innerHTML = '';
            if (data.length === 0) {
                const noDataMessage = document.createElement("p");
                noDataMessage.textContent = "No ticket data available.";
                ticketListContainer.appendChild(noDataMessage);
            } else {
                ticketListContainer.innerHTML = '<tr class="head"><td>ID</td><td>Status</td><td>Title</td><td>Product Id</td><td>Category</td><td>Date</td></tr>';
                data.forEach((ticket) => {
                    const ticketItem = document.createElement("tr");
                    ticketItem.className = "ticket-list";
                    const statusSpan = document.createElement("span");
                    if (ticket.status === 'open') {
                        statusSpan.style.backgroundColor = 'green';
                        statusSpan.style.padding = '5px';
                    } else {
                        statusSpan.style.backgroundColor = 'grey';
                        statusSpan.style.padding = '5px';
                    }
                    statusSpan.textContent = ticket.status;

                    ticketItem.innerHTML = `
                        <td>${ticket._id}</td>
                        <td>${statusSpan.outerHTML}</td>
                        <td>${ticket.title}</td>
                        <td>${ticket.productId}</td>
                        <td>${ticket.category}</td>
                        <td>${ticket.date}</td>
                        <td><button class="chat-button" data-ticket='${JSON.stringify(ticket)}'>Chat</button></td>
                  
                        <!-- Add more ticket details here as needed -->
                    `;

                    ticketListContainer.appendChild(ticketItem);
                });
                const chatButtons = document.querySelectorAll(".chat-button");
                chatButtons.forEach(button => {
                    button.addEventListener("click", () => {
                        const ticketData = JSON.parse(button.getAttribute("data-ticket"));
                        openChatRoom(ticketData);
                        // window.location.href = `/chat/${ticketData._id}`;
                    });
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching ticket data:", error);
        });
});


