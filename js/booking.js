/**
 * YogSetu - Verified Yoga Directory
 * Controllers: Database mappings, listings filters, search, forms callbacks, and scheduler wizard.
 */

// Note: teachersDatabase and jobsDatabase are loaded from js/database.js

// ------------------------------------------
// INTERACTIVE SANDBOX SEARCH WIDGET (HOME)
// ------------------------------------------
function initSandboxSearch() {
  const styleBtns = document.querySelectorAll('.sandbox-style-btn');
  const locBtns = document.querySelectorAll('.sandbox-loc-btn');
  const teacherName = document.getElementById('sandbox-teacher-name');
  const teacherDesc = document.getElementById('sandbox-teacher-desc');
  const ctaBtn = document.getElementById('sandbox-cta-btn');
  
  let selectedStyle = null;
  let selectedLoc = null;

  const database = {
    "Hatha_Delhi": { name: "Anjali Sharma", desc: "Certified Hatha & Vinyasa expert // Delhi // Est. 8 yrs exp", id: 1 },
    "Hatha_Mumbai": { name: "Rohit Deshmukh", desc: "Classical Hatha & Alignment // Mumbai // Est. 6 yrs exp" },
    "Hatha_Bengaluru": { name: "Kavitha Raj", desc: "Hatha Flow & Breath alignment // Bengaluru // Est. 10 yrs exp" },
    "Hatha_Online": { name: "Suresh Rao", desc: "Traditional Hatha & somatic flows // Online // Est. 12 yrs exp" },
    
    "Ashtanga_Delhi": { name: "Kabir Singh", desc: "Vinyasa flow & power Ashtanga // Delhi // Est. 7 yrs exp" },
    "Ashtanga_Mumbai": { name: "Shubir Sharma", desc: "Rishikesh-certified Ashtanga // Mumbai // Est. 9 yrs exp", id: 2 },
    "Ashtanga_Bengaluru": { name: "Deepa Hegde", desc: "Mysore-style Ashtanga yoga // Bengaluru // Est. 11 yrs exp" },
    "Ashtanga_Online": { name: "Preeti Desai", desc: "Ashtanga fundamentals // Online // Est. 5 yrs exp" },
    
    "Prenatal_Delhi": { name: "Dr. Ritu Sen", desc: "Pregnancy yoga & breath coaching // Delhi // Est. 14 yrs exp" },
    "Prenatal_Mumbai": { name: "Shreya Ghoshal", desc: "Safe prenatal poses & pelvic health // Mumbai // Est. 8 yrs exp" },
    "Prenatal_Bengaluru": { name: "Nisha Kamath", desc: "Active motherhood somatic support // Bengaluru // Est. 6 yrs exp" },
    "Prenatal_Online": { name: "Meera Nair", desc: "Online Prenatal somatic guidance // Online // Est. 10 yrs exp", id: 4 },
    
    "Therapeutic_Delhi": { name: "Vikram Malhotra", desc: "Spinal alignment & back pain relief // Delhi // Est. 12 yrs exp" },
    "Therapeutic_Mumbai": { name: "Pooja Mehta", desc: "Joint health & mobility therapy // Mumbai // Est. 7 yrs exp" },
    "Therapeutic_Bengaluru": { name: "Chetan Dev", desc: "Somatic therapist & recovery alignment // Bengaluru // Est. 15 yrs exp", id: 3 },
    "Therapeutic_Online": { name: "Amit Trivedi", desc: "Therapeutic yoga for posture fix // Online // Est. 9 yrs exp" }
  };

  function updateResult() {
    if (!selectedStyle || !selectedLoc) {
      teacherName.textContent = "Select both criteria";
      teacherDesc.textContent = "Click on a style and a location above to view the vetted guide.";
      ctaBtn.classList.add('hidden');
      return;
    }

    const key = `${selectedStyle}_${selectedLoc}`;
    const match = database[key];

    if (match) {
      teacherName.textContent = match.name;
      teacherDesc.textContent = match.desc;
      ctaBtn.classList.remove('hidden');
      
      if (match.id) {
        ctaBtn.setAttribute('onclick', `window.location.href = 'profile.html?id=${match.id}'`);
        ctaBtn.textContent = "VIEW PROFILE";
      } else {
        ctaBtn.setAttribute('onclick', "showToast('Connecting directly...')");
        ctaBtn.textContent = "CONNECT";
      }
      
      if (typeof gsap !== 'undefined') {
        gsap.fromTo('#sandbox-result-card', { scale: 0.96, opacity: 0.85 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      }
    }
  }

  styleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      styleBtns.forEach(b => b.classList.remove('!bg-sage-600', '!text-white', '!border-transparent'));
      btn.classList.add('!bg-sage-600', '!text-white', '!border-transparent');
      selectedStyle = btn.getAttribute('data-style');
      updateResult();
    });
  });

  locBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      locBtns.forEach(b => b.classList.remove('!bg-sage-600', '!text-white', '!border-transparent'));
      btn.classList.add('!bg-sage-600', '!text-white', '!border-transparent');
      selectedLoc = btn.getAttribute('data-loc');
      updateResult();
    });
  });
}

// ------------------------------------------
// VETTED DIRECTORY CONTROLLERS (TEACHERS LIST)
// ------------------------------------------
function initDirectoryListings() {
  const grid = document.getElementById('teachers-grid');
  const searchInput = document.getElementById('search-name');
  const styleSelect = document.getElementById('filter-style');
  const citySelect = document.getElementById('filter-city');

  if (!grid) return;

  function renderListings(data) {
    grid.innerHTML = '';
    if (data.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center space-y-4">
          <i data-lucide="compass" class="w-12 h-12 text-mutedgray mx-auto animate-spin"></i>
          <p class="font-serif text-lg text-charcoal">No registered guides match these criteria.</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    data.forEach(t => {
      const card = document.createElement('div');
      card.className = 'p-6 bg-cream border border-sage-200 rounded-[2rem] flex flex-col justify-between hover:bg-sand/30 transition duration-300 relative organic-shadow-hover';
      card.innerHTML = `
        <div class="space-y-4">
          <div class="aspect-square w-full rounded-2xl overflow-hidden shadow-sm bg-sand">
            <img src="${t.image}" alt="${t.name}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500">
          </div>
          <div class="space-y-1.5">
            <div class="flex justify-between items-start">
              <span class="px-2 py-0.5 bg-sage-100 border border-sage-200 text-sage-800 text-[9px] font-bold rounded-full uppercase tracking-wider">${t.style}</span>
              <span class="text-xs font-mono font-bold text-sage-700 flex items-center gap-1"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i>${t.city}</span>
            </div>
            <h3 class="font-serif text-xl font-bold text-charcoal">${t.name}</h3>
            <p class="text-xs text-mutedgray leading-relaxed line-clamp-2 font-sans">${t.tagline}</p>
          </div>
        </div>
        <div class="pt-4 border-t border-sage-200/40 flex justify-between items-center mt-4">
          <span class="font-mono text-xs font-bold text-charcoal">${t.rate}</span>
          <a href="profile.html?id=${t.id}" class="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition">Profile</a>
        </div>
      `;
      grid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function filterData() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedStyle = styleSelect.value;
    const selectedCity = citySelect.value;

    const filtered = teachersDatabase.filter(t => {
      const matchesQuery = t.name.toLowerCase().includes(query);
      const matchesStyle = selectedStyle === 'All' || t.style === selectedStyle;
      const matchesCity = selectedCity === 'All' || t.city === selectedCity;
      return matchesQuery && matchesStyle && matchesCity;
    });

    renderListings(filtered);
  }

  searchInput.addEventListener('input', filterData);
  styleSelect.addEventListener('change', filterData);
  citySelect.addEventListener('change', citySelect); // fixed listener trigger
  citySelect.addEventListener('change', filterData);

  renderListings(teachersDatabase);
}

// ------------------------------------------
// RENDER TEACHER DETAIL PROFILE (PROFILE PAGE)
// ------------------------------------------
function renderTeacherDetail(id) {
  const t = teachersDatabase.find(x => x.id === id);
  if (!t) {
    // If not found, redirect to list
    window.location.href = 'teachers.html';
    return;
  }

  document.getElementById('detail-image').src = t.image;
  document.getElementById('detail-name').textContent = t.name;
  document.getElementById('detail-tagline').textContent = t.tagline;
  document.getElementById('detail-bio').textContent = t.bio;
  document.getElementById('detail-primary-style').textContent = t.style;
  document.getElementById('detail-location').textContent = t.city;
  document.getElementById('detail-exp').textContent = t.experience;
  document.getElementById('detail-rate').textContent = t.rate;
  document.getElementById('detail-rating').innerHTML = `<i data-lucide="star" class="w-4 h-4 fill-current text-terracotta-500"></i> ${t.rating} (${t.reviewsCount})`;

  // Specialties
  const specWrap = document.getElementById('detail-specialties');
  specWrap.innerHTML = '';
  t.specialties.forEach(s => {
    const span = document.createElement('span');
    span.className = 'px-3 py-1 bg-sand border border-sage-300 text-charcoal text-xs font-semibold rounded-lg font-sans';
    span.textContent = s;
    specWrap.appendChild(span);
  });

  // Availability slots
  const slotWrap = document.getElementById('detail-slots');
  slotWrap.innerHTML = '';

  // Hide booking wizard on loading a new teacher
  const wizard = document.getElementById('booking-wizard');
  if (wizard) wizard.classList.add('hidden');
  resetBookingWizard();

  t.availability.forEach(slot => {
    const btn = document.createElement('button');
    btn.className = 'slot-btn px-4 py-2 bg-cream hover:bg-sage-600 hover:text-white border border-sage-300 text-[10px] font-mono font-bold rounded-xl transition duration-200';
    btn.textContent = slot;
    btn.onclick = () => {
      document.querySelectorAll('.slot-btn').forEach(b => {
        b.classList.remove('!bg-sage-600', '!text-white', '!border-transparent');
      });
      btn.classList.add('!bg-sage-600', '!text-white', '!border-transparent');
      openBookingWizard(slot, t);
    };
    slotWrap.appendChild(btn);
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// ------------------------------------------
// BOOKING WIZARD SYSTEM (PROFILE PAGE)
// ------------------------------------------
let selectedSlot = null;
let activeTeacher = null;

function openBookingWizard(slot, teacher) {
  selectedSlot = slot;
  activeTeacher = teacher;

  const wizard = document.getElementById('booking-wizard');
  const chosenSlotText = document.getElementById('booking-chosen-slot');
  if (!wizard) return;

  chosenSlotText.textContent = `SELECTED SLOT: ${slot}`;
  wizard.classList.remove('hidden');

  setTimeout(() => {
    wizard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);

  goToStep(1);

  if (typeof gsap !== 'undefined') {
    gsap.fromTo(wizard, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
  }
}

function resetBookingWizard() {
  selectedSlot = null;
  activeTeacher = null;
  
  const form = document.getElementById('booking-form');
  if (form) form.reset();
  
  const successReceipt = document.getElementById('booking-success-receipt');
  if (successReceipt) successReceipt.classList.add('hidden');
  
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) bookingForm.classList.remove('hidden');

  document.querySelectorAll('.slot-btn').forEach(b => {
    b.classList.remove('!bg-sage-600', '!text-white', '!border-transparent');
  });
  
  goToStep(1);
}

function goToStep(stepNum) {
  const step1 = document.getElementById('booking-step-1');
  const step2 = document.getElementById('booking-step-2');
  const step3 = document.getElementById('booking-step-3');
  const steps = [step1, step2, step3];

  steps.forEach((s, idx) => {
    if (idx + 1 === stepNum) {
      s.classList.remove('hidden');
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(s, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" });
      }
    } else {
      s.classList.add('hidden');
    }
  });

  for (let i = 1; i <= 3; i++) {
    const tab = document.getElementById(`step-tab-${i}`);
    if (!tab) continue;
    if (i === stepNum) {
      tab.className = "border-b-2 border-sage-600 pb-1 text-sage-700 font-bold";
    } else {
      tab.className = "border-b border-sage-300/40 pb-1 text-mutedgray";
    }
  }
}

function initBookingWizard() {
  const closeBtn = document.getElementById('close-booking-btn');
  if (closeBtn) {
    closeBtn.onclick = () => {
      const wizard = document.getElementById('booking-wizard');
      if (wizard) wizard.classList.add('hidden');
      resetBookingWizard();
    };
  }

  const next1 = document.getElementById('booking-next-1');
  if (next1) {
    next1.onclick = () => goToStep(2);
  }

  const back2 = document.getElementById('booking-back-2');
  if (back2) {
    back2.onclick = () => goToStep(1);
  }

  const next2 = document.getElementById('booking-next-2');
  if (next2) {
    next2.onclick = () => {
      const sName = document.getElementById('booking-student-name');
      const sEmail = document.getElementById('booking-student-email');
      const sPhone = document.getElementById('booking-student-phone');

      if (!sName.reportValidity() || !sEmail.reportValidity() || !sPhone.reportValidity()) {
        return;
      }

      document.getElementById('summary-teacher-name').textContent = activeTeacher ? activeTeacher.name : '';
      document.getElementById('summary-slot').textContent = selectedSlot || '';
      
      const formatVal = document.querySelector('input[name="booking-format"]:checked')?.value || 'Online';
      document.getElementById('summary-format').textContent = formatVal === 'Online' ? 'Online Session' : `In-Person (${activeTeacher ? activeTeacher.city : ''})`;
      document.getElementById('summary-student-name').textContent = sName.value;
      document.getElementById('summary-rate').textContent = activeTeacher ? activeTeacher.rate : '';

      goToStep(3);
    };
  }

  const back3 = document.getElementById('booking-back-3');
  if (back3) {
    back3.onclick = () => goToStep(2);
  }

  const bForm = document.getElementById('booking-form');
  if (bForm) {
    bForm.onsubmit = (e) => {
      e.preventDefault();

      const formatVal = document.querySelector('input[name="booking-format"]:checked')?.value || 'Online';
      const sName = document.getElementById('booking-student-name').value;
      const bookingId = `YS-${Math.floor(100000 + Math.random() * 900000)}`;

      document.getElementById('receipt-booking-id').textContent = bookingId;
      document.getElementById('receipt-teacher').textContent = activeTeacher ? activeTeacher.name : '';
      document.getElementById('receipt-format').textContent = formatVal === 'Online' ? 'Online Video Call' : `In-Person at your location in ${activeTeacher ? activeTeacher.city : ''}`;
      document.getElementById('receipt-slot').textContent = selectedSlot || '';
      document.getElementById('receipt-student').textContent = sName;

      bForm.classList.add('hidden');
      const successReceipt = document.getElementById('booking-success-receipt');
      successReceipt.classList.remove('hidden');

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(successReceipt, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" });
      }

      showToast('Appointment successfully scheduled!');
    };
  }

  const closeReceiptBtn = document.getElementById('close-receipt-btn');
  if (closeReceiptBtn) {
    closeReceiptBtn.onclick = () => {
      window.location.href = 'teachers.html';
    };
  }
}

// ------------------------------------------
// JOB LISTING CONTROLLERS (NEW)
// ------------------------------------------
function initJobsListings() {
  const grid = document.getElementById('jobs-grid');
  const searchInput = document.getElementById('search-job');
  const typeSelect = document.getElementById('filter-type');
  const citySelect = document.getElementById('filter-city');

  if (!grid) return;

  function renderJobs(data) {
    grid.innerHTML = '';
    if (data.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center space-y-4">
          <i data-lucide="compass" class="w-12 h-12 text-mutedgray mx-auto animate-spin"></i>
          <p class="font-serif text-lg text-charcoal">No job openings match these criteria.</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    data.forEach(job => {
      const card = document.createElement('div');
      card.className = 'p-8 bg-cream border border-sage-200 rounded-[2.5rem] flex flex-col justify-between hover:bg-sand/30 transition duration-300 relative organic-shadow-hover';
      card.innerHTML = `
        <div class="space-y-4">
          <div class="flex justify-between items-start">
            <span class="px-2.5 py-0.5 bg-sage-100 border border-sage-200 text-sage-800 text-[10px] font-bold rounded-full uppercase tracking-wider">${job.type}</span>
            <span class="text-xs font-mono font-bold text-sage-700 flex items-center gap-1"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i>${job.city}</span>
          </div>
          <div class="space-y-1.5">
            <h3 class="font-serif text-2xl font-bold text-charcoal leading-tight">${job.title}</h3>
            <p class="text-xs font-mono font-semibold text-terracotta-600">${job.company}</p>
            <p class="text-xs text-mutedgray leading-relaxed line-clamp-3 font-sans pt-1">${job.description}</p>
          </div>
        </div>
        <div class="pt-6 border-t border-sage-200/40 flex justify-between items-center mt-6">
          <div class="font-mono text-xs">
            <span class="block text-[8px] text-mutedgray">COMPENSATION</span>
            <span class="font-bold text-charcoal">${job.compensation}</span>
          </div>
          <a href="job-detail.html?id=${job.id}" class="px-5 py-2.5 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition">View Job</a>
        </div>
      `;
      grid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function filterJobs() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedType = typeSelect.value;
    const selectedCity = citySelect.value;

    const filtered = jobsDatabase.filter(j => {
      const matchesQuery = j.title.toLowerCase().includes(query) || j.company.toLowerCase().includes(query);
      const matchesType = selectedType === 'All' || j.type === selectedType;
      const matchesCity = selectedCity === 'All' || j.city === selectedCity;
      return matchesQuery && matchesType && matchesCity;
    });

    renderJobs(filtered);
  }

  searchInput.addEventListener('input', filterJobs);
  typeSelect.addEventListener('change', filterJobs);
  citySelect.addEventListener('change', filterJobs);

  renderJobs(jobsDatabase);
}

// ------------------------------------------
// JOB DETAIL & APPLICATION SYSTEM (NEW)
// ------------------------------------------
function renderJobDetail(id) {
  const job = jobsDatabase.find(x => x.id === id);
  if (!job) {
    window.location.href = 'jobs.html';
    return;
  }

  document.getElementById('job-detail-title').textContent = job.title;
  document.getElementById('job-detail-company').textContent = job.company;
  document.getElementById('job-detail-city').textContent = job.city;
  document.getElementById('job-detail-type').textContent = job.type;
  document.getElementById('job-detail-comp').textContent = job.compensation;
  document.getElementById('job-detail-exp').textContent = job.experience;
  document.getElementById('job-detail-date').textContent = job.postedDate;
  document.getElementById('job-detail-desc').textContent = job.description;

  const reqWrap = document.getElementById('job-detail-reqs');
  reqWrap.innerHTML = '';
  job.requirements.forEach(req => {
    const li = document.createElement('li');
    li.className = 'flex gap-3 text-xs sm:text-sm text-mutedgray font-sans';
    li.innerHTML = `
      <span class="w-5 h-5 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center shrink-0"><i data-lucide="check" class="w-3.5 h-3.5"></i></span>
      <span>${req}</span>
    `;
    reqWrap.appendChild(li);
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function initJobApplication() {
  const form = document.getElementById('job-apply-form');
  if (!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('apply-name').value;
    const title = document.getElementById('job-detail-title').textContent;
    showToast(`Application submitted! Thank you, ${name}. Your profile has been sent for the ${title} opening.`);
    form.reset();
    setTimeout(() => {
      window.location.href = 'jobs.html';
    }, 2000);
  };
}

// ------------------------------------------
// SIGNUP & CONTACT FORMS
// ------------------------------------------
function initFormsCallbacks() {
  const contactForm = document.getElementById('spa-contact-form');
  const loginForm = document.getElementById('portal-login-form');
  const signupForm = document.getElementById('portal-signup-form');

  if (contactForm) {
    contactForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('spa-contact-name').value;
      showToast(`Thank you, ${name}! Your message was sent to the helpdesk.`);
      contactForm.reset();
    };
  }

  if (loginForm) {
    loginForm.onsubmit = (e) => {
      e.preventDefault();
      showToast('Portal Login under validation... Redirecting to dashboard mock.');
      setTimeout(() => {
        window.location.href = 'index.html';
        showToast('Teacher Dashboard mock session activated.');
      }, 1000);
    };
  }

  if (signupForm) {
    signupForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      showToast(`Audit submitted! YogKulam background checks started for ${name}.`);
      signupForm.reset();
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    };
  }
}

// ------------------------------------------
// CONTACT FORM SUBMISSION (HOME PAGE)
// ------------------------------------------
function initContactForm() {
  const form = document.getElementById('landing-contact-form');
  if (!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    if (name && email) {
      showToast(`Thank you, ${name}! Redirecting you to verified matches.`);
      form.reset();
      setTimeout(() => {
        window.location.href = 'teachers.html';
      }, 1000);
    }
  };
}

// ------------------------------------------
// TOAST NOTIFICATIONS
// ------------------------------------------
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toast-text');
  const icon = document.getElementById('toast-icon');
  if (!toast || !text) return;
  
  text.textContent = message;
  
  if (type === 'success') {
    toast.className = "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl transition-all duration-300 transform translate-y-0 bg-sage-700 text-white font-sans text-xs font-semibold";
    if (icon) icon.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-white"></i>`;
  } else {
    toast.className = "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl transition-all duration-300 transform translate-y-0 bg-red-600 text-white font-sans text-xs font-semibold";
    if (icon) icon.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4 text-white"></i>`;
  }
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  toast.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 4000);
}

// ------------------------------------------
// DOM CONDITIONAL INITIALIZATION (ROBUST)
// ------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Detect active page based on unique elements present in the DOM
  if (document.getElementById('teachers-grid')) {
    initDirectoryListings();
  } else if (document.getElementById('detail-name') && document.getElementById('booking-wizard')) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id')) || 1;
    renderTeacherDetail(id);
    initBookingWizard();
  } else if (document.getElementById('jobs-grid')) {
    initJobsListings();
  } else if (document.getElementById('job-detail-title') && document.getElementById('job-apply-form')) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id')) || 1;
    renderJobDetail(id);
    initJobApplication();
  } else if (document.getElementById('spa-contact-form') || document.getElementById('portal-login-form') || document.getElementById('portal-signup-form')) {
    initFormsCallbacks();
  } else if (document.getElementById('sandbox-result-card')) {
    initSandboxSearch();
    initContactForm();
  }

  // General load of lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
