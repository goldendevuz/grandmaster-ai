import { Link } from "react-router-dom";

/**
 * 404 — the page for an address the site does not have.
 *
 * MANDATORY: App.tsx routes every unknown address here with
 * <Route path="*" element={<NotFound />} /> as its LAST route. Never delete
 * this page or that route; restyle it freely. The text follows the site's
 * language (<html lang>), so it reads right before any rewrite.
 */
const TEXT: Record<string, { title: string; body: string; home: string }> = {
  uz: { title: "Sahifa topilmadi", body: "Siz izlagan sahifa yo'q yoki ko'chirilgan.", home: "Bosh sahifaga" }, // lang-data
  ru: { title: "Страница не найдена", body: "Такой страницы нет или она была перемещена.", home: "На главную" },
  en: { title: "Page not found", body: "The page you are looking for does not exist or has moved.", home: "Back to home" },
  zh: { title: "页面未找到", body: "您要找的页面不存在或已被移动。", home: "返回首页" },
  hi: { title: "पेज नहीं मिला", body: "आप जो पेज ढूँढ रहे हैं वह मौजूद नहीं है या हटा दिया गया है।", home: "होम पेज पर जाएँ" },
  es: { title: "Página no encontrada", body: "La página que buscas no existe o se ha movido.", home: "Volver al inicio" },
  ar: { title: "الصفحة غير موجودة", body: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.", home: "العودة إلى الرئيسية" },
  fr: { title: "Page introuvable", body: "La page que vous cherchez n'existe pas ou a été déplacée.", home: "Retour à l'accueil" },
  bn: { title: "পৃষ্ঠাটি পাওয়া যায়নি", body: "আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি নেই বা সরানো হয়েছে।", home: "হোম পেজে ফিরুন" },
  pt: { title: "Página não encontrada", body: "A página que você procura não existe ou foi movida.", home: "Voltar ao início" },
  ur: { title: "صفحہ نہیں ملا", body: "آپ جو صفحہ تلاش کر رہے ہیں وہ موجود نہیں یا منتقل ہو گیا ہے۔", home: "ہوم پیج پر جائیں" },
};

export default function NotFound() {
  const lang = (typeof document !== "undefined" ? document.documentElement.lang : "").slice(0, 2).toLowerCase();
  const t = TEXT[lang] ?? TEXT.en;
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-7xl font-extrabold tracking-tight text-[color:var(--accent)]">404</p>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">{t.title}</h1>
      <p className="mt-3 max-w-md text-gray-600">{t.body}</p>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[color:var(--accent)] px-5 py-3 text-base font-medium text-white transition hover:opacity-90"
      >
        {t.home}
      </Link>
    </section>
  );
}
