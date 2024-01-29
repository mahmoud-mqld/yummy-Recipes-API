$( window ).on( "load",()=> {
  $('.loading').fadeOut(1000);
  $("body").css("overflow", "visible")

});
// -----------------------------------home------------------------------------------------------
$('.loading').fadeIn(200)

search('s=v')

// --------------------------------------------------------------------------------------------------

class Nav {
  constructor() {
    this.setnav();
  }
  setnav() {

    $("#btn-text").text("Open");
    $(".side-btn").click(() => {
      $(".sidebar").toggleClass("slide");
      var newText = $("#btn-text").text() == "Open" ? `Close` : "Open";
      $("#btn-text").text(newText);
      $("#btn-text").text() == "Open"
        ? $(".inner ul li").animate({ top: 300 }, 500)
        : 0;
      $("#nav-icon").toggleClass("fa-bars fa-xmark");



      for (let i = 0; i < 6; i++) {
        $(".inner ul li")
          .eq(i)
          .animate(
            {
              top: 0,
            },
            (i + 6) * 160
          );
      }
    });

    $(".inner ul li").animate(
      {
        top: 300,
      },
      500
    );
    $(".inner ul li:nth(0)").click(() => {
      search('s=pa')
      $('.search').addClass('d-none')
      sideNavClose ()
      console.log("home");
      $('#form').addClass('d-none')

    });
    $(".inner ul li:nth(1)").click(() => {
      console.log("search");
      $('.search').removeClass('d-none')
      $("#gallery").addClass("d-none");
      $("#ditails").addClass("d-none");
      $('#form').addClass('d-none')
      $('.loading').fadeOut(1000);

      sideNavClose ()

    });
    $(".inner ul li:nth(2)").click(() => {
      console.log("categories");
      callCategories();
      sideNavClose ()
      $('#form').addClass('d-none')

    });
    $(".inner ul li").eq(4).click(() => {
      console.log("area");
      getList()
      sideNavClose ()
      $('#form').addClass('d-none')

    });
    $(".inner ul li").eq(3).click(() => {
      console.log("ingrediant");
      callIngredient();
      $('#form').addClass('d-none')

      sideNavClose ()
    });
    $(".inner ul li").eq(5).click(() => {
      $('#form').removeClass('d-none')
      $("#gallery").addClass("d-none");
      $("#ditails").addClass("d-none");
      $('.search').addClass('d-none')
      $('.loading').fadeOut(1000);

      resetForm ()
      // runValidation()
      console.log("contact");
      sideNavClose ()
    });
  }
}
// -------------------------------------------------------------------------------------------------
class DataFetcher {
  constructor(baseUrl, endpoint) {
    this.url = `${baseUrl}/${endpoint}`;

    // this.fetchData();
  }

  async fetchData() {
    try {
      const response = await fetch(this.url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }
}
// ----------------------------------------------------------------------------------------------------
class Ui {
  constructor(data) {
    this.Display(data);
  }

  Display(data) {
    let gallery = ``;
    for (let index = 0; index < data.length; index++) {
      gallery += `                
                <div id-data="c=${data[index].strCategory}" id="card" class="d-flex justify-content-end my-1 col-md-3">
                <div class="inner  d-flex justify-content-center  overflow-hidden position-relative rounded-4 ">
                    <img class="" src="${data[index].strCategoryThumb}" alt="">
                    <div class=" p-2 card-slide position-absolute text-light text-center">
            <h2 class="p-1">${data[index].strCategory}.</h2>
            <p class="px-1" >${data[index].strCategoryDescription}</p>

            </div>
                </div>
                </div>
                
                `;
    }
    $("#gallery").html(gallery);
    $("#ditails").addClass("d-none");
    $('.search').addClass('d-none')
    $("#gallery").removeClass("d-none");
    $('.loading').fadeOut(1000);

  }
  
}

// calling nav class
const nav = new Nav();
// ---------------------------------------------------------------------------------------------------
function sideNavClose (){  
  $("#btn-text").text("Open");
    $(".sidebar").removeClass("slide");
    var newText = $("#btn-text").text() == "Open" ? `Close` : "Open";
    $("#btn-text").text(newText);
    $("#btn-text").text() == "Open"
      ? $(".inner ul li").animate({ top: 300 }, 500):0;
    $("#nav-icon").toggleClass("fa-bars fa-xmark");
}

function callCategories() {
  $('.loading').fadeIn(200)

  const categoriesUrl =
    "https://www.themealdb.com/api/json/v1/1/categories.php";
  const endpoint = "";
  // caling fetch class
  const categories = new DataFetcher(categoriesUrl, endpoint);
  categories.fetchData().then((data) => {
    const categories = data.categories;
    console.log(" data:", categories);
    //   call ui class
    const ui = new Ui(categories);
    ui.Display(categories);
  


    document.querySelectorAll("#card").forEach((card) => {
      card.addEventListener("click", () => {
        console.log(card.getAttribute("id-data"));

        cat(card.getAttribute("id-data"));
      });
    });
  });
}

async function cat(cat) {
  $('.loading').fadeIn(200)

  const data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?${cat}`
  );
  const res = await data.json();
  console.log(res.meals);
  const meals = res.meals;
  displaymeals(meals);
  document.querySelectorAll("#card").forEach((card) => {
    card.addEventListener("click", (e) => {
      console.log(card.getAttribute("id-data"));
      
      getMealById(card.getAttribute("id-data"));
    });
  });
}

function displaymeals(data) {
  let gallery = ``;
  for (let index = 0; index < data.length; index++) {
    gallery += `                
              <div id-data="${data[index].idMeal}"  id="card" class="ms-auto my-1 col-9 col-md-4  col-lg-3">
              <div class="inner  d-flex justify-content-center  overflow-hidden position-relative rounded-4 ">
                  <img class="" src="${data[index].strMealThumb}" alt="">
                  <div class=" p-2 card-slide position-absolute text-light text-center">
          <h2 class="p-1">${data[index].strMeal}.</h2>

          </div>
              </div>
              </div>
              
              `;
  }
  $("#gallery").html(gallery);
  $("#ditails").addClass("d-none");
  $("#gallery").removeClass("d-none");
  $('.loading').fadeOut(1000);
  // $('.search').addClass('d-none')

}

// ----------------------get meal details by id-----------------------------------------------------
async function getMealById(id) {
  $('.loading').fadeIn(200)
  const data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const res = await data.json();
  console.log(res);
  const meal = res.meals[0];
  console.log(meal);
  displayDetails(meal);
  $('.close-btn').click( ()=>{$("#ditails").addClass("d-none")
  $("#gallery").removeClass("d-none");

}
  )
}
// ----------------------diplay meal details-----------------------------------------------------

function displayDetails(meal) {
  // if (meal.strTags == "null") {
  //   $(".tags").addClass("d-none");
  // }
  // let mealDetails=``

  let mealDetails = `
  <div class="close-btn"> <i class="fa-solid fa-left-long"></i>  </div>

<div class=" col-9 col-md-3">

            <div class="card rounded-5 ">
                <img class="rounded-5" src="${meal.strMealThumb}" alt="">
            </div>

            <h2>${meal.strMeal}</h2>
        </div>
        <div class=" col-9 col-md-7">
      
            <h2>Instructions</h2>
            <p>
                ${meal.strInstructions}

            </p>
            <h2>Area :<span> ${meal.strArea} </span> </h2>
            <h2>Category : <span> ${meal.strCategory} </span> </h2>
            <h2>Recipes : </h2>
<div class="d-flex flex-wrap">
<div class="Recipes"><span class="measure">${meal.strMeasure1}</span><span class="Ingredient">${meal.strIngredient1}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure2}</span><span class="Ingredient">${meal.strIngredient2}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure3}</span><span class="Ingredient">${meal.strIngredient3}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure4}</span><span class="Ingredient">${meal.strIngredient4}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure5}</span><span class="Ingredient">${meal.strIngredient5}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure6}</span><span class="Ingredient">${meal.strIngredient6}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure7}</span><span class="Ingredient">${meal.strIngredient7}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure8}</span><span class="Ingredient">${meal.strIngredient8}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure9}</span><span class="Ingredient">${meal.strIngredient9}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure10}</span><span class="Ingredient">${meal.strIngredient10}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure11}</span><span class="Ingredient">${meal.strIngredient11}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure12}</span><span class="Ingredient">${meal.strIngredient12}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure13}</span><span class="Ingredient">${meal.strIngredient13}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure14}</span><span class="Ingredient">${meal.strIngredient14}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure15}</span><span class="Ingredient">${meal.strIngredient15}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure16}</span><span class="Ingredient">${meal.strIngredient16}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure17}</span><span class="Ingredient">${meal.strIngredient17}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure18}</span><span class="Ingredient">${meal.strIngredient18}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure19}</span><span class="Ingredient">${meal.strIngredient19}</span></div>
<div class="Recipes"><span class="measure">${meal.strMeasure20}</span><span class="Ingredient">${meal.strIngredient20}</span></div>
</div>
<h2>tags</h2>
<div class="tags"> 
${meal.strTags}   
</div>         
              <div>
              <a target="_blank" href="${meal.strSource}">Source</a>
                  <br>
                  <a target="_blank" href="${meal.strYoutube}">YouTube</a>
              </div>
        </div>

`;
  document.getElementById("ditails").innerHTML = mealDetails;
  $("#ditails").removeClass("d-none");
    $("#gallery").addClass("d-none");

    $('.loading').fadeOut(1000);

}
// -------------------------------search----------------------------------------------------------------------

$('#name').on( "keyup",()=> {
  let term = $('#name').val()
  console.log(term);
  search(`s=${term}`)
  $('#letter').val('')
})

$('#letter').on( "keyup",()=> {
  let term = $('#letter').val()
  console.log(term);
  search(`f=${term}`)
  $('#name').val('')

})




async function search(term) {
  $('.loading').fadeIn(200)


  const searchByNameUrl =
    `https://www.themealdb.com/api/json/v1/1/search.php?${term}`;
    const endpoint = "";

  // caling fetch 
 
 
  const data = await fetch( searchByNameUrl );
  const res = await data.json();
  console.log(res.meals);
  const meals = res.meals;


    //   call ui class
    displaymeals(meals);

   


    document.querySelectorAll("#card").forEach((card) => {
      card.addEventListener("click", () => {
        console.log(card.getAttribute("id-data"));
        // $('.loading').fadeIn(200)

        getMealById(card.getAttribute("id-data"))     
       });
    });
  };

// ------------------------------------------ingrediant---------------------------------------------------

function callIngredient() {
  $('.loading').fadeIn(200)

  const IngredientUrl =
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list";
  const endpoint = "";
  // caling fetch class
  const Ingredient = new DataFetcher(IngredientUrl, endpoint);
  Ingredient.fetchData().then((data) => {
    const Ingredient = data.meals;
    console.log(" data:", Ingredient);
    //   call ui class
   displayIngredient(Ingredient)
   document.querySelectorAll("#card").forEach((card) => {
    card.addEventListener("click", () => {
      console.log(card.getAttribute("id-data"));

      getMealByingredient(card.getAttribute("id-data"));
    });
  });
  })}
  function displayIngredient(data) {
    let gallery = ``;
    for (let index = 0; index <100; index++) {
      gallery += `                
                <div id-data="i=${data[index].strIngredient}" id="card" class="d-flex justify-content-end my-1 col-md-3">
                <div class="inner  d-flex justify-content-center  overflow-hidden position-relative rounded-4 ">
                    <img class="" src="https://www.themealdb.com/images/ingredients/${data[index].strIngredient}.png" alt="">
                    <div class=" p-2 card-slide position-absolute text-light text-center">
            <h2 class="p-1">${data[index].strIngredient}.</h2>
            <p class="px-1" >${data[index].strDescription}</p>

            </div>
                </div>
                </div>
                
                `;
    }
    $("#gallery").html(gallery);
    $("#ditails").addClass("d-none");
    $('.search').addClass('d-none')
    $("#gallery").removeClass("d-none");
    $('.loading').fadeOut(1000);

  }
// ---------------------------------------------------------------------------------
async function getMealByingredient(i) {
  $('.loading').fadeIn(200)

  const data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?${i}`
  );
  const res = await data.json();
  console.log(res.meals);
  const meals = res.meals;
  displaymeals(meals);
  document.querySelectorAll("#card").forEach((card) => {
    card.addEventListener("click", (e) => {
      console.log(card.getAttribute("id-data"));
      
      getMealById(card.getAttribute("id-data"));
    });
  });
}
// ----------------------------------area----------------------------------------------------------
async function getList() {
  $('.loading').fadeIn(200)

  const data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list` );
  const res = await data.json();
  console.log(res.meals);
  const areas = res.meals;

  displayArea(areas);
  document.querySelectorAll("#card").forEach((card) => {
    card.addEventListener("click", (e) => {
      console.log(card.getAttribute("id-data")); 
      getAreaMeals(card.getAttribute("id-data"))
    });
    });
  }
  function displayArea(data, area) {
    let gallery = ``;
    for (let index = 0; index < data.length; index++) {
      gallery += `                
                <div id-data="a=${data[index].strArea}" id="card" class="d-flex justify-content-end my-1 col-md-3">
                <div class="inner  d-flex justify-content-center  overflow-hidden position-relative rounded-4 ">
                <h2 class="p-1">${data[index].strArea}.</h2>
                    <img class="" src="" alt="">
                    <div class=" p-2 card-slide position-absolute text-light text-center">

            </div>
                </div>
                </div>
                
                `;
    }
    $("#gallery").html(gallery);
    $("#ditails").addClass("d-none");
    $('.search').addClass('d-none')
    $("#gallery").removeClass("d-none");
    $('.loading').fadeOut(1000);

  }

  async function getAreaMeals(area) {
    $('.loading').fadeIn(200)

    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?${area}` );
    const res = await data.json();
    console.log(res.meals);
    const areas = res.meals;
  
    displaymeals(areas);
    document.querySelectorAll("#card").forEach((card) => {
      card.addEventListener("click", (e) => {
        console.log(card.getAttribute("id-data"));
        getMealById(card.getAttribute("id-data"))     

      });
      });
    }

// -----------------------------------contact us-------------------------------------------------------------

function resetForm () {
  $('form input').val('')
}

// --------------------------------------------------------------------------------------------------------------


const nameRegex = /^[a-zA-Z]{3,60}/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const ageRegex = /^([5-9]|[1-9][0-9]|100)$/;
const telRegex = /^0\d{8,10}$/;
const passRegex = /.{5,50}/;




$('#username').on("keyup", () => {
  if (isValidName()) {
    console.log('validName');
    $('#namerrorMessage').addClass('d-none')
    enableBtn()
    
  } else {
$('#namerrorMessage').removeClass('d-none')
  }
});
$('#usermail').on("keyup", () => {
  if (isValidEmail()) {
    console.log('validmail');
    $('#mailerrorMessage').addClass('d-none')
    enableBtn()
    
  } else {
$('#mailerrorMessage').removeClass('d-none')
  }
});

$('#userphone').on("keyup", () => {
  if (isValidPhoneNumber()) {
    console.log('validtel');
    $('#phoneerrorMessage').addClass('d-none')

    enableBtn()
  } else {
    $('#phoneerrorMessage').removeClass('d-none')
  }
});

$('#userage').on("keyup", () => {
  if (isValidAge()) {
    console.log('validage');
    $('#ageerrorMessage').addClass('d-none')

    enableBtn()
  } else {
    $('#ageerrorMessage').removeClass('d-none')
  }
});

$('#pass').on("keyup", () => {
  if (isValidPassword()) {
    console.log('validpass');
    
    $('#passerrorMessage').addClass('d-none')
    enableBtn()
  } else {
    $('#passerrorMessage').removeClass('d-none')
  }
});

$('#re-pass').on("keyup", () => {
  if (isValidRePassword()) {
    console.log('validre-pass');
    
    enableBtn()
  } else {
  }
});



function isValidName() {
  return nameRegex.test($('#username').val());
}


function isValidEmail() {
  return emailRegex.test($('#usermail').val());
}

function isValidPhoneNumber() {
  return telRegex.test($('#userphone').val());
}

function isValidAge() {
  return ageRegex.test($('#userage').val());
}

function isValidPassword() {
  return passRegex.test($('#pass').val());
}

function isValidRePassword() {
  return $('#re-pass').val() === $('#pass').val();
}

function enableBtn() {
  if (
    isValidName() &&
    isValidEmail() &&
    isValidPhoneNumber() &&
    isValidAge() &&
    isValidPassword()&&
    isValidRePassword()
  )
   {
    // document.getElementById('submit').classList.remove("d-none'")
    // document.getElementById('submit').removeAttribute("disabled")
    $('#submit').removeAttr('disabled') 
  
   }
}













