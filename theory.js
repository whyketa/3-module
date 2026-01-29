document.addEventListener("DOMContentLoaded", () => {
  changeBoxColor();
});

function changeBoxColor() {
  let rectangleBlack = document.querySelector(".shape1");

  rectangleBlack.addEventListener("click", () => {
    rectangleBlack.classList.toggle("colorChange");
  });
}
document.addEventListener("DOMContentLoaded", () => {
  changeBoxColor2();
});
function changeBoxColor2() {
  let rectangleBlack = document.querySelector(".shape2");

  rectangleBlack.addEventListener("click", () => {
    rectangleBlack.classList.toggle("colorChange2");
  });
}
document.addEventListener("DOMContentLoaded", () => {
  changeBoxColor3();
});
function changeBoxColor3() {
  let rectangleBlack = document.querySelector(".shape3");

  rectangleBlack.addEventListener("click", () => {
    rectangleBlack.classList.toggle("colorChange3");
  });
}
