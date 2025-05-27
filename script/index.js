import { supabase } from '../config/supabase.js';

// تكوين ثابت
const CONFIG = {
  COUNTDOWN_DAYS: 3,
  MIN_PHONE_LENGTH: 8,
  ANIMATION_DURATION: 2000,
  COUNTER_INTERVAL: 50,
  TESTIMONIAL_INTERVAL: 5000,
  SCROLL_OFFSET: 100
};

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

// دالة التهيئة الرئيسية
function initializeApp() {
  setupTimestamp();
  initCountdown();
  initTestimonialSlider();
  initFAQ();
  initFormValidation();
  initCounters();
  initScrollEffects();
  initAnalytics();
}

// إعداد الطابع الزمني
function setupTimestamp() {
  const timestampInput = document.getElementById('timestamp');
  if (timestampInput) {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    timestampInput.value = now.toLocaleString('ar-EG', options);
  }
}

// العداد التنازلي المحسن
function initCountdown() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + CONFIG.COUNTDOWN_DAYS);

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = endDate - now;

    if (distance < 0) {
      clearInterval(countdown);
      updateCountdownDisplay(0, 0, 0, 0);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    updateCountdownDisplay(days, hours, minutes, seconds);
  };

  const countdown = setInterval(updateCountdown, 1000);
  updateCountdown();
}

// تحديث عرض العد التنازلي
function updateCountdownDisplay(days, hours, minutes, seconds) {
  const padNumber = num => num.toString().padStart(2, '0');

  document.getElementById('days').textContent = padNumber(days);
  document.getElementById('hours').textContent = padNumber(hours);
  document.getElementById('minutes').textContent = padNumber(minutes);
  document.getElementById('seconds').textContent = padNumber(seconds);
}

// شريط الشهادات المحسن
function initTestimonialSlider() {
  const testimonials = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let autoSlideInterval;

  const showSlide = (index) => {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;

    // تتبع التحويلات
    trackEvent('testimonial_view', { slide_index: index });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % testimonials.length;
    showSlide(currentSlide);
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, CONFIG.TESTIMONIAL_INTERVAL);
  };

  const stopAutoSlide = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoSlide();
    });
  });

  // التعامل مع تفاعل المستخدم
  const sliderContainer = document.querySelector('.testimonials-slider');
  sliderContainer.addEventListener('mouseenter', stopAutoSlide);
  sliderContainer.addEventListener('mouseleave', startAutoSlide);

  startAutoSlide();
}

// الأسئلة الشائعة المحسنة
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // إغلاق جميع الأسئلة المفتوحة
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          toggleFAQItem(otherItem, false);
        }
      });

      // تبديل حالة السؤال الحالي
      toggleFAQItem(item, !isOpen);

      // تتبع التحويلات
      trackEvent('faq_toggle', {
        question: question.textContent.trim(),
        action: !isOpen ? 'open' : 'close'
      });
    });
  });
}

// تبديل حالة عنصر الأسئلة الشائعة
function toggleFAQItem(item, open) {
  const icon = item.querySelector('.faq-toggle i');
  const answer = item.querySelector('.faq-answer');

  if (open) {
    item.classList.add('active');
    icon.className = 'fas fa-minus';
    answer.style.maxHeight = `${answer.scrollHeight}px`;
  } else {
    item.classList.remove('active');
    icon.className = 'fas fa-plus';
    answer.style.maxHeight = '0';
  }
}

// التحقق من صحة النموذج المحسن
function initFormValidation() {
  const form = document.getElementById('order-form');
  if (!form) return;

  const validators = {
    name: {
      validate: value => value.trim().length >= 3,
      message: 'يجب أن يحتوي الاسم على 3 أحرف على الأقل'
    },
    email: {
      validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'يرجى إدخال بريد إلكتروني صحيح'
    },
    phone: {
      validate: value => value.trim().length >= CONFIG.MIN_PHONE_LENGTH && /^\d+$/.test(value),
      message: 'يرجى إدخال رقم هاتف صحيح'
    },
    payment: {
      validate: value => value !== '',
      message: 'يرجى اختيار طريقة الدفع'
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const formData = new FormData(form);

    // التحقق من جميع الحقول
    for (const [field, value] of formData.entries()) {
      if (validators[field]) {
        const { validate, message } = validators[field];
        const isFieldValid = validate(value);
        showFieldError(field, isFieldValid ? '' : message);
        isValid = isValid && isFieldValid;
      }
    }

    if (isValid) {
      await submitForm(form, formData);
    }
  });

  // التحقق المباشر عند الكتابة
  Object.keys(validators).forEach(field => {
    const input = form.querySelector(`[name="${field}"]`);
    if (input) {
      input.addEventListener('input', () => {
        const { validate, message } = validators[field];
        showFieldError(field, validate(input.value) ? '' : message);
      });
    }
  });
}

// عرض رسائل الخطأ
function showFieldError(field, message) {
  const errorElement = document.getElementById(`${field}-error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = message ? 'block' : 'none';
  }
}

// إرسال النموذج
async function submitForm(form, formData) {
  const submitButton = form.querySelector('.submit-btn');
  const originalText = submitButton.innerHTML;

  try {
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    submitButton.disabled = true;

    // إضافة الطابع الزمني
    formData.append('timestamp', new Date().toLocaleString('ar-EG'));

    const result = await saveOrder(formData);

    if (result.success) {
      showSuccessMessage();
      trackConversion('form_submit_success');
      form.reset();
    } else {
      throw new Error('فشل حفظ الطلب');
    }
  } catch (error) {
    console.error('Error:', error);
    showErrorMessage('حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.');
    trackError('form_submit_error', error);
  } finally {
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }
}

// عرض رسالة النجاح
function showSuccessMessage() {
  const successPopup = document.getElementById('success-popup');
  if (successPopup) {
    successPopup.classList.add('show');

    const closeBtn = successPopup.querySelector('.close-popup');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        successPopup.classList.remove('show');
      });
    }
  }
}

// عرض رسالة الخطأ
function showErrorMessage(message) {
  // يمكن تخصيص طريقة عرض الخطأ هنا
  alert(message);
}

// تهيئة العدادات المحسنة
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const options = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, options);

  counters.forEach(counter => observer.observe(counter));
}

// بدء العداد
function startCounter(counter) {
  const target = parseInt(counter.getAttribute('data-target'));
  const increment = Math.ceil(target / (CONFIG.ANIMATION_DURATION / CONFIG.COUNTER_INTERVAL));
  let current = 0;

  const updateCounter = () => {
    current += increment;

    if (current >= target) {
      counter.textContent = formatNumber(target);
      clearInterval(timer);
    } else {
      counter.textContent = formatNumber(current);
    }
  };

  const timer = setInterval(updateCounter, CONFIG.COUNTER_INTERVAL);
}

// تنسيق الأرقام
function formatNumber(number) {
  return new Intl.NumberFormat('ar-EG').format(number);
}

// تأثيرات التمرير
function initScrollEffects() {
  const scrollElements = document.querySelectorAll('[data-aos]');

  const elementInView = (el, offset = 50) => {
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= window.innerHeight - offset;
  };

  const displayScrollElement = element => {
    element.classList.add('aos-animate');
  };

  const hideScrollElement = element => {
    element.classList.remove('aos-animate');
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach(el => {
      if (elementInView(el, 50)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el);
      }
    });
  };

  window.addEventListener('scroll', throttle(handleScrollAnimation, 50));
  handleScrollAnimation();
}

// تتبع التحويلات
function trackEvent(eventName, params = {}) {
  try {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, params);
    }
    // يمكن إضافة أنظمة تتبع أخرى هنا
  } catch (error) {
    console.error('Analytics Error:', error);
  }
}

// تتبع التحويلات
function trackConversion(conversionName) {
  trackEvent('conversion', { type: conversionName });
}

// تتبع الأخطاء
function trackError(errorType, error) {
  trackEvent('error', {
    type: errorType,
    message: error.message
  });
}

// تهيئة التحليلات
function initAnalytics() {
  // إعداد تتبع مخصص
  trackEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href
  });
}

// دالة مساعدة للحد من تكرار التنفيذ
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// التمرير السلس
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - CONFIG.SCROLL_OFFSET,
        behavior: 'smooth'
      });

      // تتبع النقرات على الروابط الداخلية
      trackEvent('internal_link_click', {
        link_id: targetId,
        link_text: this.textContent.trim()
      });
    }
  });
});

// Import database service
import { saveOrder } from '../services/database.js'

// Form submission
const orderForm = document.getElementById('order-form')
const successPopup = document.getElementById('success-popup')

console.log('Script loaded') // Debug message

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  console.log('Form submitted') // Debug message

  // Get form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    payment: document.getElementById('payment').value
  }

  console.log('Form data:', formData) // Debug message

  try {
    // Save to database
    console.log('Attempting to save to database...') // Debug message
    const result = await saveOrder(formData)
    console.log('Save result:', result) // Debug message

    if (result.success) {
      // Show success popup
      successPopup.classList.add('show')

      // Reset form
      orderForm.reset()

      // Hide popup after 5 seconds
      setTimeout(() => {
        successPopup.classList.remove('show')
      }, 5000)

      // Track successful submission
      trackEvent('form_submit_success', {
        email: formData.email,
        payment_method: formData.payment
      })
    } else {
      throw new Error(result.error || 'فشل حفظ الطلب')
    }
  } catch (error) {
    console.error('Error:', error)
    showErrorMessage('حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.')
    trackEvent('form_submit_error', {
      error: error.message
    })
  }
})

// Close popup
document.querySelector('.close-popup').addEventListener('click', () => {
  successPopup.classList.remove('show')
})