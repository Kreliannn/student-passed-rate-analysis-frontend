import { courseInterface } from "@/types/interface"
import { getRetentionRate } from "@/utils/customFunction"
import { getCourseName } from "@/utils/customFunction"


const filterDataByYearLevel = ( department : string ,year : string, data : courseInterface[]) => {
    let filteredData 
    switch(year)
    {
        case "4th":
            filteredData = data 
        break

        case "3rd":
            filteredData = data.filter((item) => ["1st", "2nd", "3rd"].includes(item.gradeLevel))
        break


        case "2nd":
            filteredData = data.filter((item) => ["1st", "2nd"].includes(item.gradeLevel))
        break


        case "1st":
            filteredData = data.filter((item) => ["1st"].includes(item.gradeLevel))
        break
    }

    if(!filteredData) return []

    return  filteredData?.filter((item) => item.department == department)
    
}


const getRetentionRateByYearLevel = ( data : courseInterface[], year : string) => {
    try{
        let retention =  0
 
        let highestEnrolled1st;
        let highestPassedLast;
        
         switch(year)
         {
          case "1st":
              highestEnrolled1st = data
              .filter(item => item.gradeLevel === "1st" && item.sem === 1)
              .reduce((max, item) => (item.totalEnrolled > max.totalEnrolled ? item : max));
            
            // Get highest passed in 4th year, 2nd sem
             highestPassedLast = data
              .filter(item => item.gradeLevel === "1st" && item.sem === 2)
              .reduce((max, item) => (item.passed > max.passed ? item : max));
      
            retention = ( highestPassedLast.passed / highestEnrolled1st.totalEnrolled )* 100
            retention = (retention > 100) ? 100 : retention
          break;
      
          case "2nd":
              highestEnrolled1st = data
              .filter(item => item.gradeLevel === "1st" && item.sem === 1)
              .reduce((max, item) => (item.totalEnrolled > max.totalEnrolled ? item : max));
            
            // Get highest passed in 4th year, 2nd sem
             highestPassedLast = data
              .filter(item => item.gradeLevel === "2nd" && item.sem === 2)
              .reduce((max, item) => (item.passed > max.passed ? item : max));
            
      
            retention = ( highestPassedLast.passed / highestEnrolled1st.totalEnrolled )* 100
            retention = (retention > 100) ? 100 : retention
          break;
      
          case "3rd":
              highestEnrolled1st = data
              .filter(item => item.gradeLevel === "1st" && item.sem === 1)
              .reduce((max, item) => (item.totalEnrolled > max.totalEnrolled ? item : max));
      
              // Get highest passed in 4th year, 2nd sem
              highestPassedLast = data
              .filter(item => item.gradeLevel === "3rd" && item.sem === 2)
              .reduce((max, item) => (item.passed > max.passed ? item : max));
      
              retention = ( highestPassedLast.passed / highestEnrolled1st.totalEnrolled )* 100
              retention = (retention > 100) ? 100 : retention
          break;
      
      
          case "4th":
              highestEnrolled1st = data
              .filter(item => item.gradeLevel === "1st" && item.sem === 1)
              .reduce((max, item) => (item.totalEnrolled > max.totalEnrolled ? item : max));
            
            // Get highest passed in 4th year, 2nd sem
             highestPassedLast = data
              .filter(item => item.gradeLevel === "4th" && item.sem === 2)
              .reduce((max, item) => (item.passed > max.passed ? item : max));
            
            retention = ( highestPassedLast.passed / highestEnrolled1st.totalEnrolled )* 100
            retention = (retention > 100) ? 100 : retention
          break;
         }
      
         return retention
    } catch(e) {
        return 0
    }   
   
}

const isGreaterThanUcl3 = (data : courseInterface[], item : courseInterface) => {
    const totalFailed: number = data.reduce((sum, item) => sum + (item.totalEnrolled - item.passed), 0);
    const totalEnrolled: number = data.reduce((sum, item) => sum + item.totalEnrolled, 0);
    const CL: number = totalFailed / totalEnrolled;
    const fixedN: number = 100; 
    const sigma: number = Math.sqrt((CL * (1 - CL)) / fixedN); 
    const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
    const ucl3 = (CL + 3 * sigma) * 100
    return proportion > ucl3
}

const getUcl3 = (data : courseInterface[]) => {
    const totalFailed: number = data.reduce((sum, item) => sum + (item.totalEnrolled - item.passed), 0);
    const totalEnrolled: number = data.reduce((sum, item) => sum + item.totalEnrolled, 0);
    const CL: number = totalFailed / totalEnrolled;
    const fixedN: number = 100; 
    const sigma: number = Math.sqrt((CL * (1 - CL)) / fixedN); 
    const ucl3 = (CL + 3 * sigma) * 100
    return ucl3 
}



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
    

    return(
        <div className="w-full h-full bg-white">   
            <h1 className="text-center"> Failure Rate Analysis Report </h1>
            <h1 className="text-center"> Batch {selectedYear}</h1>

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
                <h1>CE</h1>

                {getRetentionRateByYearLevel(CE1st, "1st") !== 0 && (
                    <div>
                        <h1>1st year retention rate: {getRetentionRateByYearLevel(CE1st, "1st").toFixed(1)}%</h1>
                        <div>
                            {CE1st.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > CEucl3 && item.gradeLevel == "1st")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )}

                {getRetentionRateByYearLevel(CE2nd, "2nd") !== 0 && (
                    <div>
                        <h1>2nd year retention rate: {getRetentionRateByYearLevel(CE2nd, "2nd").toFixed(1)}%</h1>
                        <div>
                            {CE2nd.map((item, index) => {
                               const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                               if(proportion > CEucl3 && item.gradeLevel == "2nd")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )}

                {getRetentionRateByYearLevel(CE3rd, "3rd") !== 0 && (
                    <div>
                        <h1>3rd year retention rate: {getRetentionRateByYearLevel(CE3rd, "3rd").toFixed(1)}%</h1>
                        <div>
                            {CE3rd.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > CEucl3 && item.gradeLevel == "3rd")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )}

                {getRetentionRateByYearLevel(CE4th, "4th") !== 0 && (
                    <div>
                        <h1>4th year retention rate: {getRetentionRateByYearLevel(CE4th, "4th").toFixed(1)}%</h1>
                        <div>
                            {CE4th.map((item, index) => {
                              const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                              if(proportion > CEucl3 && item.gradeLevel == "4th")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) }   ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5 bg-stone-50">
                <h1>CPE</h1>

                {getRetentionRateByYearLevel(CPE1st, "1st") !== 0 && (
                    <div>
                        <h1>1st year retention rate: {getRetentionRateByYearLevel(CPE1st, "1st").toFixed(1)}%</h1>
                        <div>
                            {CPE1st.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > CPEucl3 && item.gradeLevel == "1st")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )}

                {getRetentionRateByYearLevel(CPE2nd, "2nd") !== 0 && (
                    <div>
                        <h1>2nd year retention rate: {getRetentionRateByYearLevel(CPE2nd, "2nd").toFixed(1)}%</h1>
                        <div>
                            {CPE2nd.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > CPEucl3 && item.gradeLevel == "2nd")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )}

                {getRetentionRateByYearLevel(CPE3rd, "3rd") !== 0 && (
                    <div>
                        <h1>3rd year retention rate: {getRetentionRateByYearLevel(CPE3rd, "3rd").toFixed(1)}%</h1>
                        <div>
                            {CPE3rd.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > CPEucl3 && item.gradeLevel == "3rd")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )}

                {getRetentionRateByYearLevel(CPE4th, "4th") !== 0 && (
                    <div>
                        <h1>4th year retention rate: {getRetentionRateByYearLevel(CPE4th, "4th").toFixed(1)}%</h1>
                        <div>
                            {CPE4th.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > CPEucl3 && item.gradeLevel == "4th")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5 bg-stone-50">
                <h1>EE</h1>

                {getRetentionRateByYearLevel(EE1st, "1st") !== 0 && (
                    <div>
                        <h1>1st year retention rate: {getRetentionRateByYearLevel(EE1st, "1st").toFixed(1)}%</h1>
                        <div>
                            {EE1st.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > EEucl3 && item.gradeLevel == "1st")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )}

                {getRetentionRateByYearLevel(EE2nd, "2nd") !== 0 && (
                    <div>
                        <h1>2nd year retention rate: {getRetentionRateByYearLevel(EE2nd, "2nd").toFixed(1)}%</h1>
                        <div>
                            {EE2nd.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > EEucl3 && item.gradeLevel == "2nd")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                    
                )}

                {getRetentionRateByYearLevel(EE3rd, "3rd") !== 0 && (
                    <div>
                        <h1>3rd year retention rate: {getRetentionRateByYearLevel(EE3rd, "3rd").toFixed(1)}%</h1>
                        <div>
                            {EE3rd.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > EEucl3 && item.gradeLevel == "3rd")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )}

                {getRetentionRateByYearLevel(EE4th, "4th") !== 0 && (
                    <div>
                        <h1>4th year retention rate: {getRetentionRateByYearLevel(EE4th, "4th").toFixed(1)}%</h1>
                        <div>
                            {EE4th.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > EEucl3 && item.gradeLevel == "4th")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5 bg-stone-50">
                <h1>ECE</h1>

                {getRetentionRateByYearLevel(ECE1st, "1st") !== 0 && (
                    <div>
                        <h1>1st year retention rate: {getRetentionRateByYearLevel(ECE1st, "1st").toFixed(1)}%</h1>
                        <div>
                            {ECE1st.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > ECEucl3 && item.gradeLevel == "1st")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                )}

                {getRetentionRateByYearLevel(ECE2nd, "2nd") !== 0 && (
                    <div>
                        <h1>2nd year retention rate: {getRetentionRateByYearLevel(ECE2nd, "2nd").toFixed(1)}%</h1>
                        {ECE2nd.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > ECEucl3 && item.gradeLevel == "2nd")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                    </div>
                )}

                {getRetentionRateByYearLevel(ECE3rd, "3rd") !== 0 && (
                    <div>
                        <h1>3rd year retention rate: {getRetentionRateByYearLevel(ECE3rd, "3rd").toFixed(1)}%</h1>
                        {ECE3rd.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > ECEucl3 && item.gradeLevel == "3rd")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                    </div>
                )}

                {getRetentionRateByYearLevel(ECE4th, "4th") !== 0 && (
                    <div>
                        <h1>4th year retention rate: {getRetentionRateByYearLevel(ECE4th, "4th").toFixed(1)}%</h1>
                        {ECE4th.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > ECEucl3 && item.gradeLevel == "4th")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                    </div>
                )}
            </div>

            <div className="mt-5 bg-stone-50">
                <h1>IE</h1>

                {getRetentionRateByYearLevel(IE1st, "1st") !== 0 && (
                    <div>
                        <h1>1st year retention rate: {getRetentionRateByYearLevel(IE1st, "1st").toFixed(1)}%</h1>
                        <div>
                            {IE1st.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > IEucl3 && item.gradeLevel == "1st")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>    
                    </div>
                )}

                {getRetentionRateByYearLevel(IE2nd, "2nd") !== 0 && (
                    <div>
                        <h1>2nd year retention rate: {getRetentionRateByYearLevel(IE2nd, "2nd").toFixed(1)}%</h1>
                        <div>
                            {IE2nd.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > IEucl3 && item.gradeLevel == "2nd")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>   
                    </div>
                )}

                {getRetentionRateByYearLevel(IE3rd, "3rd") !== 0 && (
                    <div>
                        <h1>3rd year retention rate: {getRetentionRateByYearLevel(IE3rd, "3rd").toFixed(1)}%</h1>
                        <div>
                            {IE3rd.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > IEucl3 && item.gradeLevel == "3rd")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>   
                    </div>
                )}

                {getRetentionRateByYearLevel(IE4th, "4th") !== 0 && (
                    <div>
                        <h1>4th year retention rate: {getRetentionRateByYearLevel(IE4th, "4th").toFixed(1)}%</h1>
                        <div>
                            {IE4th.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > IEucl3 && item.gradeLevel == "4th")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>   
                    </div>
                )}
            </div>

            <div className="mt-5 bg-stone-50">
                <h1>ME</h1>

                {getRetentionRateByYearLevel(ME1st, "1st") !== 0 && (
                    <div>
                        <h1>1st year retention rate: {getRetentionRateByYearLevel(ME1st, "1st").toFixed(1)}%</h1>
                        <div>
                            {ME1st.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > MEucl3 && item.gradeLevel == "1st")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>   
                    </div>
                )}

                {getRetentionRateByYearLevel(ME2nd, "2nd") !== 0 && (
                    <div>
                        <h1>2nd year retention rate: {getRetentionRateByYearLevel(ME2nd, "2nd").toFixed(1)}%</h1>
                        <div>
                            {ME2nd.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > MEucl3 && item.gradeLevel == "2nd")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>  
                    </div>
                )}

                {getRetentionRateByYearLevel(ME3rd, "3rd") !== 0 && (
                    <div>
                        <h1>3rd year retention rate: {getRetentionRateByYearLevel(ME3rd, "3rd").toFixed(1)}%</h1>
                        <div>
                            {ME3rd.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > MEucl3 && item.gradeLevel == "3rd")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>  
                    </div>
                )}

                {getRetentionRateByYearLevel(ME4th, "4th") !== 0 && (
                    <div>
                        <h1>4th year retention rate: {getRetentionRateByYearLevel(ME4th, "4th").toFixed(1)}%</h1>
                        <div>
                            {ME4th.map((item, index) => {
                                const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
                                if(proportion > MEucl3 && item.gradeLevel == "4th")
                                {
                                    return(
                                        <div key={index}>
                                            <h1 className="text-xs"> - {item.gradeLevel} year {(item.sem == 1) ? "1st" : "2nd"} sem { getCourseName(item.courseCode) } ( {proportion.toFixed(1)}% ) </h1>
                                        </div>
                                    )
                                }
                            })}
                        </div>  
                    </div>
                )}
            </div>





        </div>
    )
}