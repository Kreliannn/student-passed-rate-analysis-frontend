
export const bgStyle = {
    backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/bg.jpg')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  }
  

  
export const convertCodeToName = (code : string) => {
  switch(code)
  {
    case "CE":
      return "Civil Engeneering"
      break 

    case "CPE":
      return "Computer Engeneering"
      break

    case "EE":
      return "Electrical Engeneering"
      break

    case "ECE":
      return "Electronic Engeneering"
      break

    case "IE":
      return "industrial Engeneering"
      break

    case "ME":
      return "Mechanical Engeneering"
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
    case "1st":
      return 1
      break 

    case "2nd":
      return 2
      break
  }

  return 0
}