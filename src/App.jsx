import React, { useState, useEffect } from 'react';

const TOTAL_CUPS = 8;
const CUPS_TO_SELECT = 4;
const SIGNIFICANCE_LEVEL = 0.05;

// 機率分布表 (Probability Distribution Table)
const PROBABILITY_TABLE = [
  { correct: 4, ways: 1, p: 1 / 70, formula: 'C(4,4) × C(4,0)' },
  { correct: 3, ways: 16, p: 16 / 70, formula: 'C(4,3) × C(4,1)' },
  { correct: 2, ways: 36, p: 36 / 70, formula: 'C(4,2) × C(4,2)' },
  { correct: 1, ways: 16, p: 16 / 70, formula: 'C(4,1) × C(4,3)' },
  { correct: 0, ways: 1, p: 1 / 70, formula: 'C(4,0) × C(4,4)' },
];

export default function LadyTastingTea() {
  const [step, setStep] = useState(1);
  const [hypothesisChoice, setHypothesisChoice] = useState(null);
  
  // 杯子狀態 (Cup State)
  const [cups, setCups] = useState([]);
  const [selectedCupIds, setSelectedCupIds] = useState([]);
  const [experimentResult, setExperimentResult] = useState(null);
  const [interactiveCount, setInteractiveCount] = useState(4);

  // 初始化隨機茶杯 (Randomize Cups)
  const initCups = () => {
    let newCups = [
      { id: 1, type: 'MilkFirst' }, { id: 2, type: 'MilkFirst' },
      { id: 3, type: 'MilkFirst' }, { id: 4, type: 'MilkFirst' },
      { id: 5, type: 'TeaFirst' }, { id: 6, type: 'TeaFirst' },
      { id: 7, type: 'TeaFirst' }, { id: 8, type: 'TeaFirst' }
    ];
    // Fisher-Yates Shuffle
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

  const toggleCupSelection = (id) => {
    if (selectedCupIds.includes(id)) {
      setSelectedCupIds(selectedCupIds.filter(cupId => cupId !== id));
    } else {
      if (selectedCupIds.length < CUPS_TO_SELECT) {
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

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-amber-900 border-b-2 border-amber-200 pb-2">
        第一幕：劍橋的午後 (A Summer Afternoon in Cambridge)
      </h2>
      <p className="text-lg leading-relaxed text-stone-700">
        時間回到 1920 年代後期，英國劍橋的一個夏日午後。一群學者正享用著下午茶。
        此時，藻類學家 <strong>穆麗爾·布里斯托 (Muriel Bristol)</strong> 提出了一個驚人的主張：
      </p>
      <blockquote className="border-l-4 border-amber-500 bg-amber-50 p-4 text-amber-900 italic rounded-r-lg shadow-sm">
        「把茶加進奶裡，和把奶加進茶裡，品嚐起來的味道是完全不同的！」
      </blockquote>
      <p className="text-lg leading-relaxed text-stone-700">
        在場的科學菁英對此嗤之以鼻，認為化學成分相同，味道不可能有差異。然而，一位名叫 <strong>羅納德·費雪 (Ronald A. Fisher)</strong> 的先生卻非常感興趣，他提議：「讓我們來檢驗這個命題吧！」
      </p>
      <div className="flex justify-end mt-8">
        <button 
          onClick={() => setStep(2)}
          className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded shadow-md transition-colors font-medium text-lg"
        >
          進入第二幕：設立假說 ➡️
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-amber-900 border-b-2 border-amber-200 pb-2">
        第二幕：設立假說 (Setting the Hypothesis)
      </h2>
      <p className="text-lg text-stone-700">
        在統計學的 <strong>假設檢定 (Hypothesis Testing)</strong> 中，我們不能一開始就認定女士有超能力。我們必須先設定一個保守的起點。
        你認為 Fisher 當時是怎麼設定這個實驗的基礎前提的？
      </p>
      
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <button 
          onClick={() => setHypothesisChoice('A')}
          className={`p-6 border-2 rounded-xl text-left transition-all ${hypothesisChoice === 'A' ? 'border-red-500 bg-red-50' : 'border-stone-300 hover:border-amber-500 hover:bg-amber-50'}`}
        >
          <h3 className="font-bold text-xl text-stone-800 mb-2">選項 A</h3>
          <p className="text-stone-600">假設女士真的有超乎常人的味覺，絕對喝得出來不同。</p>
        </button>
        <button 
          onClick={() => setHypothesisChoice('B')}
          className={`p-6 border-2 rounded-xl text-left transition-all ${hypothesisChoice === 'B' ? 'border-green-500 bg-green-50' : 'border-stone-300 hover:border-amber-500 hover:bg-amber-50'}`}
        >
          <h3 className="font-bold text-xl text-stone-800 mb-2">選項 B</h3>
          <p className="text-stone-600">假設女士完全喝不出來，她選對純粹只是運氣好（隨機瞎猜）。</p>
        </button>
      </div>

      {hypothesisChoice && (
        <div className={`p-6 rounded-lg mt-6 shadow-inner ${hypothesisChoice === 'B' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
          {hypothesisChoice === 'B' ? (
            <div>
              <h4 className="font-bold text-xl mb-2 flex items-center">✅ 答對了！這就是統計學的核心！</h4>
              <p>
                這被稱為 <strong>虛無假說 (Null Hypothesis, $H_0$)</strong>。我們總是假設「沒有特殊效應」、「沒有差異」或「只是隨機」。<br/><br/>
                在這個例子中，$H_0$ 就是：「女士沒有辨別能力，她只是在瞎猜」。接下來所有的機率計算，都是建立在「如果她只是瞎猜」的前提下進行的！
              </p>
              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => setStep(3)}
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded shadow transition-colors font-medium"
                >
                  開始實驗設計 ➡️
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-bold text-xl mb-2 flex items-center">❌ 再想想看...</h4>
              <p>如果我們一開始就假設她有能力，那就沒有驗證的必要了。科學需要從懷疑出發，請嘗試另一個選項！</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-amber-900 border-b-2 border-amber-200 pb-2">
        第三幕：實驗設計 (Experimental Design)
      </h2>
      <p className="text-lg text-stone-700">
        Fisher 準備了 8 杯茶。其中 4 杯是「先加奶 (Milk-first)」，4 杯是「先加茶 (Tea-first)」。<br/>
        他告訴女士這個資訊，並請女士品嚐後，<strong>挑出她認為是「先加奶」的 4 杯茶。</strong>
      </p>
      
      <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 shadow-sm mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-stone-800">換你來當女士！請憑直覺挑出 4 杯「先加奶」的茶：</h3>
          <span className="bg-amber-200 text-amber-900 px-3 py-1 rounded-full font-bold text-sm">
            已選: {selectedCupIds.length} / {CUPS_TO_SELECT}
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {cups.map((cup, index) => (
            <button
              key={cup.id}
              onClick={() => toggleCupSelection(cup.id)}
              className={`relative h-32 flex flex-col items-center justify-center rounded-xl border-4 transition-all duration-200 
                ${selectedCupIds.includes(cup.id) 
                  ? 'border-amber-600 bg-amber-100 transform scale-105 shadow-md' 
                  : 'border-transparent bg-white hover:bg-stone-100 shadow'}`}
            >
              <div className="text-4xl mb-2">☕</div>
              <div className="font-mono text-sm text-stone-500">Cup {index + 1}</div>
              {selectedCupIds.includes(cup.id) && (
                <div className="absolute top-2 right-2 text-amber-600 text-xl font-bold">✓</div>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={submitExperiment}
            disabled={selectedCupIds.length !== CUPS_TO_SELECT}
            className={`px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all
              ${selectedCupIds.length === CUPS_TO_SELECT 
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-bounce' 
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'}`}
          >
            完成挑選，看結果！(Submit)
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mt-4">
        <p className="text-sm text-blue-900">
          <strong>💡 組合數學 (Combinatorics)：</strong> 從 8 杯中挑選 4 杯，總共有 <code className="bg-blue-100 px-1 rounded">C(8,4) = 70</code> 種可能的組合。如果女士是在瞎猜，她選中任何一種組合的機率都是 1/70。
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => {
    // 互動圖表的當前資料
    const currentInteractiveData = PROBABILITY_TABLE.find(row => row.correct === interactiveCount);
    const isInteractiveSignificant = currentInteractiveData.p <= SIGNIFICANCE_LEVEL;
    
    // 玩家實際結果的資料
    const actualResultData = PROBABILITY_TABLE.find(row => row.correct === experimentResult);
    const isActualSignificant = actualResultData.p <= SIGNIFICANCE_LEVEL;

    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-amber-900 border-b-2 border-amber-200 pb-2">
          第四幕：決策邊界與 P 值 (P-value & Decision Making)
        </h2>
        
        <div className="bg-stone-100 p-6 rounded-xl border border-stone-300 text-center shadow-inner">
          <h3 className="text-xl text-stone-600 mb-2">你的品茶結果揭曉：</h3>
          <div className="text-4xl font-black text-amber-700 mb-2">
            答對了 {experimentResult} 杯！
          </div>
          <p className="text-lg text-stone-600">
            你成功找出了 {experimentResult} 杯真正「先加奶」的茶。
          </p>
        </div>

        <p className="text-lg text-stone-700 mt-4">
          現在，讓我們回到最初的<strong>虛無假說 ($H_0$)：假設你完全是瞎猜的</strong>。
          在瞎猜的前提下，讓我們透過下方互動圖表看看不同結果發生的機率：
        </p>

        {/* 互動式圖表區塊 */}
        <div className="bg-white p-6 rounded-xl border-2 border-amber-200 shadow-md my-6">
          <h3 className="text-xl font-bold text-amber-900 mb-6 text-center flex items-center justify-center gap-2">
            <span>📊</span> 互動機率分佈圖 (Interactive Probability Distribution)
          </h3>
          
          {/* 長條圖 */}
          <div className="flex justify-around items-end h-48 border-b-2 border-stone-300 pb-2 mb-6">
            {[0, 1, 2, 3, 4].map(num => {
              const rowData = PROBABILITY_TABLE.find(r => r.correct === num);
              const heightPercent = (rowData.p / (36/70)) * 100; // 36/70 是最大的機率值
              const isSelected = num === interactiveCount;
              return (
                <div 
                  key={num} 
                  className="flex flex-col items-center w-1/6 cursor-pointer group"
                  onClick={() => setInteractiveCount(num)}
                >
                  <span className={`text-sm mb-2 transition-colors ${isSelected ? 'font-bold text-amber-700' : 'text-stone-400 group-hover:text-amber-500'}`}>
                    {(rowData.p * 100).toFixed(1)}%
                  </span>
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${isSelected ? 'bg-amber-500 shadow-lg' : 'bg-stone-200 group-hover:bg-amber-300'}`}
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  <span className={`mt-3 font-medium ${isSelected ? 'text-amber-900' : 'text-stone-500'}`}>{num} 杯</span>
                </div>
              );
            })}
          </div>

          {/* 滑桿 Slider */}
          <div className="px-4 mb-8">
            <input
              type="range"
              min="0"
              max="4"
              value={interactiveCount}
              onChange={(e) => setInteractiveCount(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>

          {/* 動態解說 */}
          <div className={`p-4 rounded-lg border-2 transition-colors ${isInteractiveSignificant ? 'bg-green-50 border-green-400 text-green-900' : 'bg-stone-50 border-stone-300 text-stone-700'}`}>
            <div className="font-bold text-lg mb-2">當答對 {interactiveCount} 杯時：</div>
            <p className="mb-2">這在隨機瞎猜的假設下，發生的機率為 <strong>{(currentInteractiveData.p).toFixed(3)}</strong> (即 {(currentInteractiveData.p * 100).toFixed(1)}%)。</p>
            
            {/* 增加的計算算式區塊 */}
            <div className="mt-4 mb-4 p-4 bg-white/60 rounded-md border border-stone-300/50 text-stone-800 text-sm">
              <div className="font-bold mb-2 flex items-center gap-2">
                <span>🧮</span> 機率計算過程 (超幾何分配 Hypergeometric Distribution)：
              </div>
              <ul className="list-disc list-inside space-y-2 ml-1 text-stone-600">
                <li>
                  <strong>總組合數 (分母)：</strong>從 8 杯中選 4 杯 = <code className="bg-white px-2 py-0.5 rounded border border-stone-200 shadow-sm text-amber-900">C(8,4) = 70</code>
                </li>
                <li>
                  <strong>符合的組合數 (分子)：</strong>選對 {interactiveCount} 杯「先加奶」，以及選錯 {4 - interactiveCount} 杯「先加茶」 = <code className="bg-white px-2 py-0.5 rounded border border-stone-200 shadow-sm text-amber-900">{currentInteractiveData.formula} = {currentInteractiveData.ways}</code>
                </li>
              </ul>
              <div className="mt-3 pt-2 border-t border-stone-300/50 font-mono text-base font-bold text-amber-800 text-center bg-white rounded shadow-sm py-2">
                P = {currentInteractiveData.ways} / 70 ≈ {(currentInteractiveData.p).toFixed(3)}
              </div>
            </div>

            <p>
              {isInteractiveSignificant 
                ? `✅ 由於機率 <= 0.05 (顯著水準)，這是一個「罕見事件」。我們有足夠的證據拒絕瞎猜假設，承認品茶能力！` 
                : `❌ 由於機率 > 0.05 (顯著水準)，這個結果在瞎猜下很常見。我們無法拒絕瞎猜的假設。`}
            </p>
          </div>
        </div>

        <div className={`p-6 rounded-xl border-2 mt-6 shadow-md ${isActualSignificant ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <h3 className="font-bold text-xl mb-4 flex items-center">
            {isActualSignificant ? '🔬 針對你的實驗結果：具備統計顯著性 (Statistically Significant)' : '🎲 針對你的實驗結果：缺乏證據 (Not Significant)'}
          </h3>
          <p className="text-lg leading-relaxed">
            你實際答對了 {experimentResult} 杯，機率為 {(actualResultData.p).toFixed(3)}。
          </p>
          <div className="mt-4 p-4 bg-white/60 rounded-lg">
            <strong className="text-lg">結論：</strong>
            {isActualSignificant ? (
              <span className="text-green-800 ml-2">我們有足夠的證據 <strong>拒絕虛無假說 (Reject H₀)</strong>！你真的具備品茶的能力！</span>
            ) : (
              <span className="text-red-800 ml-2">我們 <strong>無法拒絕虛無假說 (Fail to reject H₀)</strong>。目前的數據無法證明你有品茶的能力，可能只是運氣。</span>
            )}
          </div>
        </div>

        {/* 補充說明：統計學的反直覺 */}
        <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500 mt-6 shadow-sm">
          <h4 className="font-bold text-blue-900 text-lg flex items-center gap-2 mb-2">
            <span>💡</span> 統計學的反直覺 (Statistical Counter-intuition)
          </h4>
          <p className="text-blue-800 leading-relaxed">
            值得注意的是，即使在 4 杯中 <strong>答對了 3 杯</strong>（高達 75% 的準確率！），從機率的角度來看，瞎猜猜中 3 杯的機率仍高達 <strong>22.9%</strong> (P-value ≈ 0.229)。因為它遠大於 0.05 的顯著水準，在嚴格的統計學標準下，我們 <strong>仍然無法證明</strong> 該名女士具備品茶能力。這告訴我們：直覺上的「高準確率」，不一定等於統計上的「證據確鑿」！
          </p>
        </div>

        {/* 進階觀念：超幾何分配 vs 二項式分配 */}
        <div className="bg-indigo-50 p-5 rounded-xl border-l-4 border-indigo-500 mt-6 shadow-sm">
          <h4 className="font-bold text-indigo-900 text-lg flex items-center gap-2 mb-3">
            <span>🎓</span> 進階觀念：為什麼是超幾何分配？而不是 (1/2)⁴？
          </h4>
          <div className="text-indigo-800 space-y-3 leading-relaxed">
            <p>
              許多初學統計的人會想：「既然每一杯只有『先加奶』或『先加茶』，猜對的機率是 1/2。那連續猜對 4 杯的機率，不就是 <strong>(1/2)⁴ = 1/16 = 0.0625</strong> 嗎？」這其實是誤用了<strong>二項式分配 (Binomial Distribution)</strong>。
            </p>
            <p>
              這忽略了 Fisher 實驗設計中的一個關鍵條件：他事先告訴了女士<strong>「桌上剛好有 4 杯先加奶、4 杯先加茶」</strong>。
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li><strong>二項式分配 (獨立事件)：</strong> 假設每次猜測互不影響（就像每次丟銅板，或者取後放回）。</li>
              <li><strong>超幾何分配 (Hypergeometric)：</strong> 在已知總數的母體中<strong>「取後不放回」</strong>。當女士挑出第一杯她認為是「先加奶」的茶後，剩下的名額變少了，每一次的選擇都會改變後續的機率！</li>
            </ul>
            <div className="bg-white/70 p-4 rounded-lg mt-3 font-mono text-sm border border-indigo-200 overflow-x-auto">
              <div className="mb-2 text-stone-500 line-through">
                ❌ 誤用二項式 (獨立猜測)：<br/>
                P(全對) = (1/2) × (1/2) × (1/2) × (1/2) = 1 / 16 = 0.0625
              </div>
              <div className="text-indigo-900 font-bold mt-3">
                ✅ 正確使用超幾何 (已知 4奶4茶 總數限制)：<br/>
                P(全對) = [ C(4,4) × C(4,0) ] / C(8,4) = 1 / 70 ≈ 0.0143
              </div>
            </div>
            <p className="text-sm mt-2 opacity-80 italic">
              這正是大名鼎鼎的「費雪精確檢定 (Fisher's Exact Test)」的數學基礎！
            </p>
          </div>
        </div>

        {/* 歷史軼事：女士最後到底猜對了沒？ */}
        <div className="bg-amber-50 p-5 rounded-xl border-l-4 border-amber-500 mt-6 shadow-sm">
          <h4 className="font-bold text-amber-900 text-lg flex items-center gap-2 mb-2">
            <span>📜</span> 歷史軼事：結局到底如何？ (Historical Anecdote)
          </h4>
          <p className="text-amber-800 leading-relaxed">
            費雪在 1935 年的著作中，其實並沒有告訴我們當時這位女同事到底猜對了幾杯。但根據費雪女兒後來的說法，這位女士（穆麗爾·布里斯托）當時 <strong>8 杯茶全答對了</strong>（Agresti 2002, p.92）！在僅有 1/70 (約 1.4%) 的瞎猜機率下，她用實力震驚了在場的科學菁英們，也為這場傳奇的下午茶畫下了完美的句點。
          </p>
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button 
            onClick={() => { setStep(1); initCups(); }}
            className="bg-stone-600 hover:bg-stone-700 text-white px-6 py-2 rounded shadow transition-colors font-medium"
          >
            🔄 重新開始故事
          </button>
          <button 
            onClick={() => { setStep(3); initCups(); }}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded shadow transition-colors font-medium"
          >
            ☕ 再試喝一次
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] font-sans text-stone-800 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-amber-900 mb-4 tracking-tight">
            ☕ 女士品茶
            <span className="block text-2xl md:text-3xl font-medium text-amber-700 mt-2">
              假設檢定的誕生 (The Birth of Hypothesis Testing)
            </span>
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto">
            一場 1920 年代的下午茶，如何催生出現代科學實驗的黃金標準？
            跟隨統計學之父 Ronald Fisher 的腳步，親自體驗這場經典實驗。
          </p>
        </header>

        {/* Progress Tracker */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-stone-300 -z-10"></div>
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-colors duration-300
                ${step === s ? 'bg-amber-600 border-amber-200 text-white scale-110 shadow-lg' : 
                  step > s ? 'bg-amber-700 border-amber-700 text-white' : 'bg-stone-200 border-stone-300 text-stone-500'}`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <main className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-stone-200">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </main>

        {/* Footer info */}
        <footer className="mt-12 text-center text-stone-400 text-sm">
          <p>這場實驗確立了隨機對照實驗 (Randomized Controlled Trial) 與機率論在科學驗證中的地位。</p>
          <p className="mt-1">Designed for Statistics & Data Science Education</p>
        </footer>

      </div>
    </div>
  );
}