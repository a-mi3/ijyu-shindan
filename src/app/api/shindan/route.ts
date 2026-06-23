import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SAKURAGAWA_INFO = `
【桜川市の基本情報】
- 茨城県中西部、東京から車で約90分
- 3つのエリアで構成される

【真壁エリア】
- 国の重要伝統的建造物群保存地区に選定
- 300余棟の蔵・門が残る歴史的な町並み
- 「ふらっと」：移住相談の拠点施設。移住に関する相談や地域情報を提供

【岩瀬エリア】
- JR水戸線岩瀬駅があり、市内で最も利便性が高い
- 商業施設や公共施設が集まるエリア

【大和エリア】
- 農業が盛んな地域
- いきいきファームやまと直売所で地元の新鮮な農産物が手に入る

【支援制度】
- 住宅取得助成金：最大200万円
- 移住支援金：世帯で最大100万円
- お試し移住制度あり（実際の暮らしを体験可能）
- 認定新規就農者制度
- 農業機械購入補助

【神社仏閣・文化】
- 雨引観音（安産・子育ての名刹）
- 五所駒瀧神社
- 櫻川磯部稲村神社

【自然環境】
- ヤマザクラ約55万本（日本有数の桜の名所）
- つくし湖
- りんりんロード（サイクリングロード）
`;

export async function POST(request: NextRequest) {
  const { answers } = await request.json();

  const prompt = `あなたは茨城県桜川市の移住アドバイザーです。以下の桜川市の情報とユーザーの回答に基づいて、そのユーザーに最適な「移住スタイル」を診断してください。

${SAKURAGAWA_INFO}

【ユーザーの回答】
1. 現在の居住地: ${answers.q1}
2. 移住時期: ${answers.q2}
3. 理想の1日のイメージ: ${answers.q3}
4. 移住後の仕事・活動: ${answers.q4}
5. 住む場所でゆずれない条件: ${answers.q5}
6. 家族の状況: ${answers.q6}
7. 住まいのスタイル: ${answers.q7}
8. 桜川市で体験したいこと: ${answers.q8}

以下のJSON形式で回答してください。必ずJSONのみを返してください。マッチ度scoreは回答内容に基づいて80〜98%の範囲で設定してください。タイトルは「〇〇タイプ」のように親しみやすい名前にしてください。furato_messageは移住相談拠点「ふらっと」のスタッフからの温かい語りかけ調で。tagsは回答内容に合ったキーワードを4つ選んでください。

{
  "title": "移住スタイルタイプ名",
  "score": "マッチ度（例：93%）",
  "concept": "コンセプト説明2〜3文",
  "area": "おすすめエリアとその理由",
  "lifestyle": "暮らし方の特徴",
  "work": "できる仕事・活動",
  "activity": "地域での楽しみ方",
  "support1": "おすすめ支援制度1つ目（制度名と簡単な説明）",
  "support2": "おすすめ支援制度2つ目（制度名と簡単な説明）",
  "reasons": ["桜川市をおすすめする理由1", "理由2", "理由3"],
  "furato_message": "ふらっとからの温かいひとこと",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4"]
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return Response.json({ error: "No response" }, { status: 500 });
  }

  try {
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : textBlock.text);
    return Response.json(parsed);
  } catch {
    return Response.json({ raw: textBlock.text });
  }
}
