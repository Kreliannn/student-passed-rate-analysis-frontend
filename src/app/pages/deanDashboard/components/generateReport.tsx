import { courseInterface } from "@/types/interface"
import { getRetentionRate } from "@/utils/customFunction"

export default function GenerateReport({ data, selectedYear } : { selectedYear : string, data: courseInterface[]})
{

    const [CEretention, CEpassed, CEenrolled] = getRetentionRate(data, "CE", selectedYear)
    const [CPEretention, CPEpassed, CPEenrolled] = getRetentionRate(data, "CPE", selectedYear)
 
    const [EEretention, EEpassed, EEenrolled] = getRetentionRate(data, "EE", selectedYear)
    const [ECEretention, ECEpassed, ECEenrolled] = getRetentionRate(data, "ECE", selectedYear)
 
    const [IEretention, IEpassed, IEenrolled] = getRetentionRate(data, "IE", selectedYear)
    const [MEretention, MEpassed, MEenrolled] = getRetentionRate(data, "ME", selectedYear)
 
 
    const allDepartmentPassed = (CEpassed + CPEpassed + EEpassed + ECEpassed + IEpassed + MEpassed )
    const allDepartmentEnrolled = (CEenrolled + CPEenrolled +EEenrolled+ ECEenrolled + IEenrolled + MEenrolled )
 
    const allDepartmentRetention = (allDepartmentPassed / allDepartmentEnrolled) * 100

    return(
        <div className="w-full h-full bg-white">   
            <h1 className="text-center"> Failure Rate Analysis Report </h1>
            <h1 className="text-center"> Batch 2020 - 2020</h1>

            <div className="bg-stone-50">
                <h1> CE : {CEretention.toFixed(1)}%  </h1>
                <h1> CPE : {CPEretention.toFixed(1)}%    </h1>
                <h1> EE : {EEretention.toFixed(1)}%  </h1>
                <h1> ECE : {ECEretention.toFixed(1)}%    </h1>
                <h1> IE : {IEretention.toFixed(1)}%  </h1>
                <h1> ME : {MEretention.toFixed(1)}%  </h1>
                <h1> All Department : {allDepartmentRetention.toFixed(1)}%   </h1>
            </div>


            <div className="mt-5 bg-stone-50">
                <h1> CE </h1>

                <div>
                    <h1> 1st year retention rate: </h1>
                </div>

                <div>
                    <h1> 2nd year retention rate: </h1>
                </div>

                <div>
                    <h1> 3rd year retention rate: </h1>
                </div>

                <div>
                    <h1> 4th year retention rate: </h1>
                </div>
                
            </div>
        </div>
    )
}