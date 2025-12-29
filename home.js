 const scriptURL = "https://script.google.com/macros/s/AKfycbzIn-KmXJDPJM4vdQNT2PHalqY4_zmUCpVTNGOyJxXl-sT7FEh3fvXpK4PGffgbl4YkHQ/exec"
 
 let today = Date.now()
 
 const raw = "";

const requestOptions = {
  method: "POST",
  body: raw,
  redirect: "follow"
};
 
 let info_courses
 let info_drivers
 let info_user
 let count_courses
 let count_ca
 let currentTab = "all";
 
 
info_user = JSON.parse(localStorage.getItem('info_user'))

if(!info_user){
  window.location.href = "../index.html"
}


//ouvrir burger
function toggleMenu_open() {
    document.querySelector('.sidebar').classList.toggle('open');
  }

//fermé burger
function toggleMenu_close() {
    document.querySelector('.sidebar').classList.remove('open');
  }


//activer div
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
    
    document.querySelectorAll('.box').forEach(b =>
         b.style.display = "none" )
    
    
    link.classList.add('active');
    console.log(link.id)
    
    if(link.id == "dash"){
      document.querySelector(`#get_${link.id}`).style.display = "grid"
    } else if(link.id=="courses"){
      document.querySelector(`#wait-screen`).style.display = "flex"
      call_courses(link.id)
    } else if(link.id=="logout"){
      call_logout()
    } else {
    document.querySelector(`#get_${link.id}`).style.display = "block"
    }
    toggleMenu_close()
  });
});



function call_logout(){
  console.log('call logout')
  localStorage.removeItem("info_user");
  window.location.href = "../index.html"
}





function call_courses(link){
  
  if(!info_courses){
    
     let data = new URLSearchParams();
            data.append('action', "getOrder");

    
    let data_String = data.toString()
    
    fetch(`${scriptURL}?${data_String}`, requestOptions )
                   .then((response) => response.json())
                .then((result) => {

          if(result.statut == 200){
              info_courses = result.message
              document.querySelector(`#wait-screen`).style.display = "none"
            
            if(link){
            document.querySelector(`#get_${link}`).style.display = "grid"
            }
            
            class_infos()
          }
      
    })
    
  } else {
    document.querySelector(`#get_${link}`).style.display = "grid"
    afficherCourses()
    document.querySelector(`#wait-screen`).style.display = "none"
  }
  
}


function class_infos(){
  count_courses = 0
  count_ca = 0
  info_courses.forEach(info => {
    
    if(new Date(info.creation).toLocaleDateString() == "28/12/2025" /*new Date(today).toLocaleDateString()*/ ){
      count_courses++
      
      get_prix = parseFloat(info.Prix)
     count_ca = count_ca + get_prix;
      console.log(count_ca)
      
      
      
      
    }
  })
  
  
  document.querySelector(`#driver_online`).innerText = "Non indiqué"
  document.querySelector(`#waiting_courses`).innerText = "Non indiqué"
  document.querySelector(`#courses_today`).innerText = count_courses
  document.querySelector(`#ca_global`).innerText = `${count_ca.toFixed(2)} €` 
}



function afficherCourses() {
    const container = document.getElementById("courses_box");
    container.innerHTML = "";

    const filtered = info_courses.filter(course => {
        if (currentTab === "pending") {
            return course.Statut_pay === "en_attente";
        }
        if (currentTab === "active") {
            return course.Statut_pay === "en_cours" /*&& course.date >= today*/;
        }
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = "<p style='text-align:center;margin-top:20px'>Aucune course</p>";
        return;
    }

    filtered.forEach(course => {
        const div = document.createElement("div");
        div.className = "course";

        div.innerHTML = `
  <h3>${course.Nom}</h3>
  <p>🧾 N° Commande ${course.creation}</p>
  <p>📧 ${course.Email}</p>
  <p>📞 ${course.Téléphone}</p>
  <p>📍 ${course.Départ} → ${course.Arrivée}</p>
  <p>📅 ${course.Date}</p>
  <p>⏰ ${course.Heure}</p>
  <p>💰 ${course.Prix} €</p>
  <p>🚗 ${course.Véhicule}</p>
  <p>💬 ${course.Message}</p>
  ${
    course.Statut_pay === "en_attente"
      ? `<div class="buttons">
           <button class="accept" onclick="accepter(${course.creation})">Accepter</button>
           <button class="refuse" onclick="refuser(${course.creation})">Refuser</button>
         </div>`
      : `<span class="badge ${course.Statut_pay === 'en_cours' ? 'active' : 'pending'}">
           ${course.Statut_pay.replace("_", " ")}
         </span>`
  }
`;

        ;

        container.appendChild(div);
    });
    
    //updatePendingBadge()
}



function changeTab(tab) {
    currentTab = tab;

    document.querySelectorAll(".bottom-nav .tab").forEach(btn => {
        btn.classList.remove("active");
    });
  
  event.currentTarget.classList.add("active");
    afficherCourses();
  
}



function accepter(id) {
    /*const course = info_courses.find(c => c.id === id);
    course.Statut_pay = "en_cours";
    afficherCourses();*/
   alert("non disponible")
}

function refuser(id) {
   /* courses = info_courses.filter(c => c.id !== id);
    afficherCourses();*/
  
  alert("non disponible")
}

function updatePendingBadge() {
    const badge = document.getElementById("badge-pending");

    const count = info_courses.filter(c => c.Statut_pay === "en_attente").length;

    if (count > 0) {
        badge.textContent = count;
        badge.style.display = "inline-block";
    } else {
        badge.style.display = "none";
    }
}





document.querySelector(`#wait-screen`).style.display = "flex"
call_courses()
