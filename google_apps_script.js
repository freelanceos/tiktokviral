// Google Apps Script لربط نموذج الاتصال بجوجل شيت
// يجب نسخ هذا الكود ولصقه في محرر Google Apps Script المرتبط بجدول البيانات

function doPost(e) {
  try {
    // الحصول على جدول البيانات بواسطة معرف URL
    // استبدل SPREADSHEET_ID بمعرف جدول البيانات الخاص بك
    const ss = SpreadsheetApp.openById('SPREADSHEET_ID');
    const sheet = ss.getSheetByName('contactus') || ss.getSheets()[0];

    // الحصول على البيانات المرسلة من النموذج
    const data = e.parameter;

    // إضافة صف جديد بالبيانات
    sheet.appendRow([
      data.name,
      data.email,
      data.phone,
      data.message,
      data.timestamp
    ]);

    // إرجاع استجابة نجاح
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // إرجاع استجابة خطأ
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// تعليمات الإعداد:
// 1. أنشئ جدول بيانات جديد في Google Sheets
// 2. أضف العناوين التالية في الصف الأول: الاسم، البريد الإلكتروني، رقم الهاتف، الرسالة، وقت الإرسال
// 3. انتقل إلى Extensions > Apps Script
// 4. انسخ هذا الكود والصقه في محرر Apps Script
// 5. احفظ المشروع بتسمية مناسبة مثل "معالج نموذج الاتصال"
// 6. انقر على Deploy > New deployment
// 7. اختر Type > Web app
// 8. قم بتعيين:
//    - Execute as: Me
//    - Who has access: Anyone
// 9. انقر على Deploy
// 10. انسخ عنوان URL الذي تم إنشاؤه واستبدله في ملف script.js
