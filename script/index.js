// عناصر DOM
document.addEventListener('DOMContentLoaded', function () {
  // ضبط التاريخ والوقت في حقل timestamp
  const now = new Date();
  const options = {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  const timestampInput = document.getElementById('timestamp');
  if (timestampInput) {
    timestampInput.value = now.toLocaleString('ar-EG', options);
  }
  // تهيئة العداد التنازلي
  initCountdown();

  // تهيئة شرائح الشهادات
  initTestimonialSlider();

  // تهيئة الأسئلة الشائعة
  initFAQ();

  // تهيئة التحقق من صحة النموذج
  initFormValidation();

  // تهيئة عدادات الإحصائيات
  initCounters();
});

// دالة العداد التنازلي
function initCountdown() {
  // تعيين تاريخ انتهاء العرض (بعد 3 أيام من الآن)
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 3);

  // تحديث العداد كل ثانية
  const countdown = setInterval(function () {
    const now = new Date().getTime();
    const distance = endDate - now;

    // حساب الأيام والساعات والدقائق والثواني
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // عرض العداد
    document.getElementById('days').innerHTML = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerHTML = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerHTML = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerHTML = seconds < 10 ? '0' + seconds : seconds;

    // إذا انتهى العداد
    if (distance < 0) {
      clearInterval(countdown);
      document.getElementById('days').innerHTML = '00';
      document.getElementById('hours').innerHTML = '00';
      document.getElementById('minutes').innerHTML = '00';
      document.getElementById('seconds').innerHTML = '00';
    }
  }, 1000);
}

// دالة شرائح الشهادات
function initTestimonialSlider() {
  const testimonials = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;

  // عرض الشريحة الحالية
  function showSlide(index) {
    testimonials.forEach(testimonial => {
      testimonial.classList.remove('active');
    });

    dots.forEach(dot => {
      dot.classList.remove('active');
    });

    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  // التبديل التلقائي للشرائح
  setInterval(function () {
    currentSlide = (currentSlide + 1) % testimonials.length;
    showSlide(currentSlide);
  }, 5000);

  // التبديل اليدوي للشرائح
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });
}

// دالة الأسئلة الشائعة
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', function () {
      // إغلاق جميع الأسئلة المفتوحة
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-toggle i').className = 'fas fa-plus';
        }
      });

      // تبديل حالة السؤال الحالي
      item.classList.toggle('active');

      // تغيير أيقونة التبديل
      const icon = item.querySelector('.faq-toggle i');
      if (item.classList.contains('active')) {
        icon.className = 'fas fa-minus';
      } else {
        icon.className = 'fas fa-plus';
      }
    });
  });
}

// دالة التحقق من صحة النموذج
function initFormValidation() {
  const form = document.getElementById('order-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // التحقق من الحقول
      let isValid = true;

      // التحقق من الاسم
      const nameInput = document.getElementById('name');
      const nameError = document.getElementById('name-error');

      if (nameInput.value.trim() === '') {
        nameError.textContent = 'يرجى إدخال الاسم الكامل';
        nameError.style.display = 'block';
        isValid = false;
      } else {
        nameError.style.display = 'none';
      }

      // التحقق من البريد الإلكتروني
      const emailInput = document.getElementById('email');
      const emailError = document.getElementById('email-error');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'يرجى إدخال بريد إلكتروني صحيح';
        emailError.style.display = 'block';
        isValid = false;
      } else {
        emailError.style.display = 'none';
      }

      // التحقق من رقم الهاتف
      const phoneInput = document.getElementById('phone');
      const phoneError = document.getElementById('phone-error');

      if (phoneInput.value.trim() === '' || phoneInput.value.length < 8) {
        phoneError.textContent = 'يرجى إدخال رقم هاتف صحيح';
        phoneError.style.display = 'block';
        isValid = false;
      } else {
        phoneError.style.display = 'none';
      }

      // التحقق من طريقة الدفع
      const paymentInput = document.getElementById('payment');
      const paymentError = document.getElementById('payment-error');

      if (paymentInput.value === '') {
        paymentError.textContent = 'يرجى اختيار طريقة الدفع';
        paymentError.style.display = 'block';
        isValid = false;
      } else {
        paymentError.style.display = 'none';
      }

      // إذا كانت جميع الحقول صحيحة
      if (isValid) {
        // تعيين تاريخ ووقت الإرسال
        const now = new Date();
        const options = {
          weekday: 'long',     // اسم اليوم
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };

        document.getElementById('timestamp').value = now.toLocaleString('ar-EG', options);


        // إرسال البيانات إلى جوجل شيت
        sendToGoogleSheet(form);
      }
    });

    // إغلاق نافذة النجاح
    const closePopupBtn = document.querySelector('.close-popup');
    if (closePopupBtn) {
      closePopupBtn.addEventListener('click', function () {
        const successPopup = document.getElementById('success-popup');
        successPopup.classList.remove('show');
      });
    }
  }
}

// دالة إرسال البيانات إلى جوجل شيت
function sendToGoogleSheet(form) {
  // الحصول على بيانات النموذج
  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const payment = formData.get('payment');
  const timestamp = formData.get('timestamp');

  // رابط نشر تطبيق Google Apps Script
  // سيتم استبداله بالرابط الفعلي بعد إنشاء التطبيق
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxUXmqNjSWxKVqzgzxScth_yUUt4CfyEouOxXEUEac2XUl-6rIWmqtFL4r7qaLknwZwgA/exec';

  // إرسال البيانات باستخدام Fetch API
  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        // إظهار رسالة النجاح
        const successPopup = document.getElementById('success-popup');
        successPopup.classList.add('show');

        // إعادة تعيين النموذج
        form.reset();
      } else {
        alert('حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.');
    });
}

// دالة عدادات الإحصائيات
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // مدة العد بالمللي ثانية
    const step = Math.ceil(target / (duration / 50)); // خطوة العد
    let current = 0;

    const updateCounter = () => {
      current += step;

      if (current >= target) {
        counter.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        counter.textContent = current.toLocaleString();
      }
    };

    // بدء العد بعد ثانيتين
    setTimeout(() => {
      const timer = setInterval(updateCounter, 50);
    }, 2000);
  });
}

// تمرير سلس للروابط الداخلية
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  });
});
