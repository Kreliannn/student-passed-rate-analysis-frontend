import { courseInterface } from "@/types/interface"
import { getRetentionRate } from "@/utils/customFunction"



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

    const CE1st  = filterDataByYearLevel("CE", "1st", data)
    const CE2nd = filterDataByYearLevel("CE", "2nd", data)
    const CE3rd  = filterDataByYearLevel("CE", "3rd", data)
    const CE4th  = filterDataByYearLevel("CE", "4th", data)

    const CPE1st  = filterDataByYearLevel("CPE", "1st", data)
    const CPE2nd = filterDataByYearLevel("CPE", "2nd", data)
    const CPE3rd  = filterDataByYearLevel("CPE", "3rd", data)
    const CPE4th  = filterDataByYearLevel("CPE", "4th", data)


    const EE1st  = filterDataByYearLevel("EE", "1st", data)
    const EE2nd = filterDataByYearLevel("EE", "2nd", data)
    const EE3rd  = filterDataByYearLevel("EE", "3rd", data)
    const EE4th  = filterDataByYearLevel("EE", "4th", data)
    

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
                    {(getRetentionRateByYearLevel(CE1st, "1st") != 0)
                        ? <h1>1st year retention rate: {getRetentionRateByYearLevel(CE1st, "1st").toFixed(1)}%</h1>
                        : <h1>1st year retention rate: no record</h1>}
                </div>

                <div>
                    {(getRetentionRateByYearLevel(CE2nd, "2nd") != 0)
                        ? <h1>2nd year retention rate: {getRetentionRateByYearLevel(CE2nd, "2nd").toFixed(1)}%</h1>
                        : <h1>2nd year retention rate: no record</h1>}
                </div>

                <div>
                    {(getRetentionRateByYearLevel(CE3rd, "3rd") != 0)
                        ? <h1>3rd year retention rate: {getRetentionRateByYearLevel(CE3rd, "3rd").toFixed(1)}%</h1>
                        : <h1>3rd year retention rate: no record</h1>}
                </div>

                <div>
                    {(getRetentionRateByYearLevel(CE4th, "4th") != 0)
                        ? <h1>4th year retention rate: {getRetentionRateByYearLevel(CE4th, "4th").toFixed(1)}%</h1>
                        : <h1>4th year retention rate: no record</h1>}
                </div>
            </div>

            <div className="mt-5 bg-stone-50">
                <h1> CPE </h1>

                <div>
                    {(getRetentionRateByYearLevel(CPE1st, "1st") != 0)
                        ? <h1>1st year retention rate: {getRetentionRateByYearLevel(CPE1st, "1st").toFixed(1)}%</h1>
                        : <h1>1st year retention rate: no record</h1>}
                </div>

                <div>
                    {(getRetentionRateByYearLevel(CPE2nd, "2nd") != 0)
                        ? <h1>2nd year retention rate: {getRetentionRateByYearLevel(CPE2nd, "2nd").toFixed(1)}%</h1>
                        : <h1>2nd year retention rate: no record</h1>}
                </div>

                <div>
                    {(getRetentionRateByYearLevel(CPE3rd, "3rd") != 0)
                        ? <h1>3rd year retention rate: {getRetentionRateByYearLevel(CPE3rd, "3rd").toFixed(1)}%</h1>
                        : <h1>3rd year retention rate: no record</h1>}
                </div>

                <div>
                    {(getRetentionRateByYearLevel(CPE4th, "4th") != 0)
                        ? <h1>4th year retention rate: {getRetentionRateByYearLevel(CPE4th, "4th").toFixed(1)}%</h1>
                        : <h1>4th year retention rate: no record</h1>}
                </div>
            </div>

            <div className="mt-5 bg-stone-50">
                <h1> EE </h1>

                <div>
                    {(getRetentionRateByYearLevel(EE1st, "1st") != 0)
                        ? <h1>1st year retention rate: {getRetentionRateByYearLevel(EE1st, "1st").toFixed(1)}%</h1>
                        : <h1>1st year retention rate: no record</h1>}
                </div>

                <div>
                    {(getRetentionRateByYearLevel(EE2nd, "2nd") != 0)
                        ? <h1>2nd year retention rate: {getRetentionRateByYearLevel(EE2nd, "2nd").toFixed(1)}%</h1>
                        : <h1>2nd year retention rate: no record</h1>}
                </div>

                <div>
                    {(getRetentionRateByYearLevel(EE3rd, "3rd") != 0)
                        ? <h1>3rd year retention rate: {getRetentionRateByYearLevel(EE3rd, "3rd").toFixed(1)}%</h1>
                        : <h1>3rd year retention rate: no record</h1>}
                </div>

                <div>
                    {(getRetentionRateByYearLevel(EE4th, "4th") != 0)
                        ? <h1>4th year retention rate: {getRetentionRateByYearLevel(EE4th, "4th").toFixed(1)}%</h1>
                        : <h1>4th year retention rate: no record</h1>}
                </div>
            </div>


        </div>
    )
}