export const getScoreColorStyle = (percentage) => {
    if (percentage === 100) {
        return "bg-green-500 text-white font-extrabold shadow-xs";
    } else if (percentage >= 70) {
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    } else if (percentage >= 50) {
        return "bg-orange-50 text-orange-700 border border-orange-200";
    } else if (percentage >= 30) {
        return "bg-amber-50 text-amber-700 border border-amber-200";
    } else {
        return "bg-red-50 text-red-700 border border-red-200";
    }
};