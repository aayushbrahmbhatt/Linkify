import moment from "moment/moment";

export const getCurrentTimeStamp = (tiemFormat) => {
    return moment().format(tiemFormat);
};
