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

const questions = [
  {
    key: "q1",
    label: "今お住まいはどちらですか？",
    options: [
      "東京・首都圏",
      "その他の都市部",
      "地方在住",
      "海外在住",
    ],
  },
  {
    key: "q2",
    label: "移住を考えているのはいつ頃ですか？",
    options: [
      "すでに動いている",
      "1年以内",
      "3年以内",
      "まずは情報収集",
    ],
  },
  {
    key: "q3",
    label: "桜川市でどんな暮らしがしたいですか？",
    options: [
      "農的・自給自足的な暮らし",
      "古民家・文化財に囲まれた暮らし",
      "子育てしやすい静かな暮らし",
      "セカンドライフ・のんびり暮らし",
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
    label: "暮らしで最も重視することは？",
    options: [
      "自然・緑・空気",
      "地域コミュニティとのつながり",
      "生活の利便性",
      "静けさ・プライバシー",
    ],
  },
  {
    key: "q6",
    label: "ご家族の状況を教えてください",
    options: [
      "単身",
      "夫婦ふたりで",
      "子どもと一緒に",
      "親と一緒に・呼び寄せ",
    ],
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
    label: "桜川市に期待することは何ですか？",
    options: [
      "のびのびした子育て環境",
      "歴史・文化・アート",
      "農業・食・自然体験",
      "人とのつながり・コミュニティ",
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

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #e8f5e9 0%, #e0f2f1 50%, #f1f8e9 100%)" }}>
      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white mb-4" style={{ backgroundColor: "#1D9E75" }}>
            🌸 茨城県桜川市
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            移住スタイル診断
          </h1>
          <p className="text-gray-500 text-sm">
            8つの質問に答えて、あなたにぴったりの桜川暮らしを見つけましょう
          </p>
        </header>

        {/* Loading */}
        {loading && (
          <div className="text-center py-24">
            <div
              className="inline-block w-14 h-14 border-4 rounded-full animate-spin"
              style={{ borderColor: "#c8e6c9", borderTopColor: "#1D9E75" }}
            />
            <p className="mt-5 text-gray-600 text-lg font-medium">
              AIがあなたの移住スタイルを診断中...
            </p>
            <p className="mt-1 text-gray-400 text-sm">少々お待ちください</p>
          </div>
        )}

        {/* Questions */}
        {!loading && !result && !error && (
          <div className="bg-white rounded-2xl shadow-lg p-7">
            {/* Progress */}
            <div className="mb-7">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>質問 {step + 1} / {questions.length}</span>
                <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((step + 1) / questions.length) * 100}%`,
                    backgroundColor: "#1D9E75",
                  }}
                />
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-5">
              {questions[step].label}
            </h2>

            <div className="grid gap-2.5">
              {questions[step].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(questions[step].key, option)}
                  className="w-full text-left px-5 py-3.5 rounded-xl border-2 border-gray-100 hover:shadow-md transition-all text-gray-700 text-sm font-medium"
                  style={{
                    // hover styles handled inline via onMouseEnter/Leave would be complex,
                    // so we rely on the CSS hover class below
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#1D9E75";
                    e.currentTarget.style.backgroundColor = "#f0faf6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#f3f4f6";
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={handleBack}
                className="mt-5 text-sm text-gray-400 hover:text-gray-600 transition"
              >
                ← 前の質問に戻る
              </button>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={reset}
              className="px-6 py-3 text-white rounded-full font-medium hover:opacity-90 transition"
              style={{ backgroundColor: "#1D9E75" }}
            >
              もう一度診断する
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div>
            {/* Type title card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5">
              <div className="px-7 py-8 text-center text-white" style={{ backgroundColor: "#1D9E75" }}>
                <p className="text-sm opacity-80 mb-1">あなたの移住スタイルは…</p>
                <h2 className="text-2xl font-bold mb-2">{result.title}</h2>
                <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-4 py-1 text-sm font-medium">
                  桜川市マッチ度 {result.score}
                </div>
              </div>
              <div className="px-7 py-5">
                <p className="text-gray-600 text-sm leading-relaxed">{result.concept}</p>
              </div>
              {/* Tags */}
              <div className="px-7 pb-5 flex flex-wrap gap-2">
                {result.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{ backgroundColor: "#e8f5e9", color: "#1D9E75" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Detail cards */}
            <div className="grid gap-4">
              <DetailCard icon="📍" title="おすすめエリア" content={result.area} />
              <DetailCard icon="🏠" title="暮らし方" content={result.lifestyle} />
              <DetailCard icon="💼" title="仕事・活動" content={result.work} />
              <DetailCard icon="🎯" title="地域での楽しみ方" content={result.activity} />

              {/* Support */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  🎁 おすすめ支援制度
                </h3>
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700">{result.support1}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700">{result.support2}</p>
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  ✨ 桜川市をおすすめする理由
                </h3>
                <ul className="space-y-2.5">
                  {result.reasons.map((reason, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ backgroundColor: "#1D9E75" }}>
                        {i + 1}
                      </span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Furato message */}
              <div className="rounded-2xl shadow-lg p-6 border-2" style={{ borderColor: "#1D9E75", backgroundColor: "#f0faf6" }}>
                <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: "#1D9E75" }}>
                  💬 「ふらっと」からのメッセージ
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {result.furato_message}
                </p>
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
                className="w-full py-3 rounded-full border-2 font-medium text-sm transition"
                style={{ borderColor: "#1D9E75", color: "#1D9E75" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0faf6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                もう一度診断する
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-xs text-gray-400">
          <p>桜川市移住スタイル診断 — AI による診断結果はあくまで参考です</p>
        </footer>
      </div>
    </div>
  );
}

function DetailCard({ icon, title, content }: { icon: string; title: string; content: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
        {icon} {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}
