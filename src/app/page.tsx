"use client";

import { useState } from "react";

type DiagnosisResult = {
  title: string;
  score: string;
  concept: string;
  area: string;
  lifestyle: string;
  work: string;
  activity: string;
  support1: string;
  support2: string;
  reasons: string[];
  furato_message: string;
  tags: string[];
};

const questionImages = [
  "/images/zenkei.jpg",       // Q1: 今どこに住んでいるか → 桜川市全景
  "/images/yamazakura.jpg",   // Q2: いつ移住？ → 桜川の象徴・ヤマザクラ
  "/images/camp.jpg",         // Q3: 理想の1日 → アウトドア暮らし
  "/images/tomorokoshi.jpg",  // Q4: 仕事・活動 → 農業
  "/images/yuubinkyoku.jpg",  // Q5: ゆずれない条件 → 地域の利便性
  "/images/gion_kids.jpg",    // Q6: 家族構成 → 子どもたち
  "/images/hinamatsuri.jpg",  // Q7: 住まいスタイル → 歴史的な町並み
  "/images/amebiki.jpg",      // Q8: 体験したいこと → 雨引観音
];

// 回答内容からエリア・テーマに合った画像を選ぶ
function pickResultImages(answers: Record<string, string>) {
  // タイトルカード: Q3の回答でメインビジュアルを決める
  const heroMap: Record<string, string> = {
    "畑仕事のあと、自分で育てた野菜で食卓を囲む": "/images/tomorokoshi.jpg",
    "蔵の町並みを散歩して、カフェでひと息": "/images/hinamatsuri.jpg",
    "子どもを広い公園で遊ばせて、のびのび過ごす": "/images/gion_kids.jpg",
    "縁側でお茶を飲みながら、山を眺めてゆっくり": "/images/yamazakura.jpg",
  };
  const hero = heroMap[answers.q3] || "/images/zenkei.jpg";

  // エリアカード: Q5の回答で使い分ける
  const areaMap: Record<string, string> = {
    "きれいな空気と自然が近いこと": "/images/yamazakura.jpg",
    "ご近所さんと助け合える関係": "/images/gion.jpg",
    "スーパーや病院が近くにあること": "/images/yuubinkyoku.jpg",
    "人目を気にせず静かに暮らせること": "/images/zenkei.jpg",
  };
  const area = areaMap[answers.q5] || "/images/zenkei.jpg";

  // 暮らし方: Q7の回答で住まいの雰囲気
  const lifestyleMap: Record<string, string> = {
    "古民家・歴史ある建物": "/images/hinamatsuri.jpg",
    "新築・リノベ住宅": "/images/zenkei.jpg",
    "まずは賃貸で様子見": "/images/furatto.jpg",
    "二拠点居住": "/images/camp.jpg",
  };
  const lifestyle = lifestyleMap[answers.q7] || "/images/furatto.jpg";

  // 仕事: Q4の回答に合わせる
  const workMap: Record<string, string> = {
    "リモートワーク継続": "/images/zenkei.jpg",
    "地元で就職・転職": "/images/yuubinkyoku.jpg",
    "農業・農的活動": "/images/kodomo_nouka.jpg",
    "起業・副業・フリーランス": "/images/furatto.jpg",
    "引退・年金生活": "/images/jinja.jpg",
  };
  const work = workMap[answers.q4] || "/images/tomorokoshi.jpg";

  // 楽しみ方: Q8の回答に合わせる
  const activityMap: Record<string, string> = {
    "田植えや収穫体験、地元の食材で料理": "/images/yasai_taiken.jpg",
    "真壁のひな祭りや蔵の町歩き": "/images/hinamatsuri.jpg",
    "ヤマザクラの花見やつくし湖でアウトドア": "/images/camp.jpg",
    "お祭りや地域行事で地元の人と交流": "/images/gion.jpg",
  };
  const activity = activityMap[answers.q8] || "/images/camp.jpg";

  // 支援制度: 家族構成に合わせる
  const supportMap: Record<string, string> = {
    "単身": "/images/furatto.jpg",
    "夫婦ふたりで": "/images/yamazakura.jpg",
    "子どもと一緒に": "/images/randoseru.jpg",
    "親と一緒に・呼び寄せ": "/images/amebiki.jpg",
  };
  const support = supportMap[answers.q6] || "/images/furatto.jpg";

  return { hero, area, lifestyle, work, activity, support };
}

const questions = [
  {
    key: "q1",
    label: "今お住まいはどちらですか？",
    options: ["東京・首都圏", "その他の都市部", "地方在住", "海外在住"],
  },
  {
    key: "q2",
    label: "移住を考えているのはいつ頃ですか？",
    options: ["すでに動いている", "1年以内", "3年以内", "まずは情報収集"],
  },
  {
    key: "q3",
    label: "理想の1日を想像してみてください。どれが近いですか？",
    options: [
      "畑仕事のあと、自分で育てた野菜で食卓を囲む",
      "蔵の町並みを散歩して、カフェでひと息",
      "子どもを広い公園で遊ばせて、のびのび過ごす",
      "縁側でお茶を飲みながら、山を眺めてゆっくり",
    ],
  },
  {
    key: "q4",
    label: "移住後の仕事・活動はどうお考えですか？",
    options: [
      "リモートワーク継続",
      "地元で就職・転職",
      "農業・農的活動",
      "起業・副業・フリーランス",
      "引退・年金生活",
    ],
  },
  {
    key: "q5",
    label: "住む場所を選ぶとき、一番ゆずれない条件は？",
    options: [
      "きれいな空気と自然が近いこと",
      "ご近所さんと助け合える関係",
      "スーパーや病院が近くにあること",
      "人目を気にせず静かに暮らせること",
    ],
  },
  {
    key: "q6",
    label: "ご家族の状況を教えてください",
    options: ["単身", "夫婦ふたりで", "子どもと一緒に", "親と一緒に・呼び寄せ"],
  },
  {
    key: "q7",
    label: "住まいのスタイルはどれが気になりますか？",
    options: [
      "古民家・歴史ある建物",
      "新築・リノベ住宅",
      "まずは賃貸で様子見",
      "二拠点居住",
    ],
  },
  {
    key: "q8",
    label: "桜川市で「これは体験してみたい！」と思うのは？",
    options: [
      "田植えや収穫体験、地元の食材で料理",
      "真壁のひな祭りや蔵の町歩き",
      "ヤマザクラの花見やつくし湖でアウトドア",
      "お祭りや地域行事で地元の人と交流",
    ],
  },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = (key: string, value: string) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      submit(updated);
    }
  };

  const submit = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/shindan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      if (data.title) {
        setResult(data);
      } else if (data.raw) {
        setError(data.raw);
      } else {
        setError("診断結果を取得できませんでした");
      }
    } catch {
      setError("エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setError("");
  };

  const images = pickResultImages(answers);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #e8f5e9 0%, #e0f2f1 50%, #f1f8e9 100%)" }}
    >
      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Header */}
        <header className="text-center mb-10">
          <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/yamazakura.jpg" alt="桜川市のヤマザクラ" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-2" style={{ backgroundColor: "#1D9E75" }}>
                🌸 茨城県桜川市
              </div>
              <h1 className="text-2xl font-bold">移住スタイル診断</h1>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            8つの質問に答えて、あなたにぴったりの桜川暮らしを見つけましょう
          </p>
        </header>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-6 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images.hero} alt="桜川市の風景" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                <div className="w-14 h-14 border-4 rounded-full animate-spin" style={{ borderColor: "#c8e6c9", borderTopColor: "#1D9E75" }} />
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium">AIがあなたの移住スタイルを診断中...</p>
            <p className="mt-1 text-gray-400 text-sm">少々お待ちください</p>
          </div>
        )}

        {/* Questions */}
        {!loading && !result && !error && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative w-full h-36">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={step} src={questionImages[step]} alt="桜川市の風景" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            <div className="p-7 -mt-4 relative">
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>質問 {step + 1} / {questions.length}</span>
                  <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((step + 1) / questions.length) * 100}%`, backgroundColor: "#1D9E75" }}
                  />
                </div>
              </div>

              <h2 className="text-lg font-bold text-gray-800 mb-5">{questions[step].label}</h2>

              <div className="grid gap-2.5">
                {questions[step].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(questions[step].key, option)}
                    className="w-full text-left px-5 py-3.5 rounded-xl border-2 border-gray-100 hover:border-[#1D9E75] hover:bg-[#f0faf6] hover:shadow-md transition-all text-gray-700 text-sm font-medium"
                  >
                    {option}
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="mt-5 text-sm text-gray-400 hover:text-gray-600 transition">
                  ← 前の質問に戻る
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={reset} className="px-6 py-3 text-white rounded-full font-medium hover:opacity-90 transition" style={{ backgroundColor: "#1D9E75" }}>
              もう一度診断する
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div>
            {/* Title card — hero image matches Q3 answer */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5">
              <div className="relative w-full h-52">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images.hero} alt="あなたの移住スタイル" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(29,158,117,0.6), rgba(29,158,117,0.9))" }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-7 text-white">
                  <p className="text-sm opacity-80 mb-1">あなたの移住スタイルは…</p>
                  <h2 className="text-2xl font-bold mb-3">{result.title}</h2>
                  <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-4 py-1 text-sm font-medium">
                    桜川市マッチ度 {result.score}
                  </div>
                </div>
              </div>
              <div className="px-7 py-5">
                <p className="text-gray-600 text-sm leading-relaxed">{result.concept}</p>
              </div>
              <div className="px-7 pb-5 flex flex-wrap gap-2">
                {result.tags.map((tag, i) => (
                  <span key={i} className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "#e8f5e9", color: "#1D9E75" }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Detail cards — each image chosen by answers */}
            <div className="grid gap-4">
              <ResultCard icon="📍" title="おすすめエリア" content={result.area} image={images.area} />
              <ResultCard icon="🏠" title="暮らし方" content={result.lifestyle} image={images.lifestyle} />
              <ResultCard icon="💼" title="仕事・活動" content={result.work} image={images.work} />
              <ResultCard icon="🎯" title="地域での楽しみ方" content={result.activity} image={images.activity} />

              {/* Support — image matches family situation */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative w-full h-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={images.support} alt="支援制度" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                </div>
                <div className="p-6 -mt-3 relative">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">🎁 おすすめ支援制度</h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-sm text-gray-700">{result.support1}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-sm text-gray-700">{result.support2}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">✨ 桜川市をおすすめする理由</h3>
                <ul className="space-y-2.5">
                  {result.reasons.map((reason, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ backgroundColor: "#1D9E75" }}>{i + 1}</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Furato message */}
              <div className="rounded-2xl shadow-lg overflow-hidden border-2" style={{ borderColor: "#1D9E75" }}>
                <div className="relative w-full h-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/furatto.jpg" alt="ふらっと" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, #f0faf6 100%)" }} />
                </div>
                <div className="p-6 -mt-4 relative" style={{ backgroundColor: "#f0faf6" }}>
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: "#1D9E75" }}>💬 「ふらっと」からのメッセージ</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.furato_message}</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 space-y-3 text-center">
              <a
                href="https://see-en.net/consultation/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-full text-white font-bold text-base hover:opacity-90 transition shadow-lg"
                style={{ backgroundColor: "#1D9E75" }}
              >
                🌸 ふらっとに相談する
              </a>
              <button
                onClick={reset}
                className="w-full py-3 rounded-full border-2 font-medium text-sm hover:bg-[#f0faf6] transition"
                style={{ borderColor: "#1D9E75", color: "#1D9E75" }}
              >
                もう一度診断する
              </button>
            </div>
          </div>
        )}

        <footer className="text-center mt-12 text-xs text-gray-400">
          <p>桜川市移住スタイル診断 — AI による診断結果はあくまで参考です</p>
        </footer>
      </div>
    </div>
  );
}

function ResultCard({ icon, title, content, image }: { icon: string; title: string; content: string; image: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative w-full h-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>
      <div className="p-6 -mt-3 relative">
        <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">{icon} {title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
