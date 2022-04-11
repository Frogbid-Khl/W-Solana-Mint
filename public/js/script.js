$(window).on("load", function () {
  // Registring GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Hides loading screen when the page content is loaded
  $("#loader").fadeOut("slow");

  // Cloud infite moving animation
  gsap.to(".cloud-1", {
    left: "100%",
    duration: 50,
    repeat: -1,
    delay: 25,
    ease: Linear.easeInOut,
  });
  gsap.to(".cloud-2, .moon-cloud-4 , .moon-cloud-5, .moon-cloud-6", {
    left: "100%",
    duration: 50,
    repeat: -1,
    ease: Linear.easeInOut,
  });
  gsap.to(".cloud-3", {
    left: "100%",
    duration: 25,
    ease: Linear.easeInOut,
  });
  gsap.to(".cloud-4", {
    left: "100%",
    duration: 25,
    ease: Linear.easeInOut,
  });

  // Landing animation
  let heroLandingAnim = gsap.timeline({
    defaults: {
      ease: Back.easeInOut,
    },
  });
  heroLandingAnim
    .fromTo(
      ".l1-sun",
      {
        opacity: 0,
        transform: "translate(-50%, 100%)",
      },
      {
        opacity: 1,
        transform: "translate(-50%, 40%)",
        duration: 2,
      },
      0
    )
    .fromTo(
      ".cloud-1, .cloud-2, .cloud-3",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.75,
      }
    )
    .fromTo(
      ".rainbow",
      {
        transform: "translate(35%, 10%)",
        opacity: 0,
      },
      {
        transform: "translate(35%, -15%)",
        opacity: 1,
        duration: 2,
      },
      "<0"
    );
});
gsap.to(".island", {
  bottom: "5%",
  duration: 7,
  repeat: -1,
  yoyo: true,
  ease: Linear.easeInOut,
});
gsap.to(".charity-icon", {
  bottom: "30%",
  duration: 7,
  repeat: -1,
  yoyo: true,
  ease: Linear.easeInOut,
});
gsap.to(".merch", {
  bottom: "20%",
  duration: 7,
  repeat: -1,
  yoyo: true,
  ease: Linear.easeInOut,
});

// Hero section on-scroll animation

var heroOnScrollAnim = gsap.timeline({
  scrollTrigger: {
    trigger: ".layer-1",
    toggleActions: "start pause resume none",
    start: "top 0%",
    end: "bottom -100%",
    scrub: 0.25,
    pin: false,
    pinSpacing: false,
    markers: false,
  },
  defaults: {
    ease: Power1.easeInOut,
    duration: 1,
  },
});
heroOnScrollAnim
  /* .fromTo(
    ".mountain-left",
    {
      bottom: 0,
    },
    {
      bottom: "-50%",
    }
  )
  .fromTo(
    ".mountain-right",
    {
      bottom: 0,
    },
    {
      bottom: "-50%",
    },
    0
  ) */
  .to(
    ".bros-3",
    {
      transform: "translate(-40%, -100%)",
    },
    0
  )
  .fromTo(
    ".rainbow",
    {
      transform: "translate(35%, -15%)",
    },
    {
      transform: "translate(35%, 250%)",
    },
    0
  )
  .fromTo(
    ".sb-logo",
    {
      top: "9.5%",
    },
    {
      top: "0.5%",
      duration: 0.5,
    },
    0
  )
  .fromTo(
    ".l1-tree",
    {
      left: "-2px",
    },
    {
      left: "-10%",
    },
    0
  )
  .fromTo(
    ".l1-sun",
    {
      transform: "translate(-50%, 40%)",
    },
    {
      transform: "translate(-50%, 80%)",
      duration: 0.5,
    },
    0
  )
  .fromTo(
    ".sb-logo",
    {
      transform: "translate(-50%, 0%) rotateX(0deg)",
      opacity: 1,
    },
    {
      transform: "translate(-50%, 0%) rotateX(90deg)",
      opacity: 0,
    },
    0
  );

// Layer-2 7 NFTs on-scroll animations

var grassNFTAnim = gsap.timeline({
  scrollTrigger: {
    trigger: ".layer-2",
    toggleActions: "start pause resume none",
    start: "top 50%",
    end: "top 5%",
    scrub: 0.25,
    pin: false,
    pinSpacing: false,
    markers: false,
  },
  defaults: {
    ease: Power1.easeInOut,
    duration: 1,
  },
});
/* grassNFTAnim
  .fromTo(
    ".grass-nft-4",
    {
      transform: "translate(-50%, 100%)",
    },
    {
      transform: "translate(-50%, 0)",
    }
  )
  .fromTo(
    ".grass-nft-3",
    {
      transform: "translate(-50%, 100%)",
    },
    {
      transform: "translate(-115%, 0)",
    },
    "<0"
  )
  .fromTo(
    ".grass-nft-2",
    {
      transform: "translate(-50%, 100%)",
    },
    {
      transform: "translate(-200%,0)",
    },
    "<0"
  )
  .fromTo(
    ".grass-nft-1",
    {
      transform: "translate(-50%, 100%)",
    },
    {
      transform: "translate(-285%,0)",
    },
    "<0"
  )
  .fromTo(
    ".grass-nft-5",
    {
      transform: "translate(-50%, 100%)",
    },
    {
      transform: "translate(30%,0)",
    },
    "<0"
  )
  .fromTo(
    ".grass-nft-6",
    {
      transform: "translate(-50%, 100%)",
    },
    {
      transform: "translate(115%,0)",
    },
    "<0"
  )
  .fromTo(
    ".grass-nft-7",
    {
      transform: "translate(-75%, 100%)",
    },
    {
      transform: "translate(90%,0)",
    },
    "<0"
  ); */

/* Layer-3 Sun on-scroll animation */
var grassNFTAnim = gsap.timeline({
  scrollTrigger: {
    trigger: ".layer-3",
    toggleActions: "start pause resume none",
    start: "top 80%",
    end: "bottom 0%",
    scrub: 0.25,
    pin: false,
    pinSpacing: false,
    markers: false,
  },
  defaults: {
    ease: Power1.easeInOut,
  },
});
grassNFTAnim.fromTo(
  ".l3-sun",
  {
    top: "20%",
    rotate: 0,
  },
  {
    top: "100%",
    rotate: 50,
  }
);

/* Palm Tree Left - Onscroll animations */
var palmTreeLeftAnim = gsap.timeline({
  scrollTrigger: {
    trigger: ".palm-tree-left",
    toggleActions: "start pause resume none",
    start: "top 100%",
    end: "top 30%",
    scrub: 1,
    pin: false,
    pinSpacing: false,
    markers: false,
  },
  defaults: {
    ease: Power1.easeInOut,
    duration: 1,
  },
});
palmTreeLeftAnim.fromTo(
  ".palm-tree-left",
  {
    left: "-5%",
  },
  {
    left: "0%",
  }
);

/* Palm Tree Right - Onscroll animations */
var palmTreeRightAnim = gsap.timeline({
  scrollTrigger: {
    trigger: ".palm-tree-right",
    toggleActions: "start pause resume none",
    start: "top 100%",
    end: "top 30%",
    scrub: 1,
    pin: false,
    pinSpacing: false,
    markers: false,
  },
  defaults: {
    ease: Power1.easeInOut,
    duration: 1,
  },
});
palmTreeRightAnim.fromTo(
  ".palm-tree-right",
  {
    right: "-5%",
  },
  {
    right: "0%",
  }
);

/* Road - Onscroll animations */
var roadAnim = gsap.timeline({
  scrollTrigger: {
    trigger: ".layer-4",
    toggleActions: "start pause resume none",
    start: "top 20%",
    end: "bottom 20%",
    scrub: 0.5,
    pin: false,
    pinSpacing: false,
    markers: false,
  },
  defaults: {
    duration: 5,
  },
});
roadAnim.fromTo(
  ".road-box",
  {
    height: "0%",
  },
  {
    height: "100%",
  }
);

/* Moon - Onscroll animations */
var roadAnim = gsap.timeline({
  scrollTrigger: {
    trigger: "#night-moon-box",
    toggleActions: "start pause resume none",
    start: "top 90%",
    end: "top 10%",
    scrub: 0.5,
    pin: false,
    pinSpacing: false,
    markers: false,
  },
  defaults: {
    duration: 5,
  },
});
roadAnim.fromTo(
  ".moon img",
  {
    transform: "translate(0, 10vw)",
  },
  {
    transform: "translate(0, 0)",
  }
);

/* FAQ */
$(".fb-1 .faq-q").click(() => {
  $(".fb-1 .faq-a").slideToggle(400);
  $(".fb-1 .faq-q img").toggleClass("rotate");
});
$(".fb-2 .faq-q").click(() => {
  $(".fb-2 .faq-a").slideToggle(400);
  $(".fb-2 .faq-q img").toggleClass("rotate");
});
$(".fb-3 .faq-q").click(() => {
  $(".fb-3 .faq-a").slideToggle(400);
  $(".fb-3 .faq-q img").toggleClass("rotate");
});
$(".fb-4 .faq-q").click(() => {
  $(".fb-4 .faq-a").slideToggle(400);
  $(".fb-4 .faq-q img").toggleClass("rotate");
});

$(".menu").click(() => {
  $(".menu").css({ display: "none" });
  $(".clear").css({ display: "block" });
  $(".header-mob").css({ display: "block" });
});
$(".clear").click(() => {
  $(".menu").css({ display: "block" });
  $(".clear").css({ display: "none" });
  $(".header-mob").css({ display: "none" });
});
