export default {

    months() {
        return ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'August', 'September', 'Oktober', 'November', 'December'];
    },

    weekdays() {
        return ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned'];
    },

    format() {
        return 'YYYY-MM-DD';
    },

    formatCurrentDate(current) {
        let time = new Date(current);
        return `${time.getDate().toString().padStart(2, '0')}.${(time.getMonth() + 1).toString().padStart(2, '0')}.${time.getFullYear()} ob ${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    }

}
