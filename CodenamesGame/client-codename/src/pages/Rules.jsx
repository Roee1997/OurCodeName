import React from "react";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import codenamesImage from "../assets/codename.webp";

const Rules = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <BackgroundImage image={codenamesImage} />

      {/* תוכן כללי */}
      <div className="relative z-10 flex-1 container mx-auto px-6 py-4 text-white" dir="rtl">
        <h1 className="text-3xl font-bold mb-4 text-center">📜 חוקי המשחק – שם קוד</h1>

        {/* תיבה נגללת עם חוקי המשחק */}
        <div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-md text-lg leading-relaxed overflow-y-auto max-h-[calc(100vh-14rem)]">
          <p>
            שם קוד הוא משחק לשתי קבוצות. על לוח המשחק מופיעות 25 מילים. חלקן שייכות לקבוצת האדומים, אחרות לכחולים. מרגל ראשי (Spymaster) מכל קבוצה רואה את צבעי המילים, והיתר הם סוכנים (Operatives).
          </p>

          <h2 className="font-bold text-xl mt-4">🎲 חלוקה לקבוצות</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>חלקו את כל המשתתפים לשתי קבוצות – אדומה וכחולה.</li>
            <li>מרגל ראשי מצטרף דרך "Join as Spymaster" ורואה את צבעי הקלפים.</li>
            <li>שאר השחקנים מצטרפים דרך "Join as Operative" ואינם רואים את הצבעים.</li>
          </ul>

          <h2 className="font-bold text-xl mt-4">💡 מתן רמזים</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>בתורו, המרגל הראשי בוחר מילים בצבע שלו ונותן רמז – מילה אחת בלבד.</li>
            <li>הרמז מקשר בין מספר מילים (למשל: "ים 2").</li>
            <li>הרמז כולל מספר שמייצג כמה מילים קשורות.</li>
            <li className="text-red-300 font-bold">היזהר מהמתנקש! בחירה בו גורמת להפסד מיידי.</li>
          </ul>

          <h2 className="font-bold text-xl mt-4">🕵️ ניחוש</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>הסוכנים דנים ברמז ומנחשים מילים.</li>
            <li>אם ניחשת נכון – אפשר לנחש שוב (עד הרמז + 1).</li>
            <li>ניתן גם לנחש מילים שנותרו מרמזים קודמים.</li>
          </ul>

          <h2 className="font-bold text-xl mt-4">🔚 סיום תור</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>אם מנחשים מילה של היריב או ניטרלית.</li>
            <li>אם עוצרים ניחוש ידנית.</li>
            <li>אם מגיעים למספר ניחושים מרבי.</li>
          </ul>

          <h2 className="font-bold text-xl mt-4">🏆 ניצחון והפסד</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>הקבוצה שגילתה את כל מילותיה – מנצחת.</li>
            <li>אם נבחר קלף המתנקש – מפסידים מייד.</li>
          </ul>

          <h2 className="font-bold text-xl mt-4">📌 הערות על רמזים</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>רמז = מילה אחת + מספר.</li>
            <li>אסור להשתמש בצורה של מילה מהלוח.</li>
            <li>רמז חייב להתבסס על משמעות, לא על אותיות או מיקום.</li>
            <li>אפשר להסכים מראש אם לאפשר רמזים כמו "ניו יורק".</li>
            <li>אם יש ספק – התייעצו עם המרגל של הקבוצה השנייה.</li>
          </ul>

          <h2 className="font-bold text-xl mt-4">🔢 מספר הניחושים</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>המספר מציין את כמות המילים ברמז.</li>
            <li>תמיד מותר לנחש עוד מילה אחת.</li>
            <li>אפשר להשתמש ב־∞ כדי לאפשר ניחושים חופשיים.</li>
            <li>אפשר להשתמש ב־0 כדי לאותת שהרמז לא שייך לאף מילה מהצבע שלכם.</li>
          </ul>

          <p className="text-sm text-center mt-6 text-gray-300 italic">
            שם קוד אונליין – משחק מרתק לחברים, עם רמזים, מתח, וניחושים!
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Rules;
