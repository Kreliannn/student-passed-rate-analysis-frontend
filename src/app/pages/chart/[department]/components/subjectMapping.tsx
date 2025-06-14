import { getCL } from "@/utils/customFunction"
import { courseInterface } from "@/types/interface"
import { Button } from "@/components/ui/button"


export default function SubjectMapping({setCoursedataChart, setSelectedCourse, coursedataChartSavePoint, scrollDown, top , left, subject} : {coursedataChartSavePoint : courseInterface[], setCoursedataChart : React.Dispatch<React.SetStateAction<courseInterface[]>> , setSelectedCourse :  React.Dispatch<React.SetStateAction<string>>, scrollDown : () => void, top : number , left : number, subject : string})
{
    const H = 0
    const L = 0


    return(
        <Button
            onClick={() => {
            setCoursedataChart(coursedataChartSavePoint.filter((course: courseInterface) => course.courseCode == subject))
            setSelectedCourse(subject)
            scrollDown()
        
            }}
            className="absolute flex flex-col items-center justify-center leading-[0] p-2 z-50 w-[57px]"
            style={{ top: `${top + H}px`, left: `${left + L}px` }}
            >
            <span className="mt-2">{subject}</span>
            <span className="text-xs whitespace-nowrap">{getCL(coursedataChartSavePoint.filter((course1: courseInterface) => course1.courseCode == subject))}</span>
      </Button>

    )
}