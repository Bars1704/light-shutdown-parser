const dataFormattingOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};



exports.log = function log(logType, message) {
    console.log(new Date().toLocaleDateString("en-US", dataFormattingOptions), `[${logType}] ${message}`)
}