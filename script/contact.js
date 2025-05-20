// تهيئة النموذج وإرساله إلى جوجل شيت
document.addEventListener('DOMContentLoaded', function () {
  // تهيئة التحقق من صحة النموذج
  initFormValidation();

  // تهيئة الحقل المخفي للوقت
  document.getElementById('contactForm').addEventListener('submit', function () {
    const now = new Date();
    document.getElementById('timestamp').value = now.toLocaleString('ar-SA');
  });
});

// دالة التحقق من صحة النموذج
function initFormValidation() {
  const form = document.getElementById('contactForm');

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

      // التحقق من الرسالة
      const messageInput = document.getElementById('message');
      const messageError = document.getElementById('message-error');

      if (messageInput.value.trim() === '') {
        messageError.textContent = 'يرجى إدخال رسالتك';
        messageError.style.display = 'block';
        isValid = false;
      } else {
        messageError.style.display = 'none';
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
  const message = formData.get('message');
  const timestamp = formData.get('timestamp');

  // رابط نشر تطبيق Google Apps Script
  // سيتم استبداله بالرابط الفعلي بعد إنشاء التطبيق
  const scriptURL = 'https://script.google.com/macros/s/AKfycbzkWVArO2Yu6GPtf7kv6FLjmT3FtDCiKGwABlJZECCL6SS_2LQMKCUEztyiZFdYX7N0/exec';

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
