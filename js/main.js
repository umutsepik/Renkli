/*
  Renkli İş Kıyafetleri - Ana JavaScript Dosyası
  Amaçlar:
  - Mobil menü etkileşimi
  - Scroll reveal animasyonları
  - Teklif formu doğrulama + sunucu gönderimi + güvenli fallback
  - Gelecekte backend entegrasyonu için modüler temel
*/

(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  // Header scroll efekti
  const handleHeaderScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  };

  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll);

  // Mobil menü aç/kapat
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  // Scroll reveal (Intersection Observer)
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    // Çok eski tarayıcılar için güvenli fallback
    revealItems.forEach((item) => item.classList.add("in-view"));
  }

  // Teklif formu doğrulama + sunucu gönderimi
  const quoteForm = document.getElementById("quoteForm");
  if (quoteForm) {
    const feedback = quoteForm.querySelector(".form-feedback");

    const fields = {
      adSoyad: quoteForm.querySelector("#adSoyad"),
      firma: quoteForm.querySelector("#firma"),
      telefon: quoteForm.querySelector("#telefon"),
      email: quoteForm.querySelector("#email"),
      urun: quoteForm.querySelector("#urun"),
      adet: quoteForm.querySelector("#adet"),
      mesaj: quoteForm.querySelector("#mesaj"),
      kvkk: quoteForm.querySelector("#kvkk"),
      website: quoteForm.querySelector("#website"),
    };

    const getSiteLanguage = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === "/en/" || path.includes("/en/")) return "en";
      if (path === "/ar/" || path.includes("/ar/")) return "ar";
      return "tr";
    };

    const uiText = {
      tr: {
        fullName: "Ad Soyad", company: "Firma Adı", phone: "Telefon", email: "E-posta", product: "İlgilendiği Ürün", quantity: "Tahmini Adet",
        message: "Mesaj:", subject: "Web Sitesi Teklif Talebi - Renkli İş",
        errors: {
          adSoyad: "Lütfen ad soyad bilgisini giriniz.", firma: "Lütfen firma adını giriniz.", telefon: "Lütfen geçerli bir telefon numarası giriniz.",
          email: "Lütfen geçerli bir e-posta adresi giriniz.", urun: "Lütfen ilgilendiğiniz ürünü seçiniz.", adet: "Lütfen tahmini adet bilgisi giriniz.",
          mesaj: "Lütfen en az 10 karakterlik bir mesaj yazınız.", kvkk: "Teklif göndermek için KVKK onayı gereklidir."
        },
        incomplete: "Formda eksik veya hatalı alanlar var. Lütfen kontrol ediniz.", sending: "Gönderiliyor...", defaultSubmit: "Teklif Talebi Gönder",
        success: "Teklif talebiniz başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.",
        fallback: "Otomatik gönderim kullanılamıyor. E-posta uygulamanız üzerinden göndermek için tekrar deneyebilirsiniz.",
        failed: "Form gönderilemedi. Lütfen tekrar deneyiniz."
      },
      en: {
        fullName: "Full Name", company: "Company Name", phone: "Phone", email: "Email", product: "Product of Interest", quantity: "Estimated Quantity",
        message: "Message:", subject: "Website Quote Request - Renkli İş",
        errors: {
          adSoyad: "Please enter your full name.", firma: "Please enter your company name.", telefon: "Please enter a valid phone number.",
          email: "Please enter a valid email address.", urun: "Please select the product you are interested in.", adet: "Please enter the estimated quantity.",
          mesaj: "Please enter a message of at least 10 characters.", kvkk: "Privacy notice approval is required to submit the quote request."
        },
        incomplete: "Some fields are missing or invalid. Please check your entries.", sending: "Sending...", defaultSubmit: "Submit Quote Request",
        success: "Your quote request has been sent successfully. We will contact you as soon as possible.",
        fallback: "Automatic submission is unavailable. Please try sending the request through your email application.",
        failed: "The form could not be submitted. Please try again."
      },
      ar: {
        fullName: "الاسم الكامل", company: "اسم الشركة", phone: "الهاتف", email: "البريد الإلكتروني", product: "المنتج المطلوب", quantity: "الكمية التقريبية",
        message: "الرسالة:", subject: "طلب عرض سعر من الموقع - Renkli İş",
        errors: {
          adSoyad: "يرجى إدخال الاسم الكامل.", firma: "يرجى إدخال اسم الشركة.", telefon: "يرجى إدخال رقم هاتف صحيح.",
          email: "يرجى إدخال بريد إلكتروني صحيح.", urun: "يرجى اختيار المنتج المطلوب.", adet: "يرجى إدخال الكمية التقريبية.",
          mesaj: "يرجى كتابة رسالة لا تقل عن 10 أحرف.", kvkk: "يلزم الموافقة على إشعار الخصوصية لإرسال طلب عرض السعر."
        },
        incomplete: "هناك حقول ناقصة أو غير صحيحة. يرجى التحقق من البيانات.", sending: "جارٍ الإرسال...", defaultSubmit: "إرسال طلب عرض السعر",
        success: "تم إرسال طلب عرض السعر بنجاح. سنتواصل معكم في أقرب وقت ممكن.",
        fallback: "الإرسال التلقائي غير متاح. يرجى محاولة إرسال الطلب عبر تطبيق البريد الإلكتروني.",
        failed: "تعذر إرسال النموذج. يرجى المحاولة مرة أخرى."
      }
    };

    const t = () => uiText[getSiteLanguage()];

    const validators = {
      adSoyad: (v) => v.trim().length >= 3,
      firma: (v) => v.trim().length >= 2,
      telefon: (v) => /^[0-9\s()+-]{10,}$/.test(v.trim()),
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      urun: (v) => v.trim().length >= 2,
      adet: (v) => v.trim().length >= 1,
      mesaj: (v) => v.trim().length >= 10,
      kvkk: (v) => v === true,
    };

    const showError = (field, message) => {
      const error = quoteForm.querySelector(`[data-error="${field}"]`);
      if (error) error.textContent = message;
    };

    const clearErrors = () => {
      quoteForm.querySelectorAll(".error-msg").forEach((e) => (e.textContent = ""));
      if (feedback) feedback.textContent = "";
    };

    const setFeedback = (message, ok = false) => {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.style.color = ok ? "#166534" : "#dc2626";
    };

    const openMailFallback = () => {
      const body = [
        `${t().fullName}: ${fields.adSoyad.value}`,
        `${t().company}: ${fields.firma.value}`,
        `${t().phone}: ${fields.telefon.value}`,
        `${t().email}: ${fields.email.value}`,
        `${t().product}: ${fields.urun.value}`,
        `${t().quantity}: ${fields.adet.value}`,
        "",
        t().message,
        fields.mesaj.value,
      ].join("\n");
      const subject = encodeURIComponent(t().subject);
      window.location.href = `mailto:info@renkliis.com?subject=${subject}&body=${encodeURIComponent(body)}`;
    };

    quoteForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearErrors();

      // Honeypot alanı doluysa bot kabul edilir.
      if (fields.website && fields.website.value.trim() !== "") return;

      let hasError = false;
      Object.keys(validators).forEach((key) => {
        const field = fields[key];
        if (!field) return;
        const value = key === "kvkk" ? field.checked : field.value;
        if (!validators[key](value)) {
          hasError = true;
          const msgMap = t().errors;
          showError(key, msgMap[key]);
        }
      });

      if (hasError) {
        setFeedback(t().incomplete);
        return;
      }

      const submitButton = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitButton ? submitButton.textContent : t().defaultSubmit;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = t().sending;
      }

      try {
        const response = await fetch(quoteForm.getAttribute("action") || "form-gonder.php", {
          method: "POST",
          body: new FormData(quoteForm),
          headers: { Accept: "application/json" },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data.ok !== true) throw new Error(data.message || t().failed);

        setFeedback(t().success, true);
        quoteForm.reset();
      } catch (error) {
        // PHP/hosting desteği yoksa kullanıcıyı boşta bırakmıyoruz.
        setFeedback(t().fallback);
        openMailFallback();
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  }
})();

/* ── Hero Slider ──
   5 saniyede bir otomatik geçiş, noktalara tıklanınca manuel geçiş.
   Gelecekte swipe (dokunmatik) desteği de eklenebilir.
*/
(function () {
  const slides = document.querySelectorAll(".hero-slide");
  const dots   = document.querySelectorAll(".hero-dot");
  if (!slides.length) return;

  let current  = 0;
  let timer    = null;

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current] && dots[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current] && dots[current].classList.add("active");
  }

  function next() { goTo(current + 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, 8000);
  }

  // Noktalara tıklanınca o slide'a git, otomatik sayacı sıfırla
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      goTo(i);
      startAuto();
    });
  });

  startAuto();
})();

/* ─── Önlük Mini Karusel ─────────────────────────────────── */
(function () {
  var slider = document.getElementById('onluk-slider');
  if (!slider) return;

  var track   = slider.querySelector('.pslider-track');
  var dots    = slider.querySelectorAll('.pdot');
  var btnPrev = slider.querySelector('.pslider-prev');
  var btnNext = slider.querySelector('.pslider-next');
  var total   = dots.length;
  var current = 0;
  function goTo(idx) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    current = idx;
    slider.dataset.current = current;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d) { d.classList.remove('active'); });
    if (dots[current]) dots[current].classList.add('active');
  }


  btnPrev.addEventListener('click', function () { goTo(current - 1); });
  btnNext.addEventListener('click', function () { goTo(current + 1); });

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); });
  });

})();

/* ─── Polar Mini Karusel ─────────────────────────────────── */
(function () {
  var slider = document.getElementById('polar-slider');
  if (!slider) return;

  var track   = slider.querySelector('.pslider-track');
  var dots    = slider.querySelectorAll('.pdot');
  var btnPrev = slider.querySelector('.pslider-prev');
  var btnNext = slider.querySelector('.pslider-next');
  var total   = dots.length;
  var current = 0;
  function goTo(idx) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    current = idx;
    slider.dataset.current = current;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d) { d.classList.remove('active'); });
    if (dots[current]) dots[current].classList.add('active');
  }


  btnPrev.addEventListener('click', function () { goTo(current - 1); });
  btnNext.addEventListener('click', function () { goTo(current + 1); });
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); });
  });

})();

/* ─── Yelek Mini Karusel ─────────────────────────────────── */
(function () {
  var slider = document.getElementById('yelek-slider');
  if (!slider) return;

  var track   = slider.querySelector('.pslider-track');
  var dots    = slider.querySelectorAll('.pdot');
  var btnPrev = slider.querySelector('.pslider-prev');
  var btnNext = slider.querySelector('.pslider-next');
  var total   = dots.length;
  var current = 0;
  function goTo(idx) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    current = idx;
    slider.dataset.current = current;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d) { d.classList.remove('active'); });
    if (dots[current]) dots[current].classList.add('active');
  }


  btnPrev.addEventListener('click', function () { goTo(current - 1); });
  btnNext.addEventListener('click', function () { goTo(current + 1); });

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); });
  });

})();

/* ─── T-Shirt Mini Karusel ───────────────────────────────── */
(function () {
  var slider = document.getElementById('tshirt-slider');
  if (!slider) return;

  var track   = slider.querySelector('.pslider-track');
  var dots    = slider.querySelectorAll('.pdot');
  var btnPrev = slider.querySelector('.pslider-prev');
  var btnNext = slider.querySelector('.pslider-next');
  var total   = dots.length;
  var current = 0;
  function goTo(idx) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    current = idx;
    slider.dataset.current = current;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d) { d.classList.remove('active'); });
    if (dots[current]) dots[current].classList.add('active');
  }


  btnPrev.addEventListener('click', function () { goTo(current - 1); });
  btnNext.addEventListener('click', function () { goTo(current + 1); });

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); });
  });

})();

/* ─── Mont Mini Karusel ───────────────────────────────────── */
(function () {
  var slider = document.getElementById('mont-slider');
  if (!slider) return;

  var track   = slider.querySelector('.pslider-track');
  var dots    = slider.querySelectorAll('.pdot');
  var btnPrev = slider.querySelector('.pslider-prev');
  var btnNext = slider.querySelector('.pslider-next');
  var total   = dots.length;
  var current = 0;
  function goTo(idx) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    current = idx;
    slider.dataset.current = current;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d) { d.classList.remove('active'); });
    if (dots[current]) dots[current].classList.add('active');
  }


  btnPrev.addEventListener('click', function () { goTo(current - 1); });
  btnNext.addEventListener('click', function () { goTo(current + 1); });

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); });
  });

})();

/* ─── Pantolon Mini Karusel ───────────────────────────────── */
(function () {
  var slider = document.getElementById('pantolon-slider');
  if (!slider) return;

  var track   = slider.querySelector('.pslider-track');
  var dots    = slider.querySelectorAll('.pdot');
  var btnPrev = slider.querySelector('.pslider-prev');
  var btnNext = slider.querySelector('.pslider-next');
  var total   = dots.length;
  var current = 0;
  function goTo(idx) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    current = idx;
    slider.dataset.current = current;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d) { d.classList.remove('active'); });
    if (dots[current]) dots[current].classList.add('active');
  }


  btnPrev.addEventListener('click', function () { goTo(current - 1); });
  btnNext.addEventListener('click', function () { goTo(current + 1); });

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); });
  });

})();


/* ─── Ana sayfa ürün kartları renk seçenekleri ───────────────── */
(function () {
  var root = document.querySelector('.pcard-carousel');
  if (!root) return;

  root.addEventListener('click', function (event) {
    var swatch = event.target.closest('.pcard-swatch');
    if (!swatch) return;

    var card = swatch.closest('.pcard');
    if (!card) return;

    var image = card.querySelector('.pcard-img-wrap img');
    var title = card.querySelector('.pcard-single-title');
    if (!image) return;

    var src = swatch.getAttribute('data-src');
    var newTitle = swatch.getAttribute('data-title') || '';
    var alt = swatch.getAttribute('data-alt') || image.alt;

    if (src && image.getAttribute('src') !== src) {
      image.style.opacity = '0.45';
      var preloader = new Image();
      preloader.onload = function () {
        image.src = src;
        image.alt = alt;
        image.style.opacity = '';
      };
      preloader.onerror = function () { image.style.opacity = ''; };
      preloader.src = src;
    }

    if (title && newTitle) title.textContent = newTitle;

    card.querySelectorAll('.pcard-swatch').forEach(function (item) {
      item.classList.remove('is-active');
    });
    swatch.classList.add('is-active');
  });
})();

/* ─── Ana sayfa ürün kartları yatay carousel ───────────────── */
(function () {
  var carousel = document.querySelector('.pcard-carousel');
  if (!carousel) return;
  var track = carousel.querySelector('.pcard-grid');
  var prev = carousel.querySelector('.pcard-carousel-prev');
  var next = carousel.querySelector('.pcard-carousel-next');
  if (!track || !prev || !next) return;

  function amount() {
    var card = track.querySelector('.pcard');
    if (!card) return track.clientWidth * 0.8;
    var gap = parseFloat(getComputedStyle(track).gap) || 20;
    return card.getBoundingClientRect().width + gap;
  }

  prev.addEventListener('click', function () {
    track.scrollBy({ left: -amount(), behavior: 'smooth' });
  });

  next.addEventListener('click', function () {
    track.scrollBy({ left: amount(), behavior: 'smooth' });
  });

  function updateButtons() {
    var max = track.scrollWidth - track.clientWidth - 2;
    prev.style.opacity = track.scrollLeft <= 2 ? '0' : '1';
    prev.style.pointerEvents = track.scrollLeft <= 2 ? 'none' : 'auto';
    next.style.opacity = track.scrollLeft >= max ? '0' : '1';
    next.style.pointerEvents = track.scrollLeft >= max ? 'none' : 'auto';
  }

  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();
})();
