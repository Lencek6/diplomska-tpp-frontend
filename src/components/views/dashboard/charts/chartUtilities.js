export default  {
    randomNumberArray(numberCount) {
        let result = [];
        for(let i = 0; i < numberCount; i++){
            result.push(Math.floor(Math.random() * 100))
        }
        return result
    },
    last7Days() {
        let result = [];
        for (let i = 0; i < 7; i++) {
            let d = new Date();
            d.setDate(d.getDate() - i);
            result.unshift(this.formatDate(d))
        }
        return result;
    },
    formatDate(date){
        let dd = date.getDate().toString();
        let mm = (date.getMonth()+1).toString();
        let yyyy = date.getFullYear();
        return `${dd.padStart(2,'0')}-${mm.padStart(2, '0')}-${yyyy}`;
    }
}