export default  {

    // Random border and background color array generator
    randomColorsArray(n) {
        let bgColors = [];
        let borderColors =[];

        for(let i = 0; i < n ; i++){
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            bgColors.push(`rgba(${r}, ${g}, ${b}, 0.2)`);
            borderColors.push(`rgba(${r}, ${g}, ${b})`);
        }

        return {bgColors, borderColors};
    },

    // Random number array generator
    randomNumberArray(numberCount) {
        let result = [];
        for(let i = 0; i < numberCount; i++){
            result.push(Math.floor(Math.random() * 100));
        }
        return result;
    },

    // Last n days array generator
    lastNDays(n) {
        let result = [];
        for (let i = 0; i < n; i++) {
            let d = new Date();
            d.setDate(d.getDate() - i);
            result.unshift(this.formatDate(d));
        }
        return result;
    },

    // Date formatter
    formatDate(date){
        let dd = date.getDate().toString();
        let mm = (date.getMonth()+1).toString();
        let yyyy = date.getFullYear();
        return `${dd.padStart(2,'0')}-${mm.padStart(2, '0')}-${yyyy}`;
    }
}
