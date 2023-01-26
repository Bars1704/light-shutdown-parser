const dataFormattingOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
    
};



exports.log = function log(logType, message) {
    date = new Date()
    console.log(date.toLocaleDateString("en-US", dataFormattingOptions), date.toLocaleTimeString("en-GB"), `[${logType}] ${message}`)
}