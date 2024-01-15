/* animation starts. Since I'm removing the windows so that event listeners don't accumulate,
the animation is reversed with a separate animation, because 'tl1.reverse()' caused bugs */

export function playAnimation(target, blurWindow, startDisplay = 'none', finishDisplay = 'flex') {
  // eslint-disable-next-line no-undef
  const tl1 = gsap.timeline({ paused: true });
  tl1.fromTo(target, { display: startDisplay, opacity: 0, }, { display: finishDisplay, opacity: 1, duration: 0.5, ease: "expo", });
  tl1.eventCallback('onStart', () => {
    document.body.style.overflowY = 'hidden';
  });
  tl1.play();
  blurWindow.style.display = 'inline-block';
}

export function reverseAnimation(target, blurWindow, startDisplay = 'flex', finishDisplay = 'none') {
  // eslint-disable-next-line no-undef
  const tl2 = gsap.timeline({ paused: true });
  const timeOutLength = 300;
  tl2.fromTo(target, { display: startDisplay, opacity: 1, }, { display: finishDisplay, opacity: 0, duration: 0.5, ease: "expo", });
  tl2.play();
  tl2.eventCallback('onStart', () => {
    document.body.style.overflowY = 'auto';
  });
  setTimeout(() => {
    target.remove();
    blurWindow.style.display = 'none';
  }, timeOutLength);
}

//  wanted to work with promises. let them be here, so I can see the context

// export function reverseAnimation1(target, blurWindow, startDisplay = 'flex', finishDisplay = 'none') {
//   return new Promise((resolve, reject) => {
//     let tl2 = gsap.timeline({ paused: true });
//     tl2.fromTo(target, { display: startDisplay, opacity: 1, }, { display: finishDisplay, opacity: 0, duration: 0.5, ease: "expo", });
//     tl2.play();
//     setTimeout(() => {
//       target.remove();
//       blurWindow.style.display = 'none';
//       resolve();
//     }, 300);
//   })
// }

// function delay(ms: number) {
//   return new Promise((resolve, reject)=> {
//     setTimeout(()=>{
//       resolve();
//     }, ms);
//   });
// }
