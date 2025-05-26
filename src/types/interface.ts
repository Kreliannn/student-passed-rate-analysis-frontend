export interface courseInterface {
    department : string,
    gradeLevel : string,
    sem : number,
    batch : string,
    courseCode : string,
    totalEnrolled : number,
    passed : number
}

export interface deleteItemCourse {
    department : string,
    gradeLevel : string,
    sem : number,
    batch : string,
    courseCode : string,
  
  }
   




interface SemesterCourses {
    firstSem: string[];
    secondSem: string[];
}
  


export interface departmentCourseStructureInterface {
    firstYear: SemesterCourses;
    secondYear: SemesterCourses;
    thirdYear: SemesterCourses;
    fourthYear: SemesterCourses;
}