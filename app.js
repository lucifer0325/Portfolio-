/* ==========================================================================
   ASHISH KR SINGH PORTFOLIO SCRIPT [PERFORMANCE MARKETING REDESIGN]
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Page Load state
  setTimeout(() => {
    document.body.classList.remove('no-scroll-loading');
    document.body.classList.add('loaded');
  }, 300);

  // --- Lenis Smooth Scroll Setup ---
  let lenis;
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.9,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } catch (e) {
    console.warn('Lenis scroll failed to load, falling back to standard scroll.', e);
  }

  // --- Custom Cursor Logic (Desktop Only) ---
  const cursor = document.getElementById('custom-cursor');
  const cursorRing = document.getElementById('custom-cursor-ring');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let ringX = 0, ringY = 0;
  let isTouchDevice = false;

  window.addEventListener('touchstart', function detectTouch() {
    isTouchDevice = true;
    if (cursor) cursor.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
    window.removeEventListener('touchstart', detectTouch);
  }, { passive: true });

  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.25;
      cursorY += (mouseY - cursorY) * 0.25;
      if (cursor) {
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
      }

      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    const interactiveElements = document.querySelectorAll('a, button, .btn, .input-card, .bento-cell, .timeline-card, .methodology-card, .contact-btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hover-active');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hover-active');
      });
    });
  }

  // --- Mobile Hamburger Navigation ---
  const hamburger = document.getElementById('hamburger-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl && lenis) {
            lenis.scrollTo(targetEl);
          }
        }
      });
    });
  }

  // --- Scroll Spy sidebar & Smooth Anchor Scroll ---
  const spyDots = document.querySelectorAll('.spy-dot');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  function updateActiveNavigation(sectionId) {
    spyDots.forEach(dot => {
      if (dot.getAttribute('data-section') === sectionId) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const navObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateActiveNavigation(entry.target.id);
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });

  const allScrollLinks = document.querySelectorAll('.nav-link, .spy-dot, .hero-ctas a, .logo');
  allScrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl && lenis) {
          lenis.scrollTo(targetEl);
        }
      }
    });
  });


  // --- SECTION D: Case Studies Desktop Horizontal Scroll ---
  const caseSection = document.getElementById('case-studies');
  const caseInner = document.querySelector('.case-studies-inner');
  const progressBar = document.getElementById('case-progress-bar');
  let horizontalScrollLimit = 0;

  function calculateHorizontalBounds() {
    if (caseInner && window.innerWidth >= 1200) {
      horizontalScrollLimit = caseInner.scrollWidth - window.innerWidth;
    } else {
      horizontalScrollLimit = 0;
    }
  }
  calculateHorizontalBounds();
  window.addEventListener('resize', calculateHorizontalBounds);

  function handleHorizontalScroll() {
    if (!caseSection || !caseInner || window.innerWidth < 1200) {
      if (caseInner) caseInner.style.transform = 'none';
      return;
    }

    const sectionTop = caseSection.offsetTop;
    const sectionHeight = caseSection.offsetHeight;
    const windowHeight = window.innerHeight;

    const progress = (window.scrollY - sectionTop) / (sectionHeight - windowHeight);
    const clampedProgress = Math.max(0, Math.min(1, progress));

    const translateX = clampedProgress * horizontalScrollLimit;
    caseInner.style.transform = `translateX(-${translateX}px)`;

    if (progressBar) {
      progressBar.style.width = `${clampedProgress * 100}%`;
    }

    const cards = document.querySelectorAll('.case-study-card');
    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      if (cardRect.left < window.innerWidth && cardRect.right > 0) {
        animateCardBars(card);
      }
    });
  }

  window.addEventListener('scroll', handleHorizontalScroll);

  function animateCardBars(card) {
    const bars = card.querySelectorAll('.bar-fill');
    bars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width');
      if (targetWidth && bar.style.width !== targetWidth) {
        bar.style.width = targetWidth;
      }
    });
  }

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCardBars(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.case-study-card').forEach(card => {
    cardObserver.observe(card);
  });


  // --- 3D Desktop Tilt Effect ---
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (window.innerWidth >= 1200) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const tiltX = (yc - y) / 14; 
        const tiltY = (x - xc) / 20;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
        
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${px}%`);
        card.style.setProperty('--mouse-y', `${py}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });
  }


  // --- Intersection Observer for Section elements ---
  const revealObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  document.querySelectorAll('.scroll-reveal-fade').forEach(el => {
    revealObserver.observe(el);
  });


  // --- Intersection Observer for Stats Counter ---
  const counterElements = document.querySelectorAll('[data-counter-target], [data-target]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => {
    counterObserver.observe(el);
  });

  function animateNumber(element) {
    const targetVal = parseFloat(element.getAttribute('data-counter-target') || element.getAttribute('data-target'));
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const decimals = parseInt(element.getAttribute('data-decimals') || '0', 10);
    
    let startTimestamp = null;
    const duration = 2000;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentVal = easeProgress * targetVal;
      
      element.textContent = prefix + currentVal.toFixed(decimals) + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }


  // --- THREE.JS WebGL 3D SCENES [ROLE-TAILORED REDESIGN] ---

  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable()) {
    console.warn('WebGL not supported. Bypassing 3D canvases.');
    return;
  }

  // --- 1. HERO 3D SCENE (3D Scaling Ad Channel Data-Grid & Exponential Growth Curve) ---
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 3, 9); // Angled downward to look at the grid dashboard
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: heroCanvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 5, 25);
    blueLight.position.set(-6, 3, 3);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xe5c158, 6, 25);
    goldLight.position.set(6, -2, 3);
    scene.add(goldLight);

    // Group to tilt grid + growth elements
    const dashboardGroup = new THREE.Group();
    dashboardGroup.rotation.x = -Math.PI / 12; // tilt slightly
    scene.add(dashboardGroup);

    // 1. Grid Dashboard plane
    const gridHelper = new THREE.GridHelper(10, 14, 0x3b82f6, 0x111115);
    gridHelper.position.y = -2.0;
    gridHelper.material.opacity = 0.35;
    gridHelper.material.transparent = true;
    dashboardGroup.add(gridHelper);

    // 2. Exponential Growth Curve (Scale path)
    const curvePoints = [
      new THREE.Vector3(-4.5, -2.0, 1.5),
      new THREE.Vector3(-3.0, -1.9, 0.8),
      new THREE.Vector3(-1.0, -1.6, 0.0),
      new THREE.Vector3(1.0, -0.8, -0.8),
      new THREE.Vector3(3.0, 0.8, -1.5),
      new THREE.Vector3(4.5, 3.2, -2.0) // curves exponentially up and deep
    ];
    const scalingCurve = new THREE.CatmullRomCurve3(curvePoints);
    
    // Draw the main glowing scale line
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(scalingCurve.getPoints(60));
    const curveMaterial = new THREE.LineBasicMaterial({
      color: 0xe5c158,
      linewidth: 3,
      transparent: true,
      opacity: 0.85
    });
    const scaleLine = new THREE.Line(curveGeometry, curveMaterial);
    dashboardGroup.add(scaleLine);

    // 3. Grid data nodes (pulsing conversions) at key coordinates
    const nodeGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const goldNodeMat = new THREE.MeshBasicMaterial({ color: 0xe5c158 });
    const blueNodeMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });

    const nodes = [];
    curvePoints.forEach((pt, i) => {
      const nodeMesh = new THREE.Mesh(nodeGeom, i % 2 === 0 ? goldNodeMat : blueNodeMat);
      nodeMesh.position.copy(pt);
      dashboardGroup.add(nodeMesh);
      nodes.push(nodeMesh);
    });

    // 4. Clicks / Leads / Conversion Packets flowing up the scale line
    const particleCount = 25;
    const packetGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0xe5c158,
      transparent: true,
      opacity: 0.8
    });

    const packets = [];
    for (let i = 0; i < particleCount; i++) {
      const packetMesh = new THREE.Mesh(packetGeom, i % 3 === 0 ? goldNodeMat : packetMat);
      dashboardGroup.add(packetMesh);
      packets.push({
        mesh: packetMesh,
        t: Math.random(), // progress along path [0, 1]
        speed: 0.08 + Math.random() * 0.12
      });
    }

    // Parallax
    let targetX = 0, targetY = 0;
    document.addEventListener('mousemove', (e) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.0006;
      targetY = (e.clientY - window.innerHeight / 2) * 0.0006;
    });

    let isHeroVisible = true;
    const heroObserver = new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    heroObserver.observe(document.getElementById('hero'));

    const clock = new THREE.Clock();

    function renderHero() {
      if (isHeroVisible) {
        const elapsedTime = clock.getElapsedTime();
        const delta = clock.getDelta();

        // Rotate grid slowly
        dashboardGroup.rotation.y = elapsedTime * 0.05;

        // Pulse conversion nodes scale
        nodes.forEach((node, idx) => {
          const pulse = 1.0 + Math.sin(elapsedTime * 3 + idx) * 0.2;
          node.scale.set(pulse, pulse, pulse);
        });

        // Move packets along the exponential growth path
        packets.forEach(packet => {
          packet.t += packet.speed * 0.02;
          if (packet.t >= 1) {
            packet.t = 0; // reset flow at TOF
          }
          const pos = scalingCurve.getPointAt(packet.t);
          packet.mesh.position.copy(pos);
        });

        // Mouse Parallax
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY + 3.0 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, -1);

        renderer.render(scene, camera);
      }
      requestAnimationFrame(renderHero);
    }
    requestAnimationFrame(renderHero);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // --- 2. PHILOSOPHY SCENE (3D Marketing Funnel Morphing to Growth Staircase) ---
  const philCanvas = document.getElementById('philosophy-canvas');
  if (philCanvas) {
    const parentContainer = philCanvas.parentElement;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, parentContainer.clientWidth / parentContainer.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: philCanvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(parentContainer.clientWidth, parentContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xe5c158, 5, 20);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 4, 20);
    blueLight.position.set(-2, -2, 3);
    scene.add(blueLight);

    // Funnel Stage Rings
    const stageRings = [];
    const ringColors = [0xe5c158, 0x3b82f6, 0x10b981, 0x059669]; // gold, blue, green, deep green
    const ringCount = 4;
    const funnelGroup = new THREE.Group();
    scene.add(funnelGroup);

    for (let i = 0; i < ringCount; i++) {
      const ringGeom = new THREE.TorusGeometry(1.0, 0.05, 12, 64);
      const ringMat = new THREE.MeshPhysicalMaterial({
        color: ringColors[i],
        metalness: 0.9,
        roughness: 0.15
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      funnelGroup.add(ringMesh);
      stageRings.push(ringMesh);
    }

    // Traffic/Conversions Particles flowing through the system
    const trafficCount = 40;
    const trafficGroup = new THREE.Group();
    funnelGroup.add(trafficGroup);

    const trafficGeom = new THREE.SphereGeometry(0.04, 8, 8);
    const trafficMat = new THREE.MeshBasicMaterial({ color: 0xe5c158 });
    const traffics = [];

    for (let i = 0; i < trafficCount; i++) {
      const trafficMesh = new THREE.Mesh(trafficGeom, trafficMat);
      trafficGroup.add(trafficMesh);
      traffics.push({
        mesh: trafficMesh,
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.015
      });
    }

    // Monitor scroll bounds
    const philSection = document.getElementById('philosophy');
    let isPhilVisible = false;

    const philObserver = new IntersectionObserver((entries) => {
      isPhilVisible = entries[0].isIntersecting;
    }, { threshold: 0.01 });
    
    if (philSection) philObserver.observe(philSection);

    function animateFunnelMorph(percent) {
      // Rotate whole group
      funnelGroup.rotation.y = window.scrollY * 0.0015;

      stageRings.forEach((ring, idx) => {
        // State 0: Marketing Funnel Stack (stacked vertically, decreasing radius)
        const yStart = 1.8 - idx * 1.2; // top to bottom: 1.8, 0.6, -0.6, -1.8
        const rStart = 1.8 - idx * 0.45; // TOF is wide, BOF is narrow

        // State 1: Growth Staircase / Escalating slope (spaced horizontally, stepping up)
        const xEnd = -2.2 + idx * 1.45; // step left-to-right
        const yEnd = -1.5 + idx * 0.95; // step upward
        const rEnd = 0.65;               // uniform steps

        // Lerp positions and scales
        const currentX = THREE.MathUtils.lerp(0, xEnd, percent);
        const currentY = THREE.MathUtils.lerp(yStart, yEnd, percent);
        const currentRadius = THREE.MathUtils.lerp(rStart, rEnd, percent);

        ring.position.set(currentX, currentY, 0);
        ring.scale.set(currentRadius, currentRadius, 1);
        
        // Tilt rings in staircase configuration
        if (percent > 0.1) {
          ring.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, Math.PI / 3, percent);
        } else {
          ring.rotation.x = Math.PI / 2;
        }
      });

      // Animate flowing traffic
      traffics.forEach(traffic => {
        traffic.progress += traffic.speed;
        if (traffic.progress >= 1.0) {
          traffic.progress = 0;
        }

        // State 0: Flow downward and narrow (Funneling)
        // State 1: Scale upward and climb (Conversion Growth scaling)
        let tx = 0, ty = 0, tz = 0;
        const angle = traffic.progress * Math.PI * 8; // spiral spin

        if (percent < 0.5) {
          // Spirals down the funnel cone
          const funnelProgressPercent = THREE.MathUtils.lerp(0, 1, percent * 2);
          const currentY = 1.8 - traffic.progress * 3.6;
          const currentRadius = 1.8 - traffic.progress * 1.35;
          tx = Math.cos(angle) * currentRadius * 0.9;
          ty = currentY;
          tz = Math.sin(angle) * currentRadius * 0.9;
        } else {
          // Climbs up the staircase stairs
          const stairIdx = Math.floor(traffic.progress * 4);
          const stairSegmentT = (traffic.progress * 4) % 1;
          
          const x0 = -2.2 + stairIdx * 1.45;
          const y0 = -1.5 + stairIdx * 0.95;
          const x1 = -2.2 + (stairIdx + 1) * 1.45;
          const y1 = -1.5 + (stairIdx + 1) * 0.95;

          tx = THREE.MathUtils.lerp(x0, x1, stairSegmentT) + Math.cos(angle) * 0.15;
          ty = THREE.MathUtils.lerp(y0, y1, stairSegmentT) + Math.sin(angle) * 0.15;
          tz = Math.sin(angle) * 0.2;
        }

        traffic.mesh.position.set(tx, ty, tz);
      });
    }

    function renderPhil() {
      if (isPhilVisible) {
        let percent = 0;
        if (philSection) {
          const sectionTop = philSection.offsetTop;
          const sectionHeight = philSection.offsetHeight;
          percent = (window.scrollY - sectionTop) / (sectionHeight - window.innerHeight);
          percent = Math.max(0, Math.min(1, percent));
        }

        animateFunnelMorph(percent);
        renderer.render(scene, camera);
      }
      requestAnimationFrame(renderPhil);
    }
    requestAnimationFrame(renderPhil);

    window.addEventListener('resize', () => {
      const w = parentContainer.clientWidth;
      const h = parentContainer.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  // --- 3. CONTACT SCENE (Pulsing Compounding Feedback Spiral) ---
  const contactCanvas = document.getElementById('contact-canvas');
  if (contactCanvas) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas: contactCanvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0a0a0a, 2.0);
    scene.add(ambientLight);

    const pointLightLeft = new THREE.PointLight(0x3b82f6, 4, 20);
    pointLightLeft.position.set(-5, 2, 3);
    scene.add(pointLightLeft);

    const pointLightRight = new THREE.PointLight(0xe5c158, 6, 20);
    pointLightRight.position.set(5, -2, 3);
    scene.add(pointLightRight);

    // Generate Spiral Points representing compounding loop systems
    const spiralPoints = [];
    const rotations = 5;
    const stepCount = 180;
    
    for (let i = 0; i <= stepCount; i++) {
      const t = i / stepCount;
      const angle = t * Math.PI * 2 * rotations;
      const radius = 0.3 + t * 1.8; // spiral grows outward
      const y = (t - 0.5) * 3.5;    // spiral stretches vertically
      spiralPoints.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }

    const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints);
    const spiralGeom = new THREE.BufferGeometry().setFromPoints(spiralCurve.getPoints(120));
    const spiralMat = new THREE.LineBasicMaterial({
      color: 0xe5c158,
      linewidth: 3,
      transparent: true,
      opacity: 0.8
    });
    
    const spiralMesh = new THREE.Line(spiralGeom, spiralMat);
    scene.add(spiralMesh);

    // Orbiting conversion signal nodes
    const signalCount = 12;
    const signalGeom = new THREE.SphereGeometry(0.08, 8, 8);
    const signalMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const signals = [];

    for (let i = 0; i < signalCount; i++) {
      const signalMesh = new THREE.Mesh(signalGeom, i % 2 === 0 ? signalMat : new THREE.MeshBasicMaterial({ color: 0xe5c158 }));
      scene.add(signalMesh);
      signals.push({
        mesh: signalMesh,
        t: i / signalCount,
        speed: 0.05
      });
    }

    let isContactVisible = false;
    const contactObserver = new IntersectionObserver((entries) => {
      isContactVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    contactObserver.observe(document.getElementById('contact'));

    const clock = new THREE.Clock();
    
    function renderContact() {
      if (isContactVisible) {
        const elapsedTime = clock.getElapsedTime();

        // Rotate spiral
        spiralMesh.rotation.y = elapsedTime * 0.4;
        
        // Pulse spiral scale
        const scaleVal = 1.0 + Math.sin(elapsedTime * 2.5) * 0.05;
        spiralMesh.scale.set(scaleVal, scaleVal, scaleVal);

        // Circulate signals along spiral
        signals.forEach(signal => {
          signal.t += signal.speed * 0.005;
          if (signal.t >= 1.0) {
            signal.t = 0;
          }
          const pt = spiralCurve.getPointAt(signal.t);
          // Apply rotation of main spiral mesh to signals
          const rotatedPt = pt.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), spiralMesh.rotation.y);
          signal.mesh.position.copy(rotatedPt);
        });

        renderer.render(scene, camera);
      }
      requestAnimationFrame(renderContact);
    }
    requestAnimationFrame(renderContact);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

});
