// =========================
// CAM BROS PHOTOGRAPHY
// APP.JS V1
// =========================

const ADMIN_PASSWORD = "Cambros2025";

// -------------------------
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

    if(password===ADMIN_PASSWORD){

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
        await supabase
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
        await supabase
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

    data.forEach(gallery=>{

        galleryList.innerHTML += `
            <div class="galleryCard">
                <div class="galleryHeader">
                    <h3>${gallery.code}</h3>
                </div>
            </div>
        `;

    });

}
