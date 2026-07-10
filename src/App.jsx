import React, { useEffect, useMemo, useState } from 'react';

const TOTAL_CUPS = 8;
const CUPS_PER_TYPE = 4;
const CUPS_TO_SELECT = 4;
const SIGNIFICANCE_LEVEL = 0.05;

const combination = (n, k) => {
  if (k < 0 || k > n) return 0;
  const smallerK = Math.min(k, n - k);
  let result = 1;

  for (let i = 1; i <= smallerK; i += 1) {
    result = (result * (n - smallerK + i)) / i;
  }

  return Math.round(result);
};

const buildProbabilityTable = (cupsPerType = CUPS_PER_TYPE) => {
  const denominator = combination(cupsPerType * 2, cupsPerType);

  return Array.from({ length: cupsPerType + 1 }, (_, correct) => {
    const ways =
      combination(cupsPerType, correct) *
      combination(cupsPerType, cupsPerType - correct);

    return {
      correct,
      ways,
      probability: ways / denominator,
      formula: `C(${cupsPerType},${correct}) × C(${cupsPerType},${
        cupsPerType - correct
      })`,
    };
  });
};

const PROBABILITY_TABLE = buildProbabilityTable();

const getPointProbability = (correct, table = PROBABILITY_TABLE) =>
  table.find((row) => row.correct === correct)?.probability ?? 0;

// 單尾檢定：H1 是「正確辨別能力優於隨機猜測」，因此累加 X >= x_obs。
const getOneSidedPValue = (observedCorrect, table = PROBABILITY_TABLE) =>
  table
    .filter((row) => row.correct >= observedCorrect)
    .reduce((sum, row) => sum + row.probability, 0);

const formatProbability = (value, digits = 4) => value.toFixed(digits);
const formatPercent = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

const shuffle = (items) => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const createRandomizedCups = () =>
  shuffle([
    ...Array.from({ length: CUPS_PER_TYPE }, (_, index) => ({
      id: `milk-${index + 1}`,
      type: 'MilkFirst',
    })),
    ...Array.from({ length: CUPS_PER_TYPE }, (_, index) => ({
      id: `tea-${index + 1}`,
      type: 'TeaFirst',
    })),
  ]);

const drawFromNullExperiment = () =>
  shuffle([
    ...Array(CUPS_PER_TYPE).fill(1),
    ...Array(CUPS_PER_TYPE).fill(0),
  ])
    .slice(0, CUPS_TO_SELECT)
    .reduce((sum, isMilkFirst) => sum + isMilkFirst, 0);

function HypothesisLabel({ subscript }) {
  return (
    <span className="font-serif italic">
      H<sub>{subscript}</sub>
    </span>
  );
}

export default function LadyTastingTea() {
  const [step, setStep] = useState(1);
  const [hypothesisChoice, setHypothesisChoice] = useState(null);
  const [cups, setCups] = useState([]);
  const [selectedCupIds, setSelectedCupIds] = useState([]);
  const [experimentResult, setExperimentResult] = useState(null);
  const [interactiveCount, setInteractiveCount] = useState(4);
  const [simulation, setSimulation] = useState(null);
  const [designCupsPerType, setDesignCupsPerType] = useState(4);

  const initializeExperiment = () => {
    setCups(createRandomizedCups());
    setSelectedCupIds([]);
    setExperimentResult(null);
    setInteractiveCount(4);
    setSimulation(null);
  };

  useEffect(() => {
    initializeExperiment();
  }, []);

  const toggleCupSelection = (id) => {
    setSelectedCupIds((currentSelection) => {
      if (currentSelection.includes(id)) {
        return currentSelection.filter((cupId) => cupId !== id);
      }

      if (currentSelection.length >= CUPS_TO_SELECT) {
        return currentSelection;
      }

      return [...currentSelection, id];
    });
  };

  const submitExperiment = () => {
    if (selectedCupIds.length !== CUPS_TO_SELECT) return;

    const correctlySelectedMilkFirst = cups.filter(
      (cup) =>
        selectedCupIds.includes(cup.id) && cup.type === 'MilkFirst',
    ).length;

    setExperimentResult(correctlySelectedMilkFirst);
    setInteractiveCount(correctlySelectedMilkFirst);
    setStep(4);
  };

  const runNullSimulation = (runs) => {
    const counts = Array(CUPS_PER_TYPE + 1).fill(0);

    for (let i = 0; i < runs; i += 1) {
      counts[drawFromNullExperiment()] += 1;
    }

    setSimulation({ runs, counts });
  };

  const restartStory = () => {
    setStep(1);
    setHypothesisChoice(null);
    initializeExperiment();
  };

  const repeatExperiment = () => {
    initializeExperiment();
    setStep(3);
  };

  const designInfo = useMemo(() => {
    const table = buildProbabilityTable(designCupsPerType);
    const criticalRow = table.find(
      (row) =>
        getOneSidedPValue(row.correct, table) <= SIGNIFICANCE_LEVEL + 1e-12,
    );

    return {
      table,
      criticalCorrect: criticalRow?.correct ?? null,
      actualAlpha:
        criticalRow === undefined
          ? 0
          : getOneSidedPValue(criticalRow.correct, table),
    };
  }, [designCupsPerType]);

  const renderStep1 = () => (
    <section className="space-y-6 animate-fade-in" aria-labelledby="step-1-title">
      <h2
        id="step-1-title"
        className="border-b-2 border-amber-200 pb-2 text-2xl font-bold text-amber-900"
      >
        第一幕：劍橋的午後
        <span className="ml-2 text-base font-medium text-amber-700">
          A Summer Afternoon in Cambridge
        </span>
      </h2>

      <p className="text-lg leading-relaxed text-stone-700">
        時間回到 1920 年代後期，英國劍橋的一場下午茶。藻類學家{' '}
        <strong>穆麗爾・布里斯托（Muriel Bristol）</strong>提出一項主張：
      </p>

      <blockquote className="rounded-r-lg border-l-4 border-amber-500 bg-amber-50 p-4 italic text-amber-900 shadow-sm">
        「把茶倒入奶中，和把奶倒入茶中，喝起來並不一樣；我可以分辨兩者。」
      </blockquote>

      <p className="text-lg leading-relaxed text-stone-700">
        有人對這項主張抱持懷疑。統計學家{' '}
        <strong>羅納德・費雪（Ronald A. Fisher）</strong>
        沒有只靠爭論決定誰對誰錯，而是把問題轉換成一個可以用資料檢驗的隨機化實驗。
      </p>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-blue-900">
        <h3 className="mb-2 font-bold">這個案例真正重要的地方</h3>
        <p className="leading-relaxed">
          它不只是計算「猜中的機率」，而是展示如何先定義研究問題、控制實驗條件、進行隨機化，最後才根據機率作出有限度的科學結論。
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="rounded-lg bg-amber-700 px-6 py-3 text-lg font-medium text-white shadow-md transition-colors hover:bg-amber-800 focus:outline-none focus:ring-4 focus:ring-amber-200"
        >
          進入第二幕：設立假說 →
        </button>
      </div>
    </section>
  );

  const renderStep2 = () => (
    <section className="space-y-6 animate-fade-in" aria-labelledby="step-2-title">
      <h2
        id="step-2-title"
        className="border-b-2 border-amber-200 pb-2 text-2xl font-bold text-amber-900"
      >
        第二幕：設立假說
        <span className="ml-2 text-base font-medium text-amber-700">
          Setting the Hypotheses
        </span>
      </h2>

      <p className="text-lg leading-relaxed text-stone-700">
        在看到實驗結果以前，我們必須先指定檢驗的基準。下列哪一項最適合作為這個實驗的虛無假說？
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setHypothesisChoice('A')}
          aria-pressed={hypothesisChoice === 'A'}
          className={`rounded-xl border-2 p-6 text-left transition-all focus:outline-none focus:ring-4 focus:ring-amber-200 ${
            hypothesisChoice === 'A'
              ? 'border-red-500 bg-red-50'
              : 'border-stone-300 hover:border-amber-500 hover:bg-amber-50'
          }`}
        >
          <h3 className="mb-2 text-xl font-bold text-stone-800">選項 A</h3>
          <p className="text-stone-600">女士確實能分辨兩種沖泡順序。</p>
        </button>

        <button
          type="button"
          onClick={() => setHypothesisChoice('B')}
          aria-pressed={hypothesisChoice === 'B'}
          className={`rounded-xl border-2 p-6 text-left transition-all focus:outline-none focus:ring-4 focus:ring-amber-200 ${
            hypothesisChoice === 'B'
              ? 'border-green-600 bg-green-50'
              : 'border-stone-300 hover:border-amber-500 hover:bg-amber-50'
          }`}
        >
          <h3 className="mb-2 text-xl font-bold text-stone-800">選項 B</h3>
          <p className="text-stone-600">
            女士的判斷與真實沖泡方式無關，沒有優於隨機猜測的正向辨別能力。
          </p>
        </button>
      </div>

      {hypothesisChoice && (
        <div
          className={`rounded-xl p-6 shadow-inner ${
            hypothesisChoice === 'B'
              ? 'bg-green-100 text-green-950'
              : 'bg-red-100 text-red-950'
          }`}
          role="status"
        >
          {hypothesisChoice === 'B' ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">答對了：選項 B 是檢驗的基準</h3>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-white/70 p-4">
                  <p className="mb-1 font-bold">
                    <HypothesisLabel subscript="0" />：虛無假說
                  </p>
                  <p>判斷與真實沖泡方式無關，結果來自隨機猜測。</p>
                </div>
                <div className="rounded-lg bg-white/70 p-4">
                  <p className="mb-1 font-bold">
                    <HypothesisLabel subscript="1" />：對立假說
                  </p>
                  <p>正確辨別能力優於隨機猜測。</p>
                </div>
              </div>

              <p className="leading-relaxed">
                這是一個<strong>單尾檢定</strong>，因為只有「較多正確分類」才支持
                <HypothesisLabel subscript="1" />。顯著水準也應在看見結果前設定；本教材採用{' '}
                <strong>α = 0.05</strong>。
              </p>

              <div className="flex flex-wrap justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-lg border border-green-800 px-5 py-2 font-medium hover:bg-white/60 focus:outline-none focus:ring-4 focus:ring-green-200"
                >
                  ← 上一步
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-lg bg-green-800 px-6 py-2 font-medium text-white shadow hover:bg-green-900 focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                  進入實驗設計 →
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="mb-2 text-xl font-bold">再想想看</h3>
              <p className="leading-relaxed">
                「女士確實能分辨」是我們想尋找證據支持的方向，比較適合作為對立假說。虛無假說必須提供一個可以計算隨機結果分配的基準。
              </p>
            </div>
          )}
        </div>
      )}

      {hypothesisChoice !== 'B' && (
        <button
          type="button"
          onClick={() => setStep(1)}
          className="rounded-lg border border-stone-400 px-5 py-2 font-medium text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-4 focus:ring-stone-200"
        >
          ← 上一步
        </button>
      )}
    </section>
  );

  const renderStep3 = () => (
    <section className="space-y-6 animate-fade-in" aria-labelledby="step-3-title">
      <h2
        id="step-3-title"
        className="border-b-2 border-amber-200 pb-2 text-2xl font-bold text-amber-900"
      >
        第三幕：實驗設計
        <span className="ml-2 text-base font-medium text-amber-700">
          Experimental Design
        </span>
      </h2>

      <p className="text-lg leading-relaxed text-stone-700">
        Fisher 準備 8 杯茶：4 杯先加奶、4 杯先加茶。他告訴女士這項資訊，並請她選出認為是「先加奶」的 4 杯。
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['隨機化', '以隨機順序呈現八杯茶，避免位置或順序形成系統性線索。'],
          ['盲化', '女士看不到沖泡過程，也不能從杯子標記得知答案。'],
          ['控制條件', '杯型、茶量、奶量、溫度與等待時間應盡可能一致。'],
          ['固定邊際', '真實類型與女士的分類都固定為 4 比 4，形成超幾何分配。'],
        ].map(([title, description]) => (
          <div key={title} className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-1 font-bold text-blue-950">{title}</h3>
            <p className="text-sm leading-relaxed text-blue-900">{description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-stone-800">
            換你來分類：挑出 4 杯你認為是「先加奶」的茶
          </h3>
          <span className="self-start rounded-full bg-amber-200 px-3 py-1 text-sm font-bold text-amber-950 sm:self-auto">
            已選 {selectedCupIds.length} / {CUPS_TO_SELECT}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {cups.map((cup, index) => {
            const isSelected = selectedCupIds.includes(cup.id);

            return (
              <button
                key={cup.id}
                type="button"
                onClick={() => toggleCupSelection(cup.id)}
                aria-pressed={isSelected}
                aria-label={`第 ${index + 1} 杯茶${
                  isSelected ? '，已選為先加奶' : '，尚未選取'
                }`}
                className={`relative flex h-28 flex-col items-center justify-center rounded-xl border-4 transition-all focus:outline-none focus:ring-4 focus:ring-amber-200 sm:h-32 ${
                  isSelected
                    ? 'scale-[1.03] border-amber-600 bg-amber-100 shadow-md'
                    : 'border-transparent bg-white shadow hover:bg-stone-100'
                }`}
              >
                <span className="mb-2 text-4xl" aria-hidden="true">
                  ☕
                </span>
                <span className="font-mono text-sm text-stone-600">Cup {index + 1}</span>
                {isSelected && (
                  <span
                    className="absolute right-2 top-2 text-xl font-bold text-amber-700"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="rounded-lg border border-stone-400 px-5 py-2 font-medium text-stone-700 hover:bg-white focus:outline-none focus:ring-4 focus:ring-stone-200"
          >
            ← 上一步
          </button>

          <button
            type="button"
            onClick={submitExperiment}
            disabled={selectedCupIds.length !== CUPS_TO_SELECT}
            className={`rounded-full px-8 py-3 text-lg font-bold shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-amber-200 ${
              selectedCupIds.length === CUPS_TO_SELECT
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'cursor-not-allowed bg-stone-300 text-stone-500'
            }`}
          >
            完成挑選，查看結果
          </button>
        </div>
      </div>

      <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 text-blue-950">
        <p className="leading-relaxed">
          <strong>組合數學：</strong>從 8 杯中指定 4 杯為「先加奶」，共有{' '}
          <code className="rounded bg-white px-2 py-1">C(8,4) = 70</code>{' '}
          種可能組合。在虛無假說下，每一種組合都同樣可能。
        </p>
      </div>
    </section>
  );

  const renderStep4 = () => {
    if (experimentResult === null) return null;

    const pointProbability = getPointProbability(interactiveCount);
    const interactivePValue = getOneSidedPValue(interactiveCount);
    const actualPointProbability = getPointProbability(experimentResult);
    const actualPValue = getOneSidedPValue(experimentResult);
    const isInteractiveSignificant = interactivePValue <= SIGNIFICANCE_LEVEL;
    const isActualSignificant = actualPValue <= SIGNIFICANCE_LEVEL;
    const totalCorrectClassifications = experimentResult * 2;
    const maxProbability = Math.max(
      ...PROBABILITY_TABLE.map((row) => row.probability),
    );

    return (
      <section className="space-y-7 animate-fade-in" aria-labelledby="step-4-title">
        <h2
          id="step-4-title"
          className="border-b-2 border-amber-200 pb-2 text-2xl font-bold text-amber-900"
        >
          第四幕：從結果到 p 值
          <span className="ml-2 text-base font-medium text-amber-700">
            From Results to the P-value
          </span>
        </h2>

        <div className="rounded-xl border border-stone-300 bg-stone-100 p-6 text-center shadow-inner">
          <h3 className="mb-2 text-xl text-stone-600">你的分類結果</h3>
          <p className="mb-2 text-4xl font-black text-amber-700">
            找對 {experimentResult} / 4 杯先加奶
          </p>
          <p className="text-lg text-stone-700">
            同時也正確排除 {experimentResult} / 4 杯先加茶，因此總共正確分類{' '}
            <strong>{totalCorrectClassifications} / {TOTAL_CUPS}</strong> 杯。
          </p>
        </div>

        <div className="rounded-xl border-2 border-amber-200 bg-white p-5 shadow-md sm:p-6">
          <h3 className="mb-2 text-center text-xl font-bold text-amber-950">
            超幾何機率分配
          </h3>
          <p className="mb-6 text-center text-sm leading-relaxed text-stone-600">
            點選長條或移動滑桿。橘色是觀察值，右側藍色長條是更支持
            <HypothesisLabel subscript="1" /> 的結果；橘色加藍色長條的總機率才是單尾 p 值。
          </p>

          <div className="flex h-56 items-end justify-around border-b-2 border-stone-300 pb-2">
            {PROBABILITY_TABLE.map((row) => {
              const heightPercent = (row.probability / maxProbability) * 100;
              const isObserved = row.correct === interactiveCount;
              const isInTail = row.correct >= interactiveCount;

              return (
                <button
                  key={row.correct}
                  type="button"
                  onClick={() => setInteractiveCount(row.correct)}
                  aria-pressed={isObserved}
                  aria-label={`找對 ${row.correct} 杯，機率 ${formatPercent(
                    row.probability,
                  )}`}
                  className="group flex h-full w-[17%] flex-col items-center justify-end focus:outline-none focus:ring-4 focus:ring-amber-200"
                >
                  <span
                    className={`mb-2 text-xs sm:text-sm ${
                      isObserved
                        ? 'font-bold text-amber-800'
                        : isInTail
                          ? 'font-semibold text-blue-700'
                          : 'text-stone-500'
                    }`}
                  >
                    {formatPercent(row.probability)}
                  </span>
                  <span
                    className={`block min-h-1 w-full rounded-t-md transition-all duration-300 ${
                      isObserved
                        ? 'bg-amber-500 shadow-lg'
                        : isInTail
                          ? 'bg-blue-500'
                          : 'bg-stone-200 group-hover:bg-stone-300'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                    aria-hidden="true"
                  />
                  <span
                    className={`mt-3 text-sm font-medium sm:text-base ${
                      isObserved ? 'text-amber-950' : 'text-stone-600'
                    }`}
                  >
                    {row.correct} 杯
                  </span>
                </button>
              );
            })}
          </div>

          <div className="px-2 pb-2 pt-7">
            <label htmlFor="correct-count-slider" className="sr-only">
              選擇找對的先加奶杯數
            </label>
            <input
              id="correct-count-slider"
              type="range"
              min="0"
              max="4"
              step="1"
              value={interactiveCount}
              onChange={(event) => setInteractiveCount(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-amber-600"
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-stone-300 bg-stone-50 p-4">
              <h4 className="mb-2 font-bold text-stone-900">① 恰好發生的機率</h4>
              <p className="text-sm leading-relaxed text-stone-700">
                <span className="font-serif italic">P</span>(X = {interactiveCount}) ={' '}
                <strong>{formatProbability(pointProbability)}</strong> ={' '}
                <strong>{formatPercent(pointProbability)}</strong>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-stone-500">
                這只是單一長條的高度，不一定是 p 值。
              </p>
            </div>

            <div className="rounded-lg border border-blue-300 bg-blue-50 p-4">
              <h4 className="mb-2 font-bold text-blue-950">② 單尾 p 值</h4>
              <p className="text-sm leading-relaxed text-blue-900">
                <span className="font-serif italic">P</span>(X ≥ {interactiveCount} |{' '}
                <HypothesisLabel subscript="0" />) ={' '}
                <strong>{formatProbability(interactivePValue)}</strong> ={' '}
                <strong>{formatPercent(interactivePValue)}</strong>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-blue-800">
                這是橘色觀察值加上其右側所有更極端結果的總機率。
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-stone-300 bg-white p-4 text-sm text-stone-700">
            <p className="mb-2 font-bold text-stone-900">超幾何分配的單點機率</p>
            <div className="overflow-x-auto rounded bg-stone-50 px-3 py-3 text-center font-mono text-sm sm:text-base">
              P(X = {interactiveCount}) = [{
                PROBABILITY_TABLE.find((row) => row.correct === interactiveCount)
                  ?.formula
              }] / C(8,4)
              <br />= {
                PROBABILITY_TABLE.find((row) => row.correct === interactiveCount)
                  ?.ways
              } / 70 = {formatProbability(pointProbability)}
            </div>
          </div>

          <div
            className={`mt-4 rounded-lg border-2 p-4 ${
              isInteractiveSignificant
                ? 'border-green-500 bg-green-50 text-green-950'
                : 'border-stone-300 bg-stone-50 text-stone-800'
            }`}
          >
            <p className="font-bold">
              當 X = {interactiveCount} 時：p ={' '}
              {formatProbability(interactivePValue)}{' '}
              {isInteractiveSignificant ? '≤' : '>'} α = 0.05
            </p>
            <p className="mt-2 leading-relaxed">
              {isInteractiveSignificant
                ? '這個結果落在單尾拒絕域中，可以拒絕虛無假說。'
                : '這個結果沒有落在單尾拒絕域中，無法拒絕虛無假說。'}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-300 bg-indigo-50 p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-xl font-bold text-indigo-950">
            動態 2 × 2 列聯表
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse bg-white text-center text-sm sm:text-base">
              <caption className="mb-3 text-left text-sm leading-relaxed text-indigo-900">
                列與欄的合計都固定為 4，這正是超幾何分配與 Fisher 精確檢定的連結。
              </caption>
              <thead>
                <tr className="bg-indigo-100">
                  <th className="border border-indigo-200 p-3 text-left">真實沖泡方式</th>
                  <th className="border border-indigo-200 p-3">判斷先加奶</th>
                  <th className="border border-indigo-200 p-3">判斷先加茶</th>
                  <th className="border border-indigo-200 p-3">合計</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="border border-indigo-200 p-3 text-left">實際先加奶</th>
                  <td className="border border-indigo-200 bg-amber-50 p-3 font-bold">
                    {interactiveCount}
                  </td>
                  <td className="border border-indigo-200 p-3">
                    {CUPS_PER_TYPE - interactiveCount}
                  </td>
                  <td className="border border-indigo-200 p-3 font-bold">4</td>
                </tr>
                <tr>
                  <th className="border border-indigo-200 p-3 text-left">實際先加茶</th>
                  <td className="border border-indigo-200 p-3">
                    {CUPS_PER_TYPE - interactiveCount}
                  </td>
                  <td className="border border-indigo-200 bg-amber-50 p-3 font-bold">
                    {interactiveCount}
                  </td>
                  <td className="border border-indigo-200 p-3 font-bold">4</td>
                </tr>
                <tr className="bg-indigo-100">
                  <th className="border border-indigo-200 p-3 text-left">合計</th>
                  <td className="border border-indigo-200 p-3 font-bold">4</td>
                  <td className="border border-indigo-200 p-3 font-bold">4</td>
                  <td className="border border-indigo-200 p-3 font-bold">8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={`rounded-xl border-2 p-6 shadow-md ${
            isActualSignificant
              ? 'border-green-500 bg-green-50'
              : 'border-amber-500 bg-amber-50'
          }`}
        >
          <h3 className="mb-4 text-xl font-bold text-stone-950">
            針對你的實驗結果
          </h3>
          <div className="grid gap-3 text-sm sm:grid-cols-2 sm:text-base">
            <p className="rounded-lg bg-white/70 p-3">
              恰好出現這個結果的機率：
              <strong>{formatProbability(actualPointProbability)}</strong>
            </p>
            <p className="rounded-lg bg-white/70 p-3">
              單尾 p 值：<strong>{formatProbability(actualPValue)}</strong>
            </p>
          </div>
          <p className="mt-4 text-lg leading-relaxed">
            {isActualSignificant ? (
              <>
                因為 p ≤ 0.05，我們<strong>拒絕虛無假說</strong>。這份結果提供支持正向辨別能力的統計證據；但它不是「能力必然存在」的數學證明，也沒有直接告訴我們能力有多強。
              </>
            ) : (
              <>
                因為 p &gt; 0.05，我們<strong>無法拒絕虛無假說</strong>。目前資料不足以排除隨機猜測，但這不等於證明你完全沒有辨別能力；樣本數太小也可能使檢定難以偵測真實能力。
              </>
            )}
          </p>
        </div>

        <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-5 shadow-sm">
          <h3 className="mb-2 text-lg font-bold text-blue-950">
            為什麼找對 3 杯仍不顯著？
          </h3>
          <p className="leading-relaxed text-blue-900">
            找對 3/4 杯先加奶，等價於正確分類 6/8 杯。恰好出現這個結果的機率是{' '}
            <strong>16/70 = 22.9%</strong>；但 p 值還要納入更極端的全對結果，因此是{' '}
            <strong>(16 + 1)/70 = 24.3%</strong>。高達 75% 的表面準確率，仍不足以在這個小樣本中形成強證據。
          </p>
        </div>

        <div className="rounded-xl border-l-4 border-violet-500 bg-violet-50 p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-violet-950">
            為什麼是超幾何分配，而不是 (1/2)⁴？
          </h3>
          <div className="space-y-3 leading-relaxed text-violet-900">
            <p>
              關鍵不只是「每杯有兩種類型」，而是實驗同時固定了兩個邊際：桌上恰好有 4 杯先加奶，女士也必須恰好選出 4 杯。因此 70 種四杯組合才是虛無假說下的等可能樣本空間。
            </p>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-lg bg-white/70 p-4">
                <strong>二項分配：</strong>每杯獨立作答，而且不限制最後必須各選四杯。
              </div>
              <div className="rounded-lg bg-white/70 p-4">
                <strong>超幾何分配：</strong>已知總數固定，並在固定名額下進行不放回分類。
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-cyan-300 bg-cyan-50 p-5 shadow-sm sm:p-6">
          <h3 className="mb-2 text-xl font-bold text-cyan-950">
            用模擬驗證理論分配
          </h3>
          <p className="mb-4 leading-relaxed text-cyan-900">
            假設女士完全隨機猜測，讓電腦重複實驗。次數愈多，模擬比例通常愈接近理論機率。
          </p>

          <div className="mb-5 flex flex-wrap gap-3">
            {[100, 1000, 10000].map((runs) => (
              <button
                key={runs}
                type="button"
                onClick={() => runNullSimulation(runs)}
                className="rounded-lg bg-cyan-800 px-4 py-2 font-medium text-white hover:bg-cyan-900 focus:outline-none focus:ring-4 focus:ring-cyan-200"
              >
                模擬 {runs.toLocaleString()} 次
              </button>
            ))}
          </div>

          {simulation ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] border-collapse bg-white text-center text-sm">
                <thead>
                  <tr className="bg-cyan-100">
                    <th className="border border-cyan-200 p-3 text-left">找對杯數</th>
                    {PROBABILITY_TABLE.map((row) => (
                      <th key={row.correct} className="border border-cyan-200 p-3">
                        {row.correct}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="border border-cyan-200 p-3 text-left">理論機率</th>
                    {PROBABILITY_TABLE.map((row) => (
                      <td key={row.correct} className="border border-cyan-200 p-3">
                        {formatPercent(row.probability)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="border border-cyan-200 p-3 text-left">
                      模擬比例
                      <span className="block text-xs font-normal text-cyan-800">
                        n = {simulation.runs.toLocaleString()}
                      </span>
                    </th>
                    {simulation.counts.map((count, index) => (
                      <td key={index} className="border border-cyan-200 p-3 font-bold">
                        {formatPercent(count / simulation.runs)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-lg bg-white/70 p-4 text-sm text-cyan-900">
              選擇模擬次數後，這裡會比較理論機率與模擬比例。
            </p>
          )}
        </div>

        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-5 shadow-sm sm:p-6">
          <h3 className="mb-2 text-xl font-bold text-emerald-950">
            樣本數與離散檢定設計器
          </h3>
          <p className="mb-5 leading-relaxed text-emerald-900">
            調整每種類型的杯數。系統會尋找在單尾 α = 0.05 下，最少需要找對幾杯才能拒絕虛無假說。
          </p>

          <label htmlFor="sample-size-slider" className="mb-2 block font-bold text-emerald-950">
            每種類型 {designCupsPerType} 杯；總杯數 {designCupsPerType * 2} 杯
          </label>
          <input
            id="sample-size-slider"
            type="range"
            min="2"
            max="8"
            step="1"
            value={designCupsPerType}
            onChange={(event) => setDesignCupsPerType(Number(event.target.value))}
            className="mb-5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-emerald-200 accent-emerald-700"
          />

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-white/75 p-4">
              <p className="text-sm text-emerald-800">等可能組合數</p>
              <p className="mt-1 text-2xl font-bold text-emerald-950">
                {combination(designCupsPerType * 2, designCupsPerType).toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-white/75 p-4">
              <p className="text-sm text-emerald-800">單尾拒絕域</p>
              <p className="mt-1 text-lg font-bold text-emerald-950">
                {designInfo.criticalCorrect === null
                  ? '沒有可行的拒絕域'
                  : `X ≥ ${designInfo.criticalCorrect}`}
              </p>
            </div>
            <div className="rounded-lg bg-white/75 p-4">
              <p className="text-sm text-emerald-800">實際第一類錯誤率</p>
              <p className="mt-1 text-2xl font-bold text-emerald-950">
                {formatPercent(designInfo.actualAlpha, 2)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-emerald-900">
            原始的 4 + 4 設計只有 X = 4 時能拒絕，因此名目 α 雖然是 5%，實際第一類錯誤率只有 1/70 = 1.43%。精確檢定的結果是離散的，所以實際 α 通常不會剛好等於名目水準。
          </p>
        </div>

        <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-5 shadow-sm">
          <h3 className="mb-2 text-lg font-bold text-amber-950">歷史軼事：結局到底如何？ (Historical Anecdote)</h3>
          <p className="leading-relaxed text-amber-900">
            費雪在 1935 年的著作中，其實並沒有告訴我們當時這位女同事到底猜對了幾杯。但根據費雪女兒後來的說法，這位女士（穆麗爾·布里斯托）當時 8 杯茶全答對了（Agresti 2002, p.92）！在僅有 1/70 (約 1.4%) 的瞎猜機率下，她用實力震驚了在場的科學菁英們，也為這場傳奇的下午茶畫下了完美的句點。
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={restartStory}
            className="rounded-lg bg-stone-700 px-6 py-3 font-medium text-white shadow hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-300"
          >
            ↻ 重新開始故事
          </button>
          <button
            type="button"
            onClick={repeatExperiment}
            className="rounded-lg bg-amber-600 px-6 py-3 font-medium text-white shadow hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-200"
          >
            ☕ 再進行一次實驗
          </button>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] px-4 py-8 font-sans text-stone-800 md:px-8 md:py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-9 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-amber-950 md:text-5xl">
            <span aria-hidden="true">☕ </span>女士品茶
            <span className="mt-2 block text-2xl font-medium text-amber-700 md:text-3xl">
              假設檢定、隨機化與精確推論的經典案例
            </span>
          </h1>
          <p className="mx-auto max-w-3xl leading-relaxed text-stone-600">
            從一場 1920 年代的下午茶出發，親自探索虛無假說、超幾何分配、p 值、Fisher 精確檢定與實驗設計。
          </p>
        </header>

        <nav aria-label="教材進度" className="relative mb-8">
          <div
            className="absolute left-0 top-1/2 -z-0 h-1 w-full -translate-y-1/2 bg-stone-300"
            aria-hidden="true"
          />
          <ol className="relative z-10 flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <li key={stepNumber}>
                <span
                  aria-current={step === stepNumber ? 'step' : undefined}
                  aria-label={`第 ${stepNumber} 步${
                    step === stepNumber ? '，目前步驟' : ''
                  }`}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-4 text-lg font-bold transition-colors ${
                    step === stepNumber
                      ? 'scale-110 border-amber-200 bg-amber-600 text-white shadow-lg'
                      : step > stepNumber
                        ? 'border-amber-700 bg-amber-700 text-white'
                        : 'border-stone-300 bg-stone-100 text-stone-600'
                  }`}
                >
                  {stepNumber}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        <main className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xl sm:p-8 md:p-10">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </main>

        <footer className="mt-10 text-center text-sm leading-relaxed text-stone-500">
          <p>
            這個經典案例展示了隨機化、控制、固定邊際與精確機率推論如何共同構成一項可檢驗的實驗。
          </p>
          <p className="mt-1">Designed for Statistics, Econometrics & Data Science Education</p>
        </footer>
      </div>
    </div>
  );
}