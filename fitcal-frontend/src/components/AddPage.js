import React, { useState } from "react";
import "./AddPage.css";
import dusukKarbonhidratImage from "../assets/dusuk_karbonhidrat.jpg.webp";
import dusukYagImage from "../assets/dusuk_yag.jpg.webp";
import aralikliOrucImage from "../assets/aralikli_oruc.jpg.webp";
import akdenizDiyetiImage from "../assets/akdeniz_diyeti.jpg.webp";
import vejetaryenDiyetImage from "../assets/vejetaryen_diyet.jpg.webp";
import glutensizDiyetImage from "../assets/glutensiz_diyet.jpg.webp";
import veganDiyetImage from "../assets/vegan_diyet.jpg.webp";


const AddPage = () => {
  const diets = [
    { name: "Düşük Karbonhidrat Diyeti", image: dusukKarbonhidratImage },
    { name: "Düşük Yağ Diyeti", image: dusukYagImage },
    { name: "Aralıklı Oruç (Intermittent Fasting)", image: aralikliOrucImage },
    { name: "Akdeniz Diyeti", image: akdenizDiyetiImage },
    { name: "Vejetaryen Diyet", image: vejetaryenDiyetImage },
    { name: "Glütensiz Diyet", image: glutensizDiyetImage },
  ];

  
  const dietPlans = {
    "Düşük Karbonhidrat Diyeti": [
      {
        title: "Beslenme Programı ",
        meals: [
          "Sabah: 2 haşlanmış yumurta, 1 avokado dilimi, 5-6 zeytin",
          "Öğle: 150 gr ızgara tavuk, zeytinyağlı yeşil salata",
          "Akşam: Fırında somon, buharda brokoli ve karnabahar",
        ],
        calories: [250, 160, 400], // Kalori değerleri sırayla eklenir
      },
      {
        title: "Beslenme Programı",
        meals: [
          "Sabah: Omlet (2 yumurta, ıspanak, biber), 1 dilim peynir",
          "Öğle: Izgara köfte, haşlanmış kabak ve havuç",
          "Akşam: 200 gr ızgara hindi, zeytinyağlı roka salatası",
          
        ],
        calories: [265, 325, 470], // Kalori değerleri sırayla eklenmiştir

      },
    ],
    "Akdeniz Diyeti": [
      {
        title: "Beslenme Programı",
        meals: [
          "Sabah: Zeytinyağlı domatesli omlet, tam buğday ekmeği",
          "Öğle: Fırında levrek, bol yeşillikli salata",
          "Akşam: Zeytinyağlı enginar, bulgur pilavı",
        ],
        calories: [350, 370, 330], // Sabah, Öğle, Akşam

      },
      {
        title: "Beslenme Programı",
        meals: [
          "Sabah: Yoğurt, yulaf ezmesi, ceviz ve meyve",
          "Öğle: Nohutlu ve sebzeli bulgur salatası",
          "Akşam: Izgara somon, zeytinyağlı fasulye",
        ],
        calories: [320, 400, 480], // Sabah, Öğle, Akşam

      },
    ],
    "Vejetaryen Diyet": [
      {
        title: "Beslenme Programı",
        meals: [
          "Sabah: Lor peyniri, domates, salatalık, tam buğday ekmeği",
          "Öğle: Fırında sebzeli nohut yemeği",
          "Akşam: Sebzeli mercimek köftesi, zeytinyağlı salata",
        ],
        calories: [200, 350, 320], // Sabah, Öğle, Akşam

      },
      {
        title: "Beslenme Programı",
        meals: [
          "Sabah: Smoothie (muz, yulaf ezmesi, badem sütü)",
          "Öğle: Zeytinyağlı kabak dolması",
          "Akşam: Fırında sebzeler (brokoli, havuç, kabak)",
        ],
        calories: [290, 200, 150], // Sabah, Öğle, Akşam
      },
    ],
    "Düşük Yağ Diyeti": [
      {
        title: "Beslenme Programı",
        meals: [
          "Sabah: Yulaf ezmesi (az yağlı süt ve muz ile hazırlanmış)",
          "Öğle: Izgara tavuk göğsü, haşlanmış sebzeler",
          "Akşam: Fırında somon (az yağlı), bol limonlu yeşil salata",
        ],
        calories: [340, 280, 310], // Sabah, Öğle, Akşam
      },
      {
        title: "Beslenme Programı",
        meals: [
          "Sabah: Yağsız lor peyniri, domates ve salatalık",
          "Öğle: Sebze çorbası, 1 dilim tam buğday ekmeği",
          "Akşam: Haşlanmış mercimek yemeği, 1 kase yoğurt",
        ],
        calories: [130, 220, 350], // Sabah, Öğle, Akşam
      },
    ],




    // Diğer diyet planları eklenmiştir
    "Aralıklı Oruç (Intermittent Fasting)": [
      {
        title: "Beslenme Programı (16/8)",
        meals: [
          "Öğle (oruç sonrası): 2 yumurtalı omlet, avokado salatası",
          "Ara Öğün: 1 avuç badem",
          "Akşam: Izgara tavuk, zeytinyağlı sebze yemeği",
        ],
        calories: [310, 100, 350], // Öğle, Ara Öğün, Akşam

      },
      {
        title: "Beslenme Programı (16/8)",
        meals: [
          "Öğle (oruç sonrası): Yoğurtlu nohut salatası",
          "Ara Öğün: 1 elma",
          "Akşam: Izgara köfte, fırında karnabahar",
        ],
        calories: [300, 80, 400], // Öğle, Ara Öğün, Akşam

      },
    ],
        "Glütensiz Diyet" : [
      {
          title: "Beslenme Programı",
          meals: [
              "Sabah: Glütensiz yulaf ezmesi (badem sütü ve muz ile hazırlanmış)",
              "Öğle: Izgara tavuk göğsü, kinoa salatası",
              "Akşam: Fırında levrek, bol limonlu yeşil salata",
          ],
          calories: [320, 300, 310], 
      },
      {
          title: "Beslenme Programı",
          meals: [
              "Sabah: Yağsız lor peyniri, domates ve salatalık (glütensiz ekmek ile)",
              "Öğle: Zeytinyağlı sebze yemeği, 1 kase yoğurt",
              "Akşam: Haşlanmış mercimek yemeği, kırmızı biberli kinoa",
          ],
          "calories": [150, 250, 330],  
      },
  ]
  };

  const [selectedDiet, setSelectedDiet] = useState("");

  const handleDietClick = (diet) => {
    setSelectedDiet(diet);
  };
  return (
    <div className="add-page">
      <div className="page-header">
        <h1>Diyet Programları</h1>
      </div>

      {/* Tüm Diyet Görselleri ve Butonlar */}
      <div className="diet-gallery">
        {diets.map((diet, index) => (
          <div key={index} className="diet-item">
            <img src={diet.image} alt={diet.name} className="diet-image" />
            <button className="diet-button" onClick={() => handleDietClick(diet.name)}>
              {diet.name}
            </button>
          </div>
        ))}
      </div>

{/* Seçilen Diyet Detayları */}
<div className="diet-plan-section">
  {selectedDiet && (
    <>
      <h2>{selectedDiet}</h2>
      <div className="diet-plan-container">
        {dietPlans[selectedDiet]?.map((plan, idx) => {
          const totalCalories = plan.calories.reduce((acc, val) => acc + val, 0); // Toplam Kalori Hesabı
          return (
            <div key={idx} className="diet-plan-table">
              <h3>Beslenme Programı {idx + 1}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Öğün</th>
                    <th>Yemek Detayı</th>
                    <th>Kalori (kcal)</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.meals.map((meal, id) => {
                    const [mealTime, mealDetail] = meal.split(": ");
                    return (
                      <tr key={id}>
                        <td className="meal-time">{mealTime}</td>
                        <td className="meal-detail">{mealDetail}</td>
                        <td className="meal-calories">{plan.calories[id]} kcal</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2" className="total-calories">Toplam Kalori</td>
                    <td className="meal-calories">{totalCalories} kcal</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          );
        })}
      </div>
    </>
  )}
</div>



    </div>
  );
};

export default AddPage