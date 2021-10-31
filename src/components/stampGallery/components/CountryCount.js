class CountryCount {
    constructor(country, country_id) {
      this.id = country_id;
      this.name = country;
      this.value = 0;
      // this.fill =am4core.color("#FF0000")
    }
    incrementCount() {
      this.value = this.value + 1;
    }
}

export default CountryCount