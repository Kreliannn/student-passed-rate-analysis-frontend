import { courseInterface } from "@/types/interface"
import { getRetentionRate } from "@/utils/customFunction"
import { getCourseName, convertCodeToName } from "@/utils/customFunction"
import { getUcl3, filterDataByYearLevel, getRetentionRateByYearLevel } from "@/utils/customFunction"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export default function GenerateReport({ data, selectedYear } : { selectedYear : string, data: courseInterface[]})
{
    const handlePrint = () => {
        const printContent = document.getElementById('report-content');
        const originalContent = document.body.innerHTML;
        
        if (printContent) {
            document.body.innerHTML = printContent.innerHTML;
            window.print();
            document.body.innerHTML = originalContent;
            window.location.reload(); // Reload to restore React functionality
        }
    };

    const [CEretention, CEpassed, CEenrolled] = getRetentionRate(data, "CE", selectedYear)
    const [CPEretention, CPEpassed, CPEenrolled] = getRetentionRate(data, "CPE", selectedYear)
 
    const [EEretention, EEpassed, EEenrolled] = getRetentionRate(data, "EE", selectedYear)
    const [ECEretention, ECEpassed, ECEenrolled] = getRetentionRate(data, "ECE", selectedYear)
 
    const [IEretention, IEpassed, IEenrolled] = getRetentionRate(data, "IE", selectedYear)
    const [MEretention, MEpassed, MEenrolled] = getRetentionRate(data, "ME", selectedYear)
 
 
    const allDepartmentPassed = (CEpassed + CPEpassed + EEpassed + ECEpassed + IEpassed + MEpassed )
    const allDepartmentEnrolled = (CEenrolled + CPEenrolled +EEenrolled+ ECEenrolled + IEenrolled + MEenrolled )
 
    const allDepartmentRetention = (allDepartmentPassed / allDepartmentEnrolled) * 100

    const CEucl3 = getUcl3(data.filter((item) => item.department == "CE"))
    const CE1st  = filterDataByYearLevel("CE", "1st", data)
    const CE2nd = filterDataByYearLevel("CE", "2nd", data)
    const CE3rd  = filterDataByYearLevel("CE", "3rd", data)
    const CE4th  = filterDataByYearLevel("CE", "4th", data)
   

    const CPEucl3 = getUcl3(data.filter((item) => item.department == "CPE"))
    const CPE1st  = filterDataByYearLevel("CPE", "1st", data)
    const CPE2nd = filterDataByYearLevel("CPE", "2nd", data)
    const CPE3rd  = filterDataByYearLevel("CPE", "3rd", data)
    const CPE4th  = filterDataByYearLevel("CPE", "4th", data)


    const EEucl3 = getUcl3(data.filter((item) => item.department == "EE"))
    const EE1st  = filterDataByYearLevel("EE", "1st", data)
    const EE2nd = filterDataByYearLevel("EE", "2nd", data)
    const EE3rd  = filterDataByYearLevel("EE", "3rd", data)
    const EE4th  = filterDataByYearLevel("EE", "4th", data)

    const ECEucl3 = getUcl3(data.filter((item) => item.department == "ECE"))
    const ECE1st  = filterDataByYearLevel("ECE", "1st", data)
    const ECE2nd = filterDataByYearLevel("ECE", "2nd", data)
    const ECE3rd  = filterDataByYearLevel("ECE", "3rd", data)
    const ECE4th  = filterDataByYearLevel("ECE", "4th", data)

    const IEucl3 = getUcl3(data.filter((item) => item.department == "IE"))
    const IE1st  = filterDataByYearLevel("IE", "1st", data)
    const IE2nd = filterDataByYearLevel("IE", "2nd", data)
    const IE3rd  = filterDataByYearLevel("IE", "3rd", data)
    const IE4th  = filterDataByYearLevel("IE", "4th", data)

    const MEucl3 = getUcl3(data.filter((item) => item.department == "ME"))
    const ME1st  = filterDataByYearLevel("ME", "1st", data)
    const ME2nd = filterDataByYearLevel("ME", "2nd", data)
    const ME3rd  = filterDataByYearLevel("ME", "3rd", data)
    const ME4th  = filterDataByYearLevel("ME", "4th", data)

    const renderDepartmentSection = (
        departmentCode: string,
        ucl3: number,
        yearData: { [key: string]: any[] }
    ) => {
        return (
            <div className="mb-8 bg-gray-50 rounded-lg p-6 break-inside-avoid">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
                    Department: {convertCodeToName(departmentCode)}
                </h2>

                {Object.entries(yearData).map(([year, data]) => {
                    const yearLevel = year.replace('Data', '');
                    const retentionRate = getRetentionRateByYearLevel(data, yearLevel);
                    
                    if (retentionRate === 0) return null;

                    return (
                        <div key={year} className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                {yearLevel} Year Retention Rate: {retentionRate.toFixed(1)}%
                            </h3>
                            <div className="ml-6 space-y-1">
                                {data.map((item, index) => {
                                    const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100;
                                    if (proportion > ucl3 && item.gradeLevel === yearLevel) {
                                        return (
                                            <div key={index} className="text-sm text-gray-600 leading-relaxed">
                                                • {item.gradeLevel} year {item.sem === 1 ? "1st" : "2nd"} sem {getCourseName(item.courseCode)} ({proportion.toFixed(1)}%)
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
    

    return(
        <>
        <style jsx>{`
            @media print {
                @page {
                    margin: 0.5in;
                    size: A4;
                }
                body {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                .break-inside-avoid {
                    break-inside: avoid !important;
                }
                * {
                    visibility: visible !important;
                    position: static !important;
                }
            }
        `}</style>
        
        <div className="">
            <Button 
                disabled={selectedYear == "all"}
                onClick={handlePrint}
                className=" flex items-center gap-2   me-4 px-6 py-2 rounded-lg shadow-lg transition-colors"
            >
                <Printer size={20} />
                Print Report
            </Button>
            
            <div id="report-content" className="w-full bg-white shadow-xl rounded-lg min-h-screen hidden">   
                {/* Header Section */}
                <div className="text-center py-8 border-b-2 border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Failure Rate Analysis Report
                    </h1>
                    <h2 className="text-xl text-gray-600">
                        Batch {selectedYear}
                    </h2>
                    <div className="text-sm text-gray-500 mt-2">
                        Generated on {new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                </div>

                {/* Summary Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 m-6 rounded-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Department Retention Rates
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-white rounded shadow-sm border-l-4 border-blue-500">
                                    <span className="font-medium text-gray-700">{convertCodeToName("CE")}</span>
                                    <span className="font-bold text-lg tex00">{CEretention.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded shadow-sm border-l-4 border-green-500">
                                    <span className="font-medium text-gray-700">{convertCodeToName("CPE")}</span>
                                    <span className="font-bold text-lg tex600">{CPEretention.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded shadow-sm border-l-4 border-purple-500">
                                    <span className="font-medium text-gray-700">{convertCodeToName("EE")}</span>
                                    <span className="font-bold text-lg tex-600">{EEretention.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded shadow-sm border-l-4 border-red-500">
                                    <span className="font-medium text-gray-700">{convertCodeToName("ECE")}</span>
                                    <span className="font-bold text-lg tex0">{ECEretention.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded shadow-sm border-l-4 border-yellow-500">
                                    <span className="font-medium text-gray-700">{convertCodeToName("IE")}</span>
                                    <span className="font-bold text-lg tex-600">{IEretention.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded shadow-sm border-l-4 border-indigo-500">
                                    <span className="font-medium text-gray-700">{convertCodeToName("ME")}</span>
                                    <span className="font-bold text-lg tex-600">{MEretention.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center items-center">
                            <div className="text-center p-8 bg-white rounded-xl shadow-lg border sm:w-full">
                                <h3 className="text-lg font-semibold text-gray-600 mb-4">
                                    Overall Engineering Retention Rate 
                                </h3>
                                <div className={`text-5xl font-bold t mb-2 ${allDepartmentRetention >= 80 ? "text-green-500" : "text-red-500"}`}>
                                    {allDepartmentRetention.toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-500">
                                    {(data[data.length - 1]?.gradeLevel != "4th") ? `As Of ${data[data.length - 1]?.gradeLevel} Year` : "Complete Program"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="p-6 space-y-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
                        Detailed Department Analysis
                    </h2>

                    {/* CE Department */}
                    {renderDepartmentSection("CE", CEucl3, {
                        "1stData": CE1st,
                        "2ndData": CE2nd,
                        "3rdData": CE3rd,
                        "4thData": CE4th
                    })}

                    {/* CPE Department */}
                    {renderDepartmentSection("CPE", CPEucl3, {
                        "1stData": CPE1st,
                        "2ndData": CPE2nd,
                        "3rdData": CPE3rd,
                        "4thData": CPE4th
                    })}

                    {/* EE Department */}
                    {renderDepartmentSection("EE", EEucl3, {
                        "1stData": EE1st,
                        "2ndData": EE2nd,
                        "3rdData": EE3rd,
                        "4thData": EE4th
                    })}

                    {/* ECE Department */}
                    {renderDepartmentSection("ECE", ECEucl3, {
                        "1stData": ECE1st,
                        "2ndData": ECE2nd,
                        "3rdData": ECE3rd,
                        "4thData": ECE4th
                    })}

                    {/* IE Department */}
                    {renderDepartmentSection("IE", IEucl3, {
                        "1stData": IE1st,
                        "2ndData": IE2nd,
                        "3rdData": IE3rd,
                        "4thData": IE4th
                    })}

                    {/* ME Department */}
                    {renderDepartmentSection("ME", MEucl3, {
                        "1stData": ME1st,
                        "2ndData": ME2nd,
                        "3rdData": ME3rd,
                        "4thData": ME4th
                    })}
                </div>

                {/* Footer */}
                <div className="text-center py-6 border-t-2 border-gray-200 text-gray-500 text-sm">
                    <p>End of Report - Confidential Academic Document</p>
                </div>
            </div>
        </div>
        </>
    )
}