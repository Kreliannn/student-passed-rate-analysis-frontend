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

    return  filteredData?.filter((item) => item.department == department)
    
}


const getRetentionRateByYearLevel = (data : courseInterface[]) => {
    let retention =  0
 
    let highestEnrolled1st;
    let highestPassedLast;
    
   
     switch(data.length != 0 ? data[data.length - 1].gradeLevel : "none")
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

    const CE1st = filterDataByYearLevel("CE", "2nd", data)

    console.log(CE1st)      
    console.log("test: " + getRetentionRateByYearLevel(CE1st as courseInterface[]) )
    

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