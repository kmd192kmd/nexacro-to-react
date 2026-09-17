export const GENDER_MAP: Record<string, string> = {
    M: "Male",
    F: "Female"
};

export const POSITION_MAP: Record<string, string> = {
    "10": "CEO",
    "20": "Director",
    "30": "General Manager",
    "40": "Manager",
    "50": "Assistant Manager",
    "60": "Staff"
}

export const DEPARTMENT_MAP: Record<string, string> = {
    "10": "Accounting Team",
    "20": "Finances Team",
    "30": "Human Resource Team",
    "40": "Support Team",
    "50": "Sales Team"
}

export const SKILL_MAP: Record<string, string> = {
    "01": "HTML",
    "02": "CSS",
    "03": "JavaSript",
    "04": "JAVA",
    "05": "C/C++",
    "06": "Python"
}

export const HOBBY_MAP: Record<string, string> = {
    "01": "Climbing",
    "02": "Running",
    "03": "Cycling",
    "04": "Swimming",
    "05": "Yoga",
    "06": "Golf",
    "07": "tennis",
    "08": "Reading",
    "09": "Cooking",
    "10": "Photography",
    "11": "Painting",
    "12": "Movie and Drama",
    "13": "Game",
    "14": "Sleeping",
    "15": "Shopping"
}

export const SKILL_OPTIONS = Object.entries(SKILL_MAP).map(
    ([code, name]) => ({ code, name })
);