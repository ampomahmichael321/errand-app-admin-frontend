const requestDetailCard = document.querySelector(".request-detail-card-main");
const acceptButton = document.querySelector(".accept-button");
let html = "";
const backend_url =
  "https://errand-app-backend.onrender.com/api/service_requests";
const completedButton = document.querySelector(".completed-button");

params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`${backend_url}/${id}`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    html = `
    <h2>${data.service_type} Request</h2>
      <p class="status"></p>
      <p><span class="blue">Customer Name: </span>${data.username}</p>
      <p><span class="blue">Email: </span>${data.user_email}</p>
      <p><span class="blue">Phone: </span>${data.user_phone}</p>
       <p> <span class="blue">Details: </span>${data.request_details}</p>
      <p><span class="blue">Additional Info: </span>John Doe</p>
    `;
    if (data.service_type === "delivery") {
      html += `
        <p><span class="blue">Pickup Location: </span>John Doe</p>
      <p><span class="blue">Drop off Location: </span>John Doe</p>
      
        `;
    } else if (data.service_type === "errands") {
      html += `<p><span class="blue">Errand Destination: </span>${data.errand_destination}</p>
      <p><span class="blue">Delivery Location: </span>${data.delivery_location}</p>`;
    } else if (data.service_type === "shopping") {
      html += ` <p><span class="blue">Delivery Location: </span>${data.delivery_location}</p>`;
    }
    requestDetailCard.innerHTML = html;

    if (data.status === "pending") {
      acceptButton.style.display = "block";
      document.querySelector(".status").innerText = "Pending";
      document.querySelector(".status").style.color = "red";
    } else if (data.status === "accepted") {
      acceptButton.style.display = "none";
      document.querySelector(".status").innerText = "Accepted";
      document.querySelector(".status").style.color = "green";
      completedButton.style.display = "block";
    }
    if (data.completed) {
      acceptButton.style.display = "none";
      completedButton.style.display = "none";
      document.querySelector(".completed").style.display = "block";
    }
  });

function acceptRequest(id) {
  fetch(`${backend_url}/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "accepted",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Updated:", data);
      alert("Request accepted!");
      document.querySelector(".status").innerText = "Accepted";
      window.location.reload();
    });
}

function markAsCompleted(id) {
  fetch(`${backend_url}/${id}/`, {
    method: "PATCH",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ completed: "True" }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("updated:", data);
    });
}

acceptButton.addEventListener("click", () => {
  acceptRequest(id);
});
completedButton.addEventListener("click", () => {
  markAsCompleted(id);
  document.querySelector(".completed").style.display = "block";
  completedButton.style.display = "none";
});

