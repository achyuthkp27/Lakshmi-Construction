setTimeout(function () {
  $(".loader").fadeToggle();
}, 1000);

$("a[href='#main-page']").click(function () {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
});
$("a[href='#contact']").click(function () {
  $("html, body").animate({ scrollTop: $("#contact").offset().top }, "slow");
});
$("a[href='#about']").click(function () {
  $("html, body").animate({ scrollTop: $("#about").offset().top }, "slow");
});
$("a[href='#services']").click(function () {
  $("html, body").animate({ scrollTop: $("#services").offset().top }, "slow");
});
$("a[href='#portfolio']").click(function () {
  $("html, body").animate({ scrollTop: $("#portfolio").offset().top }, "slow");
});
$("a[href='#trending']").click(function () {
  $("html, body").animate({ scrollTop: $("#trending").offset().top }, "slow");
});

let TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  let i = this.loopNum % this.toRotate.length;
  let fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  let that = this;
  let delta = 300 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  let elements = document.getElementsByClassName("txt-rotate");
  for (let i = 0; i < elements.length; i++) {
    let toRotate = elements[i].getAttribute("data-rotate");
    let period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }

  let css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};
