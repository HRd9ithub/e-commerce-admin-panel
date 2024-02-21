import moment from "moment"

export const DateFormatConvert = (date) => {
    const formattedDate = moment(date).format("Do MMM YYYY");
    return formattedDate
}