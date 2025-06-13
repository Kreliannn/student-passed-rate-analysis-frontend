import { courseInterface } from "@/types/interface"

export const bgStyle = {
    backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/bg.jpg')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  }

  export function getBatches() {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    
    const lastBatchStartYear = currentYear;
    const batches = [];
  
    for (let year = startYear; year <= lastBatchStartYear; year++) {
      const endYear = year + 4;
      batches.push(`${year}-${endYear}`);
    }
  
    return batches;
  }
  
 


  export const filterDataByYearLevel = ( department : string ,year : string, data : courseInterface[]) => {
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


export const getRetentionRateByYearLevel = ( data : courseInterface[], year : string) => {
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

export const isGreaterThanUcl3 = (data : courseInterface[], item : courseInterface) => {
    const totalFailed: number = data.reduce((sum, item) => sum + (item.totalEnrolled - item.passed), 0);
    const totalEnrolled: number = data.reduce((sum, item) => sum + item.totalEnrolled, 0);
    const CL: number = totalFailed / totalEnrolled;
    const fixedN: number = 100; 
    const sigma: number = Math.sqrt((CL * (1 - CL)) / fixedN); 
    const proportion = ((item.totalEnrolled - item.passed) / item.totalEnrolled) * 100
    const ucl3 = (CL + 3 * sigma) * 100
    return proportion > ucl3
}

export const getUcl3 = (data : courseInterface[]) => {
    const totalFailed: number = data.reduce((sum, item) => sum + (item.totalEnrolled - item.passed), 0);
    const totalEnrolled: number = data.reduce((sum, item) => sum + item.totalEnrolled, 0);
    const CL: number = totalFailed / totalEnrolled;
    const fixedN: number = 100; 
    const sigma: number = Math.sqrt((CL * (1 - CL)) / fixedN); 
    const ucl3 = (CL + 3 * sigma) * 100
    return ucl3 
}




 export const getRetentionRate = (data : courseInterface[], department : string, selectedYear : string) => {
    let retention =  0
 
    let highestEnrolled1st;
    let highestPassedLast;

    let passed = 0
    let enrolled = 0
 
    try{
     switch(data.length != 0 ? data[data.length - 1].gradeLevel : "none")
     {
      case "1st":
          highestEnrolled1st = data
          .filter(item => item.gradeLevel === "1st" && item.sem === 1 && item.department == department && item.batch == selectedYear)
          .reduce((max, item) => (item.totalEnrolled > max.totalEnrolled ? item : max));
        
        // Get highest passed in 4th year, 2nd sem
         highestPassedLast = data
          .filter(item => item.gradeLevel === "1st" && item.sem === 2 && item.department == department && item.batch == selectedYear)
          .reduce((max, item) => (item.passed > max.passed ? item : max));
  
        retention = ( highestPassedLast.passed / highestEnrolled1st.totalEnrolled )* 100
        retention = (retention > 100 ) ? 100 : retention
        passed = highestPassedLast.passed
        enrolled = highestEnrolled1st.totalEnrolled
      break;
  
      case "2nd":
          highestEnrolled1st = data
          .filter(item => item.gradeLevel === "1st" && item.sem === 1 && item.department == department && item.batch == selectedYear)
          .reduce((max, item) => (item.totalEnrolled > max.totalEnrolled ? item : max));
        
        // Get highest passed in 4th year, 2nd sem
         highestPassedLast = data
          .filter(item => item.gradeLevel === "2nd" && item.sem === 2 && item.department == department && item.batch == selectedYear)
          .reduce((max, item) => (item.passed > max.passed ? item : max));
  
        retention = ( highestPassedLast.passed / highestEnrolled1st.totalEnrolled )* 100
        retention = (retention > 100 ) ? 100 : retention
        passed = highestPassedLast.passed
        enrolled = highestEnrolled1st.totalEnrolled
      break;
  
      case "3rd":
          highestEnrolled1st = data
          .filter(item => item.gradeLevel === "1st" && item.sem === 1 && item.department == department && item.batch == selectedYear)
          .reduce((max, item) => (item.totalEnrolled > max.totalEnrolled ? item : max));
  
          // Get highest passed in 4th year, 2nd sem
          highestPassedLast = data
          .filter(item => item.gradeLevel === "3rd" && item.sem === 2 && item.department == department && item.batch == selectedYear)
          .reduce((max, item) => (item.passed > max.passed ? item : max));
  

  
          retention = ( highestPassedLast.passed / highestEnrolled1st.totalEnrolled )* 100
          retention = (retention > 100 ) ? 100 : retention
          passed = highestPassedLast.passed
          enrolled = highestEnrolled1st.totalEnrolled
      break;
  
  
      case "4th":
          highestEnrolled1st = data
          .filter(item => item.gradeLevel === "1st" && item.sem === 1 && item.department == department && item.batch == selectedYear)
          .reduce((max, item) => (item.totalEnrolled > max.totalEnrolled ? item : max));
        
        // Get highest passed in 4th year, 2nd sem
         highestPassedLast = data
          .filter(item => item.gradeLevel === "4th" && item.sem === 2 && item.department == department && item.batch == selectedYear)
          .reduce((max, item) => (item.passed > max.passed ? item : max));
        
        
  
        retention = ( highestPassedLast.passed / highestEnrolled1st.totalEnrolled )* 100
        retention = (retention > 100 ) ? 100 : retention
        passed = highestPassedLast.passed
        enrolled = highestEnrolled1st.totalEnrolled
      break;
     }
  
    } catch (e) {
        console.log("no recoerd for 2nd sem")
    }

    return [ retention , passed, enrolled]
}
  

  
export const convertCodeToName = (code : string) => {
  switch(code)
  {
    case "CE":
      return "Civil Engineering"
      break 

    case "CPE":
      return "Computer Engineering"
      break

    case "EE":
      return "Electrical Engineering"
      break

    case "ECE":
      return "Electronic Engineering"
      break

    case "IE":
      return "Industrial Engineering"
      break

    case "ME":
      return "Mechanical Engineering"
      break
  }
}



export const convertYearLevel= (year : string) => {
  switch(year)
  {
    case "firstYear":
      return "1st"
      break 

    case "secondYear":
      return "2nd"
      break

    case "thirdYear":
      return "3rd"
      break

    case "fourthYear":
      return "4th"
      break
  }

  return "no selected year"
}

export const convertSem = (sem : string) => {
  switch(sem)
  {
    case "firstSem":
      return 1
      break 

    case "secondSem":
      return 2
      break
  }

  return 0
}


export const getAllCourseCode = (courses: courseInterface[]) => {
  const items: courseInterface[] = []
  
  courses.forEach((course) => {
    if (!items.find(item => item.courseCode === course.courseCode)) {
      items.push(course)
    }
  })
  
  return items
}


export const getCL = ( data : courseInterface[]) => {
    if(data.length == 0) return "no data"
    const totalFailed: number = data.reduce((sum, item) => sum + (item.totalEnrolled - item.passed), 0);
    const totalEnrolled: number = data.reduce((sum, item) => sum + item.totalEnrolled, 0);
    const CL: number = totalFailed / totalEnrolled;
   
   
    return `𝑝 ${(CL * 100).toFixed(1)}%`
}


  
export const getSortedCoursesByYear = (data: courseInterface[]) => {
  // Extract unique batch years and sort them by the starting year
  const uniqueBatches = [...new Set(data.map(item => item.batch))].sort((a, b) => {
    const startYearA = parseInt(a.split('-')[0]);
    const startYearB = parseInt(b.split('-')[0]);
    return startYearA - startYearB;
  });

  // Create a map for quick lookup and grouping by batch
  const groupedData = new Map();
  for (const item of data) {
    const batch = item.batch;
    if (!groupedData.has(batch)) {
      groupedData.set(batch, []);
    }
    groupedData.get(batch).push(item);
  }

  const sortedCourses = [];
  for (const batch of uniqueBatches) {
    if (groupedData.has(batch)) {
      // Add all courses for this specific batch
      sortedCourses.push(...groupedData.get(batch));
    }
  }

  return sortedCourses;
};

export const getSortedCourses = (data : courseInterface[]) => {
  const desiredOrder = [
    { gradeLevel: "1st", sem: 1 },
    { gradeLevel: "1st", sem: 2 },
    { gradeLevel: "2nd", sem: 1 },
    { gradeLevel: "2nd", sem: 2 },
    { gradeLevel: "3rd", sem: 1 },
    { gradeLevel: "3rd", sem: 2 },
    { gradeLevel: "4th", sem: 1 },
    { gradeLevel: "4th", sem: 2 },
  ];

  // Create a map for quick lookup and grouping
  const groupedData = new Map();
  for (const item of data) {
    const key = `${item.gradeLevel}-${item.sem}`;
    if (!groupedData.has(key)) {
      groupedData.set(key, []);
    }
    groupedData.get(key).push(item);
  }

  const sortedCourses = [];
  for (const order of desiredOrder) {
    const key = `${order.gradeLevel}-${order.sem}`;
    if (groupedData.has(key)) {
      // Add all courses for this specific gradeLevel/sem combination
      sortedCourses.push(...groupedData.get(key));
    }
  }

  return sortedCourses;
};


const courseMap = new Map<string, string>([

  ["CVE02F", "Fundamentals of Surveying Field"],
  ["CVE19", "CE Laws, Ethics and Contracts"],
  ["CVE20", "Quantity Surveying"],
  ["CVE20L", " Quantity Surveying Lab"],
  ["GECC06", "Purposive Communication"],
  ["EEN06", "Basic Occupational Safety and Health"],
  ["ECE11", "Feedback and Control Systems"],
  ["ECE11L", "Feedback and Control Systems Lab"],
  ["MCE25", "Basic Occupational Safety and Health"],

  
  ["MAT04", "CALCULUS 1 (DIFFERENTIAL)"],
  ["CHM01a", "CHEMISTRY FOR ENGINEERS"],
  ["CHM01aL", "CHEMISTRY FOR ENGINEERS LAB"],
  ["CVE00", "CIVIL ENGINEERING ORIENTATION"],
  ["CVE01", "ENGINEERING DRAWINGS AND PLANS"],
  ["CAD01", "COMPUTER AIDED DRAFTING"],
  ["CVE03", "GEOLOGY FOR CIVIL ENGINEERS"],
  ["MAT05", "CALCULUS 2 (INTEGRAL)"],
  ["PHY03", "PHYSICS FOR ENGINEERS"],
  ["PHY03", "PHYSICS FOR ENGINEERS LAB"],
  ["CVE02", "FUNDAMENTALS OF SURVEYING"],
  ["CVE02f", "FUNDAMENTALS OF SURVEYING FIELD"],
  ["CVE04", "CAD APPLICATION IN CE"],
  ["COM01", "COMPUTER FUNDAMENTALS & PROGRAMMING"],
  ["MAT07", "DIFFERENTIAL EQUATIONS"],
  ["MEC01", "STATICS OF RIGID BODIES"],
  ["MEC02", "DYNAMICS OF RIGID BODIES"],
  ["MEC03", "MECHANICS OF DEFORMABLE BODIES"],
  ["MAT08", "ENGINEERING DATA ANALYSIS"],
  ["BES01", "ENGINEERING ECONOMICS"],
  ["EEN01a", "BASIC ELECTRICAL ENGINEERING"],
  ["CVE06", "HIGHWAY AND RAILROAD ENGINEERING"],
  ["CVE05", "STRUCTURAL THEORY"],
  ["CVE05L", "STRUCTURAL THEORY LAB"],
  ["CVE07", "HYDRAULICS"],
  ["CVE07L", "HYDRAULICS LAB"],
  ["CVE08", "NUMERICAL SOLUTIONS TO CE PROBLEMS"],
  ["CVE08L", "NUMERICAL SOLUTIONS TO CE PROBLEMS LAB"],
  ["CVE09", "CONSTRUCTION MATERIALS AND TESTING"],
  ["CVE09L", "CONSTRUCTION MATERIALS AND TESTING LAB"],


  ["BES02", "ENGINEERING MANAGEMENT"],
  ["CVE10", "HYDROLOGY"],
  ["MCE01a", "BASIC MECHANICAL ENGINEERING"],
  ["CVE11", "STRUCTURAL THEORY 2"],
  ["CVE11L", "STRUCTURAL THEORY 2 LAB"],
  ["CVE12", "BUILDING SYSTEMS DESIGN"],
  ["CVE12L", "BUILDING SYSTEMS DESIGN LAB"],
  ["CVE13", "PRINCIPLES OF STEEL & TIMBER DESIGN"],
  ["CVE13L", "PRINCIPLES OF STEEL & TIMBER DESIGN LAB"],
  ["CVE14", "PRINCIPLES OF REINFORCED/PRESTRESSED CONCRETE"],
  ["CVE14L", "PRINCIPLES OF REINFORCED/PRESTRESSED CONCRETE LAB"],
  ["CVE15", "CONSTRUCTION METHODS & PROJECT MANAGEMENT"],
  ["CVE16", "PRINCIPLES OF TRANSPORTATION ENGINEERING"],
  ["CVS01", "PROFESSIONAL COURSE – SPECIALIZED 1"],
  ["CVE17", "CE PROJECT 1"],
  ["CVE17L", "CE PROJECT 1 LAB"],
  ["CVE18", "GEOTECHNICAL ENGINEERING 1"],
  ["CVE18L", "GEOTECHNICAL ENGINEERING 1 LAB"],
  ["CVS02", "PROFESSIONAL COURSE – SPECIALIZED 2"],
  ["CVS03", "PROFESSIONAL COURSE – SPECIALIZED 3"],
  ["CVS04", "PROFESSIONAL COURSE – SPECIALIZED 4"],
  ["CVS05", "PROFESSIONAL COURSE – SPECIALIZED 5"],
  ["CVE21", "CE PROJECT 2"],
  ["CVE21L", "CE PROJECT 2 LAB"],
  ["CVE22", "INTEGRATIVE COURSE FOR CE"],
  ["OJT", "ON-THE-JOB TRAINING"],


  ["MAT04", "CALCULUS 1 (DIFFERENTIAL)"],
  ["CHM01a", "CHEMISTRY FOR ENGINEERS"],
  ["CHM01aL", "CHEMISTRY FOR ENGINEERS LAB"],
  ["COE01", "COMPUTER ENGINEERING AS A DISCIPLINE"],
  ["MAT05", "CALCULUS 2 (INTEGRAL)"],
  ["PHY03", "PHYSICS FOR ENGINEERS"],
  ["PHY03L", "PHYSICS FOR ENGINEERS LAB"],
  ["GEC06", "PURPOSIVE COMMUNICATION"],
  ["CAD01", "COMPUTER AIDED DRAFTING"],
  ["CPE01", "DISCRETE MATHEMATICS"],
  ["CPE02", "PROGRAMMING AND LOGIC DESIGN"],
  ["CPE03", "DATABASE MANAGEMENT SYSTEM"],
  ["MAT07", "DIFFERENTIAL EQUATIONS"],
  ["EEN01", "FUNDAMENTALS OF ELECTRICAL CIRCUITS"],
  ["EEN01L", "FUNDAMENTALS OF ELECTRICAL CIRCUITS LAB"],
  ["MAT08", "ENGINEERING DATA ANALYSIS"],
  ["CPE04", "NUMERICAL METHODS"],
  ["CPE05", "OBJECT-ORIENTED PROGRAMMING"],
  ["CPE06", "ONLINE TECHNOLOGIES"],
  ["CPE07", "LOGIC CIRCUITS & DESIGN"],
  ["CPE07L", "LOGIC CIRCUITS & DESIGN LAB"],
  ["CPE08", "COMPUTER ENGINEERING & DRAFTING DESIGN"],
  ["ECE01", "FUNDAMENTALS OF ELECTRONIC CIRCUITS"],
  ["ECE01L", "FUNDAMENTALS OF ELECTRONIC CIRCUITS LAB"],
  ["CPE09", "INTRODUCTION TO HDL"],
  ["CPE10", "FUNDAMENTALS OF MIXED SIGNALS & SENSORS"],

  ["CPE11", "FEEDBACK AND CONTROL SYSTEMS"],
  ["CPE12", "DATA AND DIGITAL COMMUNICATIONS"],
  ["CPE13", "DATA STRUCTURES & ALGORITHMS"],
  ["CPE14", "BASIC OCCUPATIONAL SAFETY & HEALTH"],
  ["CPE15", "COGNATE/PROFESSIONAL COURSE 1"],
  ["CPE16", "COMPUTER NETWORKS & SECURITY"],
  ["CPE16L", "COMPUTER NETWORKS & SECURITY LAB"],
  ["CPE17", "OPERATING SYSTEMS"],
  ["CPE18", "SOFTWARE DESIGN"],
  ["CPE18L", "SOFTWARE DESIGN LAB"],
  ["CPE19", "MICROPROCESSORS"],
  ["CPE19L", "MICROPROCESSORS LAB"],
  ["CPE20", "METHODS OF RESEARCH"],
  ["CPE21", "COGNATE/PROFESSIONAL COURSE 2"],
  ["BES01", "ENGINEEERING ECONOMICS"],
  ["BES04", "TECHNOPRENEURSHIP 101"],
  ["CPE22", "DIGITAL SIGNAL PROCESSING"],
  ["CPE22L", "DIGITAL SIGNAL PROCESSING LAB"],
  ["CPE23", "COMPUTER ARCHITECTURE & ORGANIZATION"],
  ["CPE23L", "COMPUTER ARCHITECTURE & ORGANIZATION LAB"],
  ["CPE24", "EMBEDDED SYSTEMS"],
  ["CPE24L", "EMBEDDED SYSTEMS LAB"],
  ["CPE25", "CPE PRACTICE & DESIGN"],
  ["CPE26", "CPE LAWS AND PROFESSIONAL PRACTICE"],
  ["CPE27", "EMERGING TECHNOLOGIES IN CPE"],
  ["CPE28", "COGNATE/PROFESSIONAL COURSE 3"],
  ["CPE29", "SEMINARS AND FIELD TRIPS"],
  ["CPE30", "CPE PRACTICE & DESIGN 2"],
  ["OJT", "ON-THE-JOB TRAINING"],

  ["MAT04", "CALCULUS 1 (DIFFERENTIAL)"],
  ["CHM01a", "CHEMISTRY FOR ENGINEERS"],
  ["CHM01aL", "CHEMISTRY FOR ENGINEERS LAB"],
  ["CAD01", "COMPUTER AIDED DRAFTING"],
  ["ECM01", "PHYSICS 2"],
  ["ECM01L", "PHYSICS 2 LAB"],
  ["PHY03", "PHYSICS FOR ENGINEERS"],
  ["PHY03L", "PHYSICS FOR ENGINEERS LAB"],
  ["MAT05", "CALCULUS 2 (INTEGRAL)"],
  ["EEN01", "CIRCUITS 1"],
  ["EEN01L", "CIRCUITS 1 LAB"],
  ["ECE01", "ELECTRONICS 1: ELECTRONIC DEVICES & CIRCUITS"],
  ["ECE01L", "ELECTRONICS 1: ELECTRONIC DEVICES & CIRCUITS LAB"],
  ["MAT07", "DIFFERENTIAL EQUATIONS"],
  ["MAT08", "ENGINEERING DATA ANALYSIS"],
  ["COM01", "COMPUTER PROGRAMMING"],
  ["EEN02", "CIRCUITS 2"],
  ["EEN02L", "CIRCUITS 2 LAB"],
  ["ECE02", "ELECTRONICS 2: ELECTRONIC CIRCUIT ANALYSIS & DESIGN"],
  ["ECE02L", "ELECTRONICS 2: ELECTRONIC CIRCUIT ANALYSIS & DESIGN LAB"],
  ["ECE05", "COMMUNICATIONS 1: PRINCIPLES OF COMMUNICATION SYSTEMS"],
  ["ECE05L", "COMMUNICATIONS 1: PRINCIPLES OF COMMUNICATION SYSTEMS LAB"],
  ["ECM02", "ADVANCED ENGINEERING MATHEMATICS FOR ECE"],
  ["ECM02L", "ADVANCED ENGINEERING MATHEMATICS FOR ECE LAB"],

  ["BES01", "ENGINEERING ECONOMICS"],
  ["ECM03", "ELECTROMAGNETICS"],
  ["ECE03", "ELECTRONICS 3: ELECTRONIC SYSTEM & DESIGN"],
  ["ECE03L", "ELECTRONICS 3: ELECTRONIC SYSTEM & DESIGN LAB"],
  ["ECE04", "SIGNALS, SPECTRA & SIGNAL PROCESSING"],
  ["ECE04L", "SIGNALS, SPECTRA & SIGNAL PROCESSING LAB"],
  ["ECE06", "COMMUNICATIONS 2: MODULATION & CODING TECHNIQUES"],
  ["ECE06L", "COMMUNICATIONS 2: MODULATION & CODING TECHNIQUES LAB"],
  ["ECE09", "DIGITAL ELECTRONICS 1: LOGIC CIRCUITS & SWITCHING THEORY"],
  ["ECE09L", "DIGITAL ELECTRONICS 1: LOGIC CIRCUITS & SWITCHING THEORY LAB"],
  ["ECE00", "ECE LAWS, CONTRACTS, ETHICS"],
  ["BES02a", "ENGINEERING MANAGEMENT"],
  ["ECE07", "COMMUNICATIONS 3: TRANSMISSION MEDIA"],
  ["ECE07L", "COMMUNICATIONS 3: TRANSMISSION MEDIA LAB"],
  ["ECE08", "COMMUNICATIONS 4: DATA COMMUNICATIONS"],
  ["ECE08L", "COMMUNICATIONS 4: DATA COMMUNICATIONS LAB"],
  ["ECE12", "METHODS OF RESEARCH"],
  ["EEC01", "ECE ELECTIVE 1"],
  ["EEC01L", "ECE ELECTIVE 1 LAB"],
  ["BES03b", "MATERIAL SCIENCE AND ENGINEERING"],
  ["ECE10", "DIGITAL ELECTRONICS: MICROPROCESSOR AND MICROCONTROLLER SYSTEMS & DESIGN"],
  ["ECE10L", "DIGITAL ELECTRONICS: MICROPROCESSOR AND MICROCONTROLLER SYSTEMS & DESIGN LAB"],
  ["ECE13", "DESIGN 1: CAPSTONE PROJECT 1"],
  ["EEC02", "ELECTIVE 2"],
  ["EEC02L", "ELECTIVE 2 LAB"],
  ["EEC03", "ELECTIVE 3"],
  ["EEC03L", "ELECTIVE 3 LAB"],
  ["EEC04", "ELECTIVE 4"],
  ["EEC04L", "ELECTIVE 4 LAB"],
  ["ECE14", "DESIGN 2: CAPSTONE PROJECT 2"],
  ["ECE15", "SEMINARS/COLLOQUIUM"],
  ["ECE16", "INTEGRATIVE COURSE FOR ECE"],
  ["OJT", "ON-THE-JOB TRAINING"],

  ["MAT04", "CALCULUS 1 (DIFFERENTIAL)"],
  ["CHM01a", "CHEMISTRY FOR ENGINEERS"],
  ["CHM01aL", "CHEMISTRY FOR ENGINEERS LAB"],
  ["PHY03", "PHYSICS FOR ENGINEERS"],
  ["PHY03L", "PHYSICS FOR ENGINEERS LAB"],
  ["MAT05", "CALCULUS 2 (INTEGRAL)"],
  ["IEN01", "STATISTICAL ANALYSIS FOR IE 1"],
  ["IEN02", "STATISTICAL ANALYSIS FOR IE 2"],
  ["IEN03", "INDUSTRIAL MATERIALS AND PROCESSES"],
  ["IEN03L", "INDUSTRIAL MATERIALS AND PROCESSES LAB"],
  ["IEN04", "INDUSTRIAL ORGANIZATION & MANAGEMENT"],
  ["MEC00", "ENGINEERING MECHANICS"],
  ["MAT07", "DIFFERENTIAL EQUATIONS"],
  ["COM01", "COMPUTER FUNDAMENTALS & PROGRAMMING"],
  ["IEN05", "ADVANCED MATHEMATICS FOR IE"],
  ["IEN06", "WORK STUDY & MEASUREMENT"],
  ["IEN06L", "WORK STUDY & MEASUREMENT LAB"],
  ["MCE01a", "THERMODYNAMICS"],
  ["BES05", "BASIC OCCUPATIONAL SAFETY & HEALTH"],
  ["BES01", "ENGINEERING ECONOMICS"],
  ["AEC02", "PRINCIPLES OF ECONOMICS"],
  ["CAD01", "COMPUTER AIDED DRAFTING"],
  ["IEN07", "OPERATIONS RESEARCH 1"],
  ["IEN08", "QUALITY MANAGEMENT SYSTEMS"],
  ["IEN09", "ERGONOMICS 1"],
  ["IEN09L", "ERGONOMICS 1 LAB"],
  ["IEE01", "IE ELECTIVE 1"],
  ["EEN01a", "ELEMENTARY ELECTRICAL ENGINEERING"],



  ["AEC04", "FINANCIAL ACCOUNTING"],
  ["IEN10", "OPERATIONS RESEARCH 2"],
  ["IEN11", "OPERATIONS MANAGEMENT"],
  ["IEN12", "ERGONOMICS 2"],
  ["IEN12L", "ERGONOMICS 2 LAB"],
  ["IEN13", "INDUSTRY COMPUTER APPLICATION"],
  ["IEN13L", "INDUSTRY COMPUTER APPLICATION LAB"],
  ["AEC05", "MANAGERIAL ACCOUNTING"],
  ["BES04", "TECHNOPRENEURSHIP 101"],
  ["IEE02", "IE ELECTIVE 2"],
  ["IEN14", "PROJECT FEASIBILITY"],
  ["IEN14L", "PROJECT FEASIBILITY LAB"],
  ["IEN15", "SUPPLY CHAIN MANAGEMENT"],
  ["IEN16", "INFORMATION SYSTEMS"],
  ["IEN16L", "INFORMATION SYSTEMS LAB"],
  ["IEN17", "SYSTEMS ENGINEERING"],
  ["IEE03", "IE ELECTIVE 3"],
  ["IEN18", "IE CAPSTONE PROJECT"],
  ["IEN18L", "IE CAPSTONE PROJECT LAB"],
  ["IEN19", "IE INDUSTRY IMMERSION"],


  ["MAT04", "CALCULUS 1 (DIFFERENTIAL)"],
  ["CHM01a", "CHEMISTRY FOR ENGINEERS"],
  ["CHM01aL", "CHEMISTRY FOR ENGINEERS LAB"],
  ["COM01", "COMPUTER PROGRAMMING"],
  ["PHY03", "PHYSICS FOR ENGINEERS"],
  ["PHY03L", "PHYSICS FOR ENGINEERS LAB"],
  ["MAT05", "CALCULUS 2 (INTEGRAL)"],
  ["CAD01", "COMPUTER AIDED DESIGN"],
  ["EET01", "ELECTRICAL ENGINEERING TECHNOLOGY 1"],
  ["MAT07", "DIFFERENTIAL EQUATIONS"],
  ["MAT08", "ENGINEERING DATA ANALYSIS"],
  ["EEN01", "ELECTRICAL CIRCUITS 1"],
  ["EEN01L", "ELECTRICAL CIRCUITS 1 LAB"],
  ["MEC00", "ENGINEERING MECHANICS"],
  ["MEC02a", "FLUID MECHANICS"],
  ["GEC09", "ETHICS"],
  ["EET02", "ELECTRICAL ENGINEERING TECHNOLOGY"],
  ["ECE01a", "ELECTRONIC CIRCUITS, DEVICES & ANALYSIS"],
  ["ECE01aL", "ELECTRONIC CIRCUITS, DEVICES & ANALYSIS LAB"],
  ["EEN02", "ELECTRICAL CIRCUITS 2"],
  ["EEN02L", "ELECTRICAL CIRCUITS 2 LAB"],
  ["EEN03", "EE LAWS, CODES, & PROFESSIONAL ETHICS"],
  ["EEN04", "ENGINEERING MATH FOR EE"],
  ["EEN05", "ENGINEERING ELECTROMAGNETICS"],
  ["MEC03a", "FUNDAMENTAL OF DEFORMABLE BODIES"],
  ["MEC01a", "BASIC THERMODYNAMICS"],

  ["EEN07", "FUNDAMENTALS OF ELECTRONIC COMMUNICATION"],
  ["EEN08", "NUMERICAL METHODS & ANALYSIS"],
  ["EEN08L", "NUMERICAL METHODS & ANALYSIS LAB"],
  ["EEN09", "LOGIC CIRCUITS & SWITCHING THEORY"],
  ["EEN10", "ELECTRICAL MACHINES 1"],
  ["EEN11", "INDUSTRIAL ELECTRONICS"],
  ["EEN11L", "INDUSTRIAL ELECTRONICS LAB"],
  ["EEN12", "ELECTRICAL STANDARDS & PRACTICES"],
  ["EEN13", "ELECTRICAL DEVICES & APPARATUS"],
  ["EEN13L", "ELECTRICAL DEVICES & APPARATUS LAB"],
  ["BES01", "ENGINEERING ECONOMICS"],
  ["EEN14", "FEEDBACK CONTROL SYSTEM"],
  ["EEN15", "MICROPROCESSESOR SYSTEM"],
  ["EEN16", "ELECTRICAL MACHINES 2"],
  ["EEN16L", "ELECTRICAL MACHINES 2 LAB"],
  ["EEN17", "MANAGEMENT OF ENGINEERING PROJECTS"],
  ["EEN18", "MATERIALS SCIENCE AND ENGINEERING"],
  ["EEN19", "ELECTRICAL SYSTEM & ILLUMINATION ENGINEERING DESIGN"],
  ["EEN19L", "ELECTRICAL SYSTEM & ILLUMINATION ENGINEERING DESIGN LAB"],
  ["EEN20", "EE ELECTIVE 1"],
  ["EEN20L", "EE ELECTIVE 1 LAB"],
  ["EEN21", "INSTRUMENTATION AND CONTROL"],
  ["EEN21L", "INSTRUMENTATION AND CONTROL LAB"],
  ["EEN22", "POWER SYSTEM ANALYSIS"],
  ["EEN22L", "POWER SYSTEM ANALYSIS LAB"],
  ["EEN23", "EE ELECTIVE 2"],
  ["EEN23L", "EE ELECTIVE 2 LAB"],
  ["EEN24", "FUNDAMENTALS OF POWERPLANT ENGINEERING DESIGN"],
  ["EEN25", "DISTRIBUTION SYSTEM AND SUBSTATION DESIGN"],


  ["EEN25L", "DISTRIBUTION SYSTEM AND SUBSTATION DESIGN LAB"],
  ["EEN26", "INTEGRATIVE COURSE FOR EE"],
  ["RES01a", "RESEARCH METHODS"],
  ["BES04", "TECHNOPRENEURSHIP 101"],
  ["EEN27", "SEMINARS/COLLOQUIA"],
  ["RES02", "RESEARCH PROJECT/CAPSTONE DESIGN"],
  ["OJT", "ON-THE-JOB TRAINING"],



  ["MAT04", "CALCULUS 1 (DIFFERENTIAL)"],
  ["CHM01a", "CHEMISTRY FOR ENGINEERS"],
  ["CHM01aL", "CHEMISTRY FOR ENGINEERS LAB"],
  ["DRW01", "ENGINEERING DRAWING"],
  ["COE1", "MECHANICALN ENGINEERING ORIENTATION"],
  ["PHY03", "PHYSICS FOR ENGINEERS"],
  ["PHY03L", "PHYSICS FOR ENGINEERS (LAB)"],
  ["MAT05", "CALCULUS 2 (INTEGRAL)"],
  ["CAD01", "COMPUTER AIDED DRAFTING"],
  ["MEC01", "STATICS OF RIGID BODIES"],
  ["EEN01", "BASIC ELECTRICAL ENGINEERING"],
  ["MCE01", "THERMODYNAMICS 1"],
  ["MAT07", "DIFFERENTIAL EQUATIONS"],
  ["MCE03", "WORKSHOP, THEORY AND PRACTICE"],
  ["GEC09", "ETHICS"],
  ["COM01", "COMPUTER FUNDAMENTALS AND PROGRAMMING"],
  ["MEC02", "DYNAMICS OF RIGID BODIES"],
  ["ECE00", "BASIC ELECTRONICS"],
  ["MCE02", "THERMODYNAMIC 2"],
  ["MAT10f", "ADVANCE MATHEMATICS FOR ME"],
  ["MCE04", "MACHINE SHOP THEORY"],
  ["MCE35", "ME LAWS, ETHICS, CONTRACTS, CODES, AND STANDARDS"],
  ["MAT08", "ENGINEERING DATA AND ANALYSIS"],
  ["BES02a", "ENGINEERING MANAGEMENT"],
  ["MEC03", "MECHANICS OF DEFORMABLE BODIES"],
  ["MCE05", "MACHINE ELEMENTS"],
  ["MCE13", "DC AND AC MACHINERIES"],


  ["MCE06", "HEAT TRANSFER"],
  ["MEC04c", "FLUID MECHANICS"],
  ["MCE07", "VIBRATION ENGINEERING"],
  ["BES01a", "ENGINEERING ECONOMICS"],
  ["COM02", "COMPUTER APPLICATION FOR ME"],
  ["MCE12", "MATERIAL SCIENCE AND ENGINEERING FOR ME"],
  ["MCE14", "ME ELECTIVE 1 ELECTROPNEUMATICS"],
  ["MCE08", "REFRIGERATION SYSTEM"],
  ["MCE09", "FLUID MACHINERY"],
  ["MCE10", "COMBUSTION ENGINEERING"],
  ["MCE11", "ME LABORATORY 1"],
  ["RES01", "METHODS OF RESEARCH FOR ME"],
  ["BES04", "TECHNOPRENEURSHIP 101"],
  ["MCE16", "MACHINE DESIGN 1"],
  ["MCE17", "CONTROL ENGINEERING"],
  ["MCE19", "POWER PLANT DEISGN W/ RENEWABLE ENERGY"],
  ["MCE15", "ME LABORATORY 2"],
  ["MCE18", "AIR CONDITIONING AND VENTILATION SYSTEM"],
  ["RES02a", "ME PROJECT STUDY 1"],
  ["MCE20", "ME ELECTIVE 2 MECHATRONICS"],
  ["MCE22", "MACHINE DESIGN 2"],
  ["MCE26", "INTEGRATIVE COURSE FOR ME"],
  ["MCE21", "ME LABORATORY 3"],
  ["MCE24", "MANUFACTURING AND INDUSTRIAL PROCESSES W/ PLANT VISITS"],
  ["MCE23", "INDUSTRIAL PLANT ENGINEERING"],
  ["RES02b", "PROJECT STUDY 2"],
  
]);

export function getCourseName(courseCode: string): string {
  const name = courseMap.get(courseCode);
  return name ?? " ";
}


