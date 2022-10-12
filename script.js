// Setting Favourite item arr in local storage
if(localStorage.getItem("favList") == null){
    localStorage.setItem("favList",JSON.stringify([]));
}

// Fetching Api
async function fetchMealApi(url,value){
    const response = await fetch(`${url+value}`);
    const meals = await response.json();
    // console.log("response",response);
    // console.log("meals1",meals);
    // console.log(meal);
    return meals;
}

// Showing all meals according to search
function showMeals(){
    let char = document.getElementById("search").value;
    // console.log("char",char);
    let arr = JSON.parse(localStorage.getItem("favList"));
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
    let html = ""
    
    let meals = fetchMealApi(url,char);
    meals.then(data => {
        if(data.meals){
            data.meals.forEach((element) => {
                let isfav = false;
                for(let i = 0; i <= arr.length; i++){
                    if(arr[i] == element.idMeal){
                        isfav = true
                    }
                }
                if(isfav){
                    html += `
                        <div id="card" class="card mb-3" style="width: 20rem;">
                            <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${element.strMeal}</h5>
                                <div class="d-flex justify-content-between mt-5">
                                    <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                                    <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                                </div>
                            </div>
                        </div>
                    `
                }else{
                    html += `
                        <div id="card" class="card mb-3" style="width: 20rem;">
                            <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${element.strMeal}</h5>
                                <div class="d-flex justify-content-between mt-5">
                                    <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                                    <button id="main${element.idMeal}" class="btn btn-outline-light like" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-regular fa-heart"></i></button>
                                </div>
                            </div>
                        </div>
                    `
                }
            })
        }else{
            html += `
                <div class="page-wrap d-flex flex-row align-items-center">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-md-12 text-center">
                                <span class="display-1 d-block">404</span>
                                <div class="mb-4 lead">
                                    The meal you are looking for was not found.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
        document.getElementById("display").innerHTML = html;
    })
}

// Mode detail section
async function showMealDetails(id){
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    await fetchMealApi(url,id).then(data => {
        document.getElementById("display").innerHTML = `
            <div id="meal-details" class="mb-5">
                <div id="meal-header" class="d-flex justify-content-around flex-wrap">
                <div id="meal-thumbail">
                    <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
                </div>
                <div id="details">
                    <h3>${data.meals[0].strMeal}</h3>
                    <h6>Category : ${data.meals[0].strCategory}</h6>
                    <h6>Area : ${data.meals[0].strArea}</h6>
                </div>
                </div>
                <div id="meal-instruction" class="mt-3">
                <h5 class="text-center">Instruction :</h5>
                <p>${data.meals[0].strInstructions}</p>
                </div>
                <div class="text-center">
                <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
                </div>
            </div>
        `
    })
}


// Add and remove from Favourites
function addRemoveToFavList(id){
    let arr = JSON.parse(localStorage.getItem("favList"));
    let present = false;
    // console.log(arr);
    for(let i = 0; i < arr.length; i++){
        if(id == arr[i]){
            present = true
        }
    }
    if(present){
        let indexOfFavList = arr.indexOf(id);
        arr.splice(indexOfFavList,1);
        alert("Meal removed from favourite list")
        localStorage.setItem("favList",JSON.stringify(arr));
        myFavMeal()
    
    }else{
        arr.push(id);
        alert("Meal added in favourite list");
        localStorage.setItem("favList",JSON.stringify(arr));
        showMeals()
    }
    localStorage.setItem("favList",JSON.stringify(arr));
    // myFavMeal();
    // showMeals();
    
}

// My Favourite Meals
async function myFavMeal(){
    let arr = JSON.parse(localStorage.getItem("favList"));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    document.getElementById("search").style.display = "none"
    document.getElementById("fav-list").innerHTML = "Favourites"
    if(arr.length == 0){
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `

    }else{
        for (let i = 0; i < arr.length; i++) {
            await fetchMealApi(url,arr[i]).then(data=>{
                html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
            });   
        }
        // document.getElementById("main${data.meals[0].idMeal}").style.backgroundColor = 'red'
    }

    document.getElementById("display").innerHTML = html;

}

