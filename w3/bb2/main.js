 const ring = document.querySelector('.ring');
    const numImgs = 10;
    let xPos = 0;
    for (let i = 0; i < numImgs; i++) {
      const div = document.createElement('div');
      div.classList.add('img');
      ring.appendChild(div);
    }

    const imgs = document.querySelectorAll('.img');
    imgs.forEach((img, i) => {
      fetch('https://dog.ceo/api/breeds/image/random')
        .then(res => res.json())
        .then(data => {
          img.style.backgroundImage = `url(${data.message})`;
          gsap.set(img, {
            rotateY: i * -(360 / numImgs),
            transformOrigin: '50% 50% 500px',
            z: -500,
            backfaceVisibility: 'hidden'
          });
        });
    });
    gsap.set(ring, { rotationY: 180, cursor: 'grab' });

    $('.img').on('mouseenter', function () {
      const current = this;
      gsap.to('.img', {
        opacity: (i, t) => t === current ? 1 : 0.4,
        ease: 'power3'
      });
    });

    $('.img').on('mouseleave', () => {
      gsap.to('.img', { opacity: 1, ease: 'power2.inOut' });
    });

    // Kéo chuột để xoay vòng
    let isDragging = false;

    $(window).on('mousedown touchstart', (e) => {
      if (e.touches) e.clientX = e.touches[0].clientX;
      xPos = e.clientX;
      isDragging = true;
      gsap.set(ring, { cursor: 'grabbing' });
    });

    $(window).on('mouseup touchend', () => {
      isDragging = false;
      gsap.set(ring, { cursor: 'grab' });
    });

    $(window).on('mousemove touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches) e.clientX = e.touches[0].clientX;
      const dx = e.clientX - xPos;
      xPos = e.clientX;
      gsap.to(ring, {
        rotationY: "-=" + dx,
        onUpdate: () => {
          gsap.set(imgs, {
            backgroundPosition: (i) => getBgPos(i)
          });
        }
      });
    });

    function getBgPos(i) {
      const rotation = gsap.getProperty(ring, 'rotationY') - 180 - i * (360 / numImgs);
      return (100 - gsap.utils.wrap(0, 360, rotation) / 360 * 500) + 'px 0px';
    }
