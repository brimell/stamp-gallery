class Codes {
    constructor(codeStr) {
      this.codes = new Map();
      
      this.SG = "Sg";
  
      const self = this;
      var codeList = codeStr.split(",");
  
      codeList.forEach(function (val, idx) {
        var codeTuple = val.split(":");
        if (codeTuple.length === 2)
          self.codes.set(codeTuple[0].trim(),codeTuple[1].trim());
        else
          console.log("unknown code:"+val + ": in code str="+codeStr);
      });
  
    }
  
    getCode(codeType) {
      return this.codes.get(codeType);
    }
  
    getStanleyGibbonsCode() {
      var code = this.codes.get(this.SG);
      return code;
    }
  
  }

  export default Codes