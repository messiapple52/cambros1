// =========================
// CAM BROS PHOTOGRAPHY
// APP.JS V1
// =========================

const db = window.db;
let ADMIN_PASSWORD = "";

async function loadAdminPassword(){

    const {data,error} =
        await db
        .from("settings")
        .select("*")
        .eq("key","admin_value")
        .single();

    if(!error && data){
        ADMIN_PASSWORD = data.value;
    }
}// -------------------------
// PAGE NAVIGATION
// -------------------------

function showSection(section){

    document
        .querySelectorAll(".page")
        .forEach(page=>{
            page.classList.remove("active");
        });

    if(section==="photos"){
        document
            .getElementById("photosSection")
            .classList.add("active");
    }

    if(section==="events"){
        document
            .getElementById("eventsSection")
            .classList.add("active");
    }

    if(section==="gallery"){
        document
            .getElementById("gallerySection")
            .classList.add("active");
    }

    if(section==="booking"){
        document
            .getElementById("bookingSection")
            .classList.add("active");
    }

    if(section==="adminLogin"){
        document
            .getElementById("adminLoginSection")
            .classList.add("active");
    }
}

// -------------------------
// ADMIN LOGIN
// -------------------------

function adminLogin(){

    const password =
        document
        .getElementById("adminPassword")
        .value;

    if(password === window.ADMIN_PASSWORD){

        document
            .querySelectorAll(".page")
            .forEach(page=>{
                page.classList.remove("active");
            });

        document
            .getElementById("adminPanel")
            .classList.add("active");

        openTab("dashboardTab");

        loadDashboard();
        loadGalleries();
        loadBookings();
        loadOrders();
        loadEvents();
        loadPortfolio();

        localStorage.setItem(
            "camBrosAdmin",
            "true"
        );

    }else{

        alert(
            "Incorrect Password"
        );

    }
}

// -------------------------
// LOGOUT
// -------------------------

function logoutAdmin(){

    localStorage.removeItem(
        "camBrosAdmin"
    );

    document
        .querySelectorAll(".page")
        .forEach(page=>{
            page.classList.remove("active");
        });

    document
        .getElementById("homeSection")
        .classList.add("active");
}

// -------------------------
// ADMIN TABS
// -------------------------

function openTab(tabId){

    document
        .querySelectorAll(".tab")
        .forEach(tab=>{
            tab.classList.remove(
                "activeTab"
            );
        });

    document
        .getElementById(tabId)
        .classList.add(
            "activeTab"
        );
}

// -------------------------
// GALLERY CODE GENERATOR
// Mason Appel -> mappel
// John Smith -> jsmith
// -------------------------

function generateCode(name){

    const parts =
        name
        .trim()
        .toLowerCase()
        .split(" ");

    if(parts.length<2){
        return parts[0];
    }

    return (
        parts[0][0] +
        parts[parts.length-1]
    )
    .replace(/[^a-z0-9]/g,"");
}

// -------------------------
// CREATE GALLERY
// -------------------------

async function createGallery(){

    const name =
        document
        .getElementById("clientName")
        .value
        .trim();

    if(!name){
        alert(
            "Enter Client Name"
        );
        return;
    }

    const code =
        generateCode(name);

    const {error} =
        await db
        .from("galleries")
        .insert([
            {
                code:code,
                client_name:name
            }
        ]);

    if(error){

        alert(
            error.message
        );

        return;
    }

    alert(
        "Gallery Created: " +
        code
    );

    loadGalleries();
}

// -------------------------
// LOAD GALLERIES
// -------------------------

async function loadGalleries(){

    const galleryList =
        document
        .getElementById(
            "galleryList"
        );

    if(!galleryList){
        return;
    }

    galleryList.innerHTML =
        "Loading Galleries...";

    const {data,error} =
        await db
        .from("galleries")
        .select("*")
        .order(
            "created_at",
            {ascending:false}
        );

    if(error){

        galleryList.innerHTML =
            error.message;

        return;
    }

    galleryList.innerHTML="";
const gallerySelect =
document.getElementById("galleryCode");

if(gallerySelect){

    gallerySelect.innerHTML =
    `<option value="">
        Select Gallery
    </option>`;

}
    data.forEach(gallery=>{if(gallerySelect){

    gallerySelect.innerHTML += `
    <option value="${gallery.code}">
        ${gallery.code}
    </option>`;
}

    galleryList.innerHTML += `
        <div class="galleryCard">
            <div class="galleryHeader">
                <h3>${gallery.code}</h3>
            </div>
        </div>
    `;

});

}
// =========================
// DASHBOARD STATS
// =========================

async function loadDashboard(){

    try{

        const galleries =
        await db
        .from("galleries")
        .select("*",{count:"exact",head:true});

        const photos =
        await db
        .from("photos")
        .select("*",{count:"exact",head:true});

        const bookings =
        await db
        .from("bookings")
        .select("*",{count:"exact",head:true});

        const orders =
        await db
        .from("orders")
        .select("*",{count:"exact",head:true});

        document.getElementById("galleryCount").innerText =
            galleries.count || 0;

        document.getElementById("photoCount").innerText =
            photos.count || 0;

        document.getElementById("bookingCount").innerText =
            bookings.count || 0;

        document.getElementById("orderCount").innerText =
            orders.count || 0;

    }catch(err){

        console.log(err);

    }

}

// =========================
// BOOKINGS
// =========================

const bookingForm =
document.getElementById("bookingForm");

if(bookingForm){

    bookingForm.addEventListener(
        "submit",
        async function(e){

            e.preventDefault();

            alert("booking started");

            const booking = {

                name:
                document.getElementById("bookName").value,

                email:
                document.getElementById("bookEmail").value,

                phone:
                document.getElementById("bookPhone").value,

                sport:
                document.getElementById("bookSport").value,

                event:
                document.getElementById("bookEvent").value,

                date:
                document.getElementById("bookDate").value,

                notes:
                document.getElementById("bookNotes").value

            };

            const {error} =
            await db
            .from("bookings")
            .insert([booking]);

            if(error){

                alert(error.message);

                return;
            }

            alert(
                "Booking Submitted"
            );

            bookingForm.reset();

        }
    );

}

// =========================
// LOAD BOOKINGS
// =========================

async function loadBookings(){

    const container =
    document.getElementById(
        "bookingsContainer"
    );

    if(!container){
        return;
    }

    const {data,error} =
    await db
    .from("bookings")
    .select("*")
    .order(
        "created_at",
        {ascending:false}
    );

    if(error){
        return;
    }

    container.innerHTML="";

    data.forEach(item=>{

        container.innerHTML += `
        <div class="card">

            <h3>${item.name}</h3>

            <p><strong>Email:</strong>
            ${item.email}</p>

            <p><strong>Phone:</strong>
            ${item.phone}</p>

            <p><strong>Sport:</strong>
            ${item.sport}</p>

            <p><strong>Event:</strong>
            ${item.event}</p>

            <p><strong>Date:</strong>
            ${item.date}</p>

            <p><strong>Notes:</strong>
            ${item.notes || ""}</p>

            <button onclick="deleteBooking(${item.id})">
Delete Booking
</button>

        </div>
        `;

    });

}

// =========================
// ORDERS
// =========================

async function loadOrders(){

    const container =
    document.getElementById(
        "ordersContainer"
    );

    if(!container){
        return;
    }

    const {data,error} =
    await db
    .from("orders")
    .select("*")
    .order(
        "created_at",
        {ascending:false}
    );

    if(error){
        return;
    }

    container.innerHTML="";

    data.forEach(order=>{

        container.innerHTML += `
        <div class="card">

            <h3>${order.name}</h3>

            <p><strong>Email:</strong>
            ${order.email}</p>

            <p><strong>Phone:</strong>
            ${order.phone}</p>

            <p><strong>Gallery:</strong>
            ${order.gallery_code}</p>

            <p><strong>Photos:</strong>
            ${order.photos}</p>

        </div>
        `;

    });

}

// =========================
// EVENTS
// =========================

async function addEvent(){

    const title =
    document.getElementById(
        "eventTitle"
    ).value;

    const date =
    document.getElementById(
        "eventDate"
    ).value;

    const location =
    document.getElementById(
        "eventLocation"
    ).value;

    const {error} =
    await db
    .from("events")
    .insert([
        {
            title,
            date,
            location
        }
    ]);

    if(error){

        alert(error.message);

        return;

    }

    loadEvents();

}

async function loadEvents(){

    const publicEvents =
    document.getElementById(
        "eventsContainer"
    );

    const adminEvents =
    document.getElementById(
        "adminEvents"
    );

    const {data,error} =
    await db
    .from("events")
    .select("*")
    .order(
        "date",
        {ascending:true}
    );

    if(error){
        return;
    }

    if(publicEvents){
        publicEvents.innerHTML="";
    }

    if(adminEvents){
        adminEvents.innerHTML="";
    }

    data.forEach(event=>{

        const html = `
        <div class="card">

            <h3>${event.title}</h3>

            <p>${event.date}</p>

            <p>${event.location}</p>

        </div>
        `;

        if(publicEvents){
            publicEvents.innerHTML += html;
        }

        if(adminEvents){
            adminEvents.innerHTML += html;
        }

    });

}

// =========================
// PORTFOLIO
// =========================

async function loadPortfolio(){

    const {data,error} =
    await db
    .from("portfolio")
    .select("*")
    .order(
        "created_at",
        {ascending:false}
    );

    if(error){
        return;
    }

    const grid =
    document.getElementById(
        "portfolioGrid"
    );

    const adminGrid =
    document.getElementById(
        "portfolioAdminGrid"
    );

    if(grid){
        grid.innerHTML="";
    }

    if(adminGrid){
        adminGrid.innerHTML="";
    }

    data.forEach(photo=>{

        const img = `
        <img src="${photo.url}">
        `;

        if(grid){
            grid.innerHTML += img;
        }

        if(adminGrid){
            adminGrid.innerHTML += img;
        }

    });

}

// =========================
// STARTUP
// =========================

window.addEventListener(
    "load",
    ()=>{
        loadAdminPassword();

        loadEvents();
        loadPortfolio();

        if(
            localStorage.getItem(
                "camBrosAdmin"
            )==="true"
        ){

            adminLogin();

        }

    }
);
function openGallery(){
    alert("Gallery system not built yet.");
}
function uploadPortfolioPhotos(){
    alert("Portfolio uploads not built yet.");
}

async function deleteBooking(id){

    const { error } =
    await db
    .from("bookings")
    .delete()
    .eq("id", id);

    if(error){
        alert(error.message);
        return;
    }

    loadBookings();
}
