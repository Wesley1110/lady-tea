import React, { useState, useEffect } from 'react';

const PROBABILITY_TABLE = [
  { correct: 4, ways: 1, p: 1 / 70, formula: "C(4,4) × C(4,0)" },
  { correct: 3, ways: 16, p: 16 / 70, formula: "C(4,3) × C(4,1)" },
  { correct: 2, ways: 36, p: 36 / 70, formula: "C(4,2) × C(4,2)" },
  { correct: 1, ways: 16, p: 16 / 70, formula: "C(4,1) × C(4,3)" },
  { correct: 0, ways: 1, p: 1 / 70, formula: "C(4,0) × C(4,4)" }
];

const SIGNIFICANCE_LEVEL = 0.05; // 顯著水準

export default function App() {
  const [step, setStep] = useState(1);
  const [hypothesisChoice, setHypothesisChoice] = useState(null);
  const [cups, setCups] = useState([]);
  const [selectedCupIds, setSelectedCupIds] = useState([]);
  const [experimentResult, setExperimentResult] = useState(null);
  const [interactiveCount, setInteractiveCount] = useState(4);

  const initCups = () => {
    let newCups = [
      { id: 1, type: 'MilkFirst', label: '杯子 A' },
      { id: 2, type: 'MilkFirst', label: '杯子 B' },
      { id: 3, type: 'MilkFirst', label: '杯子 C' },
      { id: 4, type: 'MilkFirst', label: '杯子 D' },
      { id: 5, type: 'TeaFirst', label: '杯子 E' },
      { id: 6, type: 'TeaFirst', label: '杯子 F' },
      { id: 7, type: 'TeaFirst', label: '杯子 G' },
      { id: 8, type: 'TeaFirst', label: '杯子 H' },
    ];
    for (let i = newCups.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCups[i], newCups[j]] = [newCups[j], newCups[i]];
    }
    setCups(newCups);
    setSelectedCupIds([]);
    setExperimentResult(null);
    setInteractiveCount(4);
  };

  useEffect(() => {
    initCups();
  }, []);

  const handleCupClick = (id) => {
    if (selectedCupIds.includes(id)) {
      setSelectedCupIds(selectedCupIds.filter(cupId => cupId !== id));
    } else {
      if (selectedCupIds.length < 4) {
        setSelectedCupIds([...selectedCupIds, id]);
      }
    }
  };

  const submitExperiment = () => {
    const selectedCups = cups.filter(cup => selectedCupIds.includes(cup.id));
    const correctCount = selectedCups.filter(cup => cup.type === 'MilkFirst').length;
    setExperimentResult(correctCount);
    setInteractiveCount(correctCount);
    setStep(4);
  };

  const currentInteractiveData = PROBABILITY_TABLE.find(row => row.correct === interactiveCount);
  const isInteractiveSignificant = currentInteractiveData.p <= SIGNIFICANCE_LEVEL;
  const actualResultData = experimentResult !== null ? PROBABILITY_TABLE.find(row => row.correct === experimentResult) : null;
  const isActualSignificant = actualResultData ? actualResultData.p <= SIGNIFICANCE_LEVEL : false;

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 font-sans text-stone-800 selection:bg-amber-200">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
        
        {/* 網頁標頭 Banner */}
        <div className="bg-amber-800 p-8 text-white text-center border-b-4 border-amber-900">
          <h1 className="text-3xl font-serif font-bold tracking-wide">☕ 女士品茶互動實驗室</h1>
          <p className="text-amber-100 mt-2 italic">The Lady Tasting Tea: An Interactive Laboratory</p>
        </div>

        {/* 導覽進度條 */}
        <div className="bg-stone-100 px-6 py-3 border-b border-stone-200 flex justify-between text-xs font-medium text-stone-500">
          <span className={step === 1 ? 'text-amber-800 font-bold' : ''}>第一幕：歷史情境</span>
          <span className={step === 2 ? 'text-amber-800 font-bold' : ''}>第二幕：建立假說</span>
          <span className={step === 3 ? 'text-amber-800 font-bold' : ''}>第三幕：品茶實驗</span>
          <span className={step === 4 ? 'text-amber-800 font-bold' : ''}>第四幕：數據決策</span>
        </div>

        <div className="p-8">
          {/* 第一幕 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-amber-900 border-b pb-2">第一幕：劍橋夏日的午後不速之客</h2>
              <p className="leading-relaxed text-stone-600">
                在 1920 年代後期一個英國劍橋的夏日午後，一群學者與夫人在戶外享用下午茶。一位名叫穆麗爾·布里斯托（Muriel Bristol）的女士堅稱：<strong>「把茶加進奶裡，或把奶加進茶裡，品嚐起來的味道完全不同。」</strong>
              </p>
              <p className="leading-relaxed text-stone-600">
                在場的科學精英們對此嗤之以鼻，認為這在化學上沒有差別。然而，席中一位戴著厚眼鏡、蓄著短鬍鬚的紳士——<strong>羅納德·費雪（Ronald A. Fisher）</strong>卻非常興奮，決定設計一場嚴謹的實驗來驗證這個命題。
              </p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-sm italic text-stone-500">
                思考：身為統計學家，我們該如何證明這位女士是真的有品嚐能力，還是純粹憑運氣猜對的？
              </div>
              <div className="flex justify-end pt-4">
                <button onClick={() => setStep(2)} className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2.5 rounded-lg shadow font-medium transition">
                  前進：設計實驗假說 ➔
                </button>
              </div>
            </div>
          )}

          {/* 第二幕 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-amber-900 border-b pb-2">第二幕：定義「虛無假說」 (The Null Hypothesis)</h2>
              <p className="leading-relaxed">
                費雪準備了 <strong>8 杯茶</strong>，其中 4 杯是「先加奶」，4 杯是「先加茶」，並事先將這個規則告訴了女士。
              </p>
              <p className="text-stone-700 font-medium">在統計學檢定中，我們的科學思維應該建立在什麼樣的出發點（假設）上？</p>
              
              <div className="space-y-3 pt-2">
                <button 
                  onClick={() => setHypothesisChoice('A')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${hypothesisChoice === 'A' ? 'border-red-500 bg-red-50' : 'border-stone-200 hover:bg-stone-50'}`}
                >
                  <strong className="block text-red-800">選項 A：對立假說 (Alternative Hypothesis, H₁)</strong>
                  假設女士真的具備超能力，絕對能精準品嚐出注茶順序的不同。
                </button>
                
                <button 
                  onClick={() => setHypothesisChoice('B')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${hypothesisChoice === 'B' ? 'border-green-500 bg-green-50' : 'border-stone-200 hover:bg-stone-50'}`}
                >
                  <strong className="block text-green-800">選項 B：虛無假說 (Null Hypothesis, H₀)</strong>
                  假設女士完全沒有辨別能力，她能選對茶杯純粹是隨機亂猜的。
                </button>
              </div>

              {hypothesisChoice === 'A' && (
                <div className="p-4 bg-red-50 text-red-900 rounded-lg border border-red-200 text-sm">
                  ❌ <strong>這不符合統計學思維！</strong> 統計學不能建立在無法證實的預設上。我們必須先站在反方立場，看看隨機亂猜有沒有可能造就她的成績。
                </div>
              )}

              {hypothesisChoice === 'B' && (
                <div className="p-4 bg-green-50 text-green-900 rounded-lg border border-green-200 text-sm">
                  ✅ <strong>答對了！這就是統計檢定的核心。</strong> 我們總是從 <strong>虛無假說 (H₀)</strong> 出發。接下來所有的機率計算，都是建立在「如果她只是瞎猜」的前提下進行。如果瞎猜要達成全對的機率極其罕見，我們才不得不拒絕 H₀，承認她的能力！
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(1)} className="text-stone-500 hover:text-stone-700 font-medium">⬅ 返回上一頁</button>
                <button 
                  disabled={hypothesisChoice !== 'B'} 
                  onClick={() => setStep(3)} 
                  className={`px-6 py-2.5 rounded-lg shadow font-medium transition ${hypothesisChoice === 'B' ? 'bg-amber-700 hover:bg-amber-800 text-white' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
                >
                  前進：開始品茶實驗 ➔
                </button>
              </div>
            </div>
          )}

          {/* 第三幕 */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-amber-900 border-b pb-2">第三幕：隨機對照實驗 (Randomized Experiment)</h2>
              <p className="leading-relaxed text-stone-600">
                桌上現在隨機排列著 8 杯調製好的茶。請扮演品茶女士，<strong>從中挑選出您認為「先加奶」的 4 杯茶</strong>：
              </p>

              <div className="bg-amber-50 p-3 rounded-lg text-center text-amber-900 font-bold text-sm">
                已選擇：{selectedCupIds.length} / 4 杯
              </div>

              <div className="grid grid-cols-4 gap-4 py-4">
                {cups.map((cup) => {
                  const isSelected = selectedCupIds.includes(cup.id);
                  return (
                    <button
                      key={cup.id}
                      onClick={() => handleCupClick(cup.id)}
                      className={`h-24 rounded-xl border-2 font-medium flex flex-col items-center justify-center gap-2 transition ${
                        isSelected 
                          ? 'border-amber-700 bg-amber-600 text-white shadow-md transform scale-105' 
                          : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50'
                      }`}
                    >
                      <span className="text-2xl">☕</span>
                      <span className="text-xs">{cup.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(2)} className="text-stone-500 hover:text-stone-700 font-medium">⬅ 返回假說</button>
                <button 
                  disabled={selectedCupIds.length !== 4}
                  onClick={submitExperiment}
                  className={`px-6 py-2.5 rounded-lg shadow font-medium transition ${selectedCupIds.length === 4 ? 'bg-amber-700 hover:bg-amber-800 text-white' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
                >
                  送出結果，檢定 P 值 ➔
                </button>
              </div>
            </div>
          )}

          {/* 第四幕 */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-amber-900 border-b pb-2">第四幕：決策邊界與 P 值 (P-value & Decision Making)</h2>
              
              <div className="bg-stone-100 p-5 rounded-xl border border-stone-300 text-center shadow-inner">
                <h3 className="text-sm text-stone-600 uppercase tracking-wider font-semibold">您的品茶實驗結果：</h3>
                <div className="text-4xl font-black text-amber-800 my-1">答對 {experimentResult} 杯！</div>
                <p className="text-sm text-stone-500">您成功挑選出了 {experimentResult} 杯真正「先加奶」的茶杯。</p>
              </div>

              <p className="text-stone-600 leading-relaxed text-sm">
                現在，讓我們回到最初的<strong>虛無假說 (H₀)：假設您完全是在瞎猜</strong>。透過下方的互動式圖表，拉動滑桿來檢視瞎猜下各種對應結果發生的機率：
              </p>

              {/* 互動式圖表區塊 */}
              <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 shadow-sm my-4">
                <h3 className="text-base font-bold text-stone-700 mb-4 text-center flex items-center justify-center gap-2">
                  <span>📊</span> 互動機率分佈圖 (Interactive Probability Distribution)
                </h3>
                
                {/* 長條圖 */}
                <div className="flex justify-around items-end h-36 border-b border-stone-300 pb-1 mb-4">
                  {[0, 1, 2, 3, 4].map(num => {
                    const rowData = PROBABILITY_TABLE.find(r => r.correct === num);
                    const heightPercent = (rowData.p / (36 / 70)) * 100;
                    const isSelected = num === interactiveCount;
                    return (
                      <div key={num} className="flex flex-col items-center w-1/6 cursor-pointer group" onClick={() => setInteractiveCount(num)}>
                        <span className={`text-xs mb-1 transition-colors ${isSelected ? 'font-bold text-amber-700' : 'text-stone-400'}`}>
                          {(rowData.p * 100).toFixed(1)}%
                        </span>
                        <div className={`w-full rounded-t transition-all duration-200 ${isSelected ? 'bg-amber-600 shadow' : 'bg-stone-200 group-hover:bg-amber-300'}`} style={{ height: `${heightPercent}%` }}></div>
                        <span className={`text-xs mt-2 font-medium ${isSelected ? 'text-stone-900 font-bold' : 'text-stone-500'}`}>{num}杯</span>
                      </div>
                    );
                  })}
                </div>

                {/* 滑桿 Slider */}
                <div className="px-2 mb-6">
                  <input type="range" min="0" max="4" value={interactiveCount} onChange={(e) => setInteractiveCount(Number(e.target.value))} className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-700" />
                </div>

                {/* 動態計算算式與解說 */}
                <div className={`p-4 rounded-lg border text-sm transition-colors ${isInteractiveSignificant ? 'bg-green-50 border-green-300 text-green-900' : 'bg-white border-stone-200 text-stone-700'}`}>
                  <div className="font-bold text-base mb-1">當模擬結果為「答對 {interactiveCount} 杯」時：</div>
                  <p className="mb-2 opacity-90">在盲猜前提下，單看此結果發生的機率為 <strong>{(currentInteractiveData.p).toFixed(4)}</strong> (即 {(currentInteractiveData.p * 100).toFixed(1)}%)。</p>
                  
                  <div className="mb-3 p-3 bg-stone-50 rounded border border-stone-200 font-mono text-xs text-stone-700">
                    <div className="font-bold mb-1 text-stone-800">🧮 超幾何分配 (Hypergeometric Distribution) 計算過程：</div>
                    <div>• 母體總數分母：C(8, 4) = 70 (從8杯茶中任選4杯的總組合數)</div>
                    <div>• 符合特徵分子：{currentInteractiveData.formula} = {currentInteractiveData.ways}</div>
                    <div className="mt-2 font-bold text-amber-800 text-center text-sm border-t pt-1.5">P-value = {currentInteractiveData.ways} / 70 ≈ {(currentInteractiveData.p).toFixed(4)}</div>
                  </div>

                  <p className="font-medium">
                    {isInteractiveSignificant 
                      ? `✅ P 值 <= 0.05 (顯著水準)，這在瞎猜下是「罕見事件」。我們有信心拒絕虛無假說，推斷不只是靠運氣！` 
                      : `❌ P 值 > 0.05 (顯著水準)，這在瞎猜下非常普遍。我們缺乏證據拒絕虛無假說。`}
                  </p>
                </div>
              </div>

              {/* 統計學的反直覺 */}
              <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500 text-sm shadow-sm text-blue-900">
                <h4 className="font-bold flex items-center gap-1.5 mb-1">💡 統計學的反直覺 (Statistical Counter-intuition)</h4>
                <p className="leading-relaxed">
                  許多學生凭直覺認為「4杯中答對3杯（75%準確率）」已經非常厲害。但在固定總數的實驗設計下，純靠瞎猜而拿到答對3杯的機率仍然高達 <strong>22.9%</strong> ($P = 0.2286$)。因為它遠高於 5% 的顯著水準，在嚴格的科學標準下，<strong>答對3杯依然完全無法證明</strong>女士有品茶能力！直覺的「高準確率」不等同於統計學上的「證據確鑿」。
                </p>
              </div>

              {/* 超幾何分配觀念解析 */}
              <div className="bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500 text-sm shadow-sm text-indigo-900">
                <h4 className="font-bold flex items-center gap-1.5 mb-1">🎓 進階觀念：為什麼是超幾何分配？而不是 $(1/2)^4$？</h4>
                <p className="leading-relaxed mb-2">
                  若誤用獨立事件的二項式分配計算，連續猜對4杯的機率為 $(1/2)^4 = 1/16 = 0.0625$。但 Fisher 實驗設計的精妙之處在於，他<strong>事先告知了女士「有4杯先加奶、4杯先加茶」</strong>。
                </p>
                <p className="leading-relaxed">
                  這意味著每一次挑選都是<strong>取後不放回</strong>的依賴性決策。一旦女士選定了一杯，剩餘杯子是奶或茶的機率就會當刻發生改變。因此必須使用組合數學的超幾何分配計算，總可能數為 $C^8_4 = 70$ 種，這也是<strong>「費雪精確檢定 (Fisher's Exact Test)」</strong>的起點。
                </p>
              </div>

              {/* 歷史結局軼事 */}
              <div className="bg-amber-50 p-4 rounded-xl border-l-4 border-amber-500 text-sm shadow-sm text-amber-900">
                <h4 className="font-bold flex items-center gap-1.5 mb-1">📜 歷史真實大結局 (Historical Anecdote)</h4>
                <p className="leading-relaxed">
                  費雪在 1935 年的著作中並未透露當時那位女同事到底答對了幾杯。但根據費雪的女兒後來的回憶錄證實：<strong>這位女同事當時 8 杯茶完全答對了（Agresti 2002, p.92）！</strong>在僅有 $1/70 \approx 1.43\%$ 的極低盲猜機率下，她用無可置疑的味覺實力折服了在場的所有科學家。
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-4 border-t">
                <button onClick={() => { setStep(1); initCups(); }} className="bg-stone-600 hover:bg-stone-700 text-white px-5 py-2 rounded-lg font-medium transition text-sm">🔄 重頭體驗歷史</button>
                <button onClick={() => { setStep(3); initCups(); }} className="bg-amber-700 hover:bg-amber-800 text-white px-5 py-2 rounded-lg font-medium transition text-sm">☕ 再品嚐一次</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}