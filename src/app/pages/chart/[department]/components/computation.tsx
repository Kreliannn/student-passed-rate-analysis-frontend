import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

interface DataPoint {
    gradeLevel: string;
    sem: number;
    batch: string;
    courseCode: string;
    totalEnrolled: number;
    passed: number;
}

interface ChartDataPoint {
    gradeLevel: string;
    sem: number;
    batch: string;
    courseCode: string;
    totalEnrolled: number;
    passed: number;
    proportion: number;
    failed: number;
    displayLabel: string;
    CL: number;
    UCL1: number;
    UCL2: number;
    UCL3: number;
    LCL1: number;
    LCL2: number;
    LCL3: number;
    sigma: number;
}

interface PChartComputationProps {
    data: DataPoint[];
    CL: number;
    sigma: number;
    chartData: ChartDataPoint[];
}

const PChartComputation: React.FC<PChartComputationProps> = ({ data, CL, sigma, chartData }) => {
  // Debug logging
  console.log('PChartComputation Debug:', {
    dataLength: data?.length || 0,
    data: data,
    CL: CL,
    sigma: sigma,
    chartDataLength: chartData?.length || 0
  });

  // Safety checks
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] bg-stone-50 p-6 flex items-center justify-center">
        <p className="text-gray-500">No data available for computation display</p>
      </div>
    );
  }

  // Calculate values for display
  const totalFailed = data.reduce((sum, item) => sum + (item.totalEnrolled - item.passed), 0);
  const totalEnrolled = data.reduce((sum, item) => sum + item.totalEnrolled, 0);
  const fixedN = totalEnrolled;

  console.log('Calculated values:', {
    totalFailed,
    totalEnrolled,
    fixedN,
    calculatedCL: totalFailed / totalEnrolled,
    passedCL: CL
  });

  // Get UCL/LCL values from first data point (they're all the same since we use fixed n)
  // If chartData is empty or values are 0, calculate them directly
  const actualCL = CL || (totalFailed / totalEnrolled);
  const actualSigma = sigma || Math.sqrt((actualCL * (1 - actualCL)) / fixedN);
  
  const UCL1 = chartData[0]?.UCL1 || Math.min(1, actualCL + 1 * actualSigma);
  const UCL2 = chartData[0]?.UCL2 || Math.min(1, actualCL + 2 * actualSigma);
  const UCL3 = chartData[0]?.UCL3 || Math.min(1, actualCL + 3 * actualSigma);
  const LCL1 = chartData[0]?.LCL1 || Math.max(0, actualCL - 1 * actualSigma);
  const LCL2 = chartData[0]?.LCL2 || Math.max(0, actualCL - 2 * actualSigma);
  const LCL3 = chartData[0]?.LCL3 || Math.max(0, actualCL - 3 * actualSigma);

  // Use actual calculated values for display
  const displayCL = actualCL;
  const displaySigma = actualSigma;

  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"]
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"]
      ]
    }
  };

  return (
    <MathJaxContext config={config}>
      <div className="h-[880px] bg-stone-50 p-6 overflow-y-auto">
        <h3 className="text-lg font-bold mb-4 text-center text-gray-800">
          P-Chart Statistical Computation Steps
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          
          {/* Left Column - Basic Calculations */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-blue-700 mb-2">Step 1: Calculate Total Values</h4>
              
              <div className="mb-2">
                <MathJax>
                  {`$$\\text{Total Failed} = \\sum_{i=1}^{k} \\text{Failed}_i$$`}
                </MathJax>
                <MathJax>
                  {`$$= ${data.map(item => item.totalEnrolled - item.passed).join(' + ')} = ${totalFailed}$$`}
                </MathJax>
              </div>

              <div className="mb-2">
                <MathJax>
                  {`$$\\text{Total Enrolled} = \\sum_{i=1}^{k} n_i$$`}
                </MathJax>
                <MathJax>
                  {`$$= ${data.map(item => item.totalEnrolled).join(' + ')} = ${totalEnrolled}$$`}
                </MathJax>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-green-700 mb-2">Step 2: Calculate Center Line (CL)</h4>
              
              <MathJax>
                {`$$\\bar{p} = \\frac{\\text{Total Failed}}{\\text{Total Enrolled}}$$`}
              </MathJax>
              <MathJax>
                {`$\\bar{p} = \\frac{${totalFailed}}{${totalEnrolled}} = ${displayCL.toFixed(4)}$`}
              </MathJax>
              <MathJax>
                {`$\\text{CL} = ${(displayCL * 100).toFixed(2)}\\%$`}
              </MathJax>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-purple-700 mb-2">Step 3: Calculate Standard Deviation (σ)</h4>
              
              <MathJax>
                {`$\\sigma = \\sqrt{\\frac{\\bar{p}(1-\\bar{p})}{n}}$`}
              </MathJax>
              <MathJax>
                {`$\\sigma = \\sqrt{\\frac{${displayCL.toFixed(4)} \\times (1-${displayCL.toFixed(4)})}{${fixedN}}}$`}
              </MathJax>
              <MathJax>
                {`$\\sigma = \\sqrt{\\frac{${displayCL.toFixed(4)} \\times ${(1-displayCL).toFixed(4)}}{${fixedN}}}$`}
              </MathJax>
              <MathJax>
                {`$\\sigma = \\sqrt{\\frac{${(displayCL * (1-displayCL)).toFixed(6)}}{${fixedN}}} = ${displaySigma.toFixed(6)}$`}
              </MathJax>
              <MathJax>
                {`$\\sigma = ${(displaySigma * 100).toFixed(3)}\\%$`}
              </MathJax>
            </div>
          </div>

          {/* Right Column - Control Limits */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-red-700 mb-2">Step 4: Calculate Upper Control Limits (UCL)</h4>
              
              <div className="mb-2">
                <MathJax>
                  {`$\\text{UCL}_{+1\\sigma} = \\bar{p} + 1\\sigma$`}
                </MathJax>
                <MathJax>
                  {`$= ${displayCL.toFixed(4)} + ${displaySigma.toFixed(6)} = ${(displayCL + displaySigma).toFixed(6)}$`}
                </MathJax>
                <MathJax>
                  {`$= ${(UCL1 * 100).toFixed(2)}\\%$`}
                </MathJax>
              </div>

              <div className="mb-2">
                <MathJax>
                  {`$\\text{UCL}_{+2\\sigma} = \\bar{p} + 2\\sigma$`}
                </MathJax>
                <MathJax>
                  {`$= ${displayCL.toFixed(4)} + 2(${displaySigma.toFixed(6)}) = ${(displayCL + 2*displaySigma).toFixed(6)}$`}
                </MathJax>
                <MathJax>
                  {`$= ${(UCL2 * 100).toFixed(2)}\\%$`}
                </MathJax>
              </div>

              <div className="mb-2">
                <MathJax>
                  {`$\\text{UCL}_{+3\\sigma} = \\bar{p} + 3\\sigma$`}
                </MathJax>
                <MathJax>
                  {`$= ${displayCL.toFixed(4)} + 3(${displaySigma.toFixed(6)}) = ${(displayCL + 3*displaySigma).toFixed(6)}$`}
                </MathJax>
                <MathJax>
                  {`$= ${(UCL3 * 100).toFixed(2)}\\%$`}
                </MathJax>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-orange-700 mb-2">Step 5: Calculate Lower Control Limits (LCL)</h4>
              
              <div className="mb-2">
                <MathJax>
                  {`$\\text{LCL}_{-1\\sigma} = \\max(0, \\bar{p} - 1\\sigma)$`}
                </MathJax>
                <MathJax>
                  {`$= \\max(0, ${displayCL.toFixed(4)} - ${displaySigma.toFixed(6)}) = ${LCL1.toFixed(6)}$`}
                </MathJax>
                <MathJax>
                  {`$= ${(LCL1 * 100).toFixed(2)}\\%$`}
                </MathJax>
              </div>

              <div className="mb-2">
                <MathJax>
                  {`$\\text{LCL}_{-2\\sigma} = \\max(0, \\bar{p} - 2\\sigma)$`}
                </MathJax>
                <MathJax>
                  {`$= \\max(0, ${displayCL.toFixed(4)} - 2(${displaySigma.toFixed(6)})) = ${LCL2.toFixed(6)}$`}
                </MathJax>
                <MathJax>
                  {`$= ${(LCL2 * 100).toFixed(2)}\\%$`}
                </MathJax>
              </div>

              <div className="mb-2">
                <MathJax>
                  {`$\\text{LCL}_{-3\\sigma} = \\max(0, \\bar{p} - 3\\sigma)$`}
                </MathJax>
                <MathJax>
                  {`$= \\max(0, ${displayCL.toFixed(4)} - 3(${displaySigma.toFixed(6)})) = ${LCL3.toFixed(6)}$`}
                </MathJax>
                <MathJax>
                  {`$= ${(LCL3 * 100).toFixed(2)}\\%$`}
                </MathJax>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-gray-700 mb-2">Summary of Results</h4>
              <div className="text-xs space-y-1">
                <div>Center Line (CL): <strong>{(displayCL * 100).toFixed(1)}%</strong></div>
                <div>Standard Deviation (σ): <strong>{(displaySigma * 100).toFixed(2)}%</strong></div>
                <div>UCL (+3σ): <strong>{(UCL3 * 100).toFixed(1)}%</strong></div>
                <div>UCL (+2σ): <strong>{(UCL2 * 100).toFixed(1)}%</strong></div>
                <div>UCL (+1σ): <strong>{(UCL1 * 100).toFixed(1)}%</strong></div>
                <div>LCL (-1σ): <strong>{(LCL1 * 100).toFixed(1)}%</strong></div>
                <div>LCL (-2σ): <strong>{(LCL2 * 100).toFixed(1)}%</strong></div>
                <div>LCL (-3σ): <strong>{(LCL3 * 100).toFixed(1)}%</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
};

export default PChartComputation;